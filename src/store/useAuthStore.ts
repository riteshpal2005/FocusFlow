import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './index';
import { initializeAuth, loginUser, logoutUser } from './authSlice';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);

    return {
        user,
        isLoading,
        initialize: () => dispatch(initializeAuth()),
        login: async (username: string) => { await dispatch(loginUser(username)).unwrap(); },
        logout: async () => { await dispatch(logoutUser()).unwrap(); }
    };
};
