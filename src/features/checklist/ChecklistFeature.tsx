import React, { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft, LinearTransition, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../core/theme/useThemeStore';
import { useChecklistStorage } from './hooks/useChecklistStorage';
import { FAB } from '../../shared/components/ui/FAB';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';
import { Input } from '../../shared/components/ui/Input';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { triggerHaptic } from '../../shared/utils/haptics';
import { ChecklistItem } from '../../shared/utils/storageHelpers';

const FlashListElement = FlashList as any;

const ChecklistItemCard: React.FC<{
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}> = React.memo(({ item, onToggle, onDeleteRequest }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (item.isChecked) {
      scale.value = withSequence(withSpring(1.2), withSpring(1));
    } else {
      scale.value = withSequence(withSpring(0.8), withSpring(1));
    }
  }, [item.isChecked, scale]);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handleToggle = () => {
    triggerHaptic.light();
    onToggle(item.id);
  };

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      layout={LinearTransition.springify()}
    >
      <Card padding="md" className="flex-row items-center my-1.5 shadow-sm shadow-black/5 elevation-2">
        <TouchableOpacity
          activeOpacity={0.4}
          className="pr-3"
          onPress={handleToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Animated.View style={checkmarkStyle}>
            {item.isChecked ? (
              <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
            ) : (
              <Ionicons name="ellipse-outline" size={28} color="gray" />
            )}
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1"
          onPress={handleToggle}
        >
          <Text className={`text-lg font-semibold text-text ${item.isChecked ? 'line-through opacity-50' : ''}`}>
            {item.name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.4}
          className="pl-3"
          onPress={() => onDeleteRequest(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={22} color={colors.statusDanger} />
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );
});

export const ChecklistFeature = () => {
  const { colors } = useTheme();
  const {
    checklistItems,
    isLoading,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    resetChecklist,
    refreshChecklist,
  } = useChecklistStorage();

  const [newItemName, setNewItemName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      refreshChecklist();
    }, [refreshChecklist])
  );

  const handleAddItem = useCallback(() => {
    if (newItemName.trim() === '') return;
    addChecklistItem(newItemName.trim());
    setNewItemName('');
    setIsModalVisible(false);
  }, [addChecklistItem, newItemName]);

  const handleResetChecklist = useCallback(() => {
    triggerHaptic.success();
    resetChecklist();
  }, [resetChecklist]);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteItemId) {
      triggerHaptic.light();
      deleteChecklistItem(deleteItemId);
      setDeleteItemId(null);
    }
  }, [deleteChecklistItem, deleteItemId]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const hasCheckedItems = checklistItems.some(item => item.isChecked);

  return (
    <Animated.View entering={FadeIn.duration(250)} className="flex-1 px-4 pt-[60px] bg-background">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-[28px] font-bold text-text">Outgoing Checklist</Text>
        {hasCheckedItems && (
          <TouchableOpacity
            onPress={handleResetChecklist}
            className="flex-row items-center px-3 py-2 rounded-full bg-surface border border-border"
          >
            <Ionicons name="refresh-outline" size={16} color={colors.primary} />
            <Text className="ml-1 text-xs font-semibold text-primary">Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlashListElement
        data={checklistItems}
        keyExtractor={(item: ChecklistItem) => item.id}
        renderItem={({ item }: { item: ChecklistItem }) => (
          <ChecklistItemCard
            item={item}
            onToggle={toggleChecklistItem}
            onDeleteRequest={setDeleteItemId}
          />
        )}
        estimatedItemSize={64}
        contentContainerClassName="pb-[100px]"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center mt-20 px-8">
            <Ionicons name="briefcase-outline" size={64} color="gray" className="opacity-40 mb-4" />
            <Text className="text-center opacity-50 text-text text-lg font-semibold mb-2">No items listed</Text>
            <Text className="text-center opacity-40 text-text text-sm">Add items you want to take with you (keys, wallet, phone, etc.) when leaving the house.</Text>
          </View>
        }
      />

      <FAB
        icon={<Ionicons name="add" size={30} color="#FFFFFF" />}
        onPress={() => setIsModalVisible(true)}
        className="w-14 h-14"
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setIsModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full"
          >
            <Pressable className="rounded-t-[20px] px-5 pt-6 pb-10 bg-surface shadow-2xl shadow-black/10 elevation-10" onPress={(e) => e.stopPropagation()}>
              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-xl font-bold text-text">Add Item to Pack</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Input
                placeholder="Item name (e.g. Keys, Wallet)"
                value={newItemName}
                onChangeText={setNewItemName}
                onSubmitEditing={handleAddItem}
                autoFocus
              />
              <Button
                title="Add to List"
                onPress={handleAddItem}
                disabled={newItemName.trim() === ''}
              />
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <DeleteConfirmationModal
        visible={deleteItemId !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItemId(null)}
        title="Delete Item"
        message="Are you sure you want to delete this checklist item? This action cannot be undone."
      />
    </Animated.View>
  );
};
