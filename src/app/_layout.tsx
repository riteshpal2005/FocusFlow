import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Stack, usePathname, useRouter } from 'expo-router';
import { Provider } from 'jotai';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../store/useAuthStore';
import { useTheme } from '../store/useThemeStore';
import { CustomSplashScreen } from '../components/common/CustomSplashScreen';
import '../../global.css';

function AppLayoutContent() {
  const { initialize: initializeTheme, theme, colors } = useTheme();
  const { user, isLoading, initialize: initializeAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    initializeTheme();
    initializeAuth();
  }, [initializeTheme, initializeAuth]);

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  useEffect(() => {
    if (isLoading) return;

    if (!user && pathname !== '/auth/login') {
      router.replace('/auth/login');
      return;
    }

    if (user && (pathname === '/' || pathname.startsWith('/auth'))) {
      router.replace('/home');
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
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
