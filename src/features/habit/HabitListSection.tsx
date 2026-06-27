import React from 'react';
import { Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { HabitCard } from './components/HabitCard';
import { Habit } from '../../shared/utils/storageHelpers';

interface HabitListSectionProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
}

const FlashListElement = FlashList as any;

export const HabitListSection: React.FC<HabitListSectionProps> = ({ habits, onToggle, onPress }) => {
  return (
    <FlashListElement
      data={habits}
      keyExtractor={(habit: Habit) => habit.id}
      renderItem={({ item }: { item: Habit }) => (
        <View>
          <HabitCard habit={item} onToggle={onToggle} onPress={onPress} />
        </View>
      )}
      estimatedItemSize={72}
      contentContainerClassName="pb-[100px]"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text className="text-center mt-10 opacity-50 text-text">No habits yet. Start building one!</Text>
      }
    />
  );
};
