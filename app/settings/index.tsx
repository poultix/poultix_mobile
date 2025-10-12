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
        <PageHeader 
          title="Settings" 
          subtitle="Customize your experience"
          showBack 
        />

        <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
          {/* User Info Card */}
          <ThemedCard padding="lg" style={tw`mb-6`}>
            <View style={tw`flex-row items-center`}>
              <View 
                style={[
                  tw`w-16 h-16 rounded-full items-center justify-center mr-4`,
                  { backgroundColor: theme.primary + '20' }
                ]}
              >
                <Ionicons name="person" size={32} color={theme.primary} />
              </View>
              <View style={tw`flex-1`}>
                <ThemedText size="lg" weight="bold">{currentUser?.name}</ThemedText>
                <ThemedText variant="secondary" size="sm">{currentUser?.email}</ThemedText>
                <ThemedText 
                  size="xs" 
                  style={[tw`mt-1 px-2 py-1 rounded-full text-center`, { color: theme.primary, backgroundColor: theme.primary + '20' }]}
                >
                  {currentUser?.role?.toLowerCase()}
                </ThemedText>
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
                    tw`w-10 h-10 rounded-full items-center justify-center mr-4`,
                    { backgroundColor: theme.primary + '15' }
                  ]}
                >
                  <Ionicons name={option.icon as any} size={20} color={theme.primary} />
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
              <View style={tw`w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4`}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
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
 