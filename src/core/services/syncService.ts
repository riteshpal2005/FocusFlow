import { Habit, ChecklistItem } from "../../shared/utils/storageHelpers";

export const SyncService = {
  async pullFromFirebase(userId: string, onUpdate: (habits: Habit[]) => void) {
  },

  schedulePush(userId: string, onUpdate: (habits: Habit[]) => void) {
  },

  async pushToFirebase(userId: string, onUpdate: (habits: Habit[]) => void) {
  },

  async syncAll(userId: string, onUpdate: (habits: Habit[]) => void) {
  },

  async pullChecklistFromFirebase(userId: string, onUpdate: (items: ChecklistItem[]) => void) {
  },

  scheduleChecklistPush(userId: string, onUpdate: (items: ChecklistItem[]) => void) {
  },

  async pushChecklistToFirebase(userId: string, onUpdate: (items: ChecklistItem[]) => void) {
  },

  async syncChecklistAll(userId: string, onUpdate: (items: ChecklistItem[]) => void) {
  },
};
