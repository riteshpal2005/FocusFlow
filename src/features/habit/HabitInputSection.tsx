import React from 'react';
import { TextInput, TouchableOpacity, Text, View } from 'react-native';

interface HabitInputSectionProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

export const HabitInputSection: React.FC<HabitInputSectionProps> = ({ value, onChangeText, onSubmit }) => {
  return (
    <View className="flex-row mb-5">
      <TextInput
        className="flex-1 h-[50px] rounded-lg px-4 mr-3 border border-border bg-surface text-text"
        placeholder="Create a new habit..."
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        className="justify-center items-center px-5 rounded-lg h-[50px] bg-primary"
        onPress={onSubmit}
      >
        <Text className="text-white font-bold text-base">Add</Text>
      </TouchableOpacity>
    </View>
  );
};
