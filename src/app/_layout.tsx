import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Stack, usePathname, useRouter } from 'expo-router';
import { Provider } from 'jotai';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../core/auth/useAuthStore';
import { useTheme } from '../core/theme/useThemeStore';
import { CustomSplashScreen } from '../shared/components/common/CustomSplashScreen';
import '../../global.css';

function AppLayoutContent() {
  const { initialize: initializeTheme, theme, colors, activeThemeClass } = useTheme();
  const { user, isLoading, initialize: initializeAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    initializeTheme();
    const unsubscribe = initializeAuth();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initializeTheme, initializeAuth]);

  useEffect(() => {
    setColorScheme(theme === 'light' ? 'light' : 'dark');
  }, [theme, setColorScheme]);

  useEffect(() => {
    if (isLoading) return;

    if (!user && pathname !== '/auth/login') {
      router.replace('/auth/login');
      return;
    }

    if (user && (pathname === '/' || pathname.startsWith('/auth') || pathname === '/auth/login')) {
      router.replace('/home');
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className={`${activeThemeClass} bg-background flex-1`}>
        <StatusBar style={theme === 'light' ? 'dark' : 'light'} backgroundColor="transparent" translucent />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      </View>
    </GestureHandlerRootView>
  );
}

export default function Layout() {
  return (
    <Provider>
      <AppLayoutContent />
    </Provider>
  );
}
