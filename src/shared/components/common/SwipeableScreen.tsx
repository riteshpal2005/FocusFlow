import React, { useEffect, useRef } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

interface SwipeableScreenProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  entryDirection?: 'left' | 'right';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2;
const ENTRY_OFFSET = 80;

export const SwipeableScreen: React.FC<SwipeableScreenProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  entryDirection,
}) => {
  const translateX = useSharedValue(0);
  const isFocused = useIsFocused();
  const { swipe } = useLocalSearchParams<{ swipe?: string }>();
  const animatedOnce = useRef(false);

  useEffect(() => {
    if (isFocused) {
      if (swipe === 'true' && entryDirection && !animatedOnce.current) {
        translateX.value = entryDirection === 'right' ? ENTRY_OFFSET : -ENTRY_OFFSET;
        translateX.value = withTiming(0, { duration: 150, easing: Easing.out(Easing.ease) });
        animatedOnce.current = true;
      } else {
        translateX.value = 0;
      }
    } else {
      animatedOnce.current = false;
    }
  }, [isFocused, swipe, entryDirection, translateX]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if ((e.translationX < 0 && onSwipeLeft) || (e.translationX > 0 && onSwipeRight)) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD && onSwipeLeft) {
        const target = Math.min(e.translationX - 40, -ENTRY_OFFSET);
        translateX.value = withTiming(target, { duration: 100, easing: Easing.out(Easing.ease) }, () => {
          runOnJS(onSwipeLeft)();
        });
      } else if (e.translationX > SWIPE_THRESHOLD && onSwipeRight) {
        const target = Math.max(e.translationX + 40, ENTRY_OFFSET);
        translateX.value = withTiming(target, { duration: 100, easing: Easing.out(Easing.ease) }, () => {
          runOnJS(onSwipeRight)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  return (
    <View className="flex-1 bg-background">
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle} className="flex-1 bg-background">
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
