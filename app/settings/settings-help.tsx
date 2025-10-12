import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function HelpSettingsScreen() {
  const handleFAQ = () => {
    Alert.alert(
      'Frequently Asked Questions',
      'Browse common questions and answers about Poultix.',
      [
        { text: 'OK', onPress: () => {
          Alert.alert('Feature Coming Soon', 'FAQ section will be available soon.');
        }}
      ]
    );
  };

  const handleUserGuide = () => {
    Alert.alert(
      'User Guide',
      'Access the complete user manual and documentation.',
      [
        { text: 'OK', onPress: () => {
          Alert.alert('Feature Coming Soon', 'User guide will be available soon.');
        }}
      ]
    );
  };

  const handleVideoTutorials = () => {
    Alert.alert(
      'Video Tutorials',
      'Watch step-by-step video guides to learn Poultix features.',
      [
        { text: 'OK', onPress: () => {
          Alert.alert('Feature Coming Soon', 'Video tutorials will be available soon.');
        }}
      ]
    );
  };

  const handleCommunityForum = () => {
    Alert.alert(
      'Community Forum',
      'Join discussions with other Poultix users and experts.',
      [
        { text: 'OK', onPress: () => {
          Alert.alert('Feature Coming Soon', 'Community forum will be available soon.');
        }}
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Help us improve Poultix by reporting issues you encounter.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', onPress: () => {
          const subject = encodeURIComponent('Bug Report - Poultix Mobile App');
          const body = encodeURIComponent('Please describe the bug you encountered:\n\n1. What were you trying to do?\n\n2. What happened instead?\n\n3. Steps to reproduce:\n\n4. Device information:\n\nThank you for helping us improve Poultix!');
          Linking.openURL(`mailto:support@poultix.rw?subject=${subject}&body=${body}`);
        }}
      ]
    );
  };

  const helpOptions = [
    { title: 'FAQ', icon: 'help-circle-outline', action: handleFAQ },
    { title: 'Contact Support', icon: 'mail-outline', action: () => Linking.openURL('mailto:support@poultix.rw') },
    { title: 'User Guide', icon: 'book-outline', action: handleUserGuide },
    { title: 'Video Tutorials', icon: 'play-circle-outline', action: handleVideoTutorials },
    { title: 'Community Forum', icon: 'people-outline', action: handleCommunityForum },
    { title: 'Report a Bug', icon: 'bug-outline', action: handleReportBug },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw` pb-4`}>
        <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={tw` p-8`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>Help & Support</Text>
            <View style={tw`w-6`} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`bg-white rounded-2xl shadow-sm overflow-hidden mb-6`}>
          {helpOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[tw`flex-row items-center p-5`, index < helpOptions.length - 1 && tw`border-b border-gray-100`]}
              onPress={option.action}
            >
              <View style={tw`w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4`}>
                <Ionicons name={option.icon as any} size={20} color="#8B5CF6" />
              </View>
              <Text style={tw`flex-1 text-gray-800 font-medium`}>{option.title}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
