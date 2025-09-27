import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    // Redirect based on authentication status and user role
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
          router.replace('/auth/sign-in');
      }
    } else if (!isLoading) {
      router.replace('/auth/sign-in');
    }
  }, [currentUser, isLoading]);

  // Show loading screen while checking authentication
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={tw`text-gray-600 mt-4`}>Loading...</Text>
    </View>
  );
}
