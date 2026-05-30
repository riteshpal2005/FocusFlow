import React, { createContext, useState, useEffect } from 'react';
import { getTheme, saveTheme } from '../utils/storageHelpers';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
	background: string;
	surface: string;
	text: string;
	primary: string;
	border: string;
}

interface ThemeContextType {
	theme: ThemeMode;
	colors: ThemeColors;
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
	// TODO: Define a dark mode color palette that matches the ThemeColors interface
	background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    primary: '#2563EB',
    border: '#E5E5E5',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

	const [theme, setTheme] = useState<ThemeMode>('dark');

	useEffect(() => {
		const loadTheme = async () => {
			const savedTheme = await getTheme();
			if (savedTheme) {
				setTheme(savedTheme);
			}
		};
		loadTheme();
	}), [];

	const colors = theme === 'dark' ? DarkColors : LightColors;
	const toggleTheme = () => {
    	setTheme((prevTheme) => {
			const newTheme = prevTheme === 'light' ? 'dark' : 'light';
			saveTheme(newTheme); // Save the new theme to disk
			return newTheme;
		});
	};

	return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
	const context = React.useContext(ThemeContext);
	if (!context) {
    	throw new Error('useTheme must be used within a ThemeProvider');
	}	
	// TODO: Write an 'if' statement that throws an Error if context is undefined.
    // (This protects us from accidentally using useTheme outside of the ThemeProvider)

	return context; // Type is guaranteed to be ThemeContextType here
};