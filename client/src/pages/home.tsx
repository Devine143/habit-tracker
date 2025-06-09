import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useHabits } from '@/hooks/use-habits';
import { AddHabitForm } from '@/components/add-habit-form';
import { HabitCard } from '@/components/habit-card';
import { StatsSection } from '@/components/stats-section';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { DailyReflection } from '@/components/daily-reflection';
import { HabitCalendar } from '@/components/habit-calendar';
import { ProgressChart } from '@/components/progress-chart';

export default function Home() {
  const { habits, addHabit, toggleHabit, deleteHabit, stats } = useHabits();
  const [habitToDelete, setHabitToDelete] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarRefresh, setCalendarRefresh] = useState(0);

  const handleAddHabit = (name: string) => {
    const today = new Date().toDateString();
    addHabit({ name, createdDate: today });
  };

  const handleDeleteHabit = (habitId: number) => {
    setHabitToDelete(habitId);
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete);
      setHabitToDelete(null);
    }
  };

  const cancelDelete = () => {
    setHabitToDelete(null);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleReflectionChange = () => {
    setCalendarRefresh(prev => prev + 1);
  };

  const handleHabitToggle = (habitId: number) => {
    toggleHabit(habitId);
    // Update calendar when habit is toggled to keep percentages in sync
    setCalendarRefresh(prev => prev + 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-6 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Habit Tracker
          </h1>
          <p className="text-purple-100 text-center mt-1 text-sm">
            Build better habits, one day at a time
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-20">
        {/* Add Habit Form */}
        <div className="max-w-md mx-auto">
          <AddHabitForm onAddHabit={handleAddHabit} />
        </div>

        {/* Main Content - Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 h-[600px]">
          {/* Left Column - Habits (top half) and Progress Stats (bottom half) */}
          <div className="flex flex-col h-full gap-6">
            {/* Habits Section - Top Half */}
            <div className="flex-1 min-h-0">
              <div className="bg-white rounded-lg border h-full flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="text-sm font-semibold text-gray-700">Your Habits</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  {habits.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🎯</div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No habits yet</h3>
                      <p className="text-gray-500 text-sm">
                        Your habits will appear here once you add them!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {habits.map(habit => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onToggle={handleHabitToggle}
                          onDelete={handleDeleteHabit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Stats Section - Bottom Half */}
            <div className="flex-1 min-h-0">
              {habits.length > 0 ? (
                <StatsSection
                  completed={stats.completed}
                  total={stats.total}
                  rate={stats.rate}
                />
              ) : (
                <div className="bg-white rounded-lg border p-8 text-center h-full flex flex-col justify-center">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-gray-500 text-sm">
                    Stats will appear here when you have habits to track
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Calendar (Full Height) */}
          <div className="h-full">
            <HabitCalendar 
              className="h-full"
              onDateSelect={handleDateSelect} 
              refreshTrigger={calendarRefresh}
            />
          </div>

          {/* Right Column - Progress Chart (top half) and Daily Reflection (bottom half) */}
          <div className="flex flex-col h-full gap-6">
            {/* Progress Chart - Top Half */}
            <div className="flex-1 min-h-0">
              <ProgressChart 
                className="h-full"
                refreshTrigger={calendarRefresh} 
              />
            </div>
            
            {/* Daily Reflection - Bottom Half */}
            <div className="flex-1 min-h-0">
              <DailyReflection 
                className="h-full"
                date={selectedDate || undefined} 
                onReflectionChange={handleReflectionChange}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={habitToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
