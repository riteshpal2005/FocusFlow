import React, { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../core/theme/useThemeStore';
import { useHabitStorage } from './hooks/useHabitStorage';
import { HabitInputSection } from './HabitInputSection';
import { HabitListSection } from './HabitListSection';
import { FAB } from '../../shared/components/ui/FAB';
import { RecurrenceFrequency } from '../../shared/utils/storageHelpers';

const HomeFeature = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { habits, isLoading, addHabit, toggleHabit, refreshHabits } = useHabitStorage();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshHabits();
    }, [refreshHabits])
  );

  const handleAddHabit = useCallback((
    name: string,
    frequency: RecurrenceFrequency,
    daysOfWeek?: number[],
    daysOfMonth?: number[],
    customInterval?: number
  ) => {
    addHabit(name, frequency, daysOfWeek, daysOfMonth, customInterval);
    setIsModalVisible(false);
  }, [addHabit]);

  const handleNavigateToDetail = useCallback(
    (id: string) => {
      router.push(`/habit-detail/${id}`);
    },
    [router]
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(250)} className="flex-1 px-4 pt-[72px] bg-background">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-[28px] font-bold text-text">My Habits</Text>
      </View>

      <HabitListSection habits={habits} onToggle={toggleHabit} onPress={handleNavigateToDetail} />

      <FAB
        icon={<Ionicons name="add" size={30} color="#FFFFFF" />}
        onPress={() => setIsModalVisible(true)}
        className="w-14 h-14"
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setIsModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full"
          >
            <Pressable className="rounded-t-[20px] px-5 pt-6 pb-10 bg-surface shadow-2xl shadow-black/10 elevation-10" onPress={(e) => e.stopPropagation()}>
              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-xl font-bold text-text">Add New Habit</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <HabitInputSection onSubmit={handleAddHabit} />
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </Animated.View>
  );
};

export { HomeFeature };
