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
import type { ClassActivityStatus } from "../db/schema";
import { invokeLLM } from "./llm";
import { notifyOwner } from "./notification";
import { getClassStructure, getDynamicNames } from "../../shared/courseStructure";
import { clerkClient } from "@clerk/express";
import { TRPCError } from "@trpc/server";

// ========== STUDENT ROUTER ==========
const studentRouter = router({
  me: protectedProcedure
    .query(async ({ ctx }) => {
      const existing = await getStudentByClerkId(ctx.userId);
      if (existing) return existing;
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
      await saveChatMessage({ studentId: student.id, weekId: input.weekId, classId: input.classId, blockId: input.blockId, role: "user", content: input.message });
      const history = await getChatHistory(student.id, input.weekId, input.classId, input.blockId);
      const messages = history.map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      const result = await invokeLLM({ messages });
      const reply = typeof result.choices[0]?.message?.content === "string"
        ? result.choices[0].message.content
        : "Lo siento, no pude procesar tu pregunta.";
      await saveChatMessage({ studentId: student.id, weekId: input.weekId, classId: input.classId, blockId: input.blockId, role: "assistant", content: reply });
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

// ========== DYNAMICS ROUTER ==========
const dynamicsRouter = router({
  submit: protectedProcedure
    .input(z.object({
      token: z.string().optional(),
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
      await saveDynamicResponse({
        studentId: student.id,
        weekId: input.weekId,
        classId: input.classId,
        dynamicId: input.dynamicId,
        response: input.response,
        score: input.score,
        maxScore: input.maxScore,
        timeSpentMs: input.timeSpentMs,
      });
      const progress = await getStudentProgress(student.id, input.weekId, input.classId);
      const currentCompleted = (progress?.completedDynamics as number[] | null) ?? [];
      if (!currentCompleted.includes(input.dynamicId)) {
        const updated = [...currentCompleted, input.dynamicId];
        await updateStudentCompletedDynamics(student.id, input.weekId, input.classId, updated);
        const allDynamics = getDynamicNames(input.weekId, input.classId);
        if (Object.keys(allDynamics).length > 0 && updated.length >= Object.keys(allDynamics).length) {
          notifyOwner({
            title: `${student.fullName} completó todas las dinámicas de S${input.weekId}C${input.classId}`,
            content: `Alumno: ${student.fullName}\n\nCompletó S${input.weekId}C${input.classId}`,
          }).catch(() => {});
        }
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
      const statuses = await getAllClassActivityStatuses();
      return statuses
        .filter((s: ClassActivityStatus) => s.weekId === input.weekId && s.classId === input.classId)
        .map((s: ClassActivityStatus) => ({ dynamicId: s.dynamicId, isActive: s.isActive === true }));
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
      const saved = await saveReflection({
        studentId: student.id,
        weekId: input.weekId,
        classId: input.classId,
        reflectionText: input.reflectionText,
      });
      invokeLLM({
        messages: [{
          role: "user",
          content: `Analiza brevemente esta reflexión de un estudiante de ciencias del deporte sobre tecnología deportiva. Identifica sentimiento (positivo/neutro/negativo) y 3-5 palabras clave. Reflexión: "${input.reflectionText}"`,
        }],
      }).then(result => {
        const content = result.choices[0]?.message?.content;
        if (saved && typeof content === "string") {
          updateReflectionAnalysis(saved.id, content, []).catch(() => {});
        }
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

// ========== PROFESSOR ROUTER ==========
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
      const allReflections = await getAllReflections(input.weekId, input.classId);

      // Compute aggregates expected by the dashboard
      const totalStudents = allStudents.length;
      const totalBlocks = structure?.blockCount ?? 0;
      const completedAll = allStudents.filter((_s: { id: number }) => {
        const progress = allResponses.filter((r: { studentId: number }) => r.studentId === _s.id);
        return progress.length >= totalBlocks && totalBlocks > 0;
      }).length;
      const totalReflections = allReflections.length;
      const sentimentCounts = allReflections.reduce(
        (acc: Record<string, number>, r: { sentiment?: string | null }) => {
          const s = r.sentiment ?? "neutro";
          acc[s] = (acc[s] ?? 0) + 1;
          return acc;
        },
        { positivo: 0, neutro: 0, negativo: 0 }
      );

      // Per-dynamic response counts
      const dynamicStats = Object.entries(
        allResponses.reduce((acc: Record<number, number>, r: { dynamicId: number }) => {
          acc[r.dynamicId] = (acc[r.dynamicId] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([dynamicId, totalResponses]) => ({ dynamicId: Number(dynamicId), totalResponses }));

      return {
        students: allStudents,
        responses: allResponses,
        structure,
        dynamicNames,
        totalStudents,
        completedAll,
        totalReflections,
        sentimentCounts,
        dynamicStats,
      };
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
      return getResponsesByDynamic(input.dynamicId, input.weekId, input.classId);
    }),

  allReflections: professorProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      return getAllReflections(input.weekId, input.classId);
    }),

  wordCloud: professorProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      const reflections = await getAllReflections(input.weekId, input.classId);
      const wordFreq: Record<string, number> = {};
      const stopwords = new Set(["de", "la", "el", "en", "y", "a", "los", "las", "un", "una", "es", "que", "se", "con", "del", "por", "para", "al", "lo", "su", "fue", "no", "más", "como"]);
      for (const r of reflections) {
        const words = (r.reflectionText ?? "").toLowerCase().replace(/[^a-záéíóúüñ\s]/gi, "").split(/\s+/);
        for (const w of words) {
          if (w.length > 3 && !stopwords.has(w)) {
            wordFreq[w] = (wordFreq[w] ?? 0) + 1;
          }
        }
      }
      return Object.entries(wordFreq)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50);
    }),

  dynamicStatuses: professorProcedure
    .query(async () => {
      return getAllClassActivityStatuses();
    }),

  toggleDynamic: professorProcedure
    .input(z.object({
      weekId: z.number().default(1),
      classId: z.number().default(1),
      dynamicId: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      await setDynamicActive(input.weekId, input.classId, input.dynamicId, input.isActive);
      return { dynamicId: input.dynamicId, isActive: input.isActive };
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

// ========== IMAGES ROUTER ==========
const imagesRouter = router({
  search: publicProcedure
    .input(z.object({ query: z.string().min(1), page: z.number().default(1) }))
    .query(async ({ input }) => {
      const apiKey = process.env.PEXELS_API_KEY;
      if (!apiKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "PEXELS_API_KEY no configurada" });
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(input.query)}&per_page=20&page=${input.page}&locale=es-ES`;
      const res = await fetch(url, { headers: { Authorization: apiKey } });
      if (!res.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al conectar con Pexels" });
      const data = await res.json() as any;
      return {
        photos: (data.photos ?? []).map((p: any) => ({
          id: p.id,
          photographer: p.photographer,
          alt: p.alt ?? "",
          src: { medium: p.src.medium, large: p.src.large, original: p.src.original },
          url: p.url,
        })),
        totalResults: data.total_results ?? 0,
        page: data.page ?? 1,
      };
    }),
});

export const appRouter = router({
  student: studentRouter,
  dynamics: dynamicsRouter,
  professor: professorRouter,
  images: imagesRouter,
});

export type AppRouter = typeof appRouter;
