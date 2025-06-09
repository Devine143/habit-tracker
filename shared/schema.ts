import { z } from "zod";

export const habitSchema = z.object({
  id: z.number(),
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

export type Habit = z.infer<typeof habitSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type DailyNote = z.infer<typeof dailyNoteSchema>;
export type InsertDailyNote = z.infer<typeof insertDailyNoteSchema>;
