import {
  users,
  habits,
  dailyNotes,
  habitCompletions,
  type User,
  type UpsertUser,
  type Habit,
  type InsertHabit,
  type DailyNote,
  type InsertDailyNote,
  type HabitCompletion,
  type InsertHabitCompletion,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Habit operations
  getUserHabits(userId: string): Promise<Habit[]>;
  createHabit(userId: string, habit: Omit<InsertHabit, 'userId'>): Promise<Habit>;
  updateHabit(userId: string, habitId: number, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(userId: string, habitId: number): Promise<void>;
  
  // Daily notes operations
  getUserDailyNotes(userId: string): Promise<DailyNote[]>;
  getDailyNote(userId: string, date: string): Promise<DailyNote | undefined>;
  saveDailyNote(userId: string, note: Omit<InsertDailyNote, 'userId'>): Promise<DailyNote>;
  deleteDailyNote(userId: string, date: string): Promise<void>;
  
  // Habit completion operations
  getUserHabitCompletions(userId: string): Promise<HabitCompletion[]>;
  getHabitCompletionForDate(userId: string, habitId: number, date: string): Promise<HabitCompletion | undefined>;
  recordHabitCompletion(userId: string, completion: Omit<InsertHabitCompletion, 'userId'>): Promise<HabitCompletion>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserHabits(userId: string): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId));
  }

  async createHabit(userId: string, habit: Omit<InsertHabit, 'userId'>): Promise<Habit> {
    const [newHabit] = await db
      .insert(habits)
      .values({ ...habit, userId })
      .returning();
    return newHabit;
  }

  async updateHabit(userId: string, habitId: number, updates: Partial<Habit>): Promise<Habit | undefined> {
    const [updatedHabit] = await db
      .update(habits)
      .set(updates)
      .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
      .returning();
    return updatedHabit;
  }

  async deleteHabit(userId: string, habitId: number): Promise<void> {
    await db.delete(habits).where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
  }

  async getUserDailyNotes(userId: string): Promise<DailyNote[]> {
    return await db.select().from(dailyNotes)
      .where(eq(dailyNotes.userId, userId))
      .orderBy(desc(dailyNotes.date));
  }

  async getDailyNote(userId: string, date: string): Promise<DailyNote | undefined> {
    const [note] = await db.select().from(dailyNotes)
      .where(and(eq(dailyNotes.userId, userId), eq(dailyNotes.date, date)));
    return note;
  }

  async saveDailyNote(userId: string, note: Omit<InsertDailyNote, 'userId'>): Promise<DailyNote> {
    const [savedNote] = await db
      .insert(dailyNotes)
      .values({ ...note, userId })
      .onConflictDoUpdate({
        target: [dailyNotes.userId, dailyNotes.date],
        set: {
          note: note.note,
          updatedAt: new Date(),
        },
      })
      .returning();
    return savedNote;
  }

  async deleteDailyNote(userId: string, date: string): Promise<void> {
    await db.delete(dailyNotes)
      .where(and(eq(dailyNotes.userId, userId), eq(dailyNotes.date, date)));
  }

  async getUserHabitCompletions(userId: string): Promise<HabitCompletion[]> {
    return await db.select().from(habitCompletions)
      .where(eq(habitCompletions.userId, userId))
      .orderBy(desc(habitCompletions.date));
  }

  async getHabitCompletionForDate(userId: string, habitId: number, date: string): Promise<HabitCompletion | undefined> {
    const [completion] = await db.select().from(habitCompletions)
      .where(and(
        eq(habitCompletions.userId, userId),
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.date, date)
      ));
    return completion;
  }

  async recordHabitCompletion(userId: string, completion: Omit<InsertHabitCompletion, 'userId'>): Promise<HabitCompletion> {
    const [newCompletion] = await db
      .insert(habitCompletions)
      .values({ ...completion, userId })
      .onConflictDoUpdate({
        target: [habitCompletions.userId, habitCompletions.habitId, habitCompletions.date],
        set: {
          completed: completion.completed,
          completedAt: new Date(),
        },
      })
      .returning();
    return newCompletion;
  }
}

export const storage = new DatabaseStorage();
