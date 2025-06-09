import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className = '' }: StreakBadgeProps) {
  if (streak === 0) return null;

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (streak >= 14) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (streak >= 7) return 'bg-green-100 text-green-800 border-green-200';
    if (streak >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStreakColor(streak)} flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 h-4 ${className}`}
    >
      <Flame className="w-2.5 h-2.5" />
      {streak}
    </Badge>
  );
}