import React, { memo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../../../shared/utils/storageHelpers';
import { useTheme } from '../../../core/theme/useThemeStore';
import Animated, { FadeInRight, FadeOutLeft, LinearTransition, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { Card } from '../../../shared/components/ui/Card';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = memo(({ habit, onToggle, onPress }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const [displayedStreak, setDisplayedStreak] = useState('');

  useEffect(() => {
    if (habit.completedToday) {
      scale.value = withSequence(withSpring(1.2), withSpring(1));
    } else {
      scale.value = withSequence(withSpring(0.8), withSpring(1));
    }
  }, [habit.completedToday, scale]);

  const targetText = habit.streak > 0 ? `${habit.streak} Day Streak • ` : '';

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedStreak((prev) => {
        if (prev === targetText) {
          return prev;
        }
        if (targetText.startsWith(prev) && prev.length < targetText.length) {
          return targetText.substring(0, prev.length + 1);
        } else {
          return prev.substring(0, prev.length - 1);
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [targetText]);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const recurrenceText = React.useMemo(() => {
    switch (habit.frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        if (!habit.daysOfWeek || habit.daysOfWeek.length === 0) return 'Weekly';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return habit.daysOfWeek.map((d) => dayNames[d]).join(', ');
      case 'monthly':
        if (!habit.daysOfMonth || habit.daysOfMonth.length === 0) return 'Monthly';
        return `Monthly: ${habit.daysOfMonth.join(', ')}`;
      case 'custom':
        return `Every ${habit.customInterval || 1} days`;
      default:
        return 'Daily';
    }
  }, [habit]);

  return (
    <Animated.View
      entering={FadeInRight.springify().damping(15).stiffness(100)}
      exiting={FadeOutLeft}
      layout={LinearTransition.springify()}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(habit.id)}
      >
        <Card padding="md" className="flex-row items-center my-1.5 shadow-sm shadow-black/5 elevation-2">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-text mb-1">
              {habit.name}
            </Text>
            <Text className="text-xs font-semibold text-primary">
              {displayedStreak}
              <Text className="text-text font-medium" style={{ opacity: 0.5 }}>
                {recurrenceText}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.4}
            className="pl-3"
            onPress={() => onToggle(habit.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.View style={checkmarkStyle}>
              {habit.completedToday ? (
                <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
              ) : (
                <Ionicons name="ellipse-outline" size={28} color="gray" />
              )}
            </Animated.View>
          </TouchableOpacity>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
});
