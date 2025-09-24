import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface DrawerItem {
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const drawerItems: DrawerItem[] = [
  { label: 'Home', route: '/', icon: 'home-outline' },
  { label: 'Farmer Dashboard', route: '/farmer', icon: 'leaf-outline' },
  { label: 'Farm Overview', route: '/farm', icon: 'business-outline' },
  { label: 'Pharmacies', route: '/pharmacies', icon: 'medkit-outline' },
  { label: 'Stool Checker', route: '/bluetooth-pairing', icon: 'paw-outline' },
  { label: 'AI Assistant', route: '/ai', icon: 'chatbox-ellipses-outline' },
  { label: 'Settings', route: '/settings', icon: 'settings-outline' },
  { label: 'News', route: '/news', icon: 'newspaper-outline' },
];

interface CustomDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CustomDrawer({ isVisible, onClose }: CustomDrawerProps) {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleItemPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    router.push(route as any);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
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

      {/* Drawer */}
      <Animated.View
        style={[
          tw`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl`,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          style={tw`h-32 justify-end pb-4 px-6`}
        >
          <SafeAreaView>
            <Text style={tw`text-white text-2xl font-bold`}>Poultix</Text>
            <Text style={tw`text-white text-sm opacity-90`}>Dashboard</Text>
          </SafeAreaView>
        </LinearGradient>

        <View style={tw`flex-1 pt-4`}>
          {drawerItems.map((item, index) => (
            <TouchableOpacity
              key={item.route}
              style={tw`flex-row items-center px-6 py-4 border-b border-gray-100`}
              onPress={() => handleItemPress(item.route)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color="#6B7280"
                style={tw`mr-4`}
              />
              <Text style={tw`text-gray-800 text-base font-medium flex-1`}>
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={tw`p-6 border-t border-gray-200`}>
          <TouchableOpacity
            style={tw`flex-row items-center py-2`}
            onPress={() => {
              // Handle logout
              onClose();
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#EF4444"
              style={tw`mr-4`}
            />
            <Text style={tw`text-red-500 text-base font-medium`}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
