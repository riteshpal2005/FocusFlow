import {
  collection,
  query,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getHabits, saveHabits, Habit } from "../../shared/utils/storageHelpers";

let isSyncing = false;
let syncTimeout: NodeJS.Timeout | null = null;

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
};
