import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Stack, usePathname, useRouter } from 'expo-router';
import { Provider } from 'jotai';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../core/auth/useAuthStore';
import { useTheme } from '../core/theme/useThemeStore';
import * as SplashScreen from 'expo-splash-screen';
import '../../global.css';

SplashScreen.preventAutoHideAsync();

function AppLayoutContent() {
  const { initialize: initializeTheme, theme, colors, activeThemeClass } = useTheme();
  const { user, isLoading, initialize: initializeAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { setColorScheme } = useColorScheme();
  const [hasMounted, setHasMounted] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    Promise.all([
      initializeTheme(),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ])
      .then(() => {
        setIsThemeLoaded(true);
      })
      .catch(() => {
        setIsThemeLoaded(true);
      });
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
    if (!hasMounted || isLoading || !isThemeLoaded) return;

    if (!user && pathname !== '/auth/login') {
      router.replace('/auth/login');
      return;
    }

    if (user && (pathname === '/' || pathname.startsWith('/auth') || pathname === '/auth/login')) {
      router.replace('/home');
    }
  }, [hasMounted, isLoading, isThemeLoaded, user, pathname, router]);

  useEffect(() => {
    if (isThemeLoaded && !isLoading) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn("Failed to hide splash screen:", error);
      });
    }
  }, [isThemeLoaded, isLoading]);

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
