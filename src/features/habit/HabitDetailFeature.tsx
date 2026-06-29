import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../core/theme/useThemeStore';
import { useHabitStorage } from './hooks/useHabitStorage';
import { Card } from '../../shared/components/ui/Card';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { isHabitScheduled } from '../../shared/utils/recurrenceHelpers';

export const HabitDetailFeature = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const { habits, isLoading, toggleHabit, deleteHabit } = useHabitStorage();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const habit = useMemo(
    () => habits.find((item) => item.id === habitId),
    [habits, habitId]
  );

  const isScheduledToday = useMemo(() => {
    if (!habit) return false;
    return isHabitScheduled(habit, new Date());
  }, [habit]);

  const scheduleString = useMemo(() => {
    if (!habit) return '';
    switch (habit.frequency) {
      case 'daily':
        return 'Repeats daily';
      case 'weekly':
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyDays = habit.daysOfWeek?.map(d => dayNames[d]).join(', ') || '';
        return `Repeats weekly on ${weeklyDays}`;
      case 'monthly':
        return `Repeats monthly on day ${habit.daysOfMonth?.join(', ') || ''}`;
      case 'custom':
        return `Repeats every ${habit.customInterval || 1} day${(habit.customInterval || 1) > 1 ? 's' : ''}`;
      default:
        return '';
    }
  }, [habit]);

  const handleDeleteConfirm = () => {
    deleteHabit(habitId);
    setIsDeleteModalVisible(false);
    router.back();
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!habit) {
    return (
      <View className="flex-1 pt-[50px] px-4 bg-background">
        <Text className="text-base mt-4 text-center text-text">Habit not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-5 p-[10px]">
          <Text className="text-base text-text">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-[50px] px-4 bg-background">
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text">Habit Details</Text>
        <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View className="rounded-2xl p-6 mb-6" style={{ backgroundColor: colors.primary }}>
        <Text className="text-white text-xs font-semibold uppercase tracking-wider mb-1" style={{ opacity: 0.7 }}>
          Habit
        </Text>
        <Text className="text-white text-3xl font-extrabold mb-4">{habit.name}</Text>
        <View className="flex-row items-baseline">
          <Text className="text-white text-5xl font-black">{habit.streak}</Text>
          <Text className="text-white text-lg font-medium ml-2" style={{ opacity: 0.8 }}>
            day streak
          </Text>
        </View>
      </View>

      {isScheduledToday ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleHabit(habit.id)}
          className={`flex-row items-center p-4 rounded-xl mb-6 border ${
            habit.completedToday
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-primary/10 border-primary/30'
          }`}
        >
          <View style={{ marginRight: 12 }}>
            <Ionicons
              name={habit.completedToday ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={habit.completedToday ? '#22C55E' : colors.primary}
            />
          </View>
          <View className="flex-1">
            <Text
              className={`font-semibold text-base ${
                habit.completedToday ? 'text-green-600 dark:text-green-400' : 'text-primary'
              }`}
            >
              {habit.completedToday ? 'Completed for Today!' : 'Mark Completed Today'}
            </Text>
            <Text className="text-text text-xs opacity-60 mt-0.5">
              {habit.completedToday ? 'Great job! Tap to undo completion.' : 'Tap to mark this routine as done.'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View className="flex-row items-center p-4 rounded-xl mb-6 border border-zinc-500/20 bg-zinc-500/10">
          <View style={{ marginRight: 12 }}>
            <Ionicons name="calendar-outline" size={24} color="gray" style={{ opacity: 0.7 }} />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-base text-text opacity-70">
              Off-Day Today
            </Text>
            <Text className="text-text text-xs opacity-50 mt-0.5">
              Enjoy your off day! Not scheduled for today.
            </Text>
          </View>
        </View>
      )}

      <Card padding="lg" className="shadow-lg shadow-black/10 elevation-5">
        <Text className="text-base text-text mb-2 opacity-80">Schedule: {scheduleString}</Text>
        <Text className="text-base text-text mb-2 opacity-80">Created: {new Date(habit.createdAt).toLocaleDateString()}</Text>
      </Card>

      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </View>
  );
};
