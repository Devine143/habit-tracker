import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Habit } from '@shared/schema';
import { StreakBadge } from './streak-badge';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: number) => void;
  onDelete: (habitId: number) => void;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-3 transition-all duration-200 hover:shadow-md ${
      habit.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Checkbox
            checked={habit.completed}
            onCheckedChange={() => onToggle(habit.id)}
            className="w-5 h-5 rounded-full border-2 border-gray-300 text-success focus:ring-primary focus:ring-2 transition-all duration-200"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium text-sm ${habit.completed ? 'text-green-800' : 'text-gray-800'} truncate`}>
              {habit.name}
            </h3>
            <StreakBadge streak={habit.streak} />
          </div>
          {habit.streak === 0 && (
            <span className="text-xs text-gray-500">Start today!</span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(habit.id)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 h-6 w-6"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
