import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { HabitCard } from './components/HabitCard';
import { Habit } from '../../shared/utils/storageHelpers';
import { isHabitScheduled } from '../../shared/utils/recurrenceHelpers';

interface HabitListSectionProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
}

const FlashListElement = FlashList as any;

export const HabitListSection: React.FC<HabitListSectionProps> = ({ habits, onToggle, onPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const todaysHabits = habits.filter((h) => isHabitScheduled(h, new Date()));
  const offDayHabits = habits.filter((h) => !isHabitScheduled(h, new Date()));

  return (
    <FlashListElement
      data={todaysHabits}
      keyExtractor={(habit: Habit) => habit.id}
      renderItem={({ item }: { item: Habit }) => (
        <View>
          <HabitCard habit={item} onToggle={onToggle} onPress={onPress} />
        </View>
      )}
      estimatedItemSize={72}
      contentContainerStyle={todaysHabits.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : { paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="items-center px-8">
          {habits.length === 0 ? (
            <>
              <Ionicons name="calendar-outline" size={64} color="gray" style={{ opacity: 0.4 }} className="mb-4" />
              <Text className="text-center text-text text-lg font-semibold mb-2" style={{ opacity: 0.5 }}>No habits yet</Text>
              <Text className="text-center text-text text-sm" style={{ opacity: 0.4 }}>Start building positive routines by adding your first habit.</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles-outline" size={64} color="gray" style={{ opacity: 0.4 }} className="mb-4" />
              <Text className="text-center text-text text-lg font-semibold mb-2" style={{ opacity: 0.5 }}>No habits scheduled today</Text>
              <Text className="text-center text-text text-sm" style={{ opacity: 0.4 }}>Enjoy your off day! You can see your full list of habits in the section below.</Text>
            </>
          )}
        </View>
      }
      ListFooterComponent={
        offDayHabits.length > 0 ? (
          <View className="mt-6 px-1 pb-[120px]">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsExpanded(!isExpanded)}
              className="flex-row items-center justify-between py-3 border-t border-border"
            >
              <Text className="font-semibold text-text text-base" style={{ opacity: 0.6 }}>
                Off-Day Habits ({offDayHabits.length})
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>

            {isExpanded && (
              <View className="mt-2">
                {offDayHabits.map((item) => (
                  <View key={item.id} style={{ opacity: 0.6 }}>
                    <HabitCard habit={item} onToggle={onToggle} onPress={onPress} />
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : null
      }
    />
  );
};
