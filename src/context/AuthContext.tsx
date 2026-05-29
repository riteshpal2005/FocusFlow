import React, { createContext, useState, useMemo } from 'react';

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
    const [isLoading, setIsLoading] = useState(false);
    const login = async (username: string): Promise<void> => {
        setIsLoading(true);

        return new Promise((resolve) => {
            setTimeout(() => {
                setUser({ id: '1', username: username });
                setIsLoading(false);
                resolve();
            }, 1000);
        });
    };
    const logout = async (): Promise<void> => {
    setIsLoading(true); // 1. Turn on spinner

    return new Promise((resolve) => {
        setTimeout(() => {
            setUser(null); // 2. Clear the user state
            setIsLoading(false); // 3. Turn off spinner
            resolve(); // 4. Tell the app the logout is complete
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