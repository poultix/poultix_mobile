import { Stack } from 'expo-router';
import React from 'react';

export default function ResourcesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="guidelines" />
            <Stack.Screen name="disease-info" />
        </Stack>
    );
}
