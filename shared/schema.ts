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

export type Habit = z.infer<typeof habitSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
