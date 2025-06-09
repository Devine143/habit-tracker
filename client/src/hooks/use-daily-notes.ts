import { useState, useEffect } from 'react';
import { DailyNote, InsertDailyNote } from '@shared/schema';
import { HabitStorage } from '@/lib/habit-storage';

export function useDailyNotes() {
  const [notes, setNotes] = useState<DailyNote[]>([]);

  const loadNotes = () => {
    const loadedNotes = HabitStorage.getDailyNotes();
    setNotes(loadedNotes);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const getTodaysNote = (): DailyNote | undefined => {
    const today = new Date().toDateString();
    return HabitStorage.getDailyNote(today);
  };

  const saveNote = (noteData: InsertDailyNote): DailyNote => {
    const savedNote = HabitStorage.saveDailyNote(noteData);
    loadNotes(); // Refresh the notes list
    return savedNote;
  };

  const deleteNote = (date: string): void => {
    HabitStorage.deleteDailyNote(date);
    loadNotes(); // Refresh the notes list
  };

  const getNoteForDate = (date: string): DailyNote | undefined => {
    return HabitStorage.getDailyNote(date);
  };

  return {
    notes,
    getTodaysNote,
    saveNote,
    deleteNote,
    getNoteForDate,
    refreshNotes: loadNotes,
  };
}