import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

export interface User {
  id: string;
  username: string;
}

const userAtom = atom<User | null>({
  id: 'local_user',
  username: 'Local User',
});
const isLoadingAtom = atom<boolean>(false);

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const initialize = useCallback(() => {
    setIsLoading(false);
    return () => {};
  }, [setIsLoading]);

  const login = useCallback(async (username: string, password?: string) => {
    setIsLoading(true);
    setUser({
      id: 'local_user',
      username: username || 'Local User',
    });
    setIsLoading(false);
  }, [setUser, setIsLoading]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setUser(null);
    setIsLoading(false);
  }, [setUser, setIsLoading]);

  return {
    user,
    isLoading,
    initialize,
    login,
    logout,
  };
};
