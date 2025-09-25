import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';

export default function AboutSettingsScreen() {
  const aboutOptions = [
    { title: 'Version', value: '1.0.0', icon: 'information-circle-outline' },
    { title: 'Build', value: '2024.01.15', icon: 'construct-outline' },
    { title: 'Privacy Policy', action: () => {}, icon: 'shield-outline' },
    { title: 'Terms of Service', action: () => {}, icon: 'document-text-outline' },
    { title: 'Open Source Licenses', action: () => {}, icon: 'code-outline' },
    { title: 'Contact Us', action: () => Linking.openURL('mailto:info@poultix.rw'), icon: 'mail-outline' },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw` pb-4`}>
        <LinearGradient colors={['#F97316', '#EA580C']} style={tw`p-8`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>About</Text>
            <View style={tw`w-6`} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`bg-white rounded-2xl p-8 mb-4 items-center`}>
          <View style={tw`w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4`}>
            <Ionicons name="leaf" size={40} color="#F97316" />
          </View>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Poultix</Text>
          <Text style={tw`text-gray-600 text-center`}>
            Smart poultry farm management for Rwanda
          </Text>
        </View>

        <View style={tw`bg-white rounded-2xl shadow-sm overflow-hidden mb-6`}>
          {aboutOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[tw`flex-row items-center p-5`, index < aboutOptions.length - 1 && tw`border-b border-gray-100`]}
              onPress={option.action}
              disabled={!option.action}
            >
              <View style={tw`w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4`}>
                <Ionicons name={option.icon as any} size={20} color="#F97316" />
              </View>
              <Text style={tw`flex-1 text-gray-800 font-medium`}>{option.title}</Text>
              {option.value ? (
                <Text style={tw`text-gray-500`}>{option.value}</Text>
              ) : (
                <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={tw`bg-white rounded-2xl p-5 mb-6`}>
          <Text style={tw`text-center text-gray-500 text-sm`}>
            Made with ❤️ in Rwanda
          </Text>
          <Text style={tw`text-center text-gray-400 text-xs mt-2`}>
            © 2024 Poultix. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
