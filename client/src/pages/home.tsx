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
    <div className="bg-gray-50 min-h-screen safe-area-inset">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-4 md:py-6 shadow-lg safe-area-inset">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
            Habit Tracker
          </h1>
          <p className="text-purple-100 text-center mt-1 text-xs md:text-sm">
            Build better habits, one day at a time
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 md:px-4 pb-6 md:pb-20 safe-area-bottom">
        {/* Add Habit Form */}
        <div className="max-w-md mx-auto">
          <AddHabitForm onAddHabit={handleAddHabit} />
        </div>

        {/* Mobile Layout - Stack vertically on small screens */}
        <div className="lg:hidden space-y-4 mt-4 md:mt-6 md:space-y-6">
          {/* Habits Section */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-3 md:p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-700">Your Habits</h3>
            </div>
            <div className="p-2 md:p-3 max-h-[280px] md:max-h-[300px] overflow-y-auto mobile-scroll">
              {habits.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">🎯</div>
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

          {/* Progress Stats Section */}
          {habits.length > 0 ? (
            <div className="touch-optimized">
              <StatsSection
                completed={stats.completed}
                total={stats.total}
                rate={stats.rate}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6 text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-gray-500 text-sm">
                Stats will appear here when you have habits to track
              </p>
            </div>
          )}

          {/* Calendar Section */}
          <div className="min-h-[350px] md:min-h-[400px] touch-optimized">
            <HabitCalendar 
              className="h-full"
              onDateSelect={handleDateSelect} 
              refreshTrigger={calendarRefresh}
            />
          </div>

          {/* Progress Chart Section */}
          <div className="min-h-[280px] md:min-h-[300px] touch-optimized">
            <ProgressChart 
              className="h-full"
              refreshTrigger={calendarRefresh} 
            />
          </div>
          
          {/* Daily Reflection Section */}
          <div className="min-h-[280px] md:min-h-[300px] touch-optimized">
            <DailyReflection 
              className="h-full"
              date={selectedDate || undefined} 
              onReflectionChange={handleReflectionChange}
            />
          </div>
        </div>

        {/* Desktop Layout - Three Column Layout for large screens */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mt-6 h-[600px] overflow-hidden">
          {/* Left Column - Habits (top half) and Progress Stats (bottom half) */}
          <div className="flex flex-col h-full">
            {/* Habits Section - Top Half */}
            <div className="h-[287px] mb-6">
              <div className="bg-white rounded-lg border h-full flex flex-col">
                <div className="p-4 border-b flex-shrink-0">
                  <h3 className="text-sm font-semibold text-gray-700">Your Habits</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 min-h-0">
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
            <div className="h-[287px]">
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
          <div className="flex flex-col h-full">
            {/* Progress Chart - Top Half */}
            <div className="h-[287px] mb-6">
              <ProgressChart 
                className="h-full"
                refreshTrigger={calendarRefresh} 
              />
            </div>
            
            {/* Daily Reflection - Bottom Half */}
            <div className="h-[287px]">
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
