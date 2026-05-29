import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { useAuth } from "../context/AuthContext";

import { AuthStack } from "./AuthStack";
import { MainTabs } from "./MainTabs";
import { HabitDetailScreen } from "../screens/main/HabitDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Auth" component={AuthStack} />
                    </>
                )}
            </Stack.Navigator>
        );
};