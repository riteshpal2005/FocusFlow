import React, { useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../../store/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const AboutFeature = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const openLink = useCallback(async (url: string) => {
    await Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  }, []);

  return (
    <ScrollView className="flex-1 bg-background"> 
      <View className="flex-row items-center px-4 pt-[60px] pb-6"> 
        <TouchableOpacity onPress={() => router.back()} className="mr-4"> 
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text">About FocusFlow</Text>
      </View>

      <View className="p-6 mx-4 rounded-2xl mb-6 items-center bg-surface"> 
        <Text className="text-[28px] font-bold text-text mb-1">FocusFlow</Text>
        <Text className="text-sm mb-4 text-text opacity-70">Version 1.0.0</Text>
        <Text className="text-base text-center leading-6 text-text">FocusFlow is a minimal, effective habit tracker designed to help you build better routines and stay consistent.</Text>
      </View>

      <View className="mb-6 px-4"> 
        <Text className="text-xs font-semibold mb-2 pl-2 uppercase tracking-widest text-text opacity-50">Developer</Text>
        <TouchableOpacity className="flex-row items-center p-4 rounded-xl mb-2 bg-surface" onPress={() => openLink('https://riteshpal.dev')}> 
          <Ionicons name="globe-outline" size={20} color={colors.primary} className="mr-3" />
          <Text className="flex-1 text-base font-medium text-text">riteshpal.dev</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
        </TouchableOpacity>
      </View>

      <View className="mb-6 px-4"> 
        <Text className="text-xs font-semibold mb-2 pl-2 uppercase tracking-widest text-text opacity-50">Legal</Text>
        <TouchableOpacity className="flex-row items-center p-4 rounded-xl mb-2 bg-surface border-b border-border" onPress={() => openLink('https://riteshpal.dev/privacy')}> 
          <Ionicons name="document-text-outline" size={20} color={colors.primary} className="mr-3" />
          <Text className="flex-1 text-base font-medium text-text">Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center p-4 rounded-xl mb-2 bg-surface" onPress={() => openLink('https://riteshpal.dev/terms')}> 
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} className="mr-3" />
          <Text className="flex-1 text-base font-medium text-text">Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
        </TouchableOpacity>
      </View>

      <View className="p-6 items-center"> 
        <Text className="text-xs text-text opacity-50">© {new Date().getFullYear()} Ritesh Pal. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};
