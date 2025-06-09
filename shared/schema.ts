import { z } from "zod";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Database table definitions
export const habits = pgTable("habits", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  completed: boolean("completed").default(false),
  streak: integer("streak").default(0),
  lastCompleted: varchar("last_completed"),
  createdDate: varchar("created_date").notNull(),
});

export const dailyNotes = pgTable("daily_notes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: varchar("date").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habitCompletions = pgTable("habit_completions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  habitId: integer("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  date: varchar("date").notNull(),
  completed: boolean("completed").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Zod schemas for validation
export const habitSchema = z.object({
  id: z.number(),
  userId: z.string(),
  name: z.string(),
  completed: z.boolean(),
  streak: z.number(),
  lastCompleted: z.string().nullable(),
  createdDate: z.string(),
});

export const insertHabitSchema = habitSchema.omit({
  id: true,
  completed: true,
  streak: true,
  lastCompleted: true,
});

export const dailyNoteSchema = z.object({
  id: z.number(),
  userId: z.string(),
  date: z.string(),
  note: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertDailyNoteSchema = dailyNoteSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const habitCompletionSchema = z.object({
  id: z.number(),
  userId: z.string(),
  habitId: z.number(),
  date: z.string(),
  completed: z.boolean(),
  completedAt: z.string(),
});

export const insertHabitCompletionSchema = habitCompletionSchema.omit({
  id: true,
  completedAt: true,
});

export type Habit = z.infer<typeof habitSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type DailyNote = z.infer<typeof dailyNoteSchema>;
export type InsertDailyNote = z.infer<typeof insertDailyNoteSchema>;
export type HabitCompletion = z.infer<typeof habitCompletionSchema>;
export type InsertHabitCompletion = z.infer<typeof insertHabitCompletionSchema>;
