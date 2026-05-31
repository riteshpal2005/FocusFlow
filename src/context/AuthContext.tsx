import React, { createContext, useState, useMemo, useEffect } from 'react';
import { saveUser, getUser, clearAuthStorage } from '../utils/storageHelpers';

interface User {
    id: string;
    username: string;
}

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (username: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            const savedUser = await getUser();
            if (savedUser) {
                setUser(savedUser);
            }
            setIsLoading(false);
        };
        loadSession();
    }, []);

    const login = async (username: string): Promise<void> => {
        setIsLoading(true);
        return new Promise((resolve) => {
            setTimeout(async () => {
                const mockUser = { id: '1', username: username };
                await saveUser(mockUser);
                setUser(mockUser);
                setIsLoading(false);
                resolve();
            }, 1000);
        });
    };

    const logout = async (): Promise<void> => {
        setIsLoading(true);
        return new Promise((resolve) => {
            setTimeout(async () => {
                setUser(null);
                await clearAuthStorage();
                setIsLoading(false); 
                resolve(); 
            }, 1000);
        });
    };
    
    const value = useMemo(() => ({
        user,
        isLoading,
        login,
        logout,
    }), [user, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};