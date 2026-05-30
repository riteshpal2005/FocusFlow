import {  useState, useEffect } from 'react';
import { getHabits, saveHabits, Habit } from '../utils/storageHelpers';

export const useHabitStorage = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            const savedHabits = await getHabits();
            setHabits(savedHabits);
            setIsLoading(false);
        };
        loadInitialData();

    }, []);

    const addHabit = async (name: string) => {
        const newHabit: Habit = {
            id: Date.now().toString(),
            name,
            streak: 0,
            completedToday: false,
            createdAt: Date.now(),
        };

        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits); 
        saveHabits(updatedHabits).catch(console.error);
    };

    const toggleHabit = async (id: string) => {
        const updatedHabits = habits.map(habit => {
            if (habit.id === id) {
                return {
                    ...habit,
                    completedToday: !habit.completedToday,
                };
            } else {
                return habit;
            }
        });
        setHabits(updatedHabits);
        saveHabits(updatedHabits).catch(console.error);
    };

    const deleteHabit = async (id: string) => {
        const updatedHabits = habits.filter(habit => habit.id !== id);
        setHabits(updatedHabits);
        saveHabits(updatedHabits).catch(console.error);
    };

    const refreshHabits = async () => {
        const savedHabits = await getHabits();
        setHabits(savedHabits);
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