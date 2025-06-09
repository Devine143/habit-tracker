import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { HabitStorage } from '@/lib/habit-storage';

interface HabitCalendarProps {
  className?: string;
  onDateSelect?: (date: string) => void;
}

export function HabitCalendar({ className = '', onDateSelect }: HabitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get completion data for the month
    const monthData = HabitStorage.getCompletionRateForDateRange(firstDay, lastDay);
    
    // Get first day of week (Sunday = 0, Monday = 1, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Create array for calendar grid (6 weeks * 7 days = 42 cells)
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toDateString();
      const dayData = monthData.find(d => d.date === dateStr);
      const hasReflection = HabitStorage.getDailyNote(dateStr) !== undefined;
      
      days.push({
        date,
        day,
        completed: dayData?.completed || 0,
        total: dayData?.total || 0,
        rate: dayData?.rate || 0,
        isToday: dateStr === new Date().toDateString(),
        isFuture: date > new Date(),
        hasReflection
      });
    }
    
    return days;
  }, [currentMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getCompletionColor = (rate: number, isFuture: boolean) => {
    if (isFuture) return 'bg-gray-100';
    if (rate === 0) return 'bg-red-100 text-red-700';
    if (rate < 50) return 'bg-orange-100 text-orange-700';
    if (rate < 80) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold">Calendar</span>
          </div>
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>
          <span className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map(day => (
            <div key={day} className="text-[10px] font-medium text-gray-400 text-center py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {calendarData.map((dayData, index) => (
            <div
              key={index}
              className="aspect-square flex items-center justify-center relative"
            >
              {dayData ? (
                <div
                  className={`
                    w-full h-full rounded flex flex-col items-center justify-center text-xs font-medium cursor-pointer relative
                    ${getCompletionColor(dayData.rate, dayData.isFuture)}
                    ${dayData.isToday ? 'ring-2 ring-purple-600 ring-inset' : ''}
                    transition-colors duration-200 hover:opacity-80
                  `}
                  title={
                    dayData.isFuture 
                      ? `${dayData.day} - Future date`
                      : `${dayData.day} - ${dayData.completed}/${dayData.total} habits (${dayData.rate}%)${dayData.hasReflection ? ' • Has reflection' : ''}`
                  }
                  onClick={() => onDateSelect?.(dayData.date.toDateString())}
                >
                  <span className="text-[11px] font-semibold">{dayData.day}</span>
                  {!dayData.isFuture && dayData.total > 0 && (
                    <span className="text-[9px] leading-none opacity-75">
                      {dayData.rate}%
                    </span>
                  )}
                  {dayData.hasReflection && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-red-100"></div>
            <span className="text-gray-500">0%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-orange-100"></div>
            <span className="text-gray-500">&lt;50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-yellow-100"></div>
            <span className="text-gray-500">&lt;80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-green-100"></div>
            <span className="text-gray-500">80%+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}