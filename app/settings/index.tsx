import BottomTabs from '@/components/BottomTabs';
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
  Alert,
  Switch,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedContainer, ThemedText, ThemedCard } from '@/components/ui/ThemedComponents';
import { PageHeader } from '@/components/ui/ThemedHeader';

export default function SettingsScreen() {
  const { currentUser, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
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
            } catch (error) {
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
      action: toggleTheme,
      hasToggle: true,
      toggleValue: isDark
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
    <ThemedContainer variant="background">
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header with Gradient */}
        <View style={tw`bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-12 shadow-lg`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity
              style={tw`bg-white/20 p-3 rounded-2xl`}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={tw`flex-1 ml-4`}>
              <Text style={tw`text-white font-medium text-sm`}>Settings</Text>
              <Text style={tw`text-white text-2xl font-bold`}>App Preferences</Text>
              <Text style={tw`text-blue-100 text-sm`}>Customize your experience</Text>
            </View>
          </View>
        </View>

        <ScrollView style={tw`flex-1 px-4 -mt-6`} showsVerticalScrollIndicator={false}>
          {/* User Info Card */}
          <ThemedCard padding="lg" style={tw`mb-6`}>
            <View style={tw`flex-row items-center`}>
              <View 
                style={[
                  tw`w-16 h-16 rounded-2xl items-center justify-center mr-4`,
                  { backgroundColor: `linear-gradient(135deg, ${theme.primary}20, ${theme.primary}30)` }
                ]}
              >
                <Ionicons name="person" size={32} color={theme.primary} />
              </View>
              <View style={tw`flex-1`}>
                <ThemedText size="lg" weight="bold">{currentUser?.name}</ThemedText>
                <ThemedText variant="secondary" size="sm">{currentUser?.email}</ThemedText>
                <View style={tw`flex-row items-center mt-1`}>
                  <View style={[
                    tw`px-2 py-1 rounded-full`,
                    { backgroundColor: theme.primary + '20' }
                  ]}>
                    <ThemedText 
                      size="xs" 
                      style={{ color: theme.primary, fontWeight: '600' }}
                    >
                      {currentUser?.role?.toLowerCase()}
                    </ThemedText>
                  </View>
                  {currentUser?.isActive && (
                    <View style={tw`ml-2 flex-row items-center`}>
                      <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-1`} />
                      <ThemedText size="xs" variant="secondary">Active</ThemedText>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ThemedCard>

          {/* Settings Options */}
          <ThemedCard padding="sm" style={tw`mb-6`}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  tw`flex-row items-center p-4`,
                  index < settingsOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.divider }
                ]}
                onPress={option.action}
              >
                <View 
                  style={[
                    tw`w-12 h-12 rounded-2xl items-center justify-center mr-4`,
                    { backgroundColor: `linear-gradient(135deg, ${theme.primary}15, ${theme.primary}25)` }
                  ]}
                >
                  <Ionicons name={option.icon as any} size={22} color={theme.primary} />
                </View>
                <ThemedText weight="medium" style={tw`flex-1`}>
                  {option.title}
                </ThemedText>
                {option.hasToggle ? (
                  <Switch
                    value={option.toggleValue}
                    onValueChange={option.action}
                    trackColor={{ false: '#D1D5DB', true: theme.primary + '80' }}
                    thumbColor={option.toggleValue ? theme.primary : '#F3F4F6'}
                  />
                ) : (
                  <Ionicons name="chevron-forward-outline" size={20} color={theme.text.secondary} />
                )}
              </TouchableOpacity>
            ))}
          </ThemedCard>

          {/* Danger Zone */}
          <ThemedCard padding="sm" style={tw`mb-20`}>
            <TouchableOpacity
              style={tw`flex-row items-center p-4`}
              onPress={handleLogout}
            >
              <View style={tw`w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl items-center justify-center mr-4`}>
                <Ionicons name="log-out-outline" size={22} color="white" />
              </View>
              <ThemedText weight="medium" style={tw`flex-1 text-red-600`}>
                Sign Out
              </ThemedText>
              <Ionicons name="chevron-forward-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </ThemedCard>
        </ScrollView>
      </Animated.View>
      
      <BottomTabs />
    </ThemedContainer>
  );
}
 