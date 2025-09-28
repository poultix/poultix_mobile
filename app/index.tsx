import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import tw from 'twrnc';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { currentUser, loading } = useAuth();
  const rootNavigationState = useRootNavigationState();
  useEffect(() => {
    if (!rootNavigationState?.key) return; // wait until navigation is ready

    if (currentUser) {
      switch (currentUser.role) {
        case 'ADMIN':
          router.replace('/dashboard/admin-dashboard');
          break;
        case 'FARMER':
          router.replace('/dashboard/farmer-dashboard');
          break;
        case 'VETERINARY':
          router.replace('/dashboard/veterinary-dashboard');
          break;
        default:
          router.replace('/auth/login');
      }
    } else if (!loading) {
      router.replace('/auth/login');
    }
  }, [currentUser, loading, rootNavigationState?.key]);

  // Show loading screen while checking authentication
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={tw`text-gray-600 mt-4`}>Loading...</Text>
    </View>
  );
}
