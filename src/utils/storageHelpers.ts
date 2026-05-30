import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    THEME: '@focucsflow_theme',
    USER: '@focusflow_user',
    HABITS: '@focusflow_habits',
} as const;

export const saveTheme = async (theme: 'light' | 'dark'): Promise<void> => {
    try {
        AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
        console.error("Failed to save theme to disk:", error);
    }
};

export const getTheme = async (): Promise<'light' | 'dark' | null> => {
    try {
        const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (theme === 'light' || theme === 'dark') {
            return theme;
        }
        return null;
    } catch (error) {
        return null;
    }
};

interface User {
    id: string;
    username: string;
};

export interface Habit {
    id: string;
    name: string;
    streak: number;
    completedToday: boolean;
    createdAt: number; // unix timestamp
};

export const saveHabits = async (habits: Habit[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (error) {
        console.error("Failed to save habits to disk:", error);
    }
};

export const getHabits = async (): Promise<Habit[]> => {
    try {
        const habits = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
        if (habits) {
            return JSON.parse(habits);
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch habits from disk:", error);
        return [];
    }
};

export const saveUser = async (user: User): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
        console.error("Failed to save user to disk:", error);
    }

};

export const getUser = async (): Promise<User | null> => {
    try {
        const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const clearAuthStorage = async ():  Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
        console.error("Failed to clear user from disk:", error);
    }
}; 