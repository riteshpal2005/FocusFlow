import React from 'react';
import { Text, ActivityIndicator, Pressable, PressableProps } from 'react-native'; 
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../store/useThemeStore';

interface CustomButtonProps extends Omit<PressableProps, 'style'> {
    title: string;
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
}

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

    const buttonClass = `h-[50px] rounded-lg justify-center items-center my-2 ${
        variant === 'primary' ? 'bg-primary' : 'bg-surface'
    }`;

    const textClass = `text-base font-semibold ${
        variant === 'primary' ? 'text-white' : 'text-text'
    }`;

    return (
        <Animated.View style={animatedStyle} className={rest.disabled ? 'opacity-50' : ''}>
            <Pressable
                className={buttonClass}
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
                    <Text className={textClass}>
                        {title}
                    </Text>
                )}
            </Pressable> 
        </Animated.View>
    );
};