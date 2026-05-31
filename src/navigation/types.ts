import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    Login: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    
    Auth: undefined;

    Main: undefined;

    HabitDetail: { habitId: string };

    About: undefined;
};

export type HabitDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'HabitDetail'>;