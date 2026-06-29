import { useState, useEffect, useCallback } from 'react';
import { getChecklistItems, saveChecklistItems, ChecklistItem } from '../../../shared/utils/storageHelpers';
import { useAuth } from '../../../core/auth/useAuthStore';
import { SyncService } from '../../../core/services/syncService';

export const useChecklistStorage = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    const savedItems = await getChecklistItems();
    setChecklistItems(savedItems.filter((item) => item.sync_status !== 'deleted'));
    setIsLoading(false);

    if (user) {
      await SyncService.syncChecklistAll(user.id, (updatedItems) => {
        setChecklistItems(updatedItems.filter((item) => item.sync_status !== 'deleted'));
      });
    }
  }, [user]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const addChecklistItem = async (name: string) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      name,
      isChecked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sync_status: user ? 'pending' : 'synced',
    };

    const currentItems = await getChecklistItems();
    const updatedItems = [...currentItems, newItem];
    await saveChecklistItems(updatedItems);
    setChecklistItems(updatedItems.filter((item) => item.sync_status !== 'deleted'));

    if (user) {
      SyncService.scheduleChecklistPush(user.id, (updated) => {
        setChecklistItems(updated.filter((item) => item.sync_status !== 'deleted'));
      });
    }
  };

  const toggleChecklistItem = async (id: string) => {
    const currentItems = await getChecklistItems();
    const updatedItems = currentItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isChecked: !item.isChecked,
          updatedAt: Date.now(),
          sync_status: user ? ('pending' as const) : ('synced' as const),
        };
      }
      return item;
    });

    await saveChecklistItems(updatedItems);
    setChecklistItems(updatedItems.filter((item) => item.sync_status !== 'deleted'));

    if (user) {
      SyncService.scheduleChecklistPush(user.id, (updated) => {
        setChecklistItems(updated.filter((item) => item.sync_status !== 'deleted'));
      });
    }
  };

  const deleteChecklistItem = async (id: string) => {
    const currentItems = await getChecklistItems();
    let updatedItems: ChecklistItem[] = [];

    if (user) {
      updatedItems = currentItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            sync_status: 'deleted' as const,
            updatedAt: Date.now(),
          };
        }
        return item;
      });
    } else {
      updatedItems = currentItems.filter((item) => item.id !== id);
    }

    await saveChecklistItems(updatedItems);
    setChecklistItems(updatedItems.filter((item) => item.sync_status !== 'deleted'));

    if (user) {
      SyncService.scheduleChecklistPush(user.id, (updated) => {
        setChecklistItems(updated.filter((item) => item.sync_status !== 'deleted'));
      });
    }
  };

  const resetChecklist = async () => {
    const currentItems = await getChecklistItems();
    const updatedItems = currentItems.map((item) => {
      if (item.isChecked) {
        return {
          ...item,
          isChecked: false,
          updatedAt: Date.now(),
          sync_status: user ? ('pending' as const) : ('synced' as const),
        };
      }
      return item;
    });

    await saveChecklistItems(updatedItems);
    setChecklistItems(updatedItems.filter((item) => item.sync_status !== 'deleted'));

    if (user) {
      SyncService.scheduleChecklistPush(user.id, (updated) => {
        setChecklistItems(updated.filter((item) => item.sync_status !== 'deleted'));
      });
    }
  };

  const refreshChecklist = async () => {
    const savedItems = await getChecklistItems();
    setChecklistItems(savedItems.filter((item) => item.sync_status !== 'deleted'));
  };

  return {
    checklistItems,
    isLoading,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    resetChecklist,
    refreshChecklist,
  };
};
