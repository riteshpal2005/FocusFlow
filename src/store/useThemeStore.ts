import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './index';
import { initializeTheme, toggleThemeAction } from './themeSlice';

export const useTheme = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { theme, colors } = useSelector((state: RootState) => state.theme);

    return {
        theme,
        colors,
        initialize: () => dispatch(initializeTheme()),
        toggleTheme: () => dispatch(toggleThemeAction())
    };
};
