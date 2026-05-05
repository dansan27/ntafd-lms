import { COOKIE_NAME } from "../../shared/const";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import {
  loginOrCreateStudent,
  getStudentByToken,
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
import type {
  DynamicResponse,
  ClassActivityStatus
} from "../db/schema";
import { invokeLLM } from "./llm";
import { notifyOwner } from "./notification";

import { ENV } from "./env";
import { getClassStructure, getDynamicNames } from "../../shared/courseStructure";

// Use environment variable for password
const VALID_PASSWORD = ENV.professorPassword || "profesor2026";

// ========== STUDENT ROUTER ==========
const studentRouter = router({
  login: publicProcedure
    .input(z.object({
      fullName: z.string().min(2, "Nombre completo requerido"),
      studentCode: z.string().min(3, "Código de alumno requerido"),
    }))
    .mutation(async ({ input }) => {
      const student = await loginOrCreateStudent(input.fullName, input.studentCode);
      return student;
    }),

  me: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      return student ?? null;
    }),

  getProgress: publicProcedure
    .input(z.object({ token: z.string(), weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) return null;
      return getStudentProgress(student.id, input.weekId, input.classId);
    }),

  updateBlock: publicProcedure
    .input(z.object({
      token: z.string(),
      weekId: z.number().default(1),
      classId: z.number().default(1),
      block: z.number().min(1).max(20),
    }))
    .mutation(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) throw new Error("Sesión no válida");
      await updateStudentBlock(student.id, input.weekId, input.classId, input.block);
      return { success: true };
    }),
});

// ========== DYNAMICS ROUTER ==========
const dynamicsRouter = router({
  submit: publicProcedure
    .input(z.object({
      token: z.string(),
      weekId: z.number().default(1),
      classId: z.number().default(1),
      dynamicId: z.number().min(1),
      response: z.record(z.string(), z.unknown()),
      score: z.number(),
      maxScore: z.number(),
      timeSpentMs: z.number(),
    }))
    .mutation(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) throw new Error("Sesión no válida");

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

      const prog = await getStudentProgress(student.id, input.weekId, input.classId);
      const currentCompleted = (prog.completedDynamics as number[] | null) ?? [];

      if (!currentCompleted.includes(input.dynamicId)) {
        const updated = [...currentCompleted, input.dynamicId];
        await updateStudentCompletedDynamics(student.id, input.weekId, input.classId, updated);

        // Notify professor when all dynamics of the class are completed
        const classStructure = getClassStructure(input.weekId, input.classId);
        const totalDynamics = classStructure?.dynamics.length ?? 0;
        if (totalDynamics > 0 && updated.length >= totalDynamics) {
          try {
            const allResponses = await getStudentDynamicResponses(student.id, input.weekId, input.classId);
            const dynNames = getDynamicNames(input.weekId, input.classId);
            const summary = allResponses.map((r: DynamicResponse) =>
              `${dynNames[r.dynamicId] ?? `D${r.dynamicId}`}: ${r.score}/${r.maxScore}`
            ).join("\n");
            const totalScore = allResponses.reduce((s: number, r: DynamicResponse) => s + r.score, 0);
            const totalMax = allResponses.reduce((s: number, r: DynamicResponse) => s + r.maxScore, 0);
            await notifyOwner({
              title: `${student.fullName} completó Semana ${input.weekId} Clase ${input.classId}`,
              content: `Alumno: ${student.fullName}\nCódigo: ${student.studentCode}\n\nResumen:\n${summary}\n\nTotal: ${totalScore}/${totalMax}`,
            });
          } catch (e) {
            console.warn("Failed to notify owner:", e);
          }
        }
      }

      return { success: true, score: input.score, maxScore: input.maxScore };
    }),

  myResponses: publicProcedure
    .input(z.object({ token: z.string(), weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) return [];
      return getStudentDynamicResponses(student.id, input.weekId, input.classId);
    }),

  // Public endpoint: alumnos consultan qué dinámicas están activas
  activeStatuses: publicProcedure
    .input(z.object({ weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      const statuses = await getAllClassActivityStatuses();
      return statuses
        .filter((s: ClassActivityStatus) => s.weekId === input.weekId && s.classId === input.classId)
        .map((s: ClassActivityStatus) => ({ dynamicId: s.dynamicId, isActive: s.isActive === true }));
    }),
});

// ========== REFLECTION ROUTER ==========
const reflectionRouter = router({
  submit: publicProcedure
    .input(z.object({
      token: z.string(),
      weekId: z.number().default(1),
      classId: z.number().default(1),
      text: z.string().min(5, "Escribe al menos una oración"),
    }))
    .mutation(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) throw new Error("Sesión no válida");

      const reflection = await saveReflection({
        studentId: student.id,
        weekId: input.weekId,
        classId: input.classId,
        reflectionText: input.text,
      });

      // Analyze with LLM in background
      try {
        const llmResult = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Eres un analizador de texto educativo. Analiza la reflexión del alumno sobre una clase. Responde SOLO con JSON válido.",
            },
            {
              role: "user",
              content: `Analiza esta reflexión de un alumno:\n"${input.text}"\n\nResponde con JSON: {"sentiment": "positivo|neutro|negativo", "keywords": ["palabra1", "palabra2", ...]} donde keywords son los conceptos clave mencionados (máximo 8 palabras).`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "reflection_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  sentiment: { type: "string", enum: ["positivo", "neutro", "negativo"] },
                  keywords: { type: "array", items: { type: "string" } },
                },
                required: ["sentiment", "keywords"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = llmResult.choices[0]?.message?.content;
        if (content && typeof content === "string") {
          const parsed = JSON.parse(content);
          if (reflection) {
            await updateReflectionAnalysis(reflection.id, parsed.sentiment, parsed.keywords);
          }
          return { success: true, sentiment: parsed.sentiment, keywords: parsed.keywords };
        }
      } catch (e) {
        console.warn("LLM analysis failed:", e);
      }

      return { success: true, sentiment: null, keywords: [] };
    }),

  mine: publicProcedure
    .input(z.object({ token: z.string(), weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) return null;
      return getStudentReflection(student.id, input.weekId, input.classId);
    }),
});

// ========== PROFESSOR DASHBOARD ROUTER ==========
const professorRouter = router({
  login: publicProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("Contraseña incorrecta");
      return { success: true, professorToken: "prof_token_" + Date.now() };
    }),

  verify: publicProcedure
    .input(z.object({ password: z.string() }))
    .query(async ({ input }) => {
      return { valid: input.password === VALID_PASSWORD };
    }),

  students: publicProcedure
    .input(z.object({ password: z.string() }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      return getAllStudents();
    }),

  allResponses: publicProcedure
    .input(z.object({ password: z.string(), weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      return getAllDynamicResponses(input.weekId, input.classId);
    }),

  responsesByDynamic: publicProcedure
    .input(z.object({ password: z.string(), weekId: z.number().default(1), classId: z.number().default(1), dynamicId: z.number() }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      return getResponsesByDynamic(input.dynamicId, input.weekId, input.classId);
    }),

  allReflections: publicProcedure
    .input(z.object({ password: z.string(), weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      return getAllReflections(input.weekId, input.classId);
    }),

  wordCloud: publicProcedure
    .input(z.object({ password: z.string(), weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      const reflections = await getAllReflections(input.weekId, input.classId);
      const allKeywords: Record<string, number> = {};
      for (const r of reflections) {
        const kw = (r.keywords as string[] | null) ?? [];
        for (const word of kw) {
          const lower = word.toLowerCase().trim();
          if (lower) {
            allKeywords[lower] = (allKeywords[lower] || 0) + 1;
          }
        }
      }
      return Object.entries(allKeywords)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count);
    }),

  dynamicStatuses: publicProcedure
    .input(z.object({ password: z.string() }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      return getAllClassActivityStatuses();
    }),

  toggleDynamic: publicProcedure
    .input(z.object({
      password: z.string(),
      weekId: z.number().default(1),
      classId: z.number().default(1),
      dynamicId: z.number().min(1),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      await setDynamicActive(input.weekId, input.classId, input.dynamicId, input.isActive);
      return { success: true, dynamicId: input.dynamicId, isActive: input.isActive };
    }),

  leaderboard: publicProcedure
    .input(z.object({ password: z.string() }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      return getLeaderboard();
    }),

  allAchievements: publicProcedure
    .input(z.object({ password: z.string() }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      return getAllAchievements();
    }),

  stats: publicProcedure
    .input(z.object({ password: z.string(), weekId: z.number().default(1), classId: z.number().default(1) }))
    .query(async ({ input }) => {
      if (input.password !== VALID_PASSWORD) throw new Error("ACCESO DENEGADO - PASSWORD MISMATCH");
      const students = await getAllStudents();
      const responses = await getAllDynamicResponses(input.weekId, input.classId);
      const reflections = await getAllReflections(input.weekId, input.classId);
      const progressRecords = await getProgressByClass(input.weekId, input.classId);

      const totalStudents = students.length;

      // Get dynamic IDs from course structure (or fallback to IDs found in responses)
      const classStructure = getClassStructure(input.weekId, input.classId);
      const dynamicIds = classStructure
        ? classStructure.dynamics.map(d => d.id)
        : [...new Set(responses.map((r: DynamicResponse) => r.dynamicId))].sort((a, b) => a - b);

      const dynamicStats = dynamicIds.map(dId => {
        const dResponses = responses.filter((r: DynamicResponse) => r.dynamicId === dId);
        const avgScore = dResponses.length > 0
          ? dResponses.reduce((sum: number, r: DynamicResponse) => sum + r.score, 0) / dResponses.length
          : 0;
        return {
          dynamicId: dId,
          totalResponses: dResponses.length,
          avgScore: Math.round(avgScore * 100) / 100,
        };
      });

      // Count students who completed all dynamics for this class
      const completedAll = dynamicIds.length > 0
        ? progressRecords.filter(p => {
            const completed = (p.completedDynamics as number[] | null) ?? [];
            return completed.length >= dynamicIds.length;
          }).length
        : 0;

      const sentimentCounts = { positivo: 0, neutro: 0, negativo: 0 };
      for (const r of reflections) {
        if (r.sentiment && r.sentiment in sentimentCounts) {
          sentimentCounts[r.sentiment as keyof typeof sentimentCounts]++;
        }
      }

      return {
        totalStudents,
        completedAll,
        totalReflections: reflections.length,
        dynamicStats,
        sentimentCounts,
      };
    }),
});

// ========== ACHIEVEMENTS ROUTER ==========
const achievementsRouter = router({
  mine: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) return [];
      return getStudentAchievements(student.id);
    }),

  award: publicProcedure
    .input(z.object({
      token: z.string(),
      achievementId: z.string(),
      achievementName: z.string(),
    }))
    .mutation(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) throw new Error("Sesión no válida");
      const result = await awardAchievement(student.id, input.achievementId, input.achievementName);
      return { success: true, isNew: result !== null };
    }),
});

// ========== NOTES ROUTER ==========
const notesRouter = router({
  get: publicProcedure
    .input(z.object({
      token: z.string(),
      weekId: z.number(),
      classId: z.number(),
      blockId: z.number(),
    }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) return null;
      return getStudentNote(student.id, input.weekId, input.classId, input.blockId);
    }),

  save: publicProcedure
    .input(z.object({
      token: z.string(),
      weekId: z.number(),
      classId: z.number(),
      blockId: z.number(),
      noteText: z.string(),
    }))
    .mutation(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) throw new Error("Sesión no válida");
      await saveStudentNote(student.id, input.weekId, input.classId, input.blockId, input.noteText);
      return { success: true };
    }),

  allMine: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) return [];
      return getStudentAllNotes(student.id);
    }),
});

// ========== CHATBOT ROUTER ==========
const chatRouter = router({
  ask: publicProcedure
    .input(z.object({
      token: z.string(),
      weekId: z.number(),
      classId: z.number(),
      blockId: z.number(),
      blockTitle: z.string(),
      weekTitle: z.string(),
      message: z.string().min(1).max(1000),
    }))
    .mutation(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) throw new Error("Sesión no válida");

      // Save user message
      await saveChatMessage({
        studentId: student.id,
        weekId: input.weekId,
        classId: input.classId,
        blockId: input.blockId,
        role: "user",
        content: input.message,
      });

      // Get history for context
      const history = await getChatHistory(student.id, input.weekId, input.classId, input.blockId);
      const recentHistory = history.slice(-10);

      try {
        const llmResult = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `Eres un tutor experto en tecnología deportiva y ciencias del deporte. El alumno está viendo: "${input.blockTitle}" de "${input.weekTitle}". Responde de forma clara, concisa y en español. Usa ejemplos deportivos cuando sea posible. Máximo 3 párrafos.`,
            },
            ...recentHistory.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
            { role: "user", content: input.message },
          ],
        });

        const rawContent = llmResult.choices[0]?.message?.content;
        const answer = typeof rawContent === "string" ? rawContent : "Lo siento, no pude procesar tu pregunta.";

        await saveChatMessage({
          studentId: student.id,
          weekId: input.weekId,
          classId: input.classId,
          blockId: input.blockId,
          role: "assistant",
          content: answer,
        });

        return { success: true, answer };
      } catch (e) {
        console.warn("Chatbot LLM failed:", e);
        return { success: false, answer: "El asistente no está disponible en este momento. Intenta más tarde." };
      }
    }),

  history: publicProcedure
    .input(z.object({
      token: z.string(),
      weekId: z.number(),
      classId: z.number(),
      blockId: z.number(),
    }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) return [];
      return getChatHistory(student.id, input.weekId, input.classId, input.blockId);
    }),

  clear: publicProcedure
    .input(z.object({
      token: z.string(),
      weekId: z.number(),
      classId: z.number(),
      blockId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) throw new Error("Sesión no válida");
      await clearChatHistory(student.id, input.weekId, input.classId, input.blockId);
      return { success: true };
    }),
});

// ========== STUDENT STATS ROUTER ==========
const statsRouter = router({
  mine: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const student = await getStudentByToken(input.token);
      if (!student) return null;
      return getStudentStats(student.id);
    }),
});

const systemRouter = router({});
const getSessionCookieOptions = (_req: any) => ({});

const imagesRouter = router({
  search: publicProcedure
    .input(z.object({ query: z.string().min(1), page: z.number().default(1) }))
    .query(async ({ input }) => {
      const apiKey = process.env.PEXELS_API_KEY;
      if (!apiKey) throw new Error("PEXELS_API_KEY no configurada");
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(input.query)}&per_page=20&page=${input.page}&locale=es-ES`;
      const res = await fetch(url, { headers: { Authorization: apiKey } });
      if (!res.ok) throw new Error("Error al conectar con Pexels");
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
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  student: studentRouter,
  dynamics: dynamicsRouter,
  reflection: reflectionRouter,
  professor: professorRouter,
  achievements: achievementsRouter,
  notes: notesRouter,
  chat: chatRouter,
  stats: statsRouter,
  images: imagesRouter,
});

export type AppRouter = typeof appRouter;
