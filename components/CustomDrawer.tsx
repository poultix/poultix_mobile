import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from 'twrnc';

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
  // Role-specific features
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

  // Secondary features
  {
    label: 'Veterinary Care',
    route: '/farm/veterinary-care',
    icon: 'medical-outline',
    description: 'Find expert help',
    color: '#EF4444'
  },
  {
    label: 'Contacts',
    route: '/chat',
    icon: 'people-outline',
    description: 'User directory',
    color: '#6B7280'
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
    route: '/news',
    icon: 'newspaper-outline',
    description: 'Latest updates',
    color: '#8B5CF6'
  },
  {
    label: 'AI Assistant',
    route: '/ai',
    icon: 'chatbubble-ellipses-outline',
    description: 'Get AI-powered advice',
    badge: 'BETA',
    color: '#06B6D4'
  },

  // Device features
  {
    label: 'Bluetooth Devices',
    route: '/device/pairing',
    icon: 'bluetooth-outline',
    description: 'Connect to devices',
    badge: 'BETA',
    color: '#0EA5E9'
  },
  {
    label: 'PH Analyzer',
    route: '/device/reading',
    icon: 'flask-outline',
    description: 'Analyze stool samples',
    badge: 'BETA',
    color: '#F59E0B'
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
  const { currentUser, logout } = useAuth();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const drawerWidth = screenWidth * 0.85; // 85% of screen width
  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Loading...',
    email: 'Loading...',
    role: 'farmer'
  });
  const [filteredItems, setFilteredItems] = useState<DrawerItem[]>([]);

  useEffect(() => {
    // Update user info when currentUser changes in AuthContext
    if (currentUser) {
      setUserInfo({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      });
    } else {
      // Load from AsyncStorage if not in context (fallback)
      loadUserInfo();
    }
  }, [currentUser]);

  useEffect(() => {
    filterItemsByRole();
  }, [userInfo.role]);

  const loadUserInfo = async () => {
    try {
      // This is a fallback - should primarily use AppContext
      const role = await AsyncStorage.getItem('role') || 'FARMER';
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
    if (userInfo.role === 'ADMIN') {
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
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -drawerWidth,
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
  }, [isVisible, drawerWidth]);

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

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'shield';
      case 'VETERINARY': return 'medical';
      case 'FARMER': return 'leaf';
      default: return 'person';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#7C3AED';
      case 'VETERINARY': return '#EF4444';
      case 'FARMER': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* iOS-style Overlay */}
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

      {/* iOS-style Full Height Drawer */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            width: drawerWidth,
            height: screenHeight,
            backgroundColor: '#FFFFFF',
            transform: [{ translateX: slideAnim }],
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 16,
          },
        ]}
      >
        <View style={tw`flex-1`}>
          {/* iOS-style Header */}
          <View style={[
            tw`px-4 py-3 border-b border-gray-100`,
            { paddingTop: statusBarHeight + 16 }
          ]}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <Text style={tw`text-3xl font-bold text-gray-900`}>Menu</Text>
              <TouchableOpacity
                onPress={onClose}
                style={tw`w-8 h-8 rounded-full bg-gray-100 items-center justify-center`}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* User Profile Section */}
            <TouchableOpacity onPress={() => router.push('/user/profile')}
              style={tw`flex-row items-center py-3 px-3 bg-gray-50 rounded-2xl`}>
              <View style={[
                tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
                { backgroundColor: getRoleColor(userInfo.role) }
              ]}>
                <Ionicons
                  name={getRoleIcon(userInfo.role) as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color="white"
                />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-900`}>{userInfo.name}</Text>
                <Text style={tw`text-sm text-gray-500`}>
                  {userInfo.role.charAt(0) + userInfo.role.slice(1).toLowerCase()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleItemPress('/user/profile')}
                style={tw`p-2`}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* iOS-style Navigation Items */}
          <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
            <View style={tw`px-4 py-2`}>
              {filteredItems.map((item, index) => (
                <TouchableOpacity
                  key={item.route}
                  style={[
                    tw`flex-row items-center py-3 px-3 rounded-xl mb-1`,
                    tw`active:bg-gray-100`
                  ]}
                  onPress={() => handleItemPress(item.route)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    tw`w-8 h-8 rounded-lg items-center justify-center mr-3`,
                    { backgroundColor: (item.color || '#6B7280') + '15' }
                  ]}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={item.color || '#6B7280'}
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-900 font-medium text-base`}>{item.label}</Text>
                  </View>
                  {item.badge && (
                    <View style={[
                      tw`px-2 py-1 rounded-full mr-2`,
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
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>

            {/* iOS-style Quick Actions */}
            <View style={tw`px-4 py-4 border-t border-gray-100 mt-2`}>
              <Text style={tw`text-gray-600 font-semibold mb-3 text-sm uppercase tracking-wide`}>Quick Actions</Text>
              <View style={tw`flex-row justify-between mb-3`}>
                <TouchableOpacity
                  style={tw`bg-sky-50 rounded-2xl p-4 flex-1 mr-2 items-center`}
                  onPress={() => handleItemPress('/device/pairing')}
                  activeOpacity={0.7}
                >
                  <View style={tw`w-10 h-10 bg-sky-100 rounded-full items-center justify-center mb-2`}>
                    <Ionicons name="bluetooth-outline" size={20} color="#0EA5E9" />
                  </View>
                  <Text style={tw`text-sky-600 text-xs font-medium text-center`}>Connect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-blue-50 rounded-2xl p-4 flex-1 mx-1 items-center`}
                  onPress={() => handleItemPress('/device/reading')}
                  activeOpacity={0.7}
                >
                  <View style={tw`w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2`}>
                    <Ionicons name="flask-outline" size={20} color="#3B82F6" />
                  </View>
                  <Text style={tw`text-blue-600 text-xs font-medium text-center`}>PH Scan</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>

          {/* iOS-style Footer with Logout */}
          <View style={tw`px-4 py-4 border-t border-gray-100`}>
            <TouchableOpacity
              style={tw`flex-row items-center py-3 px-3 rounded-xl bg-red-50 mb-3`}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={tw`w-8 h-8 rounded-lg bg-red-100 items-center justify-center mr-3`}>
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              </View>
              <Text style={tw`text-red-600 font-medium text-base flex-1`}>Sign Out</Text>
              <Ionicons name="chevron-forward" size={16} color="#EF4444" />
            </TouchableOpacity>

            {/* App Version */}
            <View style={tw`items-center`}>
              <Text style={tw`text-gray-400 text-xs`}>Poultix v2.0</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}
