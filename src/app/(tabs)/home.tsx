import React from 'react';
import { useRouter } from 'expo-router';
import { SwipeableScreen } from '../../shared/components/common/SwipeableScreen';
import { HomeFeature } from '../../features/habit';

export default function HomePage() {
  const router = useRouter();

  return (
    <SwipeableScreen
      entryDirection="left"
      onSwipeLeft={() => router.replace({ pathname: '/profile', params: { swipe: 'true' } })}
    >
      <HomeFeature />
    </SwipeableScreen>
  );
}
