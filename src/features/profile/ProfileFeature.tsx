import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../store/useAuthStore';
import { useTheme } from '../../store/useThemeStore';
import { CustomButton } from '../../components/common/CustomButton';

export const ProfileFeature = () => {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
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
    <Animated.View entering={FadeIn.duration(250)} className="flex-1 px-4 pt-[60px] bg-background"> 
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

      <View className="p-5 rounded-xl mb-6 bg-surface"> 
        <Text className="text-sm text-gray-500 mb-1">Logged in as</Text>
        <Text className="text-xl font-semibold text-text">{user?.username}</Text>
      </View>

      <View className="mb-6"> 
        <Text className="text-base font-semibold text-text opacity-50 mb-3 pl-1">App Info</Text>
        <CustomButton
          title="About FocusFlow"
          variant="secondary"
          onPress={() => router.push('/about')}
        />
      </View>

      <View className="mb-6"> 
        <Text className="text-base font-semibold text-text opacity-50 mb-3 pl-1">Account</Text>
        <CustomButton title="Logout" onPress={logout} isLoading={isLoggingOut} />
      </View>
    </Animated.View>
  );
};
