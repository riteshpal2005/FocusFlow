import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../store/useThemeStore';
import { useHabitStorage } from '../../hooks/useHabitStorage';
import { HabitCard } from '../../components/habit/HabitCard';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();

    const { habits, isLoading, addHabit, toggleHabit, refreshHabits } = useHabitStorage();

    useFocusEffect(
        useCallback(() => {
            refreshHabits();
        }, [])
    );

    const [newHabitName, setNewHabitName] = useState('');

    const handleAddHabit = () => {
        if (newHabitName.trim() === '') return;
        addHabit(newHabitName);
        setNewHabitName('');
    };

    const handleNavigateToDetail = (id: string) => {
        navigation.navigate('HabitDetail', { habitId: id });
    };

    if (isLoading) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <Animated.View
            entering={FadeIn.duration(250)}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Text style={[styles.header, { color: colors.text }]}>My Habits</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                    placeholder="Create a new habit..."
                    placeholderTextColor="gray"
                    value={newHabitName}
                    onChangeText={setNewHabitName}
                />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddHabit}
                >
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={habits}
                keyExtractor={habit => habit.id}
                renderItem={({ item, index }) => (
                    <View >
                        <HabitCard
                            habit={item}
                            onToggle={toggleHabit}
                            onPress={handleNavigateToDetail}
                        />
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: colors.text }]}>No habits yet. Start building one!</Text>
                }
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 60 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    inputContainer: { flexDirection: 'row', marginBottom: 20 },
    input: { flex: 1, height: 50, borderRadius: 8, paddingHorizontal: 16, marginRight: 12 },
    addButton: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 8, height: 50 },
    addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    listContent: { paddingBottom: 100 },
    emptyText: { textAlign: 'center', marginTop: 40, opacity: 0.5 },
    marginTop: { marginTop: 40, opacity: 0.5 }
});
