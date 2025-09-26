import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useApp } from '@/contexts/AppContext';

export default function Index() {
  const { state } = useApp();

  useEffect(() => {
    // Redirect based on authentication status and user role
    if (state.currentUser) {
      switch (state.currentUser.role) {
        case 'admin':
          router.replace('/dashboard/admin-dashboard');
          break;
        case 'farmer':
          router.replace('/dashboard/farmer-dashboard');
          break;
        case 'veterinary':
          router.replace('/dashboard/veterinary-dashboard');
          break;
        default:
          router.replace('/auth/sign-in');
      }
    } else if (!state.isLoading) {
      router.replace('/auth/sign-in');
    }
  }, [state.currentUser, state.isLoading]);

  // Show loading screen while checking authentication
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={tw`text-gray-600 mt-4`}>Loading...</Text>
    </View>
  );
}
