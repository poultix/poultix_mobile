import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ScheduleLayout() {
    return (
    <>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
    </>)
}