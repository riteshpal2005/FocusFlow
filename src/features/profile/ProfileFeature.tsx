import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../core/auth/useAuthStore';
import { useTheme } from '../../core/theme/useThemeStore';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';
import { Label, SubText } from '../../shared/components/ui/Typography';

export const ProfileFeature = () => {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
  const { colors, theme, toggleTheme, themeOption } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const rotation = useSharedValue(0);

  const themeIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleThemeToggle = useCallback(() => {
    rotation.value = withTiming(rotation.value + 180, { duration: 300, easing: Easing.inOut(Easing.ease) });
    toggleTheme();
  }, [rotation, toggleTheme]);

  return (
    <Animated.View entering={FadeIn.duration(250)} className="flex-1 px-4 pt-[72px] bg-background">
      <Text className="text-[28px] font-bold text-text mb-6">Settings & Profile</Text>

      <Pressable
        onPress={handleThemeToggle}
        style={{ top: insets.top + 16 }}
        className="absolute right-6 z-10"
      >
        <Animated.View style={themeIconStyle}>
          <Ionicons name={theme === 'light' ? 'moon' : 'sunny'} size={24} color={colors.text} />
        </Animated.View>
      </Pressable>

      <Card padding="md" className="mb-6">
        <SubText className="opacity-50 mb-1">Logged in as</SubText>
        <Text className="text-xl font-semibold text-text">{user?.username}</Text>
        <SubText className="opacity-50 mt-2">Active Theme: {themeOption}</SubText>
      </Card>

      <View className="mb-6">
        <Label className="pl-1 opacity-50 mb-3">App Info</Label>
        <Button
          title="About FocusFlow"
          variant="secondary"
          onPress={() => router.push('/about')}
        />
      </View>

      <View className="mb-6">
        <Label className="pl-1 opacity-50 mb-3">Account</Label>
        <Button title="Logout" onPress={logout} loading={isLoggingOut} />
      </View>
    </Animated.View>
  );
};
