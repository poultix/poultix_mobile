import { Stack } from 'expo-router';
import React from 'react';

export default function AnalyticsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="farm-analytics" />
            <Stack.Screen name="health-reports" />
        </Stack>
    );
}
