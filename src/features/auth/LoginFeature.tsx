import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../core/auth/useAuthStore';
import { useTheme } from '../../core/theme/useThemeStore';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Heading } from '../../shared/components/ui/Typography';

export const LoginFeature = () => {
  const { login, isLoading } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(async () => {
    if (!username || !password) return;
    await login(username, password);
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
        <Heading className="mb-8 text-center text-text">Welcome to FocusFlow</Heading>

        <Input
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          disabled={!username || !password}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
