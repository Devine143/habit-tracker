import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Calendar } from 'lucide-react';

interface AddHabitFormProps {
  onAddHabit: (name: string) => void;
}



export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim());
      setHabitName('');
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold">Add New Habit</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col min-h-0 space-y-4">
        {/* Add Habit Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Enter your new habit..."
            className="flex-1 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </form>

        {/* Tips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-medium text-gray-700">Pro Tips</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              Start small
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Be specific
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Set reminders
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
