import { Habit, InsertHabit, DailyNote, InsertDailyNote, HabitCompletion, InsertHabitCompletion } from "@shared/schema";

export class HabitStorage {
  private static HABITS_KEY = 'habits';
  private static CURRENT_DATE_KEY = 'currentDate';
  private static DAILY_NOTES_KEY = 'dailyNotes';
  private static HABIT_COMPLETIONS_KEY = 'habitCompletions';

  static getHabits(): Habit[] {
    const stored = localStorage.getItem(this.HABITS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveHabits(habits: Habit[]): void {
    localStorage.setItem(this.HABITS_KEY, JSON.stringify(habits));
  }

  static getCurrentDate(): string {
    return localStorage.getItem(this.CURRENT_DATE_KEY) || '';
  }

  static setCurrentDate(date: string): void {
    localStorage.setItem(this.CURRENT_DATE_KEY, date);
  }

  static addHabit(habitData: InsertHabit): Habit {
    const habits = this.getHabits();
    const newHabit: Habit = {
      id: Date.now(),
      completed: false,
      streak: 0,
      lastCompleted: null,
      ...habitData,
    };
    
    habits.push(newHabit);
    this.saveHabits(habits);
    return newHabit;
  }

  static updateHabit(habitId: number, updates: Partial<Habit>): void {
    const habits = this.getHabits();
    const index = habits.findIndex(h => h.id === habitId);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      this.saveHabits(habits);
    }
  }

  static deleteHabit(habitId: number): void {
    const habits = this.getHabits();
    const filtered = habits.filter(h => h.id !== habitId);
    this.saveHabits(filtered);
  }

  static checkAndResetForNewDay(): Habit[] {
    const habits = this.getHabits();
    const currentDate = this.getCurrentDate();
    const today = new Date().toDateString();

    if (currentDate !== today) {
      const updatedHabits = habits.map(habit => {
        if (habit.completed && habit.lastCompleted !== today) {
          // Check if habit was completed yesterday to maintain streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (habit.lastCompleted === yesterday.toDateString()) {
            // Streak continues, just reset completion for today
            return { ...habit, completed: false };
          } else {
            // Streak broken, reset
            return { ...habit, completed: false, streak: 0 };
          }
        }
        return habit;
      });

      this.saveHabits(updatedHabits);
      this.setCurrentDate(today);
      return updatedHabits;
    }

    return habits;
  }

  // Daily Notes methods
  static getDailyNotes(): DailyNote[] {
    const stored = localStorage.getItem(this.DAILY_NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveDailyNotes(notes: DailyNote[]): void {
    localStorage.setItem(this.DAILY_NOTES_KEY, JSON.stringify(notes));
  }

  static getDailyNote(date: string): DailyNote | undefined {
    const notes = this.getDailyNotes();
    return notes.find(note => note.date === date);
  }

  static saveDailyNote(noteData: InsertDailyNote): DailyNote {
    const notes = this.getDailyNotes();
    const existingIndex = notes.findIndex(note => note.date === noteData.date);
    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      // Update existing note
      const updatedNote: DailyNote = {
        ...notes[existingIndex],
        note: noteData.note,
        updatedAt: now,
      };
      notes[existingIndex] = updatedNote;
      this.saveDailyNotes(notes);
      return updatedNote;
    } else {
      // Create new note
      const newNote: DailyNote = {
        id: Date.now(),
        date: noteData.date,
        note: noteData.note,
        createdAt: now,
        updatedAt: now,
      };
      notes.push(newNote);
      this.saveDailyNotes(notes);
      return newNote;
    }
  }

  static deleteDailyNote(date: string): void {
    const notes = this.getDailyNotes();
    const filtered = notes.filter(note => note.date !== date);
    this.saveDailyNotes(filtered);
  }

  // Habit Completion methods
  static getHabitCompletions(): HabitCompletion[] {
    const stored = localStorage.getItem(this.HABIT_COMPLETIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveHabitCompletions(completions: HabitCompletion[]): void {
    localStorage.setItem(this.HABIT_COMPLETIONS_KEY, JSON.stringify(completions));
  }

  static getHabitCompletionForDate(habitId: number, date: string): HabitCompletion | undefined {
    const completions = this.getHabitCompletions();
    return completions.find(c => c.habitId === habitId && c.date === date);
  }

  static recordHabitCompletion(completionData: InsertHabitCompletion): HabitCompletion {
    const completions = this.getHabitCompletions();
    const existing = completions.find(c => 
      c.habitId === completionData.habitId && c.date === completionData.date
    );

    if (existing) {
      // Update existing completion
      existing.completed = completionData.completed;
      existing.completedAt = new Date().toISOString();
      this.saveHabitCompletions(completions);
      return existing;
    } else {
      // Create new completion record
      const newCompletion: HabitCompletion = {
        id: Date.now(),
        completedAt: new Date().toISOString(),
        ...completionData,
      };
      completions.push(newCompletion);
      this.saveHabitCompletions(completions);
      return newCompletion;
    }
  }

  static getCompletionStatsForDate(date: string): { completed: number; total: number } {
    const habits = this.getHabits();
    const completions = this.getHabitCompletions();
    
    const completedCount = completions.filter(c => 
      c.date === date && c.completed
    ).length;
    
    return {
      completed: completedCount,
      total: habits.length
    };
  }

  static getCompletionRateForDateRange(startDate: Date, endDate: Date): Array<{
    date: string;
    completed: number;
    total: number;
    rate: number;
  }> {
    const results = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toDateString();
      const stats = this.getCompletionStatsForDate(dateStr);
      
      results.push({
        date: dateStr,
        completed: stats.completed,
        total: stats.total,
        rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return results;
  }

  // Initialize with test data for demonstration
  static initializeTestData(): void {
    const existingNotes = this.getDailyNotes();
    
    // Only add test reflection data if none exists
    if (existingNotes.length === 0) {
      const today = new Date();
      const testNotes: DailyNote[] = [];
      
      // Add notes for the past few days
      for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        testNotes.push({
          id: Date.now() + i,
          date: dateStr,
          note: `Day ${i} reflection: Had a productive day working on my habits. ${i === 1 ? 'Felt really motivated today!' : i === 2 ? 'Struggled a bit but pushed through.' : i === 3 ? 'Amazing progress on my goals.' : i === 4 ? 'Learned something new about consistency.' : 'Feeling grateful for the journey.'}`,
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        });
      }
      
      this.saveDailyNotes(testNotes);
    }
  }

  // Initialize test completion data only when habits exist
  static initializeTestCompletions(): void {
    const existingCompletions = this.getHabitCompletions();
    const habits = this.getHabits();
    
    // Add some test completion data if none exists and we have habits
    if (existingCompletions.length === 0 && habits.length > 0) {
      const testCompletions: HabitCompletion[] = [];
      const today = new Date();
      
      for (let i = 0; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        habits.forEach((habit, habitIndex) => {
          // Create some random completion pattern
          const shouldComplete = Math.random() > 0.3; // 70% chance of completion
          
          if (shouldComplete) {
            testCompletions.push({
              id: Date.now() + i * 1000 + habitIndex,
              habitId: habit.id,
              date: dateStr,
              completed: true,
              completedAt: date.toISOString(),
            });
          }
        });
      }
      
      this.saveHabitCompletions(testCompletions);
    }
  }
}
