import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpSettingsScreen() {
  const helpOptions = [
    { title: 'FAQ', icon: 'help-circle-outline', action: () => {} },
    { title: 'Contact Support', icon: 'mail-outline', action: () => Linking.openURL('mailto:support@poultix.rw') },
    { title: 'User Guide', icon: 'book-outline', action: () => {} },
    { title: 'Video Tutorials', icon: 'play-circle-outline', action: () => {} },
    { title: 'Community Forum', icon: 'people-outline', action: () => {} },
    { title: 'Report a Bug', icon: 'bug-outline', action: () => {} },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
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
    </SafeAreaView>
  );
}
