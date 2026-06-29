import { Habit } from './storageHelpers';

export const isHabitScheduled = (habit: Habit, date: Date): boolean => {
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();

  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekly':
      if (!habit.daysOfWeek) return true;
      return habit.daysOfWeek.includes(dayOfWeek);
    case 'monthly':
      if (!habit.daysOfMonth) return true;
      return habit.daysOfMonth.includes(dayOfMonth);
    case 'custom':
      if (!habit.customInterval) return true;
      const startOfDay = (d: Date) => {
        const newDate = new Date(d);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
      };
      const createdDate = startOfDay(new Date(habit.createdAt));
      const checkDate = startOfDay(date);
      const diffTime = checkDate.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays % habit.customInterval === 0;
    default:
      return true;
  }
};

export const getLastScheduledDate = (habit: Habit, beforeDate: Date): Date | null => {
  const check = new Date(beforeDate);
  check.setHours(0, 0, 0, 0);

  const createdDate = new Date(habit.createdAt);
  createdDate.setHours(0, 0, 0, 0);

  for (let i = 1; i <= 31; i++) {
    const d = new Date(check);
    d.setDate(check.getDate() - i);

    if (d.getTime() < createdDate.getTime()) {
      break;
    }

    if (isHabitScheduled(habit, d)) {
      return d;
    }
  }
  return null;
};

export const checkAndResetHabits = (habits: Habit[], checkDate: Date): { updated: Habit[]; changed: boolean } => {
  let changed = false;
  const todayStr = checkDate.toISOString().split('T')[0];

  const updated = habits.map((habit) => {
    let completedToday = habit.completedToday;
    let streak = habit.streak;

    if (habit.lastResetDate !== todayStr) {
      if (habit.lastCompletedDate !== todayStr) {
        completedToday = false;
      }

      const lastSched = getLastScheduledDate(habit, checkDate);
      if (lastSched) {
        const lastSchedStr = lastSched.toISOString().split('T')[0];
        if (!habit.lastCompletedDate || lastSchedStr > habit.lastCompletedDate) {
          streak = 0;
        }
      }

      changed = true;
      return {
        ...habit,
        completedToday,
        streak,
        lastResetDate: todayStr,
        updatedAt: Date.now(),
      };
    }

    return habit;
  });

  return { updated, changed };
};
