import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Habit, InsertHabit, HabitCompletion, InsertHabitCompletion } from "@shared/schema";

export function useDatabaseHabits() {
  const queryClient = useQueryClient();

  // Fetch habits
  const { data: habits = [], isLoading, refetch } = useQuery<Habit[]>({
    queryKey: ['/api/habits'],
  });

  // Fetch habit completions
  const { data: completions = [] } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/habit-completions'],
  });

  // Create habit mutation
  const addHabitMutation = useMutation({
    mutationFn: async (habitData: Omit<InsertHabit, 'userId'>) => {
      const response = await fetch('/api/habits', {
        method: 'POST',
        body: JSON.stringify(habitData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to create habit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
    },
  });

  // Update habit mutation
  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Habit> }) => {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to update habit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
    },
  });

  // Delete habit mutation
  const deleteHabitMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete habit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
    },
  });

  // Record habit completion mutation
  const toggleHabitMutation = useMutation({
    mutationFn: async (completionData: Omit<InsertHabitCompletion, 'userId'>) => {
      const response = await fetch('/api/habit-completions', {
        method: 'POST',
        body: JSON.stringify(completionData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to record completion');
      return response.json();
    },
    onSuccess: () => {
      // Force refresh of both queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['/api/habit-completions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.refetchQueries({ queryKey: ['/api/habit-completions'] });
    },
  });

  // Helper functions
  const addHabit = (habitData: Omit<InsertHabit, 'userId'>) => {
    addHabitMutation.mutate(habitData);
  };

  const toggleHabit = (habitId: number, completed: boolean, date: string) => {
    toggleHabitMutation.mutate({
      habitId,
      date,
      completed,
    });
  };

  const deleteHabit = (habitId: number) => {
    deleteHabitMutation.mutate(habitId);
  };

  // Calculate completion stats
  const getCompletionStatsForDate = (date: string) => {
    const dayCompletions = completions.filter(c => c.date === date && c.completed);
    return {
      completed: dayCompletions.length,
      total: habits.length,
    };
  };

  // Calculate completion rate
  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = completions.filter(c => c.date === today && c.completed);
    return Math.round((todayCompletions.length / habits.length) * 100);
  };

  return {
    habits,
    completions,
    isLoading,
    addHabit,
    toggleHabit,
    deleteHabit,
    refetch,
    getCompletionStatsForDate,
    get rate() {
      return getCompletionRate();
    },
  };
}