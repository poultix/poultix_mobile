import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';

export default function AppearanceSettingsScreen() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');

  const themes = [
    { key: 'light', label: 'Light', icon: 'sunny-outline' },
    { key: 'dark', label: 'Dark', icon: 'moon-outline' },
    { key: 'auto', label: 'Auto', icon: 'phone-portrait-outline' },
  ];

  const fontSizes = [
    { key: 'small', label: 'Small' },
    { key: 'medium', label: 'Medium' },
    { key: 'large', label: 'Large' },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw` pb-4`}>
        <LinearGradient colors={['#F59E0B', '#D97706']} style={tw` p-8`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>Appearance</Text>
            <View style={tw`w-6`} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`bg-white rounded-2xl p-5 mb-4`}>
          <Text style={tw`text-lg font-bold mb-4`}>Theme</Text>
          {themes.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={tw`flex-row items-center py-3 ${theme === item.key ? 'bg-orange-50' : ''} rounded-xl px-3 mb-2`}
              onPress={() => setTheme(item.key)}
            >
              <Ionicons name={item.icon as any} size={20} color={theme === item.key ? '#F59E0B' : '#6B7280'} />
              <Text style={tw`flex-1 ml-3 ${theme === item.key ? 'text-orange-600 font-semibold' : 'text-gray-800'}`}>
                {item.label}
              </Text>
              {theme === item.key && <Ionicons name="checkmark" size={20} color="#F59E0B" />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={tw`bg-white rounded-2xl p-5 mb-4`}>
          <Text style={tw`text-lg font-bold mb-4`}>Font Size</Text>
          {fontSizes.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={tw`flex-row items-center justify-between py-3 ${fontSize === item.key ? 'bg-orange-50' : ''} rounded-xl px-3 mb-2`}
              onPress={() => setFontSize(item.key)}
            >
              <Text style={tw`${fontSize === item.key ? 'text-orange-600 font-semibold' : 'text-gray-800'}`}>
                {item.label}
              </Text>
              {fontSize === item.key && <Ionicons name="checkmark" size={20} color="#F59E0B" />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
