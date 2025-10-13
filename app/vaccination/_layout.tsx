import { Stack } from 'expo-router';
import React from 'react';

export default function VaccinationLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="detail" />
            <Stack.Screen name="schedule" />
            <Stack.Screen name="history" />
        </Stack>
    );
}
