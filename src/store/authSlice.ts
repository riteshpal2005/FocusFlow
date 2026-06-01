import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveUser, getUser, clearAuthStorage } from '../utils/storageHelpers';

export interface User {
    id: string;
    username: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: true,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
    const savedUser = await getUser();
    return savedUser;
});

export const loginUser = createAsyncThunk('auth/login', async (username: string) => {
    return new Promise<User>((resolve) => {
        setTimeout(async () => {
            const mockUser = { id: '1', username };
            await saveUser(mockUser);
            resolve(mockUser);
        }, 1000);
    });
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    return new Promise<void>((resolve) => {
        setTimeout(async () => {
            await clearAuthStorage();
            resolve();
        }, 1000);
    });
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.user = action.payload || null;
                state.isLoading = false;
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isLoading = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default authSlice.reducer;
