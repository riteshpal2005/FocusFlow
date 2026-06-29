import { useState, useEffect, useCallback } from 'react';
import { getHabits, saveHabits, Habit, RecurrenceFrequency } from '../../../shared/utils/storageHelpers';
import { useAuth } from '../../../core/auth/useAuthStore';
import { SyncService } from '../../../core/services/syncService';

export const useHabitStorage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    const savedHabits = await getHabits();
    setHabits(savedHabits.filter((h) => h.sync_status !== 'deleted'));
    setIsLoading(false);

    if (user) {
      await SyncService.syncAll(user.id, (updatedHabits) => {
        setHabits(updatedHabits.filter((h) => h.sync_status !== 'deleted'));
      });
    }
  }, [user]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const addHabit = async (
    name: string,
    frequency: RecurrenceFrequency = 'daily',
    daysOfWeek?: number[],
    daysOfMonth?: number[],
    customInterval?: number
  ) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      streak: 0,
      completedToday: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sync_status: user ? 'pending' : 'synced',
      frequency,
      daysOfWeek,
      daysOfMonth,
      customInterval,
    };

    const currentHabits = await getHabits();
    const updatedHabits = [...currentHabits, newHabit];
    await saveHabits(updatedHabits);
    setHabits(updatedHabits.filter((h) => h.sync_status !== 'deleted'));

    if (user) {
      SyncService.schedulePush(user.id, (updated) => {
        setHabits(updated.filter((h) => h.sync_status !== 'deleted'));
      });
    }
  };

  const toggleHabit = async (id: string) => {
    const currentHabits = await getHabits();
    const updatedHabits = currentHabits.map((habit) => {
      if (habit.id === id) {
        return {
          ...habit,
          completedToday: !habit.completedToday,
          updatedAt: Date.now(),
          sync_status: user ? ('pending' as const) : ('synced' as const),
        };
      }
      return habit;
    });

    await saveHabits(updatedHabits);
    setHabits(updatedHabits.filter((h) => h.sync_status !== 'deleted'));

    if (user) {
      SyncService.schedulePush(user.id, (updated) => {
        setHabits(updated.filter((h) => h.sync_status !== 'deleted'));
      });
    }
  };

  const deleteHabit = async (id: string) => {
    const currentHabits = await getHabits();
    let updatedHabits: Habit[] = [];

    if (user) {
      updatedHabits = currentHabits.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            sync_status: 'deleted' as const,
            updatedAt: Date.now(),
          };
        }
        return habit;
      });
    } else {
      updatedHabits = currentHabits.filter((habit) => habit.id !== id);
    }

    await saveHabits(updatedHabits);
    setHabits(updatedHabits.filter((h) => h.sync_status !== 'deleted'));

    if (user) {
      SyncService.schedulePush(user.id, (updated) => {
        setHabits(updated.filter((h) => h.sync_status !== 'deleted'));
      });
    }
  };

  const refreshHabits = async () => {
    const savedHabits = await getHabits();
    setHabits(savedHabits.filter((h) => h.sync_status !== 'deleted'));
  };

  return {
    habits,
    isLoading,
    addHabit,
    toggleHabit,
    deleteHabit,
    refreshHabits,
  };
};
