import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TextInputProps, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CustomButton } from '../../components/common/CustomButton';
import { CustomInput } from '../../components/common/CustomInput';

export const LoginScreen: React.FC = () => {
    const { login, isLoading } = useAuth();
    const { colors, theme, toggleTheme } = useTheme();

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

                <CustomButton
                    title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                    variant="secondary"
                    onPress={toggleTheme}
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