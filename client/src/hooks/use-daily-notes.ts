import { useState, useEffect, useCallback } from 'react';
import { DailyNote, InsertDailyNote } from '@shared/schema';
import { HabitStorage } from '@/lib/habit-storage';

export function useDailyNotes() {
  const [notes, setNotes] = useState<DailyNote[]>([]);

  const loadNotes = useCallback(() => {
    const loadedNotes = HabitStorage.getDailyNotes();
    setNotes(loadedNotes);
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const getTodaysNote = useCallback((): DailyNote | undefined => {
    const today = new Date().toDateString();
    return HabitStorage.getDailyNote(today);
  }, []);

  const saveNote = useCallback((noteData: InsertDailyNote): DailyNote => {
    const savedNote = HabitStorage.saveDailyNote(noteData);
    loadNotes(); // Refresh the notes list
    return savedNote;
  }, [loadNotes]);

  const deleteNote = useCallback((date: string): void => {
    HabitStorage.deleteDailyNote(date);
    loadNotes(); // Refresh the notes list
  }, [loadNotes]);

  const getNoteForDate = useCallback((date: string): DailyNote | undefined => {
    return HabitStorage.getDailyNote(date);
  }, []);

  return {
    notes,
    getTodaysNote,
    saveNote,
    deleteNote,
    getNoteForDate,
    refreshNotes: loadNotes,
  };
}