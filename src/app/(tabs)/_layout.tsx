import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../core/theme/useThemeStore';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTabs = withLayoutContext(Navigator);

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <MaterialTabs
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border || '#333',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
          height: 3,
          position: 'absolute',
          top: 0,
        },
        tabBarShowIcon: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'none',
        },
      }}
    >
      <MaterialTabs.Screen
        name="home"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <MaterialTabs.Screen
        name="checklist"
        options={{
          title: 'Checklist',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="checkbox-outline" size={24} color={color} />
          ),
        }}
      />
      <MaterialTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </MaterialTabs>
  );
}
