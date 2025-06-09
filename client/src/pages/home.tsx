import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useHabits } from '@/hooks/use-habits';
import { AddHabitForm } from '@/components/add-habit-form';
import { HabitCard } from '@/components/habit-card';
import { StatsSection } from '@/components/stats-section';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { DailyReflection } from '@/components/daily-reflection';
import { HabitCalendar } from '@/components/habit-calendar';

export default function Home() {
  const { habits, addHabit, toggleHabit, deleteHabit, stats } = useHabits();
  const [habitToDelete, setHabitToDelete] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

        {/* Empty State */}
        {habits.length === 0 && (
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No habits yet</h3>
            <p className="text-gray-500 text-sm">
              Add your first habit above to get started on your journey!
            </p>
          </div>
        )}

        {/* Daily Reflection - Show when no habits */}
        {habits.length === 0 && (
          <div className="mt-6 max-w-2xl mx-auto">
            <DailyReflection />
          </div>
        )}

        {/* Main Content - 2x2 Grid */}
        {habits.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Top Left - Habits List */}
            <div className="space-y-3">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>

            {/* Top Right - Calendar */}
            <div>
              <HabitCalendar />
            </div>

            {/* Bottom Left - Stats Section */}
            <div>
              <StatsSection
                completed={stats.completed}
                total={stats.total}
                rate={stats.rate}
              />
            </div>

            {/* Bottom Right - Daily Reflection */}
            <div>
              <DailyReflection />
            </div>
          </div>
        )}
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
