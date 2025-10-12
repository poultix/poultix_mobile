import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function AccountSettingsScreen() {

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'You will be redirected to change your password.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          // Navigate to change password screen when implemented
          Alert.alert('Feature Coming Soon', 'Password change functionality will be available soon.');
        }}
      ]
    );
  };

  const handleTwoFactorAuth = () => {
    Alert.alert(
      'Two-Factor Authentication',
      'Enable two-factor authentication for enhanced security.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enable', onPress: () => {
          Alert.alert('Feature Coming Soon', '2FA setup will be available soon.');
        }}
      ]
    );
  };

  const handleConnectedAccounts = () => {
    Alert.alert(
      'Connected Accounts',
      'Manage your connected social media and third-party accounts.',
      [
        { text: 'OK', onPress: () => {
          Alert.alert('Feature Coming Soon', 'Account connections will be available soon.');
        }}
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Download a copy of your personal data and activity.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Feature Coming Soon', 'Data export functionality will be available soon.');
        }}
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert(
            'Confirm Deletion',
            'Are you absolutely sure? This cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Yes, Delete', style: 'destructive', onPress: () => {
                Alert.alert('Feature Coming Soon', 'Account deletion will be available soon.');
              }}
            ]
          );
        }}
      ]
    );
  };

  const accountOptions = [
    { title: 'Change Password', icon: 'lock-closed-outline', action: handleChangePassword },
    { title: 'Two-Factor Authentication', icon: 'shield-checkmark-outline', action: handleTwoFactorAuth },
    { title: 'Connected Accounts', icon: 'link-outline', action: handleConnectedAccounts },
    { title: 'Export Data', icon: 'download-outline', action: handleExportData },
    { title: 'Delete Account', icon: 'trash-outline', action: handleDeleteAccount, danger: true },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
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
    </View>
  );
}
