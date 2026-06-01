import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import { getTheme, saveTheme } from '../utils/storageHelpers';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
	background: string;
	surface: string;
	text: string;
	primary: string;
	border: string;
}

const LightColors: ThemeColors = {
	background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#121212',
    primary: '#2563EB',
    border: '#E5E5E5',
};

const DarkColors: ThemeColors = {
	background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    primary: '#2563EB',
    border: '#E5E5E5',
};

const themeModeAtom = atom<ThemeMode>('dark');
const themeColorsAtom = atom<ThemeColors>(
    (get) => get(themeModeAtom) === 'dark' ? DarkColors : LightColors
);

export const useTheme = () => {
    const [theme, setTheme] = useAtom(themeModeAtom);
    const [colors] = useAtom(themeColorsAtom);

    const initialize = useCallback(async () => {
        const savedTheme = await getTheme();
        if (savedTheme) {
            setTheme(savedTheme as ThemeMode);
        }
    }, [setTheme]);

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            saveTheme(newTheme);
            return newTheme;
        });
    }, [setTheme]);

    return {
        theme,
        colors,
        initialize,
        toggleTheme
    };
};