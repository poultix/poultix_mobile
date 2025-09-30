import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function LanguageSettingsScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`pb-4`}>
        <LinearGradient colors={['#06B6D4', '#0891B2']} style={tw` p-8`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>Language & Region</Text>
            <View style={tw`w-6`} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`bg-white rounded-2xl p-5 mb-4`}>
          <Text style={tw`text-lg font-bold mb-4`}>Select Language</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={tw`flex-row items-center justify-between py-4 ${selectedLanguage === lang.name ? 'bg-cyan-50' : ''} rounded-xl px-3 mb-2`}
              onPress={() => setSelectedLanguage(lang.name)}
            >
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-2xl mr-3`}>{lang.flag}</Text>
                <Text style={tw`${selectedLanguage === lang.name ? 'text-cyan-600 font-semibold' : 'text-gray-800'}`}>
                  {lang.name}
                </Text>
              </View>
              {selectedLanguage === lang.name && <Ionicons name="checkmark" size={20} color="#06B6D4" />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
