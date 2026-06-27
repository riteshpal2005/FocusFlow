import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { getTheme, saveTheme } from '../../shared/utils/storageHelpers';

export type ThemeOption = 'light' | 'dark' | 'pitch-black' | 'system';

export interface ThemeColors {
    background: string;
    surface: string;
    text: string;
    primary: string;
    border: string;
    secondary: string;
    tertiary: string;
    brandPrimary: string;
    brandPrimaryContent: string;
    statusDanger: string;
    statusSuccess: string;
}

const LightColors: ThemeColors = {
    background: '#f4f4f5',
    surface: '#ffffff',
    text: '#000000',
    primary: '#2563eb',
    border: '#e4e4e7',
    secondary: '#71717a',
    tertiary: '#a1a1aa',
    brandPrimary: '#2563eb',
    brandPrimaryContent: '#ffffff',
    statusDanger: '#ef4444',
    statusSuccess: '#10b981',
};

const DarkColors: ThemeColors = {
    background: '#09090b',
    surface: '#18181b',
    text: '#ffffff',
    primary: '#3b82f6',
    border: '#27272a',
    secondary: '#a1a1aa',
    tertiary: '#71717a',
    brandPrimary: '#3b82f6',
    brandPrimaryContent: '#ffffff',
    statusDanger: '#ef4444',
    statusSuccess: '#10b981',
};

const PitchBlackColors: ThemeColors = {
    background: '#000000',
    surface: '#09090b',
    text: '#ffffff',
    primary: '#3b82f6',
    border: '#18181b',
    secondary: '#a1a1aa',
    tertiary: '#71717a',
    brandPrimary: '#3b82f6',
    brandPrimaryContent: '#ffffff',
    statusDanger: '#ef4444',
    statusSuccess: '#10b981',
};

const themeOptionAtom = atom<ThemeOption>('dark');

export const useTheme = () => {
    const [themeOption, setThemeOption] = useAtom(themeOptionAtom);
    const systemColorScheme = useSystemColorScheme();

    const activeTheme = themeOption === 'system' ? systemColorScheme || 'dark' : themeOption;

    const activeThemeClass = activeTheme === 'pitch-black'
        ? 'theme-pitch-black'
        : activeTheme === 'dark'
            ? 'theme-dark'
            : '';

    const colors = activeTheme === 'pitch-black'
        ? PitchBlackColors
        : activeTheme === 'dark'
            ? DarkColors
            : LightColors;

    const initialize = useCallback(async () => {
        const savedTheme = await getTheme();
        if (savedTheme) {
            setThemeOption(savedTheme as ThemeOption);
        }
    }, [setThemeOption]);

    const changeThemeOption = useCallback((option: ThemeOption) => {
        setThemeOption(option);
        saveTheme(option);
    }, [setThemeOption]);

    const toggleTheme = useCallback(() => {
        setThemeOption((prevOption) => {
            let newTheme: ThemeOption = 'dark';
            if (prevOption === 'light') {
                newTheme = 'dark';
            } else if (prevOption === 'dark') {
                newTheme = 'pitch-black';
            } else if (prevOption === 'pitch-black') {
                newTheme = 'system';
            } else if (prevOption === 'system') {
                newTheme = 'light';
            }
            saveTheme(newTheme);
            return newTheme;
        });
    }, [setThemeOption]);

    return {
        themeOption,
        theme: activeTheme,
        activeThemeClass,
        colors,
        initialize,
        changeThemeOption,
        toggleTheme
    };
};
