import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';

export const CustomSplashScreen = () => {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.95, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, [scale, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <View className="flex-1 justify-center items-center bg-background">
            <Animated.View 
                style={animatedStyle}
                className="w-[100px] h-[100px] rounded-full justify-center items-center border-4 border-primary bg-surface shadow-lg shadow-black/30 elevation-10"
            >
                <Text className="text-[36px] font-black text-primary">FF</Text>
            </Animated.View>
        </View>
    );
};
