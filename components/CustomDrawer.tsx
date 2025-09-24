import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@/contexts/AppContext';

interface DrawerItem {
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
  adminOnly?: boolean;
  description?: string;
  color?: string;
}

interface UserInfo {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const allDrawerItems: DrawerItem[] = [
  { 
    label: 'Dashboard', 
    route: '/', 
    icon: 'home-outline',
    description: 'Overview and quick actions',
    color: '#F97316'
  },
  { 
    label: 'Farm Management', 
    route: '/farm', 
    icon: 'leaf-outline',
    description: 'Monitor your poultry farm',
    color: '#10B981'
  },
  { 
    label: 'pH Analyzer', 
    route: '/bluetooth/ph-reader', 
    icon: 'flask-outline',
    description: 'Analyze stool samples',
    badge: 'NEW',
    color: '#F59E0B'
  },
  { 
    label: 'Veterinary Care', 
    route: '/farm/veterinary', 
    icon: 'medical-outline',
    description: 'Find expert help',
    color: '#EF4444'
  },
  { 
    label: 'Pharmacies', 
    route: '/pharmacy', 
    icon: 'storefront-outline',
    description: 'Locate nearby pharmacies',
    color: '#3B82F6'
  },
  { 
    label: 'Health News', 
    route: '/general/news', 
    icon: 'newspaper-outline',
    description: 'Latest updates',
    color: '#8B5CF6'
  },
  { 
    label: 'AI Assistant', 
    route: '/general/ai', 
    icon: 'chatbubble-ellipses-outline',
    description: 'Get AI-powered advice',
    badge: 'BETA',
    color: '#06B6D4'
  },
  { 
    label: 'Admin Panel', 
    route: '/admin', 
    icon: 'shield-outline',
    description: 'System administration',
    badge: 'ADMIN',
    adminOnly: true,
    color: '#7C3AED'
  },
  { 
    label: 'Data Management', 
    route: '/admin/data-management', 
    icon: 'server-outline',
    description: 'Edit content',
    adminOnly: true,
    color: '#10B981'
  },
  { 
    label: 'Settings', 
    route: '/settings', 
    icon: 'settings-outline',
    description: 'App preferences',
    color: '#6B7280'
  },
];

interface CustomDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CustomDrawer({ isVisible, onClose }: CustomDrawerProps) {
  const { logout } = useApp();
  const slideAnim = useRef(new Animated.Value(-350)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Loading...',
    email: 'Loading...',
    role: 'farmer'
  });
  const [filteredItems, setFilteredItems] = useState<DrawerItem[]>([]);

  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    filterItemsByRole();
  }, [userInfo.role]);

  const loadUserInfo = async () => {
    try {
      const role = await AsyncStorage.getItem('role') || 'farmer';
      const email = await AsyncStorage.getItem('userEmail') || 'user@example.com';
      const name = email.split('@')[0];
      
      setUserInfo({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        role
      });
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const filterItemsByRole = () => {
    if (userInfo.role === 'admin') {
      setFilteredItems(allDrawerItems);
    } else {
      setFilteredItems(allDrawerItems.filter(item => !item.adminOnly));
    }
  };

  React.useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -350,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleItemPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setTimeout(() => router.push(route as any), 100);
  };

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
    try {
      await logout();
      router.replace('/(auth)/sign-in' as any);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'shield';
      case 'veterinary': return 'medical';
      case 'farmer': return 'leaf';
      default: return 'person';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#7C3AED';
      case 'veterinary': return '#EF4444';
      case 'farmer': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Enhanced Overlay */}
      <Animated.View
        style={[
          tw`absolute inset-0 bg-black`,
          { opacity: overlayOpacity },
        ]}
      >
        <TouchableOpacity
          style={tw`flex-1`}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Enhanced Drawer */}
      <Animated.View
        style={[
          tw`absolute left-0 top-0 bottom-0 w-80 shadow-2xl`,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <BlurView intensity={95} tint="light" style={tw`absolute inset-0`} />
        
        {/* Header with User Info */}
        <LinearGradient
          colors={[getRoleColor(userInfo.role), getRoleColor(userInfo.role) + 'CC']}
          style={tw`pt-12 pb-6 px-6`}
        >
          <SafeAreaView>
            <View style={tw`flex-row items-center mb-4`}>
              <View style={tw`w-16 h-16 rounded-full bg-white bg-opacity-20 justify-center items-center mr-4`}>
                <Ionicons 
                  name={getRoleIcon(userInfo.role) as keyof typeof Ionicons.glyphMap} 
                  size={28} 
                  color="white" 
                />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white text-xl font-bold`}>{userInfo.name}</Text>
                <Text style={tw`text-white text-sm opacity-90`}>{userInfo.email}</Text>
                <View style={tw`bg-white bg-opacity-20 rounded-full px-2 py-1 mt-1 self-start`}>
                  <Text style={tw`text-white text-xs font-medium capitalize`}>
                    {userInfo.role}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-white text-2xl font-bold mr-2`}>Poultix</Text>
              <View style={tw`bg-white bg-opacity-20 rounded-full px-2 py-1`}>
                <Text style={tw`text-white text-xs font-bold`}>v2.0</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Navigation Items */}
        <ScrollView style={tw`flex-1 bg-white`} showsVerticalScrollIndicator={false}>
          <View style={tw`py-2`}>
            {filteredItems.map((item, index) => (
              <TouchableOpacity
                key={item.route}
                style={tw`flex-row items-center px-6 py-4 mx-2 rounded-xl mb-1`}
                onPress={() => handleItemPress(item.route)}
                accessibilityLabel={`Navigate to ${item.label}`}
                accessibilityRole="button"
              >
                <View style={[
                  tw`p-2 rounded-full mr-4`,
                  { backgroundColor: (item.color || '#6B7280') + '20' }
                ]}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.color || '#6B7280'}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-gray-800 text-base font-semibold`}>
                      {item.label}
                    </Text>
                    {item.badge && (
                      <View style={[
                        tw`ml-2 px-2 py-1 rounded-full`,
                        { backgroundColor: (item.color || '#6B7280') + '20' }
                      ]}>
                        <Text style={[
                          tw`text-xs font-bold`,
                          { color: item.color || '#6B7280' }
                        ]}>
                          {item.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  {item.description && (
                    <Text style={tw`text-gray-500 text-sm mt-1`}>
                      {item.description}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={tw`px-6 py-4 border-t border-gray-100 mt-4`}>
            <Text style={tw`text-gray-600 font-semibold mb-3`}>Quick Actions</Text>
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-blue-100 rounded-xl p-3 flex-1 mr-2 items-center`}
                onPress={() => handleItemPress('/bluetooth/ph-reader')}
              >
                <Ionicons name="flask-outline" size={20} color="#3B82F6" />
                <Text style={tw`text-blue-600 text-xs font-medium mt-1`}>Quick Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-green-100 rounded-xl p-3 flex-1 mx-1 items-center`}
                onPress={() => handleItemPress('/farm')}
              >
                <Ionicons name="add-circle-outline" size={20} color="#10B981" />
                <Text style={tw`text-green-600 text-xs font-medium mt-1`}>Add Record</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-100 rounded-xl p-3 flex-1 ml-2 items-center`}
                onPress={() => handleItemPress('/farm/veterinary')}
              >
                <Ionicons name="medical-outline" size={20} color="#EF4444" />
                <Text style={tw`text-red-600 text-xs font-medium mt-1`}>Emergency</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Enhanced Footer */}
        <View style={tw`p-6 border-t border-gray-200 bg-gray-50`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center bg-red-500 rounded-xl py-3 px-4`}
            onPress={handleLogout}
            accessibilityLabel="Logout"
            accessibilityRole="button"
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="white"
              style={tw`mr-2`}
            />
            <Text style={tw`text-white font-semibold`}>
              Logout
            </Text>
          </TouchableOpacity>
          
          <Text style={tw`text-center text-gray-400 text-xs mt-3`}>
            Poultix Mobile v2.0 • Made with ❤️
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
}
