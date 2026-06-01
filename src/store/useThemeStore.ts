import { create } from 'zustand';
import { getTheme, saveTheme } from '../utils/storageHelpers';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
	background: string;
	surface: string;
	text: string;
	primary: string;
	border: string;
}

interface ThemeStore {
	theme: ThemeMode;
	colors: ThemeColors;
	initialize: () => Promise<void>;
	toggleTheme: () => void;
}

const LightColors: ThemeColors = {
	background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#121212',
    primary: '#2563EB',
    border: '#E5E5E5',
}

const DarkColors: ThemeColors = {
	background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    primary: '#2563EB',
    border: '#E5E5E5',
}

export const useTheme = create<ThemeStore>((set, get) => ({
    theme: 'dark',
    colors: DarkColors,
    initialize: async () => {
        const savedTheme = await getTheme();
        if (savedTheme) {
            set({ 
                theme: savedTheme as ThemeMode, 
                colors: savedTheme === 'dark' ? DarkColors : LightColors 
            });
        }
    },
    toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        saveTheme(newTheme);
        set({ 
            theme: newTheme, 
            colors: newTheme === 'dark' ? DarkColors : LightColors 
        });
    }
}));
