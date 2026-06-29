import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { RecurrenceFrequency } from '../../shared/utils/storageHelpers';
import { useTheme } from '../../core/theme/useThemeStore';

interface HabitInputSectionProps {
  onSubmit: (
    name: string,
    frequency: RecurrenceFrequency,
    daysOfWeek?: number[],
    daysOfMonth?: number[],
    customInterval?: number
  ) => void;
}

const DAYS_OF_WEEK = [
  { label: 'S', value: 0 },
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
];

export const HabitInputSection: React.FC<HabitInputSectionProps> = ({ onSubmit }) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [daysOfMonth, setDaysOfMonth] = useState<number[]>([]);
  const [customInterval, setCustomInterval] = useState('1');

  const handleToggleDayOfWeek = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleToggleDayOfMonth = (day: number) => {
    setDaysOfMonth((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleAdd = () => {
    if (name.trim() === '') return;

    let finalDaysOfWeek: number[] | undefined = undefined;
    let finalDaysOfMonth: number[] | undefined = undefined;
    let finalInterval: number | undefined = undefined;

    if (frequency === 'weekly') {
      finalDaysOfWeek = daysOfWeek.length > 0 ? daysOfWeek : [1, 2, 3, 4, 5, 6, 0];
    } else if (frequency === 'monthly') {
      finalDaysOfMonth = daysOfMonth.length > 0 ? daysOfMonth : [1];
    } else if (frequency === 'custom') {
      finalInterval = parseInt(customInterval, 10) || 1;
    }

    onSubmit(name.trim(), frequency, finalDaysOfWeek, finalDaysOfMonth, finalInterval);
    setName('');
    setFrequency('daily');
    setDaysOfWeek([]);
    setDaysOfMonth([]);
    setCustomInterval('1');
  };

  return (
    <View className="w-full">
      <TextInput
        className="w-full h-[50px] rounded-lg px-4 mb-4 border border-border bg-surface text-text"
        placeholder="Habit name (e.g. Meditate, Read)"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-text font-semibold mb-2 text-sm" style={{ opacity: 0.8 }}>Frequency</Text>
      <View className="flex-row bg-background p-1 rounded-lg mb-4">
        {(['daily', 'weekly', 'monthly', 'custom'] as const).map((freq) => {
          const isSelected = frequency === freq;
          return (
            <TouchableOpacity
              key={freq}
              onPress={() => setFrequency(freq)}
              className="flex-grow flex-shrink py-2 items-center rounded-md"
              style={isSelected ? {
                backgroundColor: colors.surface,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 1,
              } : undefined}
            >
              <Text
                className={`text-xs font-semibold capitalize ${
                  isSelected ? 'text-primary font-bold' : 'text-text'
                }`}
                style={isSelected ? undefined : { opacity: 0.6 }}
              >
                {freq}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {frequency === 'weekly' && (
        <View className="mb-4">
          <Text className="text-text font-semibold mb-2 text-sm" style={{ opacity: 0.8 }}>Repeat on</Text>
          <View className="flex-row justify-between">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = daysOfWeek.includes(day.value);
              return (
                <TouchableOpacity
                  key={day.value}
                  onPress={() => handleToggleDayOfWeek(day.value)}
                  className={`w-9 h-9 justify-center items-center rounded-full border ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-border bg-surface'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-white font-bold' : 'text-text'
                    }`}
                    style={isSelected ? undefined : { opacity: 0.7 }}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {frequency === 'monthly' && (
        <View className="mb-4">
          <Text className="text-text font-semibold mb-2 text-sm" style={{ opacity: 0.8 }}>Repeat on day of month</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isSelected = daysOfMonth.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => handleToggleDayOfMonth(day)}
                  className={`w-9 h-9 justify-center items-center rounded-full mr-2 border ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-border bg-surface'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-white font-bold' : 'text-text'
                    }`}
                    style={isSelected ? undefined : { opacity: 0.7 }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {frequency === 'custom' && (
        <View className="flex-row items-center mb-4 bg-surface border border-border rounded-lg px-4 h-[50px]">
          <Text className="text-text mr-2 text-base" style={{ opacity: 0.7 }}>Repeat every</Text>
          <TextInput
            className="flex-1 text-text font-bold text-center text-base"
            keyboardType="number-pad"
            value={customInterval}
            onChangeText={(val) => setCustomInterval(val.replace(/[^0-9]/g, ''))}
          />
          <Text className="text-text ml-2 text-base" style={{ opacity: 0.7 }}>days</Text>
        </View>
      )}

      <TouchableOpacity
        className={`justify-center items-center rounded-lg h-[50px] bg-primary mt-2 ${
          name.trim() === '' ? 'opacity-50' : ''
        }`}
        onPress={handleAdd}
        disabled={name.trim() === ''}
      >
        <Text className="text-white font-bold text-base">Create Habit</Text>
      </TouchableOpacity>
    </View>
  );
};
