import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { DailyNote, InsertDailyNote } from "@shared/schema";

export function useDatabaseNotes() {
  const queryClient = useQueryClient();

  // Fetch daily notes
  const { data: notes = [], isLoading, refetch } = useQuery<DailyNote[]>({
    queryKey: ['/api/daily-notes'],
  });

  // Save daily note mutation
  const saveNoteMutation = useMutation({
    mutationFn: async (noteData: Omit<InsertDailyNote, 'userId'>) => {
      const response = await fetch('/api/daily-notes', {
        method: 'POST',
        body: JSON.stringify(noteData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to save note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-notes'] });
    },
  });

  // Helper functions
  const saveNote = (noteData: Omit<InsertDailyNote, 'userId'>) => {
    saveNoteMutation.mutate(noteData);
    return noteData as DailyNote; // Return immediately for optimistic updates
  };

  const getDailyNote = (date: string) => {
    return notes.find(note => note.date === date);
  };

  return {
    notes,
    isLoading,
    saveNote,
    getDailyNote,
    refetch,
  };
}