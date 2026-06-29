import React from 'react';
import { Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
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
      contentContainerStyle={habits.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : { paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="items-center px-8">
          <Ionicons name="calendar-outline" size={64} color="gray" className="opacity-40 mb-4" />
          <Text className="text-center opacity-50 text-text text-lg font-semibold mb-2">No habits yet</Text>
          <Text className="text-center opacity-40 text-text text-sm">Start building positive routines by adding your first habit.</Text>
        </View>
      }
    />
  );
};
