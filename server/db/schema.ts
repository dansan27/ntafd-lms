import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role").default("user").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: 'timestamp' }).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("fullName").notNull(),
  studentCode: text("studentCode").notNull().unique(),
  sessionToken: text("sessionToken"),
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
