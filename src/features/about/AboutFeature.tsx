import React, { useCallback } from 'react';
import { ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../../core/theme/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card } from '../../shared/components/ui/Card';
import { Heading, SubText, Label } from '../../shared/components/ui/Typography';

export const AboutFeature = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const openLink = useCallback(async (url: string) => {
    await Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  }, []);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 pt-[72px] pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Heading className="mb-0">About FocusFlow</Heading>
      </View>

      <Card padding="lg" className="mx-4 mb-6 items-center">
        <Heading className="text-[28px] mb-1">FocusFlow</Heading>
        <SubText className="mb-4 opacity-70">Version 1.0.0</SubText>
        <SubText className="text-center leading-6">FocusFlow is a minimal, effective habit tracker designed to help you build better routines and stay consistent.</SubText>
      </Card>

      <View className="mb-6 px-4">
        <Label className="pl-2 tracking-widest opacity-50">Developer</Label>
        <TouchableOpacity className="flex-row items-center p-4 rounded-xl mb-2 bg-surface" onPress={() => openLink('https://riteshpal.dev')}>
          <Ionicons name="globe-outline" size={20} color={colors.primary} className="mr-3" />
          <SubText className="flex-1 text-base font-medium text-text">riteshpal.dev</SubText>
          <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
        </TouchableOpacity>
      </View>

      <View className="mb-6 px-4">
        <Label className="pl-2 tracking-widest opacity-50">Legal</Label>
        <TouchableOpacity className="flex-row items-center p-4 rounded-xl mb-2 bg-surface border-b border-border" onPress={() => openLink('https://riteshpal.dev/privacy')}>
          <Ionicons name="document-text-outline" size={20} color={colors.primary} className="mr-3" />
          <SubText className="flex-1 text-base font-medium text-text">Privacy Policy</SubText>
          <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center p-4 rounded-xl mb-2 bg-surface" onPress={() => openLink('https://riteshpal.dev/terms')}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} className="mr-3" />
          <SubText className="flex-1 text-base font-medium text-text">Terms & Conditions</SubText>
          <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
        </TouchableOpacity>
      </View>

      <View className="p-6 items-center">
        <SubText className="text-xs opacity-50">© {new Date().getFullYear()} Ritesh Pal. All rights reserved.</SubText>
      </View>
    </ScrollView>
  );
};
