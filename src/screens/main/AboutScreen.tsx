import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export const AboutScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();

    const openLink = (url: string) => {
        Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.header, { color: colors.text }]}>About FocusFlow</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text style={[styles.title, { color: colors.text }]}>FocusFlow</Text>
                <Text style={[styles.version, { color: colors.text, opacity: 0.7 }]}>Version 1.0.0</Text>
                <Text style={[styles.description, { color: colors.text }]}>
                    FocusFlow is a minimal, effective habit tracker designed to help you build better routines and stay consistent.
                </Text>
            </View>

            <View style={[styles.linksSection]}>
                <Text style={[styles.sectionTitle, { color: colors.text, opacity: 0.5 }]}>Developer</Text>
                
                <TouchableOpacity 
                    style={[styles.linkRow, { backgroundColor: colors.surface }]}
                    onPress={() => openLink('https://riteshpal.dev')}
                >
                    <Ionicons name="globe-outline" size={20} color={colors.primary} style={styles.linkIcon} />
                    <Text style={[styles.linkText, { color: colors.text }]}>riteshpal.dev</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
                </TouchableOpacity>
            </View>

            <View style={[styles.linksSection]}>
                <Text style={[styles.sectionTitle, { color: colors.text, opacity: 0.5 }]}>Legal</Text>
                
                <TouchableOpacity 
                    style={[styles.linkRow, { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border || '#333' }]}
                    onPress={() => openLink('https://riteshpal.dev/privacy')}
                >
                    <Ionicons name="document-text-outline" size={20} color={colors.primary} style={styles.linkIcon} />
                    <Text style={[styles.linkText, { color: colors.text }]}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.linkRow, { backgroundColor: colors.surface }]}
                    onPress={() => openLink('https://riteshpal.dev/terms')}
                >
                    <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} style={styles.linkIcon} />
                    <Text style={[styles.linkText, { color: colors.text }]}>Terms & Conditions</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
                </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.text, opacity: 0.5 }]}>
                    © {new Date().getFullYear()} Ritesh Pal. All rights reserved.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 24 },
    backButton: { marginRight: 16 },
    header: { fontSize: 24, fontWeight: 'bold' },
    card: { padding: 24, marginHorizontal: 16, borderRadius: 16, marginBottom: 24, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
    version: { fontSize: 14, marginBottom: 16 },
    description: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
    linksSection: { marginBottom: 24, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, paddingLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
    linkRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8 },
    linkIcon: { marginRight: 12 },
    linkText: { flex: 1, fontSize: 16, fontWeight: '500' },
    footer: { padding: 24, alignItems: 'center' },
    footerText: { fontSize: 12 },
});