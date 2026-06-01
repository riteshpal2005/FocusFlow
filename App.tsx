import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './src/store';
import { initializeAuth } from './src/store/authSlice';
import { initializeTheme } from './src/store/themeSlice';
import { RootNavigator } from './src/navigation/RootNavigator';

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeTheme());
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}