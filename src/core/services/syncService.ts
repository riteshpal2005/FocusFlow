import {
  collection,
  query,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getHabits, saveHabits, Habit, getChecklistItems, saveChecklistItems, ChecklistItem } from "../../shared/utils/storageHelpers";

let isSyncing = false;
let syncTimeout: NodeJS.Timeout | null = null;
let isChecklistSyncing = false;
let checklistSyncTimeout: NodeJS.Timeout | null = null;

export const SyncService = {
  async pullFromFirebase(userId: string, onUpdate: (habits: Habit[]) => void) {
    if (isSyncing) return;
    isSyncing = true;

    try {
      const userRef = doc(db, "users", userId);
      const habitsColRef = collection(userRef, "habits");
      const q = query(habitsColRef);
      const snapshot = await getDocs(q);

      const remoteHabits: Habit[] = [];
      snapshot.forEach((document) => {
        const data = document.data();
        remoteHabits.push({
          id: document.id,
          name: data.name,
          streak: data.streak,
          completedToday: data.completedToday,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt || data.createdAt,
          sync_status: "synced",
        });
      });

      const localHabits = await getHabits();
      const mergedHabits: Habit[] = [...localHabits];

      for (const remote of remoteHabits) {
        const localIndex = mergedHabits.findIndex((h) => h.id === remote.id);
        if (localIndex === -1) {
          mergedHabits.push(remote);
        } else {
          const local = mergedHabits[localIndex];
          if (local.sync_status !== "pending" && local.sync_status !== "deleted") {
            const localUpdate = local.updatedAt || 0;
            const remoteUpdate = remote.updatedAt || 0;
            if (remoteUpdate > localUpdate) {
              mergedHabits[localIndex] = remote;
            }
          }
        }
      }

      const finalLocalHabits: Habit[] = [];
      for (const local of mergedHabits) {
        if (local.sync_status === "deleted") {
          continue;
        }
        const existsRemote = remoteHabits.some((r) => r.id === local.id);
        if (!existsRemote && local.sync_status === "synced") {
          continue;
        }
        finalLocalHabits.push(local);
      }

      await saveHabits(finalLocalHabits);
      onUpdate(finalLocalHabits);
    } catch (error) {
      console.error("[SyncService] Pull Failed:", error);
    } finally {
      isSyncing = false;
    }
  },

  schedulePush(userId: string, onUpdate: (habits: Habit[]) => void) {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(async () => {
      await this.pushToFirebase(userId, onUpdate);
    }, 3000);
  },

  async pushToFirebase(userId: string, onUpdate: (habits: Habit[]) => void) {
    if (isSyncing) return;
    isSyncing = true;

    try {
      const localHabits = await getHabits();
      const pendingHabits = localHabits.filter(
        (h) => h.sync_status === "pending" || h.sync_status === "deleted"
      );

      if (pendingHabits.length === 0) {
        isSyncing = false;
        return;
      }

      const batch = writeBatch(db);
      const userRef = doc(db, "users", userId);
      const habitsColRef = collection(userRef, "habits");

      for (const habit of pendingHabits) {
        const docRef = doc(habitsColRef, habit.id);
        if (habit.sync_status === "deleted") {
          batch.delete(docRef);
        } else {
          const { sync_status, ...remoteData } = habit;
          batch.set(docRef, remoteData, { merge: true });
        }
      }

      await batch.commit();

      const refreshedLocalHabits = await getHabits();
      const updatedLocalHabits = refreshedLocalHabits
        .map((h) => {
          const matched = pendingHabits.find((p) => p.id === h.id);
          if (matched) {
            if (matched.sync_status === "deleted") {
              return null;
            }
            return { ...h, sync_status: "synced" as const };
          }
          return h;
        })
        .filter((h): h is Habit => h !== null);

      await saveHabits(updatedLocalHabits);
      onUpdate(updatedLocalHabits);
    } catch (error) {
      console.error("[SyncService] Push Failed:", error);
    } finally {
      isSyncing = false;
    }
  },

  async syncAll(userId: string, onUpdate: (habits: Habit[]) => void) {
    await this.pushToFirebase(userId, onUpdate);
    await this.pullFromFirebase(userId, onUpdate);
  },

  async pullChecklistFromFirebase(userId: string, onUpdate: (items: ChecklistItem[]) => void) {
    if (isChecklistSyncing) return;
    isChecklistSyncing = true;

    try {
      const userRef = doc(db, "users", userId);
      const checklistColRef = collection(userRef, "checklist");
      const q = query(checklistColRef);
      const snapshot = await getDocs(q);

      const remoteItems: ChecklistItem[] = [];
      snapshot.forEach((document) => {
        const data = document.data();
        remoteItems.push({
          id: document.id,
          name: data.name,
          isChecked: data.isChecked,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt || data.createdAt,
          sync_status: "synced",
        });
      });

      const localItems = await getChecklistItems();
      const mergedItems: ChecklistItem[] = [...localItems];

      for (const remote of remoteItems) {
        const localIndex = mergedItems.findIndex((h) => h.id === remote.id);
        if (localIndex === -1) {
          mergedItems.push(remote);
        } else {
          const local = mergedItems[localIndex];
          if (local.sync_status !== "pending" && local.sync_status !== "deleted") {
            const localUpdate = local.updatedAt || 0;
            const remoteUpdate = remote.updatedAt || 0;
            if (remoteUpdate > localUpdate) {
              mergedItems[localIndex] = remote;
            }
          }
        }
      }

      const finalLocalItems: ChecklistItem[] = [];
      for (const local of mergedItems) {
        if (local.sync_status === "deleted") {
          continue;
        }
        const existsRemote = remoteItems.some((r) => r.id === local.id);
        if (!existsRemote && local.sync_status === "synced") {
          continue;
        }
        finalLocalItems.push(local);
      }

      await saveChecklistItems(finalLocalItems);
      onUpdate(finalLocalItems);
    } catch (error) {
      console.error("[SyncService] Checklist Pull Failed:", error);
    } finally {
      isChecklistSyncing = false;
    }
  },

  scheduleChecklistPush(userId: string, onUpdate: (items: ChecklistItem[]) => void) {
    if (checklistSyncTimeout) {
      clearTimeout(checklistSyncTimeout);
    }

    checklistSyncTimeout = setTimeout(async () => {
      await this.pushChecklistToFirebase(userId, onUpdate);
    }, 3000);
  },

  async pushChecklistToFirebase(userId: string, onUpdate: (items: ChecklistItem[]) => void) {
    if (isChecklistSyncing) return;
    isChecklistSyncing = true;

    try {
      const localItems = await getChecklistItems();
      const pendingItems = localItems.filter(
        (h) => h.sync_status === "pending" || h.sync_status === "deleted"
      );

      if (pendingItems.length === 0) {
        isChecklistSyncing = false;
        return;
      }

      const batch = writeBatch(db);
      const userRef = doc(db, "users", userId);
      const checklistColRef = collection(userRef, "checklist");

      for (const item of pendingItems) {
        const docRef = doc(checklistColRef, item.id);
        if (item.sync_status === "deleted") {
          batch.delete(docRef);
        } else {
          const { sync_status, ...remoteData } = item;
          batch.set(docRef, remoteData, { merge: true });
        }
      }

      await batch.commit();

      const refreshedLocalItems = await getChecklistItems();
      const updatedLocalItems = refreshedLocalItems
        .map((h) => {
          const matched = pendingItems.find((p) => p.id === h.id);
          if (matched) {
            if (matched.sync_status === "deleted") {
              return null;
            }
            return { ...h, sync_status: "synced" as const };
          }
          return h;
        })
        .filter((h): h is ChecklistItem => h !== null);

      await saveChecklistItems(updatedLocalItems);
      onUpdate(updatedLocalItems);
    } catch (error) {
      console.error("[SyncService] Checklist Push Failed:", error);
    } finally {
      isChecklistSyncing = false;
    }
  },

  async syncChecklistAll(userId: string, onUpdate: (items: ChecklistItem[]) => void) {
    await this.pushChecklistToFirebase(userId, onUpdate);
    await this.pullChecklistFromFirebase(userId, onUpdate);
  },
};
