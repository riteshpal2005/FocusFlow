import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../../utils/storageHelpers';
import { useTheme } from '../../store/useThemeStore';
import Animated, { FadeInRight, FadeOutLeft, LinearTransition, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';

interface HabitCardProps {
    habit: Habit;
    onToggle: (id: string) => void;
    onPress: (id: string) => void;
};

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
                style={[styles.card, { backgroundColor: colors.surface }]}
                onPress={() => onPress(habit.id)}
            >
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {habit.name}
                    </Text>
                    <Text style={[styles.streak, { color: colors.primary }]}>
                        🔥 {habit.streak} Day Streak
                    </Text>
                </View>
                <TouchableOpacity 
                    activeOpacity={0.4}
                    style={styles.checkboxContainer}
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

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    content: {
        flex: 1, 
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    streak: {
        fontSize: 14,
        fontWeight: '500',
    },
    checkboxContainer: {
        paddingLeft: 12,
    }
});