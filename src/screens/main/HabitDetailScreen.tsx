import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useHabitStorage } from '../../hooks/useHabitStorage';
import { RootStackParamList } from '../../navigation/types';

type HabitDetailRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;

export const HabitDetailScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const route = useRoute<HabitDetailRouteProp>();
    const { habitId } = route.params;

    const { habits, isLoading, deleteHabit } = useHabitStorage();

    const handleDelete = () => {
        deleteHabit(habitId);
        navigation.goBack();
    };

    const habit = habits.find(habit => habit.id === habitId);

    if (isLoading) {
    return (
        <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

    if(!habit) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Habit not found.</Text>
                <TouchableOpacity onPress={() => {navigation.goBack();}} style={styles.backButton}>
                    <Text style={{ color: colors.text }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background}]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Details</Text>
                <View style={{ width: 28 }} />
            </View>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text style={[styles.title, { color: colors.text }]}>{habit.name}</Text>
                <Text style={[styles.stat, { color: colors.text }]}>
                    Streak: {habit.streak} days
                </Text>
                
                <Text style={[styles.stat, { color: colors.text }]}>
                    Status today: {habit.completedToday ? '✅ Completed' : '❌ Pending'}
                </Text>
                <Text style={[styles.stat, { color: colors.text }]}>
                    Created: {new Date(habit.createdAt).toLocaleDateString()}
                </Text>
                <TouchableOpacity onPress={handleDelete} style={{ marginTop: 30, padding: 15, alignItems: 'center' }}>
                    <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>Delete Habit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    card: { padding: 24, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
    stat: { fontSize: 16, marginBottom: 8, opacity: 0.8 },
    backButton: { marginTop: 20, padding: 10 }
});