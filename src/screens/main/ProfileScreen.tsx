import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CustomButton } from '../../components/common/CustomButton';

export const ProfileScreen = () => {
    
    const { user, logout, isLoading: isLoggingOut } = useAuth();
    const { colors, theme, toggleTheme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.header, { color: colors.text }]}>Settings & Profile</Text>

            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text style={styles.label}>Logged in as</Text>
                <Text style={[styles.username, { color: colors.text }]}>{user?.username}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
                <CustomButton 
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    variant='secondary'
                    onPress={toggleTheme}
                />
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, opacity: 0.5 }]}>Account</Text>
                <CustomButton 
                    title='Logout'
                    onPress={logout}
                    isLoading={isLoggingOut}
                />
                {/* TODO: Render a CustomButton to log out. */}
                {/* Hint: Pass the logout function to onPress. Pass your aliased isLoggingOut variable to isLoading so the spinner works! */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 60 },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
    card: { padding: 20, borderRadius: 12, marginBottom: 24 },
    label: { fontSize: 14, color: 'gray', marginBottom: 4 },
    username: { fontSize: 20, fontWeight: '600' },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, paddingLeft: 4 },
});