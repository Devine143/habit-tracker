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

        {/* Main Content - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Habits List */}
          <div className="space-y-3">
            {habits.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No habits yet</h3>
                <p className="text-gray-500 text-sm">
                  Your habits will appear here once you add them!
                </p>
              </div>
            ) : (
              habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={handleHabitToggle}
                  onDelete={handleDeleteHabit}
                />
              ))
            )}
          </div>

          {/* Middle Column - Calendar and Stats */}
          <div className="space-y-6">
            <HabitCalendar 
              onDateSelect={handleDateSelect} 
              refreshTrigger={calendarRefresh}
            />
            
            {habits.length > 0 ? (
              <StatsSection
                completed={stats.completed}
                total={stats.total}
                rate={stats.rate}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-gray-500 text-sm">
                  Stats will appear here when you have habits to track
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Progress Chart and Daily Reflection */}
          <div className="space-y-6">
            <ProgressChart refreshTrigger={calendarRefresh} />
            
            <DailyReflection 
              date={selectedDate || undefined} 
              onReflectionChange={handleReflectionChange}
            />
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
