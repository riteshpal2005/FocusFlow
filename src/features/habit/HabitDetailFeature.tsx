import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../core/theme/useThemeStore';
import { useHabitStorage } from './hooks/useHabitStorage';
import { Card } from '../../shared/components/ui/Card';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { isHabitScheduled } from '../../shared/utils/recurrenceHelpers';
import Animated, { 
  FadeIn, 
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withSequence, 
  interpolateColor,
  Easing
} from 'react-native-reanimated';

interface RollingDigitProps {
  digit: number;
}

const RollingDigit: React.FC<RollingDigitProps> = ({ digit }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(-digit * 48, {
      duration: 350,
      easing: Easing.out(Easing.quad),
    });
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={{ height: 48, overflow: 'hidden', width: 28 }}>
      <Animated.View style={animatedStyle}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={num}
            style={{
              height: 48,
              fontSize: 48,
              lineHeight: 48,
              fontWeight: '900',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {num}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

interface RollingNumberProps {
  value: number;
}

const RollingNumber: React.FC<RollingNumberProps> = ({ value }) => {
  const digits = useMemo(() => {
    const str = Math.abs(value).toString();
    return str.split('').map(Number);
  }, [value]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 48 }}>
      {digits.map((digit, index) => (
        <RollingDigit key={index} digit={digit} />
      ))}
    </View>
  );
};

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

  const [bannerWidth, setBannerWidth] = useState(0);
  const [prevStreak, setPrevStreak] = useState(habit?.streak || 0);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (habit) {
      setPrevStreak(habit.streak);
    }
  }, [habit?.streak]);

  const isStreakIncreasing = useMemo(() => {
    if (!habit) return true;
    return habit.streak >= prevStreak;
  }, [habit, prevStreak]);

  const greenProgress = useSharedValue(habit?.completedToday ? 1 : 0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (habit) {
      greenProgress.value = withTiming(habit.completedToday ? 1 : 0, { duration: 400 });
      if (isMountedRef.current) {
        iconScale.value = withSequence(
          withSpring(1.3, { damping: 10 }),
          withSpring(1)
        );
      }
    }
  }, [habit?.completedToday, greenProgress, iconScale]);

  const animatedBannerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      greenProgress.value,
      [0, 1],
      [colors.primary, '#22C55E']
    );
    return {
      borderColor,
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => {
    const width = bannerWidth || 400;
    const translateX = (1 - greenProgress.value) * -width;
    return {
      transform: [{ translateX }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    const width = bannerWidth || 400;
    const translateX = (1 - greenProgress.value) * width;
    return {
      transform: [{ translateX }],
    };
  });

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }]
  }));

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
      <View className="flex-1 pt-[62px] px-4 bg-background">
        <Text className="text-base mt-4 text-center text-text">Habit not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-5 p-[10px]">
          <Text className="text-base text-text">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-[62px] px-4 bg-background">
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
          <RollingNumber value={habit.streak} />
          <Text className="text-white text-lg font-medium ml-2" style={{ opacity: 0.8 }}>
            day streak
          </Text>
        </View>
      </View>

      {isScheduledToday ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleHabit(habit.id)}
          onLayout={(e) => setBannerWidth(e.nativeEvent.layout.width)}
          style={{ overflow: 'hidden' }}
          className="rounded-xl mb-6"
        >
          <Animated.View
            className="flex-row items-center p-4 border"
            style={[
              {
                backgroundColor: colors.primary,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 12,
              },
              animatedBannerStyle,
            ]}
          >
            {/* Bottom Layer Content (Blue - Incomplete State) */}
            <View style={{ marginRight: 12 }}>
              <Ionicons
                name="ellipse-outline"
                size={24}
                color="white"
              />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-base text-white">
                Mark Completed Today
              </Text>
              <Text className="text-white text-xs mt-0.5" style={{ opacity: 0.8 }}>
                Tap to mark this routine as done.
              </Text>
            </View>

            {/* Absolute Green Overlay Container (Slides Left-to-Right) */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: '#22C55E',
                  overflow: 'hidden',
                },
                animatedOverlayStyle,
              ]}
            >
              {/* Top Layer Content (Green - Completed State, Slides in reverse to stay stationary) */}
              <Animated.View
                style={[
                  {
                    width: bannerWidth,
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                  },
                  animatedContentStyle,
                ]}
              >
                <Animated.View style={[{ marginRight: 12 }, iconStyle]}>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="white"
                  />
                </Animated.View>
                <View className="flex-1">
                  <Text className="font-semibold text-base text-white">
                    Completed for Today!
                  </Text>
                  <Text className="text-white text-xs mt-0.5" style={{ opacity: 0.8 }}>
                    Great job! Tap to undo completion.
                  </Text>
                </View>
              </Animated.View>
            </Animated.View>
          </Animated.View>
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

      <Card padding="md" className="mb-6 shadow-sm shadow-black/5 elevation-1">
        <Text className="font-semibold text-text text-xs uppercase tracking-wider mb-3" style={{ opacity: 0.5 }}>
          Recurrence Schedule
        </Text>
        
        {habit.frequency === 'daily' || habit.frequency === 'weekly' ? (
          <View className="flex-row justify-between mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => {
              const isActive = habit.frequency === 'daily' || habit.daysOfWeek?.includes(index);
              return (
                <View
                  key={index}
                  className={`w-9 h-9 justify-center items-center rounded-full border ${
                    isActive
                      ? 'bg-primary border-primary'
                      : 'border-border bg-background'
                  }`}
                  style={isActive ? undefined : { opacity: 0.3 }}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isActive ? 'text-white font-bold' : 'text-text'
                    }`}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : habit.frequency === 'monthly' ? (
          <View className="flex-row flex-wrap mb-4">
            {habit.daysOfMonth?.map((day) => (
              <View
                key={day}
                className="w-9 h-9 justify-center items-center rounded-full bg-primary border border-primary mr-2 mb-2"
              >
                <Text className="text-white text-sm font-bold">{day}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-row items-center bg-background border border-border rounded-xl p-3 mb-4">
            <Ionicons name="repeat-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            <Text className="text-text font-semibold text-sm">
              Repeats every {habit.customInterval} days
            </Text>
          </View>
        )}

        <Text className="text-text text-sm font-medium" style={{ opacity: 0.8 }}>
          {scheduleString}
        </Text>
      </Card>

      <View className="flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-4">
          <Card padding="md" className="shadow-sm shadow-black/5 elevation-1 h-[100px] justify-between">
            <View className="flex-row justify-between items-center">
              <Text className="text-text text-xs font-semibold uppercase tracking-wider" style={{ opacity: 0.5 }}>
                Frequency
              </Text>
              <Ionicons name="repeat-outline" size={18} color={colors.primary} />
            </View>
            <Text className="text-text font-bold text-base capitalize">
              {habit.frequency}
            </Text>
          </Card>
        </View>

        <View className="w-[48%] mb-4">
          <Card padding="md" className="shadow-sm shadow-black/5 elevation-1 h-[100px] justify-between">
            <View className="flex-row justify-between items-center">
              <Text className="text-text text-xs font-semibold uppercase tracking-wider" style={{ opacity: 0.5 }}>
                Created
              </Text>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            </View>
            <Text className="text-text font-bold text-base">
              {new Date(habit.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          </Card>
        </View>

        <View className="w-[48%] mb-4">
          <Card padding="md" className="shadow-sm shadow-black/5 elevation-1 h-[100px] justify-between">
            <View className="flex-row justify-between items-center">
              <Text className="text-text text-xs font-semibold uppercase tracking-wider" style={{ opacity: 0.5 }}>
                Last Done
              </Text>
              <Ionicons name="checkmark-done" size={18} color={colors.primary} />
            </View>
            <Animated.Text
              key={habit.lastCompletedDate || 'never'}
              entering={isMountedRef.current ? (isStreakIncreasing ? FadeInLeft.duration(300) : FadeInRight.duration(300)) : undefined}
              className="text-text font-bold text-base"
            >
              {habit.lastCompletedDate ? habit.lastCompletedDate.split('-').slice(1).join('/') : 'Never'}
            </Animated.Text>
          </Card>
        </View>

        <View className="w-[48%] mb-4">
          <Card padding="md" className="shadow-sm shadow-black/5 elevation-1 h-[100px] justify-between">
            <View className="flex-row justify-between items-center">
              <Text className="text-text text-xs font-semibold uppercase tracking-wider" style={{ opacity: 0.5 }}>
                Status
              </Text>
              <Ionicons name="ribbon-outline" size={18} color={colors.primary} />
            </View>
            <Animated.Text
              key={habit.streak}
              entering={isMountedRef.current ? (isStreakIncreasing ? FadeInRight.duration(300) : FadeInLeft.duration(300)) : undefined}
              className="text-text font-bold text-base"
            >
              {habit.streak === 0 ? 'Starting' : habit.streak <= 5 ? 'Active' : 'Elite'}
            </Animated.Text>
          </Card>
        </View>
      </View>

      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </View>
  );
};
