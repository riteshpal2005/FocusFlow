import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../store/useAuthStore';
import { useTheme } from '../../store/useThemeStore';
import { CustomButton } from '../../components/common/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const ProfileScreen = () => {
    
    const { user, logout, isLoading: isLoggingOut } = useAuth();
    const { colors, theme, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.header, { color: colors.text }]}>Settings & Profile</Text>

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
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text style={styles.label}>Logged in as</Text>
                <Text style={[styles.username, { color: colors.text }]}>{user?.username}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, opacity: 0.5 }]}>App Info</Text>
                <CustomButton 
                    title='About FocusFlow'
                    variant='secondary'
                    onPress={() => navigation.navigate('About')}
                />
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, opacity: 0.5 }]}>Account</Text>
                <CustomButton 
                    title='Logout'
                    onPress={logout}
                    isLoading={isLoggingOut}
                />
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
    themeButton: {
        position: 'absolute',
        right: 24,
        zIndex: 1,
    },
});