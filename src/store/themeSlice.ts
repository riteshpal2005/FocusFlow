import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTheme, saveTheme } from '../utils/storageHelpers';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
	background: string;
	surface: string;
	text: string;
	primary: string;
	border: string;
}

interface ThemeState {
	theme: ThemeMode;
	colors: ThemeColors;
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

const initialState: ThemeState = {
    theme: 'dark',
    colors: DarkColors,
};

export const initializeTheme = createAsyncThunk('theme/initialize', async () => {
    const savedTheme = await getTheme();
    return savedTheme as ThemeMode | null;
});

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleThemeAction: (state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            saveTheme(newTheme);
            state.theme = newTheme;
            state.colors = newTheme === 'dark' ? DarkColors : LightColors;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initializeTheme.fulfilled, (state, action) => {
            if (action.payload) {
                state.theme = action.payload;
                state.colors = action.payload === 'dark' ? DarkColors : LightColors;
            }
        });
    }
});

export const { toggleThemeAction } = themeSlice.actions;
export default themeSlice.reducer;
