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
  Modal,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '@/contexts/AuthContext';
import { i18n } from '../../services/i18n/i18n';
import { Language } from '../../types/user';
import { useOfflineSupport } from '../../hooks/useOfflineSupport';

export default function SettingsScreen() {
  const { currentUser, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getCurrentLanguage());
  const { isOnline } = useOfflineSupport();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const languages = [
    { code: Language.EN, name: 'English', flag: '🇺🇸' },
    { code: Language.FR, name: 'Français', flag: '🇫🇷' },
    { code: Language.KN, name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: Language.SW, name: 'Kiswahili', flag: '🇹🇿' },
    { code: Language.KR, name: '한국어', flag: '🇰🇷' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogout = () => {
    Alert.alert(
      i18n.common('logout') || 'Logout',
      'Are you sure you want to logout?',
      [
        { text: i18n.common('cancel') || 'Cancel', style: 'cancel' },
        {
          text: i18n.common('logout') || 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth/login');
            } catch {
              // Silent logout - no error screens
              console.log('Logout failed, redirecting anyway');
              router.replace('/auth/login');
            }
          }
        }
      ]
    );
  };

  const handleLanguageChange = async (language: Language) => {
    try {
      await i18n.setLanguage(language);
      setCurrentLanguage(language);
      setShowLanguageModal(false);
      // Force re-render by updating state
      setTimeout(() => {
        // Trigger a subtle animation to show language change
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);
    } catch (error) {
      console.log('Language change failed:', error);
    }
  };

  const settingsOptions = [
    { 
      id: 'notifications', 
      title: i18n.common('notifications') || 'Notifications', 
      icon: 'notifications-outline', 
      action: () => router.push('/settings/settings-notifications'),
      hasToggle: false,
      subtitle: 'Manage your notification preferences'
    },
    { 
      id: 'appearance', 
      title: 'Dark Mode', 
      icon: 'moon-outline', 
      action: () => setIsDarkMode(!isDarkMode),
      hasToggle: true,
      toggleValue: isDarkMode,
      subtitle: 'Toggle dark/light theme'
    },
    { 
      id: 'environment', 
      title: i18n.navigation('environmentMonitoring') || 'Environment', 
      icon: 'leaf-outline', 
      action: () => router.push('/device/environmental-scanner'),
      hasToggle: false,
      subtitle: 'Temperature & humidity monitoring'
    },
    { 
      id: 'veterinary', 
      title: i18n.navigation('findVets') || 'Veterinary', 
      icon: 'medical-outline', 
      action: () => router.push('/veterinary'),
      hasToggle: false,
      subtitle: 'Find nearby veterinarians'
    },
    { 
      id: 'language', 
      title: i18n.common('language') || 'Language & Region', 
      icon: 'language-outline', 
      action: () => setShowLanguageModal(true),
      hasToggle: false,
      subtitle: `Current: ${languages.find(l => l.code === currentLanguage)?.name || 'English'}`
    },
    { 
      id: 'emergency', 
      title: i18n.navigation('emergency') || 'Emergency', 
      icon: 'warning-outline', 
      action: () => router.push('/emergency/first-aid'),
      hasToggle: false,
      subtitle: 'First aid guides and emergency contacts'
    },
    { 
      id: 'ai', 
      title: i18n.navigation('aiAssistant') || 'AI Assistant', 
      icon: 'chatbubble-ellipses-outline', 
      action: () => router.push('/ai/ai'),
      hasToggle: false,
      subtitle: 'Chat with AI for expert advice'
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
              <Text style={tw`text-white font-medium text-sm opacity-90`}>{i18n.common('settings') || 'Settings'}</Text>
              <Text style={tw`text-white text-2xl font-bold`}>App Preferences</Text>
              <Text style={tw`text-amber-100 text-sm font-medium`}>Manage your account {!isOnline && '(Offline)'}</Text>
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
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-900 font-medium text-base`}>
                    {option.title}
                  </Text>
                  {option.subtitle && (
                    <Text style={tw`text-gray-500 text-xs mt-1`}>
                      {option.subtitle}
                    </Text>
                  )}
                </View>
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
        
        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={tw`flex-1 bg-black bg-opacity-50 justify-end`}>
            <View style={tw`bg-white rounded-t-3xl p-6`}>
              <View style={tw`flex-row items-center justify-between mb-6`}>
                <Text style={tw`text-xl font-bold text-gray-900`}>
                  {i18n.common('selectLanguage') || 'Select Language'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowLanguageModal(false)}
                  style={tw`p-2`}
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={tw`flex-row items-center p-4 rounded-2xl mb-2 ${
                    currentLanguage === language.code ? 'bg-amber-50 border-2 border-amber-200' : 'bg-gray-50'
                  }`}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <Text style={tw`text-2xl mr-4`}>{language.flag}</Text>
                  <Text style={tw`flex-1 text-gray-900 font-medium text-base`}>
                    {language.name}
                  </Text>
                  {currentLanguage === language.code && (
                    <Ionicons name="checkmark-circle" size={24} color="#d97706" />
                  )}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={tw`bg-amber-500 rounded-2xl p-4 mt-4`}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={tw`text-white font-bold text-center text-base`}>
                  {i18n.common('done') || 'Done'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Animated.View>
      
      <BottomTabs />
    </View>
  );
}
 