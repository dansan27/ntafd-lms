import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { 
  users, students, studentProgress, dynamicResponses, 
  reflections, classActivitiesStatus,
  type InsertUser,
  type InsertDynamicResponse, type InsertReflection
} from "./schema";
import { ENV } from '../api/env';
import { nanoid } from "nanoid";
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
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openId TEXT NOT NULL UNIQUE,
    name TEXT,
    email TEXT,
    loginMethod TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    lastSignedIn INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    studentCode TEXT NOT NULL UNIQUE,
    sessionToken TEXT,
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
`);

export async function getDb() {
  return db;
}

// ========== USER (Manus OAuth / Admin) ==========

export async function upsertUser(user: InsertUser): Promise<void> {
  // SQLite doesn't natively support onDuplicateKeyUpdate without insert...on conflict
  // We'll simulate upsert for simplicity since this is mostly a mock
  const existing = db.select().from(users).where(eq(users.openId, user.openId)).all();
  
  if (existing.length > 0) {
    db.update(users).set({
      name: user.name,
      email: user.email,
      lastSignedIn: user.lastSignedIn ?? new Date(),
      role: user.openId === ENV.ownerOpenId ? 'admin' : (user.role ?? 'user')
    }).where(eq(users.openId, user.openId)).run();
  } else {
    db.insert(users).values({
      ...user,
      lastSignedIn: user.lastSignedIn ?? new Date(),
      role: user.openId === ENV.ownerOpenId ? 'admin' : (user.role ?? 'user'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).run();
  }
}

export async function getUserByOpenId(openId: string) {
  const result = db.select().from(users).where(eq(users.openId, openId)).limit(1).all();
  return result.length > 0 ? result[0] : undefined;
}

// ========== STUDENTS ==========

export async function loginOrCreateStudent(fullName: string, studentCode: string) {
  const token = nanoid(64);
  const now = new Date();

  const existing = db.select().from(students).where(eq(students.studentCode, studentCode)).limit(1).all();

  if (existing.length > 0) {
    db.update(students)
      .set({ fullName, sessionToken: token, lastActiveAt: now })
      .where(eq(students.studentCode, studentCode)).run();
      
    return { ...existing[0], fullName, sessionToken: token };
  }

  db.insert(students).values({
    fullName,
    studentCode,
    sessionToken: token,
    createdAt: now,
    lastActiveAt: now,
  }).run();

  const newStudent = db.select().from(students).where(eq(students.studentCode, studentCode)).limit(1).all();
  return newStudent[0];
}

export async function getStudentByToken(token: string) {
  const result = db.select().from(students).where(eq(students.sessionToken, token)).limit(1).all();
  return result.length > 0 ? result[0] : undefined;
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
