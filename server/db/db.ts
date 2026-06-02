import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  students, studentProgress, dynamicResponses,
  reflections, classActivitiesStatus,
  studentAchievements, studentNotes, chatMessages,
  type Student,
  type InsertDynamicResponse, type InsertReflection,
  type InsertChatMessage,
} from "./schema";
import fs from "fs";
import path from "path";

// Initialize SQLite database
const dbDir = path.resolve(process.cwd(), "db_data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const sqlite = new Database(path.join(dbDir, "lms.sqlite"));
export const db = drizzle(sqlite);

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clerkUserId TEXT NOT NULL UNIQUE,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    lastActiveAt INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS student_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    weekId INTEGER NOT NULL,
    classId INTEGER NOT NULL,
    currentBlock INTEGER NOT NULL DEFAULT 1,
    completedDynamics TEXT NOT NULL DEFAULT '[]',
    updatedAt INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS dynamic_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    weekId INTEGER NOT NULL DEFAULT 1,
    classId INTEGER NOT NULL DEFAULT 1,
    dynamicId INTEGER NOT NULL,
    response TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    maxScore INTEGER NOT NULL DEFAULT 0,
    timeSpentMs INTEGER DEFAULT 0,
    submittedAt INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS reflections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    weekId INTEGER NOT NULL DEFAULT 1,
    classId INTEGER NOT NULL DEFAULT 1,
    reflectionText TEXT NOT NULL,
    sentiment TEXT,
    keywords TEXT NOT NULL DEFAULT '[]',
    analyzedAt INTEGER,
    createdAt INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS class_activities_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weekId INTEGER NOT NULL,
    classId INTEGER NOT NULL,
    dynamicId INTEGER NOT NULL,
    isActive INTEGER NOT NULL DEFAULT 0,
    activatedAt INTEGER,
    deactivatedAt INTEGER
  );
  CREATE TABLE IF NOT EXISTS student_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    achievementId TEXT NOT NULL,
    achievementName TEXT NOT NULL,
    earnedAt INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS student_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    weekId INTEGER NOT NULL,
    classId INTEGER NOT NULL,
    blockId INTEGER NOT NULL,
    noteText TEXT NOT NULL DEFAULT '',
    updatedAt INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    weekId INTEGER NOT NULL,
    classId INTEGER NOT NULL,
    blockId INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );
`);

export async function getDb() {
  return db;
}

// ========== STUDENTS ==========

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

export async function getStudentById(id: number) {
  const result = db.select().from(students).where(eq(students.id, id)).limit(1).all();
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllStudents() {
  return db.select().from(students).orderBy(desc(students.lastActiveAt)).all();
}

// ========== STUDENT PROGRESS (WEEKS / CLASSES) ==========

export async function getStudentProgress(studentId: number, weekId: number, classId: number) {
  const result = db.select().from(studentProgress)
    .where(and(
      eq(studentProgress.studentId, studentId),
      eq(studentProgress.weekId, weekId),
      eq(studentProgress.classId, classId)
    )).limit(1).all();
  
  if (result.length > 0) return result[0];

  // Initialize progress if it doesn't exist
  db.insert(studentProgress).values({
    studentId, weekId, classId, currentBlock: 1, completedDynamics: [], updatedAt: new Date()
  }).run();
  
  return db.select().from(studentProgress)
    .where(and(
      eq(studentProgress.studentId, studentId),
      eq(studentProgress.weekId, weekId),
      eq(studentProgress.classId, classId)
    )).limit(1).all()[0];
}

export async function updateStudentBlock(studentId: number, weekId: number, classId: number, block: number) {
  await getStudentProgress(studentId, weekId, classId); // ensures exists
  db.update(studentProgress)
    .set({ currentBlock: block, updatedAt: new Date() })
    .where(and(
      eq(studentProgress.studentId, studentId),
      eq(studentProgress.weekId, weekId),
      eq(studentProgress.classId, classId)
    )).run();
}

export async function updateStudentCompletedDynamics(studentId: number, weekId: number, classId: number, dynamicIds: number[]) {
  await getStudentProgress(studentId, weekId, classId);
  db.update(studentProgress)
    .set({ completedDynamics: dynamicIds, updatedAt: new Date() })
    .where(and(
      eq(studentProgress.studentId, studentId),
      eq(studentProgress.weekId, weekId),
      eq(studentProgress.classId, classId)
    )).run();
}

// ========== DYNAMIC RESPONSES ==========

export async function saveDynamicResponse(data: InsertDynamicResponse) {
  db.insert(dynamicResponses).values(data).run();
}

export async function getStudentDynamicResponses(studentId: number, weekId?: number, classId?: number) {
  return db.select().from(dynamicResponses).where(and(
    eq(dynamicResponses.studentId, studentId),
    weekId ? eq(dynamicResponses.weekId, weekId) : undefined,
    classId ? eq(dynamicResponses.classId, classId) : undefined
  )).orderBy(desc(dynamicResponses.submittedAt)).all();
}

export async function getAllDynamicResponses(weekId?: number, classId?: number) {
  return db.select().from(dynamicResponses).where(and(
    weekId ? eq(dynamicResponses.weekId, weekId) : undefined,
    classId ? eq(dynamicResponses.classId, classId) : undefined
  )).orderBy(desc(dynamicResponses.submittedAt)).all();
}

export async function getResponsesByDynamic(dynamicId: number, weekId: number, classId: number) {
  return db.select().from(dynamicResponses)
    .where(and(
      eq(dynamicResponses.dynamicId, dynamicId),
      eq(dynamicResponses.weekId, weekId),
      eq(dynamicResponses.classId, classId)
    ))
    .orderBy(desc(dynamicResponses.submittedAt)).all();
}

// ========== REFLECTIONS ==========

export async function saveReflection(data: InsertReflection) {
  db.insert(reflections).values(data).run();
  return db.select().from(reflections)
    .where(eq(reflections.studentId, data.studentId))
    .orderBy(desc(reflections.createdAt))
    .limit(1).all()[0];
}

export async function updateReflectionAnalysis(id: number, sentiment: string, keywords: string[]) {
  db.update(reflections).set({
    sentiment,
    keywords,
    analyzedAt: new Date(),
  }).where(eq(reflections.id, id)).run();
}

export async function getAllReflections(weekId?: number, classId?: number) {
  return db.select().from(reflections).where(and(
    weekId ? eq(reflections.weekId, weekId) : undefined,
    classId ? eq(reflections.classId, classId) : undefined
  )).orderBy(desc(reflections.createdAt)).all();
}

export async function getStudentReflection(studentId: number, weekId: number, classId: number) {
  const result = db.select().from(reflections)
    .where(and(
      eq(reflections.studentId, studentId),
      eq(reflections.weekId, weekId),
      eq(reflections.classId, classId)
    ))
    .orderBy(desc(reflections.createdAt))
    .limit(1).all();
  return result.length > 0 ? result[0] : undefined;
}

export async function getProgressByClass(weekId: number, classId: number) {
  return db.select().from(studentProgress)
    .where(and(
      eq(studentProgress.weekId, weekId),
      eq(studentProgress.classId, classId)
    )).all();
}

// ========== CLASS ACTIVITY STATUS ==========

export async function getAllClassActivityStatuses() {
  return db.select().from(classActivitiesStatus).all();
}

export async function setDynamicActive(weekId: number, classId: number, dynamicId: number, isActive: boolean) {
  const now = new Date();
  
  const existing = db.select().from(classActivitiesStatus)
    .where(and(
      eq(classActivitiesStatus.weekId, weekId),
      eq(classActivitiesStatus.classId, classId),
      eq(classActivitiesStatus.dynamicId, dynamicId)
    )).limit(1).all();

  if (existing.length > 0) {
    db.update(classActivitiesStatus)
      .set({
        isActive: isActive,
        ...(isActive ? { activatedAt: now } : { deactivatedAt: now }),
      })
      .where(eq(classActivitiesStatus.id, existing[0].id)).run();
  } else {
    db.insert(classActivitiesStatus).values({
      weekId, classId, dynamicId, isActive,
      ...(isActive ? { activatedAt: now } : { deactivatedAt: now }),
    }).run();
  }
}

// ========== ACHIEVEMENTS ==========

export async function getStudentAchievements(studentId: number) {
  return db.select().from(studentAchievements)
    .where(eq(studentAchievements.studentId, studentId))
    .orderBy(desc(studentAchievements.earnedAt)).all();
}

export async function hasAchievement(studentId: number, achievementId: string) {
  const result = db.select().from(studentAchievements)
    .where(and(
      eq(studentAchievements.studentId, studentId),
      eq(studentAchievements.achievementId, achievementId)
    )).limit(1).all();
  return result.length > 0;
}

export async function awardAchievement(studentId: number, achievementId: string, achievementName: string) {
  const already = await hasAchievement(studentId, achievementId);
  if (already) return null;
  db.insert(studentAchievements).values({ studentId, achievementId, achievementName, earnedAt: new Date() }).run();
  return { studentId, achievementId, achievementName };
}

export async function getAllAchievements() {
  return db.select().from(studentAchievements).orderBy(desc(studentAchievements.earnedAt)).all();
}

// ========== NOTES ==========

export async function getStudentNote(studentId: number, weekId: number, classId: number, blockId: number) {
  const result = db.select().from(studentNotes)
    .where(and(
      eq(studentNotes.studentId, studentId),
      eq(studentNotes.weekId, weekId),
      eq(studentNotes.classId, classId),
      eq(studentNotes.blockId, blockId)
    )).limit(1).all();
  return result.length > 0 ? result[0] : null;
}

export async function saveStudentNote(studentId: number, weekId: number, classId: number, blockId: number, noteText: string) {
  const existing = await getStudentNote(studentId, weekId, classId, blockId);
  const now = new Date();
  if (existing) {
    db.update(studentNotes).set({ noteText, updatedAt: now })
      .where(eq(studentNotes.id, existing.id)).run();
  } else {
    db.insert(studentNotes).values({ studentId, weekId, classId, blockId, noteText, updatedAt: now }).run();
  }
}

export async function getStudentAllNotes(studentId: number) {
  return db.select().from(studentNotes)
    .where(eq(studentNotes.studentId, studentId))
    .orderBy(desc(studentNotes.updatedAt)).all();
}

// ========== CHAT MESSAGES ==========

export async function saveChatMessage(data: InsertChatMessage) {
  db.insert(chatMessages).values(data).run();
}

export async function getChatHistory(studentId: number, weekId: number, classId: number, blockId: number) {
  return db.select().from(chatMessages)
    .where(and(
      eq(chatMessages.studentId, studentId),
      eq(chatMessages.weekId, weekId),
      eq(chatMessages.classId, classId),
      eq(chatMessages.blockId, blockId)
    ))
    .orderBy(chatMessages.createdAt).all();
}

export async function clearChatHistory(studentId: number, weekId: number, classId: number, blockId: number) {
  db.delete(chatMessages).where(and(
    eq(chatMessages.studentId, studentId),
    eq(chatMessages.weekId, weekId),
    eq(chatMessages.classId, classId),
    eq(chatMessages.blockId, blockId)
  )).run();
}

// ========== LEADERBOARD ==========

export async function getLeaderboard() {
  const allStudents = await getAllStudents();
  const allResponses = await getAllDynamicResponses();

  return allStudents.map(s => {
    const sResponses = allResponses.filter(r => r.studentId === s.id);
    const totalScore = sResponses.reduce((sum, r) => sum + r.score, 0);
    const totalMax = sResponses.reduce((sum, r) => sum + r.maxScore, 0);
    const avgTime = sResponses.length > 0
      ? sResponses.reduce((sum, r) => sum + (r.timeSpentMs ?? 0), 0) / sResponses.length
      : 0;
    return {
      studentId: s.id,
      fullName: s.fullName,
      clerkUserId: s.clerkUserId,
      totalScore,
      totalMax,
      completedDynamics: sResponses.length,
      avgTimeMs: Math.round(avgTime),
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}

// ========== STUDENT STATS (for Mi Progreso page) ==========

export async function getStudentStats(studentId: number) {
  const allResponses = await getStudentDynamicResponses(studentId);
  const allNotesResult = await getStudentAllNotes(studentId);
  const allAchievementsResult = await getStudentAchievements(studentId);

  const totalScore = allResponses.reduce((sum, r) => sum + r.score, 0);
  const totalMax = allResponses.reduce((sum, r) => sum + r.maxScore, 0);
  const totalTimeMs = allResponses.reduce((sum, r) => sum + (r.timeSpentMs ?? 0), 0);

  // Group by week/class to find completed classes
  const classMap = new Map<string, number[]>();
  for (const r of allResponses) {
    const key = `${r.weekId}-${r.classId}`;
    if (!classMap.has(key)) classMap.set(key, []);
    classMap.get(key)!.push(r.dynamicId);
  }

  return {
    totalScore,
    totalMax,
    totalDynamicsCompleted: allResponses.length,
    totalTimeMs,
    classesAttempted: classMap.size,
    notesCount: allNotesResult.length,
    achievementsCount: allAchievementsResult.length,
    achievements: allAchievementsResult,
  };
}
