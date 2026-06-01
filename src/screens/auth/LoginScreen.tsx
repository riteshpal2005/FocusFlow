import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TextInputProps, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useAuth } from '../../store/useAuthStore';
import { useTheme } from '../../store/useThemeStore';
import { CustomButton } from '../../components/common/CustomButton';
import { CustomInput } from '../../components/common/CustomInput';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const LoginScreen: React.FC = () => {
    const { login, isLoading } = useAuth();
    const { colors, theme, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) return;
        await login(username);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >

            <TouchableOpacity 
            onPress={toggleTheme}
            style={[styles.themeButton, { top: insets.top + 16 }]}
        >
            <Ionicons 
                name={theme === 'light' ? 'moon' : 'sunny'} 
                size={24} 
                color={colors.text} 
            />
        </TouchableOpacity>

            <View style={styles.formContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Welcome to FocusFlow
                </Text>

                <CustomInput 
                    label="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <CustomInput 
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry
                />

                <CustomButton
                    title="Sign In"
                    onPress={handleLogin}
                    isLoading={isLoading}
                    disabled={!username || !password}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    themeButton: {
        position: 'absolute',
        right: 24,
        zIndex: 1, // Ensures it stays clickable above other elements
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    }
});