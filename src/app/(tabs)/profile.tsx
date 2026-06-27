import React from 'react';
import { useRouter } from 'expo-router';
import { SwipeableScreen } from '../../shared/components/common/SwipeableScreen';
import { ProfileFeature } from '../../features/profile';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <SwipeableScreen
      entryDirection="right"
      onSwipeRight={() => router.replace({ pathname: '/home', params: { swipe: 'true' } })}
    >
      <ProfileFeature />
    </SwipeableScreen>
  );
}
