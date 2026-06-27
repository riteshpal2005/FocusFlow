import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from '../firebase/config';

export interface User {
  id: string;
  username: string;
}

const userAtom = atom<User | null>(null);
const isLoadingAtom = atom<boolean>(true);

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const initialize = useCallback(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          username: firebaseUser.email?.split('@')[0] || 'user',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, [setUser, setIsLoading]);

  const login = useCallback(async (username: string, password?: string) => {
    setIsLoading(true);
    const email = username.includes('@') ? username : `${username}@focusflow.com`;
    const pwd = password || "Password123!";

    try {
      const credential = await signInWithEmailAndPassword(auth, email, pwd);
      setUser({
        id: credential.user.uid,
        username: credential.user.email?.split('@')[0] || 'user',
      });
    } catch (error: any) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-email'
      ) {
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, pwd);
          setUser({
            id: credential.user.uid,
            username: credential.user.email?.split('@')[0] || 'user',
          });
        } catch (regError: any) {
          console.error("Firebase auto-registration failed:", regError);
          throw regError;
        }
      } else {
        console.error("Firebase sign-in failed:", error);
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Firebase sign-out failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  return {
    user,
    isLoading,
    initialize,
    login,
    logout,
  };
};
