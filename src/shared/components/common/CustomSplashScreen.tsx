import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';

interface CustomSplashScreenProps {
    isLoading: boolean;
    onAnimationComplete: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ isLoading, onAnimationComplete }) => {
    const scale = useSharedValue(0.3);
    const opacity = useSharedValue(0);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    useEffect(() => {
        scale.value = withTiming(1.0, { duration: 400, easing: Easing.out(Easing.back(1.5)) });
        opacity.value = withTiming(1.0, { duration: 400 });

        const timer = setTimeout(() => {
            setMinTimeElapsed(true);
        }, 900);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (minTimeElapsed && !isLoading) {
            scale.value = withTiming(0.0, { duration: 300, easing: Easing.in(Easing.back(1.2)) });
            opacity.value = withTiming(0.0, { duration: 300 }, (finished) => {
                if (finished) {
                    runOnJS(onAnimationComplete)();
                }
            });
        }
    }, [minTimeElapsed, isLoading, onAnimationComplete]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <View className="flex-1 justify-center items-center bg-background">
            <Animated.View 
                style={animatedStyle}
                className="w-[120px] h-[120px] rounded-full justify-center items-center border-4 border-primary bg-surface shadow-lg shadow-black/30 elevation-10"
            >
                <Text className="text-[42px] font-black text-primary">FF</Text>
            </Animated.View>
        </View>
    );
};
