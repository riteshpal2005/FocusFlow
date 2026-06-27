import React, { memo, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../../utils/storageHelpers';
import { useTheme } from '../../store/useThemeStore';
import Animated, { FadeInRight, FadeOutLeft, LinearTransition, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';

interface HabitCardProps {
    habit: Habit;
    onToggle: (id: string) => void;
    onPress: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = memo(({ habit, onToggle, onPress }) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    useEffect(() => {
        if (habit.completedToday) {
            scale.value = withSequence(withSpring(1.2), withSpring(1));
        } else {
            scale.value = withSequence(withSpring(0.8), withSpring(1));
        }
    }, [habit.completedToday, scale]);

    const checkmarkStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            layout={LinearTransition.springify()}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center p-4 my-1.5 rounded-xl bg-surface shadow-sm shadow-black/5 elevation-2"
                onPress={() => onPress(habit.id)}
            >
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-text mb-1">
                        {habit.name}
                    </Text>
                    <Text className="text-sm font-medium text-primary">
                        🔥 {habit.streak} Day Streak
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
            </TouchableOpacity>
        </Animated.View>
    );
});