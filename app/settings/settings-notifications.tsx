import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function NotificationSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw` pb-4`}>
        <LinearGradient colors={['#3B82F6', '#2563EB']} style={tw` p-8`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>Notifications</Text>
            <View style={tw`w-6`} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`bg-white rounded-2xl p-5 mb-4`}>
          <Text style={tw`text-lg font-bold mb-4`}>Notification Preferences</Text>
          
          {[
            { title: 'Push Notifications', value: pushEnabled, setter: setPushEnabled },
            { title: 'Email Notifications', value: emailEnabled, setter: setEmailEnabled },
            { title: 'SMS Notifications', value: smsEnabled, setter: setSmsEnabled },
            { title: 'Sound & Vibration', value: soundEnabled, setter: setSoundEnabled },
          ].map((item, index) => (
            <View key={index} style={tw`flex-row items-center justify-between py-3 ${index < 3 ? 'border-b border-gray-100' : ''}`}>
              <Text style={tw`text-gray-800 font-medium`}>{item.title}</Text>
              <Switch value={item.value} onValueChange={item.setter} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
