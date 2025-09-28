import { DrawerProvider } from '@/contexts/DrawerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import '../global.css';
import RootProvider from '@/contexts/RootProvider';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const currentUserId = await AsyncStorage.getItem('currentUserId');
        setIsAuthenticated(!!currentUserId);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return null; 
  }

  return (
    <RootProvider>
      <DrawerProvider>
        <StatusBar style="dark"  />
        <Stack screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="farmer" options={{ headerShown: false }} />
              <Stack.Screen name="farm" options={{ headerShown: false }} />
              <Stack.Screen name="pharmacies" options={{ headerShown: false }} />
              <Stack.Screen name="ai" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="news" options={{ headerShown: false }} />
              {/* New role-based dashboards */}
              <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
              <Stack.Screen name="farmer-dashboard" options={{ headerShown: false }} />
              <Stack.Screen name="veterinary-dashboard" options={{ headerShown: false }} />
              {/* Modal screens */}
              <Stack.Screen name="bluetooth-settings" options={{ presentation: 'modal' }} />
              <Stack.Screen name="bluetooth-result" options={{ presentation: 'modal' }} />
              <Stack.Screen name="bluetooth-pairing" options={{ presentation: 'modal' }} />
              <Stack.Screen name="ph-reader" options={{ presentation: 'modal' }} />
              <Stack.Screen name="network-error" options={{ presentation: 'modal' }} />
              <Stack.Screen name="veterinary" options={{ presentation: 'modal' }} />
              <Stack.Screen name="pharmacy" options={{ presentation: 'modal' }} />
              <Stack.Screen name="tester" options={{ presentation: 'modal' }} />
            </>
          ) : (
            <>
              {/* Auth screens */}
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </>
          )}
        </Stack>
      </DrawerProvider>
    </RootProvider>
  );
}
