import { BarChart3 } from 'lucide-react';

interface StatsSectionProps {
  completed: number;
  total: number;
  rate: number;
}

export function StatsSection({ completed, total, rate }: StatsSectionProps) {
  return (
    <div className="mt-8 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Today's Progress
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{completed}</div>
          <div className="text-purple-100 text-sm">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-purple-100 text-sm">Total Habits</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Completion Rate</span>
          <span>{rate}%</span>
        </div>
        <div className="w-full bg-purple-700 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300" 
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
