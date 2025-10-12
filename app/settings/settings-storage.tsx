import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function StorageSettingsScreen() {
  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary files and cached data. Your personal data will remain safe.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          Alert.alert('Success', 'Cache cleared successfully! (234 MB freed)');
        }}
      ]
    );
  };

  const handleOfflineData = () => {
    Alert.alert(
      'Offline Data',
      'Manage data stored for offline access.',
      [
        { text: 'OK', onPress: () => {
          Alert.alert('Feature Coming Soon', 'Offline data management will be available soon.');
        }}
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Create a backup of your farm data and settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Feature Coming Soon', 'Data export functionality will be available soon.');
        }}
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Restore your data from a previous backup.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Import', onPress: () => {
          Alert.alert('Feature Coming Soon', 'Data import functionality will be available soon.');
        }}
      ]
    );
  };

  const storageOptions = [
    { title: 'Clear Cache', subtitle: '234 MB', icon: 'trash-outline', action: handleClearCache },
    { title: 'Offline Data', subtitle: '1.2 GB', icon: 'download-outline', action: handleOfflineData },
    { title: 'Export Data', subtitle: 'Backup your data', icon: 'cloud-upload-outline', action: handleExportData },
    { title: 'Import Data', subtitle: 'Restore from backup', icon: 'cloud-download-outline', action: handleImportData },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`pb-4`}>
        <LinearGradient colors={['#10B981', '#059669']} style={tw`p-8`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>Storage & Data</Text>
            <View style={tw`w-6`} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`bg-white rounded-2xl p-5 mb-4`}>
          <Text style={tw`text-lg font-bold mb-4`}>Storage Usage</Text>
          <View style={tw`bg-gray-100 rounded-xl p-4 mb-4`}>
            <Text style={tw`text-center text-2xl font-bold text-gray-800`}>2.1 GB</Text>
            <Text style={tw`text-center text-gray-600`}>Total Storage Used</Text>
          </View>
        </View>

        <View style={tw`bg-white rounded-2xl shadow-sm overflow-hidden mb-6`}>
          {storageOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[tw`flex-row items-center p-5`, index < storageOptions.length - 1 && tw`border-b border-gray-100`]}
              onPress={option.action}
            >
              <View style={tw`w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4`}>
                <Ionicons name={option.icon as any} size={20} color="#10B981" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-gray-800 font-medium`}>{option.title}</Text>
                <Text style={tw`text-gray-500 text-sm`}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
