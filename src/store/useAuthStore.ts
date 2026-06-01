import { create } from 'zustand';
import { saveUser, getUser, clearAuthStorage } from '../utils/storageHelpers';

interface User {
    id: string;
    username: string;
}

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    initialize: () => Promise<void>;
    login: (username: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
    user: null,
    isLoading: true,
    initialize: async () => {
        const savedUser = await getUser();
        if (savedUser) {
            set({ user: savedUser, isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },
    login: async (username: string) => {
        set({ isLoading: true });
        return new Promise((resolve) => {
            setTimeout(async () => {
                const mockUser = { id: '1', username: username };
                await saveUser(mockUser);
                set({ user: mockUser, isLoading: false });
                resolve();
            }, 1000);
        });
    },
    logout: async () => {
        set({ isLoading: true });
        return new Promise((resolve) => {
            setTimeout(async () => {
                await clearAuthStorage();
                set({ user: null, isLoading: false });
                resolve();
            }, 1000);
        });
    },
}));
