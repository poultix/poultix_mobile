import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import tw from 'twrnc';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import DrawerButton from '@/components/DrawerButton';
// Context imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import BottomTabs from '@/components/BottomTabs';
import VetOverview from '@/components/dashboard/vet/overview';
import VetDashboardFarms from '@/components/dashboard/vet/farms';
import VetDashSchedules from '@/components/dashboard/vet/schedules';

export default function VeterinaryDashboardScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { currentUser } = useAuth();
  const { farms } = useFarms();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'farms' | 'schedules'>('overview');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'VETERINARY') {
      Alert.alert('Access Denied', 'Veterinary access required', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentUser]);

  if (!currentUser || currentUser.role !== 'VETERINARY') {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Ionicons name="lock-closed-outline" size={64} color="#6B7280" />
        <Text style={tw`text-gray-600 text-lg mt-4`}>Access Denied</Text>
      </SafeAreaView>
    );
  }

  // Filter data for current veterinary
  const assignedFarms = farms.filter(farm => farm.assignedVeterinary?.id === currentUser.id);

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw`pb-4`}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={tw` p-8 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white text-sm opacity-90`}>
                  Veterinary Dashboard
                </Text>
                <Text style={tw`text-white text-2xl font-bold`}>
                  Dr. {currentUser.name} 🩺
                </Text>
                <Text style={tw`text-red-100 text-sm mt-1`}>
                  Veterinary Professional • {assignedFarms.length} farms assigned
                </Text>
              </View>
              <DrawerButton />
            </View>
          </LinearGradient>
        </View>

        {/* Navigation Tabs */}
        <View style={tw`px-4 mb-4`}>
          <View style={tw`bg-white rounded-2xl p-2 flex-row shadow-sm`}>
            {[
              { key: 'overview', label: 'Overview', icon: 'analytics-outline' },
              { key: 'farms', label: 'My Farms', icon: 'leaf-outline' },
              { key: 'schedules', label: 'Schedule', icon: 'calendar-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  tw`flex-1 py-3 rounded-xl flex-row items-center justify-center`,
                  selectedTab === tab.key ? tw`bg-red-500` : tw`bg-transparent`
                ]}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={selectedTab === tab.key ? 'white' : '#6B7280'}
                />
                <Text style={[
                  tw`ml-2 font-medium`,
                  selectedTab === tab.key ? tw`text-white` : tw`text-gray-600`
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content */}
        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}
          contentContainerClassName='pb-40'
        >
          {selectedTab === 'overview' && <VetOverview />}
          {selectedTab === 'farms' && <VetDashboardFarms />}
          {selectedTab === 'schedules' && <VetDashSchedules />}
        </ScrollView>
      </Animated.View>
      {/* Bottom Tabs */}
      <BottomTabs currentRoute="/dashboard/veterinary-dashboard" />

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </View>
  );
}
