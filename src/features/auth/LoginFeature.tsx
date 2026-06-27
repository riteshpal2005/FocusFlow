import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../store/useAuthStore';
import { useTheme } from '../../store/useThemeStore';
import { CustomButton } from '../../components/common/CustomButton';
import { CustomInput } from '../../components/common/CustomInput';

export const LoginFeature = () => {
  const { login, isLoading } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(async () => {
    if (!username || !password) return;
    await login(username);
  }, [login, password, username]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center bg-background"
    >
      <TouchableOpacity
        onPress={toggleTheme}
        style={{ top: insets.top + 16 }}
        className="absolute right-6 z-10"
      >
        <Ionicons name={theme === 'light' ? 'moon' : 'sunny'} size={24} color={colors.text} />
      </TouchableOpacity>

      <View className="px-6">
        <Text className="text-[28px] font-bold mb-8 text-center text-text">Welcome to FocusFlow</Text>

        <CustomInput
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <CustomInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />

        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          isLoading={isLoading}
          disabled={!username || !password}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
