# Clerk Authentication Integration — Design Spec
**Date:** 2026-06-01  
**Project:** NTAFD — Guía Interactiva Web para Nuevas Tecnologías en Deporte  
**Status:** Approved, ready for implementation

---

## Context

The current auth system has two independent mechanisms with significant security gaps:

- **Students:** random 64-char token (nanoid) stored in localStorage, passed manually in every tRPC request body. No expiration, no real identity.
- **Professor:** single hardcoded password (`PROFESSOR_PASSWORD` env var) sent with every request. No session, no token.
- All tRPC routes use `publicProcedure` — `protectedProcedure` is defined but unused.
- Existing student progress data in SQLite is disposable (development phase).

---

## Decision

Replace both auth systems with **Clerk** using:
- **Microsoft OAuth** as the sole sign-in method (UPC uses Microsoft institutional accounts)
- **`@clerk/express` middleware** on the server (Option A) — middleware auto-populates `req.auth`, eliminating manual token handling
- **Clerk `publicMetadata`** to distinguish professors (`{ role: 'professor' }`) from students (no special metadata), set manually in the Clerk Dashboard

---

## Architecture

```
Browser                    Express Server              Clerk API
──────                     ──────────────              ─────────
ClerkProvider              clerkMiddleware()            Microsoft OAuth
  │                          │                          JWT signing
  ├─ <SignIn> (Microsoft)     ├─ req.auth.userId         publicMetadata
  │   └─ Clerk hosted UI      └─ req.auth.sessionId      { role: 'professor' }
  │
  ├─ useAuth() → session token
  │
  └─ tRPC client
      headers: { Authorization: Bearer <session_token> }
                    │
             tRPC createContext()
               └─ ctx.userId  (from req.auth.userId)
               └─ ctx.role    (from publicMetadata.role)
```

**Request flow:**
1. Unauthenticated user hits any route → redirected to `/login`
2. User clicks "Entrar con Microsoft" → Clerk handles Microsoft OAuth redirect + callback
3. On success, Clerk stores session; frontend reads it via `useAuth()`
4. Every tRPC request includes `Authorization: Bearer <clerk_session_token>` header
5. `clerkMiddleware()` verifies token and populates `req.auth` before tRPC handler runs
6. `createContext()` reads `req.auth.userId` and fetches `publicMetadata.role`
7. Procedures use `ctx.userId` / `ctx.role` for authorization

---

## Environment Variables

**Server (`.env`):**
```
CLERK_SECRET_KEY=sk_live_...
```

**Client (`.env` or build config):**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

Remove: `PROFESSOR_PASSWORD`

---

## Frontend Changes

### New packages
```
@clerk/react
```

### `src/main.tsx`
Wrap `<App />` with `<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>`.

### Login page (`src/pages/Login.tsx`) — replaces `StudentLogin.tsx`
Single page with one button: "Entrar con Microsoft". Uses Clerk's `<SignInButton>` or `redirectToSignIn()`. No username/password fields. No student code field — identity comes from Clerk.

### Route protection (`src/App.tsx` or router)
```tsx
// Guard component
function RequireAuth({ children }) {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) return <LoadingSpinner />
  if (!isSignedIn) return <Navigate to="/login" />
  return children
}

function RequireProfessor({ children }) {
  const { user } = useUser()
  if (user?.publicMetadata?.role !== 'professor') return <Navigate to="/" />
  return children
}
```

### `src/contexts/StudentContext.tsx` — simplified
- Remove: token state, localStorage logic, `loginOrCreateStudent` mutation
- Keep: `student` object (name, email from `useUser()`), `userId` from `useAuth()`
- Export `userId` (Clerk's) instead of `token` — all downstream components use `userId`

### Dynamic components and ClassViewer
- Replace `token` prop/variable with `userId` from `useAuth()`
- No other logic changes needed in these components

### `ProfessorDashboard`
- Remove: password state, password input, `professor.login` mutation call
- Read role: `const { user } = useUser(); const isProfessor = user?.publicMetadata?.role === 'professor'`
- Show dashboard directly if role matches; redirect otherwise

---

## Backend Changes

### New packages
```
@clerk/express
```

### `server/index.ts`
```ts
import { clerkMiddleware } from '@clerk/express'
// Add before tRPC handler:
app.use(clerkMiddleware())
```

### `server/api/context.ts`
```ts
import { clerkClient } from '@clerk/express'

export type TrpcContext = {
  userId: string | null
  role: 'professor' | 'student' | null
  req: Request
  res: Response
}

export async function createContext({ req, res }): Promise<TrpcContext> {
  const userId = req.auth?.userId ?? null
  let role: 'professor' | 'student' | null = null

  if (userId) {
    const user = await clerkClient.users.getUser(userId)
    role = (user.publicMetadata?.role as 'professor') ?? 'student'
  }

  return { userId, role, req, res }
}
```

### `server/api/trpc.ts` — activate protected procedures
```ts
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, userId: ctx.userId } })
})

export const professorProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
  if (ctx.role !== 'professor') throw new TRPCError({ code: 'FORBIDDEN' })
  return next({ ctx: { ...ctx, userId: ctx.userId, role: ctx.role } })
})
```

### `server/api/routers/student.ts`
- Remove: `token` from all input schemas
- Replace: `getStudentByToken(token)` → use `ctx.userId` directly
- Switch: `publicProcedure` → `protectedProcedure` on all routes except `login`
- Remove: `loginOrCreateStudent` mutation (Clerk handles identity creation)
- Keep: `getProgress`, `updateBlock`, `me` — just use `ctx.userId` as the key

### `server/api/routers/professor.ts`
- Remove: `password` from all input schemas
- Remove: password validation logic
- Switch: all routes to `professorProcedure`

---

## Database Changes

### Schema migration
```sql
-- students table
ALTER TABLE students RENAME COLUMN sessionToken TO clerkUserId;
-- Or: drop and recreate (data is disposable)

-- Drop legacy users table (unused)
DROP TABLE IF EXISTS users;
```

### `server/db/schema.ts`
- `students.sessionToken` → `students.clerkUserId` (type: text, unique)
- Remove `users` table definition
- All foreign key references: `studentId` stays, but resolved via `clerkUserId`

### Student record creation
On first authenticated request, if no student record exists for `ctx.userId`, auto-create one using the name and email from Clerk:
```ts
// In a shared middleware or the `student.me` procedure
const existing = await db.query.students.findFirst({ 
  where: eq(students.clerkUserId, ctx.userId) 
})
if (!existing) {
  const clerkUser = await clerkClient.users.getUser(ctx.userId)
  await db.insert(students).values({
    clerkUserId: ctx.userId,
    fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
    studentCode: clerkUser.emailAddresses[0].emailAddress,
  })
}
```

---

## Clerk Dashboard Setup (manual steps)

1. Create Clerk application at [clerk.com](https://clerk.com)
2. Enable **Microsoft (Azure AD)** OAuth provider in Sign-in methods
3. Disable email/password, Google, and other providers
4. For professor accounts: go to Users → select user → Metadata → Public metadata → add `{ "role": "professor" }`
5. Copy `Publishable Key` and `Secret Key` to `.env`
6. Add Railway production URL to Clerk's allowed origins

---

## Files Changed Summary

| File | Action |
|------|--------|
| `src/main.tsx` | Add ClerkProvider |
| `src/pages/StudentLogin.tsx` | Replace with unified Clerk login page |
| `src/contexts/StudentContext.tsx` | Simplify — use Clerk hooks |
| `src/App.tsx` | Add route guards (RequireAuth, RequireProfessor) |
| `src/pages/course/ClassViewer.tsx` | `token` → `userId` from useAuth |
| `src/components/dynamics/*.tsx` | `token` → `userId` (all dynamic components) |
| `src/pages/ProfessorDashboard.tsx` | Remove password state, use publicMetadata |
| `server/index.ts` | Add clerkMiddleware() |
| `server/api/context.ts` | Read req.auth, fetch publicMetadata role |
| `server/api/trpc.ts` | Activate protectedProcedure + professorProcedure |
| `server/api/routers/student.ts` | Remove token input, use ctx.userId |
| `server/api/routers/professor.ts` | Remove password input, use professorProcedure |
| `server/db/schema.ts` | sessionToken → clerkUserId, remove users table |
| `.env` | Add CLERK_SECRET_KEY, VITE_CLERK_PUBLISHABLE_KEY; remove PROFESSOR_PASSWORD |

---

## Out of Scope

- Multi-tenant / organization support (not needed)
- Clerk webhooks for user sync (auto-create on first request is sufficient)
- Role management UI in the app (Clerk Dashboard is used directly)
- Email notifications
