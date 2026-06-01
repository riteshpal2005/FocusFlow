import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import { saveUser, getUser, clearAuthStorage } from '../utils/storageHelpers';

export interface User {
    id: string;
    username: string;
}

const userAtom = atom<User | null>(null);
const isLoadingAtom = atom<boolean>(true);

export const useAuth = () => {
    const [user, setUser] = useAtom(userAtom);
    const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

    const initialize = useCallback(async () => {
        setIsLoading(true);
        const savedUser = await getUser();
        setUser(savedUser);
        setIsLoading(false);
    }, [setUser, setIsLoading]);

    const login = useCallback(async (username: string) => {
        setIsLoading(true);
        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                const mockUser = { id: '1', username };
                await saveUser(mockUser);
                setUser(mockUser);
                setIsLoading(false);
                resolve();
            }, 1000);
        });
    }, [setUser, setIsLoading]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                await clearAuthStorage();
                setUser(null);
                setIsLoading(false);
                resolve();
            }, 1000);
        });
    }, [setUser, setIsLoading]);

    return {
        user,
        isLoading,
        initialize,
        login,
        logout
    };
};