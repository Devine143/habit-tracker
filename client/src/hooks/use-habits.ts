import { useState, useEffect } from 'react';
import { Habit, InsertHabit } from '@shared/schema';
import { HabitStorage } from '@/lib/habit-storage';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // Check for new day and load habits
    const loadedHabits = HabitStorage.checkAndResetForNewDay();
    setHabits(loadedHabits);
    
    // Initialize test data for demonstration
    HabitStorage.initializeTestData();
  }, []);

  const addHabit = (habitData: InsertHabit) => {
    const newHabit = HabitStorage.addHabit(habitData);
    setHabits(prev => [...prev, newHabit]);
    
    // Initialize test completion data when first habit is added
    HabitStorage.initializeTestCompletions();
  };

  const toggleHabit = (habitId: number) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toDateString();
    const updates: Partial<Habit> = {
      completed: !habit.completed,
    };

    // Record the completion in our historical tracking
    HabitStorage.recordHabitCompletion({
      habitId,
      date: today,
      completed: !habit.completed
    });

    if (!habit.completed) {
      // Completing the habit
      updates.streak = habit.streak + 1;
      updates.lastCompleted = today;
    } else {
      // Uncompleting the habit
      updates.streak = Math.max(0, habit.streak - 1);
      updates.lastCompleted = null;
    }

    HabitStorage.updateHabit(habitId, updates);
    setHabits(prev => prev.map(h => 
      h.id === habitId ? { ...h, ...updates } : h
    ));
  };

  const deleteHabit = (habitId: number) => {
    HabitStorage.deleteHabit(habitId);
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const stats = {
    completed: habits.filter(h => h.completed).length,
    total: habits.length,
    get rate() {
      return this.total > 0 ? Math.round((this.completed / this.total) * 100) : 0;
    }
  };

  return {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    stats,
  };
}
