import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/useThemeStore';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border || '#333',
        },
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'home' ? 'home-outline' : 'person-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    />
  );
}
