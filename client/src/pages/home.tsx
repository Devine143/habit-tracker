import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useHabits } from '@/hooks/use-habits';
import { AddHabitForm } from '@/components/add-habit-form';
import { HabitCard } from '@/components/habit-card';
import { StatsSection } from '@/components/stats-section';
import { ConfirmationModal } from '@/components/confirmation-modal';

export default function Home() {
  const { habits, addHabit, toggleHabit, deleteHabit, stats } = useHabits();
  const [habitToDelete, setHabitToDelete] = useState<number | null>(null);

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

      <main className="max-w-md mx-auto px-4 pb-20">
        {/* Add Habit Form */}
        <AddHabitForm onAddHabit={handleAddHabit} />

        {/* Empty State */}
        {habits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No habits yet</h3>
            <p className="text-gray-500 text-sm">
              Add your first habit above to get started on your journey!
            </p>
          </div>
        )}

        {/* Habits List */}
        {habits.length > 0 && (
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
        )}

        {/* Stats Section */}
        {habits.length > 0 && (
          <StatsSection
            completed={stats.completed}
            total={stats.total}
            rate={stats.rate}
          />
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
