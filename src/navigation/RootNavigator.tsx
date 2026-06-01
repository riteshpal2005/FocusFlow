import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { useAuth } from "../store/useAuthStore";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../store/useThemeStore";
import { AuthStack } from "./AuthStack";
import { MainTabs } from "./MainTabs";
import { HabitDetailScreen } from "../screens/main/HabitDetailScreen";
import { AboutScreen } from "../screens/main/AboutScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const { user, isLoading } = useAuth();
    const { theme } = useTheme();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
                        <Stack.Screen name="About" component={AboutScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Auth" component={AuthStack} />
                    </>
                )}
            </Stack.Navigator>
        </>
    );
};