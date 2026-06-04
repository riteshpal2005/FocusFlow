import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'jotai';
import { useAuth } from './src/store/useAuthStore';
import { useTheme } from './src/store/useThemeStore';
import { RootNavigator } from './src/navigation/RootNavigator';
import { GestureSandbox } from './test/GestureSandbox';

// Set this to true to run the sandbox environment!
const RUN_TEST_ENV = true;

const AppContent = () => {
  const { theme, colors, initialize: initializeTheme } = useTheme();
  const { initialize: initializeAuth } = useAuth();

  useEffect(() => {
    initializeTheme();
    initializeAuth();
  }, [initializeTheme, initializeAuth]);

  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;
  
  if (RUN_TEST_ENV) {
      return (
          <GestureHandlerRootView style={{ flex: 1 }}>
              <GestureSandbox />
          </GestureHandlerRootView>
      );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={{...navTheme, colors: {...navTheme.colors, background: colors.background}}}>
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}