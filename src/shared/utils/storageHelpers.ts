import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let mmkv: any = null;

if (!isExpoGo) {
    try {
        const { MMKV } = require('react-native-mmkv');
        mmkv = new MMKV({ id: 'focusflow-storage' });
    } catch (error) {
        console.warn("MMKV native module not found, falling back to AsyncStorage:", error);
    }
}

const kvStorage = {
    getItem: async (key: string): Promise<string | null> => {
        if (mmkv) {
            return mmkv.getString(key) ?? null;
        }
        return AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string): Promise<void> => {
        if (mmkv) {
            mmkv.set(key, value);
            return;
        }
        await AsyncStorage.setItem(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
        if (mmkv) {
            mmkv.delete(key);
            return;
        }
        await AsyncStorage.removeItem(key);
    }
};

const STORAGE_KEYS = {
    THEME: '@focucsflow_theme',
    USER: '@focusflow_user',
    HABITS: '@focusflow_habits',
    CHECKLIST: '@focusflow_checklist',
} as const;

export const saveTheme = async (theme: string): Promise<void> => {
    try {
        await kvStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
        console.error("Failed to save theme to disk:", error);
    }
};

export const getTheme = async (): Promise<string | null> => {
    try {
        return await kvStorage.getItem(STORAGE_KEYS.THEME);
    } catch (error) {
        return null;
    }
};

interface User {
    id: string;
    username: string;
}

export interface Habit {
    id: string;
    name: string;
    streak: number;
    completedToday: boolean;
    createdAt: number;
    sync_status?: 'synced' | 'pending' | 'deleted';
    updatedAt: number;
}

export interface ChecklistItem {
    id: string;
    name: string;
    isChecked: boolean;
    createdAt: number;
    updatedAt: number;
    sync_status?: 'synced' | 'pending' | 'deleted';
}

export const saveHabits = async (habits: Habit[]): Promise<void> => {
    try {
        await kvStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (error) {
        console.error("Failed to habits to disk:", error);
    }
};

export const getHabits = async (): Promise<Habit[]> => {
    try {
        const habits = await kvStorage.getItem(STORAGE_KEYS.HABITS);
        if (habits) {
            return JSON.parse(habits);
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch habits from disk:", error);
        return [];
    }
};

export const saveChecklistItems = async (items: ChecklistItem[]): Promise<void> => {
    try {
        await kvStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
    } catch (error) {
        console.error("Failed to save checklist items to disk:", error);
    }
};

export const getChecklistItems = async (): Promise<ChecklistItem[]> => {
    try {
        const items = await kvStorage.getItem(STORAGE_KEYS.CHECKLIST);
        if (items) {
            return JSON.parse(items);
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch checklist items from disk:", error);
        return [];
    }
};

export const saveUser = async (user: User): Promise<void> => {
    try {
        await kvStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
        console.error("Failed to save user to disk:", error);
    }
};

export const getUser = async (): Promise<User | null> => {
    try {
        const user = await kvStorage.getItem(STORAGE_KEYS.USER);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const clearAuthStorage = async (): Promise<void> => {
    try {
        await kvStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
        console.error("Failed to clear user from disk:", error);
    }
};
