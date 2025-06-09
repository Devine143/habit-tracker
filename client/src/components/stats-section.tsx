import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Target, TrendingUp, Award } from 'lucide-react';
import { HabitStorage } from '@/lib/habit-storage';
import { useMemo } from 'react';

interface StatsSectionProps {
  completed: number;
  total: number;
  rate: number;
}

export function StatsSection({ completed, total, rate }: StatsSectionProps) {
  const weeklyStats = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // Last 7 days
    
    const weeklyData = HabitStorage.getCompletionRateForDateRange(startDate, endDate);
    const totalDays = weeklyData.length;
    const completedDays = weeklyData.filter(d => d.rate === 100).length;
    const weeklyAverage = totalDays > 0 ? Math.round(weeklyData.reduce((sum, d) => sum + d.rate, 0) / totalDays) : 0;
    
    return {
      perfectDays: completedDays,
      totalDays,
      weeklyAverage
    };
  }, [completed, total, rate]);

  const getRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return 'from-green-500 to-emerald-500';
    if (rate >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold">Progress Stats</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Today's Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today</span>
              <span className={`text-sm font-medium ${getRateColor(rate)}`}>{rate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${getProgressColor(rate)} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-3 h-3 text-green-600" />
              </div>
              <div className="text-lg font-bold text-green-600">{completed}</div>
              <div className="text-xs text-gray-500">Done</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-blue-600">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-3 h-3 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-purple-600">{weeklyStats.perfectDays}</div>
              <div className="text-xs text-gray-500">Perfect Days</div>
            </div>
          </div>

          {/* Weekly Average */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">7-day average</span>
              <span className={`text-xs font-medium ${getRateColor(weeklyStats.weeklyAverage)}`}>
                {weeklyStats.weeklyAverage}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
