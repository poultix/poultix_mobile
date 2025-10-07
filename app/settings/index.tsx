import DrawerButton from '@/components/DrawerButton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from 'twrnc';

export default function SettingsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  const settingsOptions = [
    { id: 'notifications', title: 'Notifications', icon: 'notifications-outline', screen: '/settings/settings-notifications' },
    { id: 'privacy', title: 'Privacy & Security', icon: 'shield-outline', screen: '/settings/settings-privacy' },
    { id: 'account', title: 'Account Settings', icon: 'person-outline', screen: '/settings/settings-account' },
    { id: 'appearance', title: 'Appearance', icon: 'color-palette-outline', screen: '/settings/settings-appearance' },
    { id: 'language', title: 'Language & Region', icon: 'language-outline', screen: '/settings/settings-language' },
    { id: 'storage', title: 'Storage & Data', icon: 'server-outline', screen: '/settings/settings-storage' },
    { id: 'help', title: 'Help & Support', icon: 'help-circle-outline', screen: '/settings/settings-help' },
    { id: 'about', title: 'About', icon: 'information-circle-outline', screen: '/settings/settings-about' },
  ]

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw`pb-4`}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={tw`p-8 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <TouchableOpacity
                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>
              
              <Text style={tw`text-white text-xl font-bold`}>Settings</Text>
              
              <DrawerButton />
            </View>

            <View style={tw`items-center`}>
              <Text style={tw`text-gray-200 text-base`}>
                Customize your experience
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Settings List */}
        <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
          <View style={tw`bg-white rounded-2xl shadow-sm overflow-hidden mb-6`}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  tw`flex-row items-center p-5`,
                  index < settingsOptions.length - 1 && tw`border-b border-gray-100`
                ]}
                onPress={() => router.push(option.screen as any)}
              >
                <View style={tw`w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4`}>
                  <Ionicons name={option.icon as any} size={20} color="#6B7280" />
                </View>
                <Text style={tw`flex-1 text-gray-800 font-medium text-base`}>
                  {option.title}
                </Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  )
}
 