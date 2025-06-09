import { Habit, InsertHabit } from "@shared/schema";

export class HabitStorage {
  private static HABITS_KEY = 'habits';
  private static CURRENT_DATE_KEY = 'currentDate';

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
}
