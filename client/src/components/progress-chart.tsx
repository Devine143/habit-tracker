import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { HabitStorage } from '@/lib/habit-storage';
import { useMemo, useState } from 'react';

interface ProgressChartProps {
  className?: string;
  refreshTrigger?: number;
}

type ViewPeriod = 3 | 7 | 14;

export function ProgressChart({ className = '', refreshTrigger = 0 }: ProgressChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ViewPeriod>(7);

  const chartData = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (selectedPeriod - 1)); // Last N days
    
    const data = HabitStorage.getCompletionRateForDateRange(startDate, endDate);
    
    return data.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { 
        month: selectedPeriod <= 7 ? 'short' : 'numeric',
        day: 'numeric' 
      }),
      rate: d.rate,
      completed: d.completed,
      total: d.total
    }));
  }, [refreshTrigger, selectedPeriod]);

  const averageRate = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, day) => acc + day.rate, 0);
    return Math.round(sum / chartData.length);
  }, [chartData]);

  const hasValidData = chartData.some(d => d.total > 0);

  return (
    <Card className={`w-full flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold">{selectedPeriod}-Day Progress</span>
          </div>
          <div className="text-sm text-gray-500">
            Avg: {averageRate}%
          </div>
        </CardTitle>
        
        {/* Period Selection Buttons */}
        <div className="flex gap-1 mt-2">
          {([3, 7, 14] as ViewPeriod[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="text-xs px-2 py-1 h-6"
            >
              {period}d
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
        {hasValidData ? (
          <div className="w-full h-full min-h-[200px] lg:min-h-0 lg:flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  interval={selectedPeriod === 3 ? 0 : selectedPeriod === 7 ? 0 : "preserveStartEnd"}
                  height={30}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  domain={[0, 100]}
                  width={40}
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
          <div className="min-h-[200px] flex items-center justify-center text-gray-500">
            <div className="text-center px-4">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm">
                Your progress chart will appear here as you track habits
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Add habits and mark them complete to see your progress
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}