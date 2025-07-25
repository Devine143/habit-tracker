import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Save, Edit3, Calendar } from 'lucide-react';
import { useDatabaseNotes } from '@/hooks/use-database-notes';
import { useToast } from '@/hooks/use-toast';

interface DailyReflectionProps {
  date?: string;
  className?: string;
  onReflectionChange?: () => void;
}

export function DailyReflection({ date, className = '', onReflectionChange }: DailyReflectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { notes, saveNote, isLoading } = useDatabaseNotes();
  const { toast } = useToast();
  
  const targetDate = date || new Date().toISOString().split('T')[0]; // Use YYYY-MM-DD format
  const isToday = targetDate === new Date().toISOString().split('T')[0];

  useEffect(() => {
    const existingNote = notes.find(note => note.date === targetDate);
    const newNoteText = existingNote ? existingNote.note : '';
    setNoteText(newNoteText);
    setIsEditing(false);
  }, [targetDate, notes]);

  const handleSave = useCallback(async () => {
    if (noteText.trim() === '') {
      toast({
        title: "Empty note",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveNote({
        date: targetDate,
        note: noteText.trim(),
      });
      
      setIsEditing(false);
      onReflectionChange?.(); // Notify parent that reflection changed
      toast({
        title: "Reflection saved",
        description: "Your daily reflection has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [noteText, targetDate, saveNote, onReflectionChange, toast]);

  const handleCancel = useCallback(() => {
    const existingNote = notes.find(note => note.date === targetDate);
    setNoteText(existingNote?.note || '');
    setIsEditing(false);
  }, [notes, targetDate]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const hasNote = noteText.trim() !== '';

  return (
    <Card className={`w-full flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold">Daily Reflection</span>
          </div>
          {isToday && (
            <Badge variant="secondary" className="text-xs">
              Today
            </Badge>
          )}
        </CardTitle>
        {!isToday && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {formatDate(targetDate)}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
        {!isEditing && !hasNote && (
          <div className="text-center py-6 flex-1 flex flex-col justify-center">
            <div className="text-4xl mb-3">💭</div>
            <p className="text-gray-500 text-sm mb-4">
              {isToday ? "How did your day go?" : "No reflection for this day"}
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {isToday ? "Add reflection" : "Add note"}
            </Button>
          </div>
        )}

        {!isEditing && hasNote && (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0 mb-4">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {noteText}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit reflection
              </Button>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {isToday ? "How was your day? What did you learn?" : "Add your thoughts about this day"}
                </label>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={
                    isToday 
                      ? "Share your thoughts, challenges, wins, or anything that stood out today..."
                      : "Add your reflection or notes for this day..."
                  }
                  className="min-h-[100px] max-h-[200px] resize-none"
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 text-right">
                  {noteText.length}/1000 characters
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={handleSave}
                disabled={isSaving || noteText.trim() === ''}
                size="sm"
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save reflection"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}