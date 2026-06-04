import React from 'react';
import { Text, ActivityIndicator, StyleSheet, Pressable, PressableProps } from 'react-native'; 
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../store/useThemeStore';

interface CustomButtonProps extends Omit<PressableProps, 'style'> {
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
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const backgroundColor = variant === 'primary' ? colors.primary : colors.surface;

    return (
        <Animated.View style={[animatedStyle, rest.disabled && { opacity: 0.5 }]}>
            <Pressable
                style={[styles.button, { backgroundColor: backgroundColor }]}
                onPressIn={(e) => {
                    scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
                    if (rest.onPressIn) rest.onPressIn(e);
                }}
                onPressOut={(e) => {
                    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
                    if (rest.onPressOut) rest.onPressOut(e);
                }}
                {...rest}
            >
                {isLoading ? (
                    <ActivityIndicator color={variant === 'primary' ? '#FFF' : colors.text} />
                ) : (
                    <Text style={[styles.text, { color: variant === 'primary' ? '#FFF' : colors.text }]}>
                        {title}
                    </Text>
                )}
            </Pressable> 
        </Animated.View>
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