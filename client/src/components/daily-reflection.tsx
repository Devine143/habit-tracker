import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Save, Edit3, Calendar } from 'lucide-react';
import { useDailyNotes } from '@/hooks/use-daily-notes';
import { useToast } from '@/hooks/use-toast';

interface DailyReflectionProps {
  date?: string;
  className?: string;
}

export function DailyReflection({ date, className = '' }: DailyReflectionProps) {
  const targetDate = date || new Date().toDateString();
  const isToday = targetDate === new Date().toDateString();
  const { getNoteForDate, saveNote } = useDailyNotes();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const existingNote = getNoteForDate(targetDate);
    if (existingNote) {
      setNoteText(existingNote.note);
      setIsEditing(false);
    } else {
      setNoteText('');
      setIsEditing(false);
    }
  }, [targetDate, getNoteForDate]);

  const handleSave = async () => {
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
  };

  const handleCancel = () => {
    const existingNote = getNoteForDate(targetDate);
    setNoteText(existingNote?.note || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasNote = noteText.trim() !== '';

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Daily Reflection
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
      
      <CardContent className="pt-0">
        {!isEditing && !hasNote && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">💭</div>
            <p className="text-gray-500 text-sm mb-4">
              {isToday ? "How did your day go?" : "No reflection for this day"}
            </p>
            <Button
              onClick={() => {
                console.log('Setting editing to true');
                setIsEditing(true);
              }}
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
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {noteText}
              </p>
            </div>
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
        )}

        {isEditing && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {isToday ? "How was your day? What did you learn?" : "Add your thoughts about this day"}
              </label>
              <textarea
                value={noteText}
                onChange={(e) => {
                  console.log('Textarea change:', e.target.value);
                  setNoteText(e.target.value);
                }}
                placeholder={
                  isToday 
                    ? "Share your thoughts, challenges, wins, or anything that stood out today..."
                    : "Add your reflection or notes for this day..."
                }
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                maxLength={1000}
                autoFocus
              />
              <div className="text-xs text-gray-500 text-right">
                {noteText.length}/1000 characters
              </div>
            </div>
            
            <div className="flex gap-2">
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