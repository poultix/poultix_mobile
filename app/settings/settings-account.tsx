import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountSettingsScreen() {
  const { logout } = useAuth();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  const accountOptions = [
    { title: 'Change Password', icon: 'lock-closed-outline', action: () => {} },
    { title: 'Two-Factor Authentication', icon: 'shield-checkmark-outline', action: () => {} },
    { title: 'Connected Accounts', icon: 'link-outline', action: () => {} },
    { title: 'Export Data', icon: 'download-outline', action: () => {} },
    { title: 'Delete Account', icon: 'trash-outline', action: handleDeleteAccount, danger: true },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`pb-4`}>
        <LinearGradient colors={['#10B981', '#059669']} style={tw`p-8`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>Account Settings</Text>
            <View style={tw`w-6`} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`bg-white rounded-2xl shadow-sm overflow-hidden mb-6`}>
          {accountOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[tw`flex-row items-center p-5`, index < accountOptions.length - 1 && tw`border-b border-gray-100`]}
              onPress={option.action}
            >
              <View style={tw`w-10 h-10 ${option.danger ? 'bg-red-100' : 'bg-gray-100'} rounded-full items-center justify-center mr-4`}>
                <Ionicons name={option.icon as any} size={20} color={option.danger ? '#EF4444' : '#6B7280'} />
              </View>
              <Text style={tw`flex-1 ${option.danger ? 'text-red-600' : 'text-gray-800'} font-medium`}>
                {option.title}
              </Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
