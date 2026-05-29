import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
    label,
    error,
    ...rest
}) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = error ? '#EF4444' : isFocused ? colors.primary : colors.border;

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}
            <TextInput 
                style={[styles.input, { backgroundColor: colors.surface, borderColor: borderColor, color: colors.text }]}
                placeholderTextColor={'gray'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...rest}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
    }
});