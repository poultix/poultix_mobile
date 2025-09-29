import { DrawerProvider } from '@/contexts/DrawerContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { RootProvider } from '@/contexts/RootProvider';

export default function RootLayout() {
  return (
    <RootProvider>
      <DrawerProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </DrawerProvider>
    </RootProvider>
  );
}
