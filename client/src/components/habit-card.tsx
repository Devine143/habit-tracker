import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Habit } from '@shared/schema';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: number) => void;
  onDelete: (habitId: number) => void;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 transition-all duration-200 hover:shadow-md ${
      habit.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Checkbox
            checked={habit.completed}
            onCheckedChange={() => onToggle(habit.id)}
            className="w-6 h-6 rounded-full border-2 border-gray-300 text-success focus:ring-primary focus:ring-2 transition-all duration-200"
          />
        </div>
        
        <div className="flex-1">
          <h3 className={`font-medium ${habit.completed ? 'text-green-800' : 'text-gray-800'}`}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm ${habit.completed ? 'text-green-600' : 'text-gray-500'}`}>
              Streak:
            </span>
            {habit.streak > 0 ? (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                {habit.streak} day{habit.streak !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                Start today!
              </span>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(habit.id)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
