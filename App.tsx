import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from './src/store/useThemeStore';
import { useAuth } from './src/store/useAuthStore';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  useEffect(() => {
    useTheme.getState().initialize();
    useAuth.getState().initialize();
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};