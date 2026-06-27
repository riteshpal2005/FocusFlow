import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { useTheme } from '../../../core/theme/useThemeStore';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  ...rest
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const inputClass = `h-[50px] border rounded-lg px-4 text-base bg-surface text-text ${
    error ? 'border-[#EF4444]' : isFocused ? 'border-primary' : 'border-border'
  }`;

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-2 text-sm font-medium text-text">
          {label}
        </Text>
      )}
      <TextInput
        className={inputClass}
        placeholderTextColor="gray"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {error && <Text className="text-[#EF4444] text-xs mt-1">{error}</Text>}
    </View>
  );
};
