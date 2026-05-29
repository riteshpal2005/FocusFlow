import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native'; 
import { useTheme } from '../../context/ThemeContext';

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
};

export const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    variant = 'primary',
    isLoading = false,
    ...rest

}) => {
    const { colors } = useTheme();

    const backgroundColor = variant === 'primary' ? colors.primary : colors.surface;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button, { backgroundColor: backgroundColor }, rest.disabled && { opacity: 0.5 }

            ]}
            {...rest}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? '#FFF' : colors.text} />
            ) : (
                <Text style={[styles.text, { color: variant === 'primary' ? '#FFF' : colors.text }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity> 
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    }
});