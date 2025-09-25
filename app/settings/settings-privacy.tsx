import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';

export default function PrivacySettingsScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw` pb-4`}>
        <LinearGradient colors={['#7C3AED', '#6D28D9']} style={tw` p-8`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>Privacy & Security</Text>
            <View style={tw`w-6`} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`bg-white rounded-2xl p-5 mb-4`}>
          <Text style={tw`text-lg font-bold mb-4`}>Security Settings</Text>
          
          {[
            { title: 'Biometric Authentication', subtitle: 'Use fingerprint or face ID', value: biometricEnabled, setter: setBiometricEnabled },
            { title: 'Data Sharing', subtitle: 'Share anonymous usage data', value: dataSharing, setter: setDataSharing },
            { title: 'Analytics', subtitle: 'Help improve the app', value: analytics, setter: setAnalytics },
          ].map((item, index) => (
            <View key={index} style={tw`flex-row items-center justify-between py-3 ${index < 2 ? 'border-b border-gray-100' : ''}`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-gray-800 font-medium`}>{item.title}</Text>
                <Text style={tw`text-gray-500 text-sm`}>{item.subtitle}</Text>
              </View>
              <Switch value={item.value} onValueChange={item.setter} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
