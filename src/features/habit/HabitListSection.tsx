import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { HabitCard } from '../../components/habit/HabitCard';
import { Habit } from '../../utils/storageHelpers';

interface HabitListSectionProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
}

export const HabitListSection: React.FC<HabitListSectionProps> = ({ habits, onToggle, onPress }) => {
  return (
    <FlatList
      data={habits}
      keyExtractor={(habit) => habit.id}
      renderItem={({ item }) => (
        <View>
          <HabitCard habit={item} onToggle={onToggle} onPress={onPress} />
        </View>
      )}
      contentContainerClassName="pb-[100px]"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text className="text-center mt-10 opacity-50 text-text">No habits yet. Start building one!</Text>
      }
    />
  );
};
