import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'jotai';
import { useAuth } from './src/store/useAuthStore';
import { useTheme } from './src/store/useThemeStore';
import { RootNavigator } from './src/navigation/RootNavigator';

const AppContent = () => {
  const { initialize: initializeTheme } = useTheme();
  const { initialize: initializeAuth } = useAuth();

  useEffect(() => {
    initializeTheme();
    initializeAuth();
  }, [initializeTheme, initializeAuth]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}