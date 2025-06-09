import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { HabitStorage } from '@/lib/habit-storage';
import { useMemo } from 'react';

interface ProgressChartProps {
  className?: string;
  refreshTrigger?: number;
}

export function ProgressChart({ className = '', refreshTrigger = 0 }: ProgressChartProps) {
  const chartData = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 13); // Last 14 days
    
    const data = HabitStorage.getCompletionRateForDateRange(startDate, endDate);
    
    return data.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      rate: d.rate,
      completed: d.completed,
      total: d.total
    }));
  }, [refreshTrigger]);

  const averageRate = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, day) => acc + day.rate, 0);
    return Math.round(sum / chartData.length);
  }, [chartData]);

  return (
    <Card className={`w-full flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold">14-Day Progress</span>
          </div>
          <div className="text-sm text-gray-500">
            Avg: {averageRate}%
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
        {chartData.length > 0 ? (
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                          <p className="text-xs font-medium">{label}</p>
                          <p className="text-xs text-blue-600">
                            {data.completed}/{data.total} habits ({data.rate}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm">
                Your progress chart will appear here as you track habits
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}