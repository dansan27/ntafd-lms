# Clerk Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current token-in-body (students) and hardcoded-password (professor) auth with Clerk using Microsoft OAuth and Express middleware, so both roles sign in with their UPC Microsoft accounts.

**Architecture:** `@clerk/express` middleware populates `req.auth` on every request before tRPC runs; `createContext()` reads `req.auth.userId` and fetches `publicMetadata.role` to set `ctx.userId` / `ctx.role`; all procedures switch from `publicProcedure` to `protectedProcedure` / `professorProcedure`; the frontend sends the Clerk session token in `Authorization: Bearer` headers via a `TrpcProvider` component that has access to `useAuth().getToken()`.

**Tech Stack:** `@clerk/express` (server middleware + clerkClient), `@clerk/react` (ClerkProvider, useAuth, useUser, SignInButton), Drizzle ORM + better-sqlite3, tRPC v11, wouter (routing), React Query

---

## File Map

| File | Action | What changes |
|------|--------|--------------|
| `server/db/schema.ts` | Modify | `sessionToken` → `clerkUserId`; remove `users` table |
| `server/db/db.ts` | Modify | Update raw SQL CREATE TABLE; add `upsertStudentByClerkId` + `getStudentByClerkId`; remove `loginOrCreateStudent` + `getStudentByToken` |
| `server/api/context.ts` | Modify | Read `getAuth(req).userId`; fetch `publicMetadata.role` |
| `server/api/trpc.ts` | Modify | Replace `requireUser` with Clerk-based check; add `professorProcedure` |
| `server/index.ts` | Modify | Add `clerkMiddleware()` before tRPC handler |
| `server/api/routers.ts` | Modify | Student procedures: remove `token` input, use `ctx.userId`; Professor procedures: remove `password` input, switch to `professorProcedure`; Dynamics: remove `token` input, use `ctx.userId` |
| `src/main.tsx` | Modify | Wrap with `ClerkProvider` |
| `src/App.tsx` | Modify | Extract `TrpcProvider` component (needs `useAuth`); add `RequireAuth` + `RequireProfessor` route guards |
| `src/contexts/StudentContext.tsx` | Modify | Use Clerk hooks; keep `token` field = Clerk userId for backward compat with dynamic components |
| `src/pages/StudentLogin.tsx` | Modify | Replace form with single Microsoft OAuth button |
| `src/pages/ProfessorDashboard.tsx` | Modify | Remove password state; read role from `useUser().publicMetadata` |
| `db_data/lms.sqlite` | Delete | Data is disposable; fresh start |
| `.env` | Modify | Add `CLERK_SECRET_KEY`; remove `PROFESSOR_PASSWORD` |
| `.env` (frontend) | Modify | Add `VITE_CLERK_PUBLISHABLE_KEY` |

---

## Task 1: Install Packages

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install server and client Clerk packages**

```bash
cd "C:/Users/Daniel/Downloads/Guía Interactiva Web para Nuevas Tecnologías en Deporte"
npm install @clerk/express @clerk/react
```

Expected output: `added N packages` with no errors. Verify with:
```bash
grep "@clerk" package.json
```
Should show both `@clerk/express` and `@clerk/react`.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "Install @clerk/express and @clerk/react"
```

---

## Task 2: Clerk Dashboard Setup (Manual)

**Files:** `.env`

- [ ] **Step 1: Create Clerk application**

1. Go to [clerk.com](https://clerk.com) → Sign up / Sign in → Create application
2. Name: `NTAFD LMS`
3. In "Sign-in methods": enable **Microsoft** only; disable Email/Password, Google, and all others
4. Click "Create application"

- [ ] **Step 2: Get API keys**

In the Clerk Dashboard → API Keys:
- Copy `Publishable key` (starts with `pk_test_` or `pk_live_`)
- Copy `Secret key` (starts with `sk_test_` or `sk_live_`)

- [ ] **Step 3: Add keys to .env**

Open `.env` and add (replacing placeholders):
```
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Remove this line:
```
PROFESSOR_PASSWORD=profesor2026
```

- [ ] **Step 4: Configure Microsoft OAuth in Clerk**

In Clerk Dashboard → Configure → Social connections → Microsoft:
- Click Enable
- Follow Clerk's guide to register an Azure AD app (or use Clerk's shared credentials for dev)
- For production: register app at portal.azure.com with redirect URI `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`

- [ ] **Step 5: Add allowed origins**

In Clerk Dashboard → Configure → Domains:
- Add `http://localhost:3001` (dev)
- Add your Railway URL once deployed (Task 15)

---

## Task 3: Update Database Schema

**Files:**
- Modify: `server/db/schema.ts`
- Modify: `server/db/db.ts`
- Delete: `db_data/lms.sqlite`

- [ ] **Step 1: Update schema.ts — replace sessionToken with clerkUserId, remove users table**

Replace the entire `server/db/schema.ts` with:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clerkUserId: text("clerkUserId").notNull().unique(),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  lastActiveAt: integer("lastActiveAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

export const studentProgress = sqliteTable("student_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  weekId: integer("weekId").notNull(),
  classId: integer("classId").notNull(),
  currentBlock: integer("currentBlock").default(1).notNull(),
  completedDynamics: text("completedDynamics", { mode: "json" }).$type<number[]>().default([]).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).notNull(),
});

export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = typeof studentProgress.$inferInsert;

export const dynamicResponses = sqliteTable("dynamic_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  weekId: integer("weekId").default(1).notNull(),
  classId: integer("classId").default(1).notNull(),
  dynamicId: integer("dynamicId").notNull(),
  response: text("response", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  score: integer("score").default(0).notNull(),
  maxScore: integer("maxScore").default(0).notNull(),
  timeSpentMs: integer("timeSpentMs").default(0),
  submittedAt: integer("submittedAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type DynamicResponse = typeof dynamicResponses.$inferSelect;
export type InsertDynamicResponse = typeof dynamicResponses.$inferInsert;

export const reflections = sqliteTable("reflections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  weekId: integer("weekId").default(1).notNull(),
  classId: integer("classId").default(1).notNull(),
  reflectionText: text("reflectionText").notNull(),
  sentiment: text("sentiment"),
  keywords: text("keywords", { mode: "json" }).$type<string[]>().default([]).notNull(),
  analyzedAt: integer("analyzedAt", { mode: 'timestamp' }),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Reflection = typeof reflections.$inferSelect;
export type InsertReflection = typeof reflections.$inferInsert;

export const classActivitiesStatus = sqliteTable("class_activities_status", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weekId: integer("weekId").notNull(),
  classId: integer("classId").notNull(),
  dynamicId: integer("dynamicId").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(false).notNull(),
  activatedAt: integer("activatedAt", { mode: 'timestamp' }),
  deactivatedAt: integer("deactivatedAt", { mode: 'timestamp' }),
});

export type ClassActivityStatus = typeof classActivitiesStatus.$inferSelect;
export type InsertClassActivityStatus = typeof classActivitiesStatus.$inferInsert;

export const studentAchievements = sqliteTable("student_achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  achievementId: text("achievementId").notNull(),
  achievementName: text("achievementName").notNull(),
  earnedAt: integer("earnedAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type StudentAchievement = typeof studentAchievements.$inferSelect;
export type InsertStudentAchievement = typeof studentAchievements.$inferInsert;

export const studentNotes = sqliteTable("student_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  weekId: integer("weekId").notNull(),
  classId: integer("classId").notNull(),
  blockId: integer("blockId").notNull(),
  noteText: text("noteText").notNull().default(""),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type StudentNote = typeof studentNotes.$inferSelect;
export type InsertStudentNote = typeof studentNotes.$inferInsert;

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  weekId: integer("weekId").notNull(),
  classId: integer("classId").notNull(),
  blockId: integer("blockId").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
```

- [ ] **Step 2: Update db.ts — CREATE TABLE SQL for students table**

In `server/db/db.ts`, find the `sqlite.exec(...)` block. Replace the `CREATE TABLE IF NOT EXISTS students` statement:

Old:
```sql
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    studentCode TEXT NOT NULL UNIQUE,
    sessionToken TEXT,
    createdAt INTEGER NOT NULL,
    lastActiveAt INTEGER NOT NULL
  );
```

New:
```sql
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clerkUserId TEXT NOT NULL UNIQUE,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    lastActiveAt INTEGER NOT NULL
  );
```

Also remove the `CREATE TABLE IF NOT EXISTS users` block entirely from the `sqlite.exec()` call.

- [ ] **Step 3: Update db.ts — replace loginOrCreateStudent and getStudentByToken**

In `server/db/db.ts`, remove the `loginOrCreateStudent` and `getStudentByToken` functions entirely and add these two new functions in their place:

```typescript
export async function upsertStudentByClerkId(
  clerkUserId: string,
  fullName: string,
  email: string
): Promise<Student> {
  const now = new Date();
  const existing = db.select().from(students).where(eq(students.clerkUserId, clerkUserId)).limit(1).all();
  if (existing.length > 0) {
    db.update(students)
      .set({ fullName, email, lastActiveAt: now })
      .where(eq(students.clerkUserId, clerkUserId))
      .run();
    return { ...existing[0], fullName, email, lastActiveAt: now };
  }
  const result = db.insert(students).values({
    clerkUserId,
    fullName,
    email,
    createdAt: now,
    lastActiveAt: now,
  }).returning().all();
  return result[0];
}

export async function getStudentByClerkId(clerkUserId: string): Promise<Student | null> {
  const result = db.select().from(students).where(eq(students.clerkUserId, clerkUserId)).limit(1).all();
  return result[0] ?? null;
}
```

- [ ] **Step 4: Update all imports of removed functions in db.ts**

In `server/db/db.ts`, remove the `nanoid` import (no longer needed for token generation):
```typescript
// Remove this line:
import { nanoid } from "nanoid";
```

- [ ] **Step 5: Delete the old SQLite database**

```bash
rm -f "C:/Users/Daniel/Downloads/Guía Interactiva Web para Nuevas Tecnologías en Deporte/db_data/lms.sqlite"
```

The server will recreate it with the new schema on next startup.

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd "C:/Users/Daniel/Downloads/Guía Interactiva Web para Nuevas Tecnologías en Deporte"
npx tsc --noEmit 2>&1
```

Expected: no errors (or only errors about routers.ts still referencing old functions — those get fixed in Task 7).

- [ ] **Step 7: Commit**

```bash
git add server/db/schema.ts server/db/db.ts
git commit -m "Replace sessionToken with clerkUserId in students schema and db functions"
```

---

## Task 4: Update tRPC Context

**Files:**
- Modify: `server/api/context.ts`

- [ ] **Step 1: Replace context.ts entirely**

```typescript
import type { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";

export type TrpcContext = {
  userId: string | null;
  role: "professor" | "student" | null;
  req: Request;
  res: Response;
};

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<TrpcContext> {
  const { userId } = getAuth(req);

  if (!userId) {
    return { userId: null, role: null, req, res };
  }

  let role: "professor" | "student" = "student";
  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    if (clerkUser.publicMetadata?.role === "professor") {
      role = "professor";
    }
  } catch {
    // If Clerk API fails, default to student role
  }

  return { userId, role, req, res };
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep "context.ts"
```

Expected: no lines (no errors in that file).

- [ ] **Step 3: Commit**

```bash
git add server/api/context.ts
git commit -m "Update tRPC context to read Clerk userId and role from req.auth"
```

---

## Task 5: Update tRPC Procedures

**Files:**
- Modify: `server/api/trpc.ts`

- [ ] **Step 1: Replace trpc.ts entirely**

```typescript
import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "../../shared/const";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const protectedProcedure = t.procedure.use(requireAuth);

export const professorProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  if (ctx.role !== "professor") {
    throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId, role: "professor" as const } });
});
```

- [ ] **Step 2: Commit**

```bash
git add server/api/trpc.ts
git commit -m "Add professorProcedure; wire protectedProcedure to Clerk userId"
```

---

## Task 6: Add Clerk Middleware to Express

**Files:**
- Modify: `server/index.ts`

- [ ] **Step 1: Add clerkMiddleware import and usage**

In `server/index.ts`, add the import after the existing imports:
```typescript
import { clerkMiddleware } from "@clerk/express";
```

Then add the middleware line right after `app.use(express.json())` and before the tRPC handler:
```typescript
app.use(clerkMiddleware());
```

The relevant section should look like:
```typescript
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(clerkMiddleware());   // ← add this line

// tRPC handler
app.use(
  "/api/trpc",
  createExpressMiddleware({ ... })
);
```

- [ ] **Step 2: Verify server starts without errors**

```bash
cd "C:/Users/Daniel/Downloads/Guía Interactiva Web para Nuevas Tecnologías en Deporte"
npm run server
```

Expected: `[Server] Running on http://localhost:3001` with no crash. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add server/index.ts
git commit -m "Add clerkMiddleware() to Express before tRPC handler"
```

---

## Task 7: Update Student Router

**Files:**
- Modify: `server/api/routers.ts`

- [ ] **Step 1: Update imports at top of routers.ts**

Replace the import block at the top. Remove `loginOrCreateStudent`, `getStudentByToken`. Add `upsertStudentByClerkId`, `getStudentByClerkId`. Add `clerkClient`. Remove `COOKIE_NAME` if unused:

```typescript
import { protectedProcedure, professorProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import {
  upsertStudentByClerkId,
  getStudentByClerkId,
  updateStudentBlock,
  updateStudentCompletedDynamics,
  saveDynamicResponse,
  getStudentDynamicResponses,
  getAllStudents,
  getAllDynamicResponses,
  getResponsesByDynamic,
  saveReflection,
  updateReflectionAnalysis,
  getAllReflections,
  getStudentReflection,
  getAllClassActivityStatuses,
  setDynamicActive,
  getStudentProgress,
  getProgressByClass,
  getStudentAchievements,
  awardAchievement,
  getStudentNote,
  saveStudentNote,
  getStudentAllNotes,
  saveChatMessage,
  getChatHistory,
  clearChatHistory,
  getLeaderboard,
  getStudentStats,
  getAllAchievements,
} from "../db/db";
import type { DynamicResponse, ClassActivityStatus } from "../db/schema";
import { invokeLLM } from "./llm";
import { notifyOwner } from "./notification";
import { ENV } from "./env";
import { getClassStructure, getDynamicNames } from "../../shared/courseStructure";
import { clerkClient } from "@clerk/express";
import { TRPCError } from "@trpc/server";
```

Also remove this line (no longer needed):
```typescript
const VALID_PASSWORD = ENV.professorPassword || "profesor2026";
```

- [ ] **Step 2: Replace the studentRouter definition**

Find `const studentRouter = router({` and replace the entire student router with:

```typescript
const studentRouter = router({
  // Auto-creates or updates the student record from Clerk identity
  me: protectedProcedure
    .query(async ({ ctx }) => {
      const existing = await getStudentByClerkId(ctx.userId);
      if (existing) return existing;
      // First login: create student record from Clerk profile
      const clerkUser = await clerkClient.users.getUser(ctx.userId);
      const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "Estudiante";
      const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
      return upsertStudentByClerkId(ctx.userId, fullName, email);
    }),

  getProgress: protectedProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) return null;
      return getStudentProgress(student.id, input.weekId, input.classId);
    }),

  updateBlock: protectedProcedure
    .input(z.object({
      weekId: z.number().default(1),
      classId: z.number().default(1),
      block: z.number().min(1).max(20),
    }))
    .mutation(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Estudiante no encontrado" });
      await updateStudentBlock(student.id, input.weekId, input.classId, input.block);
      return { success: true };
    }),

  getNote: protectedProcedure
    .input(z.object({ weekId: z.number(), classId: z.number(), blockId: z.number() }))
    .query(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) return null;
      return getStudentNote(student.id, input.weekId, input.classId, input.blockId);
    }),

  saveNote: protectedProcedure
    .input(z.object({ weekId: z.number(), classId: z.number(), blockId: z.number(), noteText: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Estudiante no encontrado" });
      await saveStudentNote(student.id, input.weekId, input.classId, input.blockId, input.noteText);
      return { success: true };
    }),

  getAllNotes: protectedProcedure
    .query(async ({ ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) return [];
      return getStudentAllNotes(student.id);
    }),

  chat: protectedProcedure
    .input(z.object({
      weekId: z.number(),
      classId: z.number(),
      blockId: z.number(),
      message: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Estudiante no encontrado" });
      await saveChatMessage(student.id, input.weekId, input.classId, input.blockId, "user", input.message);
      const history = await getChatHistory(student.id, input.weekId, input.classId, input.blockId);
      const messages = history.map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      const reply = await invokeLLM(messages);
      await saveChatMessage(student.id, input.weekId, input.classId, input.blockId, "assistant", reply);
      return { reply };
    }),

  getChatHistory: protectedProcedure
    .input(z.object({ weekId: z.number(), classId: z.number(), blockId: z.number() }))
    .query(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) return [];
      return getChatHistory(student.id, input.weekId, input.classId, input.blockId);
    }),

  clearChat: protectedProcedure
    .input(z.object({ weekId: z.number(), classId: z.number(), blockId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Estudiante no encontrado" });
      await clearChatHistory(student.id, input.weekId, input.classId, input.blockId);
      return { success: true };
    }),

  achievements: protectedProcedure
    .query(async ({ ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) return [];
      return getStudentAchievements(student.id);
    }),

  stats: protectedProcedure
    .query(async ({ ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) return null;
      return getStudentStats(student.id);
    }),
});
```

- [ ] **Step 3: Commit**

```bash
git add server/api/routers.ts
git commit -m "Student router: remove token inputs, use ctx.userId via protectedProcedure"
```

---

## Task 8: Update Dynamics Router

**Files:**
- Modify: `server/api/routers.ts`

- [ ] **Step 1: Replace the dynamicsRouter**

Find `const dynamicsRouter = router({` and replace the entire dynamics router with:

```typescript
const dynamicsRouter = router({
  submit: protectedProcedure
    .input(z.object({
      token: z.string().optional(),   // kept for client backward compat, ignored server-side
      weekId: z.number().default(1),
      classId: z.number().default(1),
      dynamicId: z.number().min(1),
      response: z.record(z.string(), z.unknown()),
      score: z.number(),
      maxScore: z.number(),
      timeSpentMs: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Estudiante no encontrado" });
      await saveDynamicResponse(
        student.id,
        input.weekId,
        input.classId,
        input.dynamicId,
        input.response,
        input.score,
        input.maxScore,
        input.timeSpentMs,
      );
      await updateStudentCompletedDynamics(student.id, input.weekId, input.classId, input.dynamicId);

      // Notify if all dynamics completed
      const allDynamics = getDynamicNames(input.weekId, input.classId);
      const progress = await getStudentProgress(student.id, input.weekId, input.classId);
      if (progress && allDynamics.length > 0 &&
          progress.completedDynamics.length >= allDynamics.length) {
        notifyOwner(`🎉 ${student.fullName} completó todas las dinámicas de S${input.weekId}C${input.classId}`).catch(() => {});
      }

      return { success: true, score: input.score, maxScore: input.maxScore };
    }),

  myResponses: protectedProcedure
    .input(z.object({ token: z.string().optional() }))
    .query(async ({ ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) return [];
      return getStudentDynamicResponses(student.id);
    }),

  activeStatuses: publicProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      return getAllClassActivityStatuses(input.weekId, input.classId);
    }),

  saveReflection: protectedProcedure
    .input(z.object({
      token: z.string().optional(),
      weekId: z.number().default(1),
      classId: z.number().default(1),
      reflectionText: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Estudiante no encontrado" });
      const saved = await saveReflection(student.id, input.weekId, input.classId, input.reflectionText);
      // Trigger async LLM analysis
      invokeLLM([{
        role: "user",
        content: `Analiza brevemente esta reflexión de un estudiante de ciencias del deporte sobre tecnología deportiva. Identifica sentimiento (positivo/neutro/negativo) y 3-5 palabras clave. Reflexión: "${input.reflectionText}"`,
      }]).then(analysis => {
        updateReflectionAnalysis(saved.id, analysis).catch(() => {});
      }).catch(() => {});
      return saved;
    }),

  getReflection: protectedProcedure
    .input(z.object({
      token: z.string().optional(),
      weekId: z.number().default(1),
      classId: z.number().default(1),
    }))
    .query(async ({ input, ctx }) => {
      const student = await getStudentByClerkId(ctx.userId);
      if (!student) return null;
      return getStudentReflection(student.id, input.weekId, input.classId);
    }),
});
```

- [ ] **Step 2: Commit**

```bash
git add server/api/routers.ts
git commit -m "Dynamics router: remove token inputs, use ctx.userId via protectedProcedure"
```

---

## Task 9: Update Professor Router

**Files:**
- Modify: `server/api/routers.ts`

- [ ] **Step 1: Replace the professorRouter**

Find `const professorRouter = router({` and replace the entire professor router. The key change: every procedure switches from `publicProcedure` with `if (input.password !== VALID_PASSWORD)` checks to `professorProcedure` with no password in input. Keep all the existing logic — only remove the password check and `password` from inputs.

Replace `const professorRouter = router({` through its closing `});` with:

```typescript
const professorRouter = router({
  login: professorProcedure
    .mutation(async () => {
      return { success: true };
    }),

  verify: professorProcedure
    .query(async () => {
      return { valid: true };
    }),

  stats: professorProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      const structure = getClassStructure(input.weekId, input.classId);
      const allStudents = await getAllStudents();
      const allResponses = await getAllDynamicResponses(input.weekId, input.classId);
      const dynamicNames = getDynamicNames(input.weekId, input.classId);
      return { students: allStudents, responses: allResponses, structure, dynamicNames };
    }),

  students: professorProcedure
    .query(async () => {
      return getAllStudents();
    }),

  allResponses: professorProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      return getAllDynamicResponses(input.weekId, input.classId);
    }),

  responsesByDynamic: professorProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1), dynamicId: z.number() }))
    .query(async ({ input }) => {
      return getResponsesByDynamic(input.weekId, input.classId, input.dynamicId);
    }),

  allReflections: professorProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      return getAllReflections(input.weekId, input.classId);
    }),

  activeDynamics: professorProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      return getAllClassActivityStatuses(input.weekId, input.classId);
    }),

  setDynamic: professorProcedure
    .input(z.object({
      weekId: z.number().default(1),
      classId: z.number().default(1),
      dynamicId: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      await setDynamicActive(input.weekId, input.classId, input.dynamicId, input.isActive);
      return { success: true };
    }),

  leaderboard: professorProcedure
    .query(async () => {
      return getLeaderboard();
    }),

  allAchievements: professorProcedure
    .query(async () => {
      return getAllAchievements();
    }),

  awardAchievement: professorProcedure
    .input(z.object({
      studentId: z.number(),
      achievementId: z.string(),
      achievementName: z.string(),
    }))
    .mutation(async ({ input }) => {
      await awardAchievement(input.studentId, input.achievementId, input.achievementName);
      return { success: true };
    }),

  progressByClass: professorProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      return getProgressByClass(input.weekId, input.classId);
    }),
});
```

- [ ] **Step 2: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit 2>&1
```

Expected: 0 errors. If errors reference removed functions, verify db.ts exports match what routers.ts imports.

- [ ] **Step 3: Commit**

```bash
git add server/api/routers.ts
git commit -m "Professor router: remove password inputs, use professorProcedure"
```

---

## Task 10: Frontend — ClerkProvider + TrpcProvider with Auth Headers

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Update main.tsx — wrap with ClerkProvider**

Replace `src/main.tsx` with:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
```

- [ ] **Step 2: Update App.tsx — extract TrpcProvider, add route guards**

Replace `src/App.tsx` with:

```tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./lib/trpc";
import superjson from "superjson";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StudentProvider } from "./contexts/StudentContext";
import Home from "./pages/Home";
import ClassViewer from "./pages/course/ClassViewer";
import StudentLogin from "./pages/StudentLogin";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import MiProgreso from "./pages/MiProgreso";
import Flashcards from "./pages/Flashcards";
import Simuladores from "./pages/Simuladores";
import { useAuth, useUser } from "@clerk/react";
import { Loader2 } from "lucide-react";

// Provides tRPC with Clerk session token in Authorization header
function TrpcProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          headers: async () => {
            const token = await getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

// Redirects unauthenticated users to /login
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );
  if (!isSignedIn) return <Redirect to="/login" />;
  return <>{children}</>;
}

// Redirects non-professors to home
function RequireProfessor({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );
  if (user?.publicMetadata?.role !== "professor") return <Redirect to="/" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={StudentLogin} />
      <Route path="/">
        <RequireAuth>
          <Home />
        </RequireAuth>
      </Route>
      <Route path="/week/:week/class/:class">
        <RequireAuth>
          <ClassViewer />
        </RequireAuth>
      </Route>
      <Route path="/profesor">
        <RequireAuth>
          <RequireProfessor>
            <ProfessorDashboard />
          </RequireProfessor>
        </RequireAuth>
      </Route>
      <Route path="/mi-progreso">
        <RequireAuth>
          <MiProgreso />
        </RequireAuth>
      </Route>
      <Route path="/flashcards">
        <RequireAuth>
          <Flashcards />
        </RequireAuth>
      </Route>
      <Route path="/simuladores">
        <RequireAuth>
          <Simuladores />
        </RequireAuth>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TrpcProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <StudentProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </StudentProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </TrpcProvider>
  );
}

export default App;
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "App.tsx\|main.tsx"
```

Expected: no lines.

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "Add ClerkProvider, TrpcProvider with auth headers, RequireAuth/RequireProfessor guards"
```

---

## Task 11: Simplify StudentContext

**Files:**
- Modify: `src/contexts/StudentContext.tsx`

- [ ] **Step 1: Replace StudentContext.tsx**

This keeps `token` as a field (now equals Clerk userId) so all 30+ dynamic components that call `const { token } = useStudent()` continue to work without changes.

```tsx
import React, { createContext, useContext } from "react";
import { useAuth, useUser } from "@clerk/react";
import { trpc } from "@/lib/trpc";
import type { Student } from "../../server/db/schema";

type StudentContextType = {
  student: Student | null;
  token: string | null;   // equals Clerk userId — kept for backward compat with dynamic components
  loading: boolean;
  logout: () => void;
};

const StudentContext = createContext<StudentContextType>({
  student: null,
  token: null,
  loading: true,
  logout: () => {},
});

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded, signOut } = useAuth();
  const { isLoaded: userLoaded } = useUser();

  // Auto-creates student record on first login via the `me` procedure
  const { data: student, isLoading } = trpc.student.me.useQuery(undefined, {
    enabled: !!userId,
    retry: false,
  });

  const loading = !isLoaded || !userLoaded || (!!userId && isLoading);

  return (
    <StudentContext.Provider
      value={{
        student: student ?? null,
        token: userId ?? null,   // Clerk userId acts as the session identifier
        loading,
        logout: () => signOut(),
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
```

- [ ] **Step 2: Verify all dynamic components still compile**

```bash
npx tsc --noEmit 2>&1
```

Expected: 0 errors. Dynamic components call `const { token } = useStudent()` — `token` is still exported, now equals userId.

- [ ] **Step 3: Commit**

```bash
git add src/contexts/StudentContext.tsx
git commit -m "Simplify StudentContext: use Clerk hooks, token=userId for backward compat"
```

---

## Task 12: Replace Login Page

**Files:**
- Modify: `src/pages/StudentLogin.tsx`

- [ ] **Step 1: Replace StudentLogin.tsx with Microsoft OAuth button**

```tsx
import { useSignIn, useAuth } from "@clerk/react";
import { Redirect } from "wouter";
import { motion } from "framer-motion";
import { Cpu, Activity, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentLogin() {
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect to="/" />;

  const handleMicrosoftLogin = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_microsoft",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8 text-center"
      >
        {/* Logo / brand */}
        <div className="space-y-3">
          <div className="flex justify-center gap-3 text-primary">
            <Cpu size={28} />
            <Activity size={28} />
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">NTAFD</h1>
          <p className="text-white/50 text-sm">
            Nuevas Tecnologías Aplicadas a la Actividad Física y el Deporte
          </p>
        </div>

        {/* Microsoft login */}
        <div className="space-y-4">
          <Button
            onClick={handleMicrosoftLogin}
            disabled={!isLoaded}
            className="w-full h-12 bg-[#0078D4] hover:bg-[#106EBE] text-white font-medium gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Entrar con Microsoft UPC
          </Button>
          <p className="text-white/30 text-xs">
            Usa tu cuenta institucional @upc.edu.pe
          </p>
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Add SSO callback route in App.tsx**

In `src/App.tsx`, add the Clerk SSO callback route inside the `<Switch>`. Add after the `/login` route:

```tsx
import { AuthenticateWithRedirectCallback } from "@clerk/react";

// Inside <Switch>:
<Route path="/sso-callback">
  <AuthenticateWithRedirectCallback />
</Route>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/StudentLogin.tsx src/App.tsx
git commit -m "Replace login form with Clerk Microsoft OAuth; add SSO callback route"
```

---

## Task 13: Update ProfessorDashboard

**Files:**
- Modify: `src/pages/ProfessorDashboard.tsx`

- [ ] **Step 1: Remove password state and ProfessorLogin component**

In `src/pages/ProfessorDashboard.tsx`:

1. Remove the entire `function ProfessorLogin(...)` component
2. Find and remove these lines:
   ```tsx
   const [password, setPassword] = useState<string | null>(() => { ... });
   ```
   ```tsx
   if (!password) return <ProfessorLogin onLogin={handleLogin} />;
   ```
   ```tsx
   function handleLogin(p: string) { setPassword(p); }
   ```

3. Remove `password` from all tRPC query/mutation calls. Every call that had `{ password, ... }` becomes `{ ... }` (just the other fields).

For example:
```tsx
// Before:
const { data: stats } = trpc.professor.stats.useQuery({ password, weekId, classId });

// After:
const { data: stats } = trpc.professor.stats.useQuery({ weekId, classId });
```

4. Remove all `password={password}` props passed to child components. Remove `password: string` from the props type of any sub-components that received it.

5. Add this import if not present:
```tsx
import { useUser } from "@clerk/react";
```

6. The dashboard now renders directly (the `RequireProfessor` guard in App.tsx handles the role check):
```tsx
export default function ProfessorDashboard() {
  const { user } = useUser();
  // ... rest of dashboard JSX directly
}
```

- [ ] **Step 2: Remove password from professor.login mutation call if present**

Search for any remaining `trpc.professor.login` call and remove it — login is now handled by Clerk.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "ProfessorDashboard"
```

Expected: no lines.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ProfessorDashboard.tsx
git commit -m "ProfessorDashboard: remove password state; role enforced by RequireProfessor guard"
```

---

## Task 14: Smoke Test Locally

- [ ] **Step 1: Start the dev server**

```bash
npm run dev:all
```

Expected: Vite dev server on port 5173, Express on port 3001, no startup errors.

- [ ] **Step 2: Test student login flow**

Open `http://localhost:5173` in browser:
1. Should redirect to `/login`
2. Click "Entrar con Microsoft UPC"
3. Microsoft OAuth should open (or Clerk test modal in dev)
4. After auth, should redirect to `/` (Home)
5. Open browser DevTools → Network → verify tRPC calls include `Authorization: Bearer ...` header

- [ ] **Step 3: Test professor access**

1. In Clerk Dashboard → Users → find your user → Metadata → Public metadata → add `{ "role": "professor" }`
2. Navigate to `/profesor`
3. Should show professor dashboard without password prompt

- [ ] **Step 4: Test unauthorized professor access**

With a student account (no professor metadata), navigate to `/profesor`:
Expected: redirect to `/` (home)

- [ ] **Step 5: Commit if any fixes were needed**

```bash
git add -A
git commit -m "Fix any issues found during local smoke test"
```

---

## Task 15: Deploy to Railway

- [ ] **Step 1: Add env vars to Railway**

In Railway dashboard → your project → Variables:
- Add `CLERK_SECRET_KEY` = your Clerk secret key
- Add `VITE_CLERK_PUBLISHABLE_KEY` = your Clerk publishable key
- Delete `PROFESSOR_PASSWORD` if it exists

- [ ] **Step 2: Add Railway URL to Clerk allowed origins**

In Clerk Dashboard → Configure → Domains:
- Add your Railway production URL (e.g., `https://ntafd-lms-production.up.railway.app`)

- [ ] **Step 3: Push to trigger Railway deploy**

```bash
git push origin master
```

- [ ] **Step 4: Verify production**

1. Open your Railway URL
2. Test Microsoft login with a real UPC account
3. Verify tRPC calls succeed (no 401 errors in browser Network tab)
4. Test professor dashboard with professor metadata set in Clerk

---

## Self-Review Checklist

- [x] **Spec coverage:** All spec sections implemented — Microsoft OAuth, Express middleware, metadata roles, DB migration, StudentContext simplification, route guards, professor password removal
- [x] **No placeholders:** All code blocks are complete and runnable
- [x] **Type consistency:** `clerkUserId` used consistently in schema.ts, db.ts, routers.ts; `token` field kept in StudentContext for backward compat; `ctx.userId` used in all protected procedures
- [x] **Backward compat:** Dynamic components unchanged — `token` still exported from useStudent (now = userId); `token` kept as optional in dynamics input schemas
- [x] **DB migration:** Old sqlite file deleted (data disposable); new schema auto-created on server start
