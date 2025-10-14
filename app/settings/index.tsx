import BottomTabs from '@/components/BottomTabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Switch,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const { currentUser, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth/login');
            } catch {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const settingsOptions = [
    { 
      id: 'notifications', 
      title: 'Notifications', 
      icon: 'notifications-outline', 
      action: () => Alert.alert('Coming Soon', 'Notification settings will be available in the next update.'),
      hasToggle: false 
    },
    { 
      id: 'appearance', 
      title: 'Dark Mode', 
      icon: 'moon-outline', 
      action: () => setIsDarkMode(!isDarkMode),
      hasToggle: true,
      toggleValue: isDarkMode
    },
    { 
      id: 'privacy', 
      title: 'Privacy & Security', 
      icon: 'shield-outline', 
      action: () => Alert.alert('Coming Soon', 'Privacy settings will be available in the next update.'),
      hasToggle: false 
    },
    { 
      id: 'account', 
      title: 'Account Settings', 
      icon: 'person-outline', 
      action: () => router.push('/user/profile'),
      hasToggle: false 
    },
    { 
      id: 'language', 
      title: 'Language & Region', 
      icon: 'language-outline', 
      action: () => Alert.alert('Coming Soon', 'Language settings will be available in the next update.'),
      hasToggle: false 
    },
    { 
      id: 'help', 
      title: 'Help & Support', 
      icon: 'help-circle-outline', 
      action: () => Alert.alert('Help', 'For support, please contact: support@poultix.rw'),
      hasToggle: false 
    },
    { 
      id: 'about', 
      title: 'About Poultix', 
      icon: 'information-circle-outline', 
      action: () => Alert.alert('About', 'Poultix v1.0.0\nVeterinary Management System for Rwanda'),
      hasToggle: false 
    },
  ];

  return (
    <View style={tw`flex-1 bg-amber-50`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Amber Header */}
        <LinearGradient
          colors={['#f59e0b', '#d97706', '#b45309']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={tw`px-6 py-12`}
        >
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity
              style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={tw`flex-1 ml-4`}>
              <Text style={tw`text-white font-medium text-sm opacity-90`}>Settings</Text>
              <Text style={tw`text-white text-2xl font-bold`}>App Preferences</Text>
              <Text style={tw`text-amber-100 text-sm font-medium`}>Manage your account</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={tw`flex-1 px-4 -mt-6`} showsVerticalScrollIndicator={false}>
          {/* User Info Card */}
          <View style={tw`bg-white rounded-3xl p-6 mb-4 shadow-lg border border-amber-100`}>
            <View style={tw`flex-row items-center`}>
              <LinearGradient
                colors={['#fef3c7', '#fed7aa']}
                style={tw`w-16 h-16 rounded-2xl items-center justify-center mr-4`}
              >
                <Ionicons name="person" size={32} color="#d97706" />
              </LinearGradient>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold text-gray-900`}>{currentUser?.name || 'User Name'}</Text>
                <Text style={tw`text-gray-600 text-sm`}>{currentUser?.email || 'user@example.com'}</Text>
                <View style={tw`flex-row items-center mt-2`}>
                  <View style={tw`bg-amber-100 px-3 py-1 rounded-full`}>
                    <Text style={tw`text-amber-800 text-xs font-bold`}>
                      {currentUser?.role?.toLowerCase() || 'farmer'}
                    </Text>
                  </View>
                  <View style={tw`ml-3 flex-row items-center`}>
                    <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-2`} />
                    <Text style={tw`text-gray-500 text-xs font-medium`}>Active</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Settings Options */}
          <View style={tw`bg-white rounded-3xl mb-4 shadow-lg border border-amber-100`}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  tw`flex-row items-center p-4`,
                  index < settingsOptions.length - 1 && tw`border-b border-amber-50`,
                  index === 0 && tw`rounded-t-3xl`,
                  index === settingsOptions.length - 1 && tw`rounded-b-3xl`
                ]}
                onPress={option.action}
              >
                <View style={tw`w-12 h-12 bg-amber-50 rounded-2xl items-center justify-center mr-4`}>
                  <Ionicons name={option.icon as any} size={22} color="#d97706" />
                </View>
                <Text style={tw`flex-1 text-gray-900 font-medium text-base`}>
                  {option.title}
                </Text>
                {option.hasToggle ? (
                  <Switch
                    value={option.toggleValue}
                    onValueChange={option.action}
                    trackColor={{ false: '#D1D5DB', true: '#fed7aa' }}
                    thumbColor={option.toggleValue ? '#d97706' : '#F3F4F6'}
                  />
                ) : (
                  <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Section */}
          <View style={tw`bg-white rounded-3xl mb-20 shadow-lg border border-red-100`}>
            <TouchableOpacity
              style={tw`flex-row items-center p-4 rounded-3xl`}
              onPress={handleLogout}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={tw`w-12 h-12 rounded-2xl items-center justify-center mr-4`}
              >
                <Ionicons name="log-out-outline" size={22} color="white" />
              </LinearGradient>
              <Text style={tw`flex-1 text-red-600 font-bold text-base`}>
                Sign Out
              </Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
      
      <BottomTabs />
    </View>
  );
}
 