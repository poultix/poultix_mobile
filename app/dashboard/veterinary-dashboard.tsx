import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import tw from 'twrnc';

import CustomDrawer from '@/components/CustomDrawer';
import DrawerButton from '@/components/DrawerButton';
import { useDrawer } from '@/contexts/DrawerContext';
// Context imports
import BottomTabs from '@/components/BottomTabs';
import VetDashboardFarms from '@/components/dashboard/vet/farms';
import VetOverview from '@/components/dashboard/vet/overview';
import VetDashSchedules from '@/components/dashboard/vet/schedules';
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { getRoleTheme } from '@/utils/theme';

export default function VeterinaryDashboardScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { currentUser } = useAuth();
  const { farms } = useFarms();
  const theme = getRoleTheme(currentUser?.role);
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
      <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <View style={tw`bg-amber-100 p-6 rounded-2xl items-center shadow-lg`}>
          <Ionicons name="medical-outline" size={56} color="#D97706" />
          <Text style={tw`text-amber-600 text-base font-semibold mt-3`}>Access Denied</Text>
          <Text style={tw`text-amber-700 text-sm mt-2 text-center`}>Veterinary credentials required</Text>
        </View>
      </View>
    );
  }

  // Filter data for current veterinary
  const assignedFarms = farms.filter(farm => farm.assignedVeterinary?.id === currentUser.id);

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Animated.View style={[tw`flex-1 `, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw`pb-4`}>
          <LinearGradient
            colors={[theme.primary, theme.primary + 'CC']}
            style={tw`p-7 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <View style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-3`}>
                    <Ionicons name="medical-outline" size={20} color="white" />
                  </View>
                  <Text style={tw`text-white text-xs opacity-90 font-medium`}>
                    Veterinary Dashboard
                  </Text>
                </View>
                <Text style={tw`text-white text-2xl font-bold mb-1`}>
                  Dr. {currentUser.name}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`bg-white bg-opacity-15 px-3 py-1 rounded-full mr-2`}>
                    <Text style={tw`text-white text-xs font-semibold`}>
                      VETERINARY
                    </Text>
                  </View>
                  <Text style={tw`text-white text-xs opacity-80`}>
                    {assignedFarms.length} farms assigned
                  </Text>
                </View>
              </View>
              <DrawerButton />
            </View>
          </LinearGradient>
        </View>

        {/* Navigation Tabs */}
        <View style={tw`px-4 mb-4 -mt-3 z-10`}>
          <View style={tw`bg-white rounded-2xl p-2 flex-row shadow-lg`}>
            {[
              { key: 'overview', label: 'Overview', icon: 'analytics-outline' },
              { key: 'farms', label: 'My Farms', icon: 'leaf-outline' },
              { key: 'schedules', label: 'Schedule', icon: 'calendar-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  tw`flex-1 py-3 px-2 rounded-xl flex-row items-center justify-center`,
                  selectedTab === tab.key ? [tw`shadow-md`, { backgroundColor: theme.primary }] : tw`bg-transparent`
                ]}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={selectedTab === tab.key ? 'white' : '#6B7280'}
                />
                <Text style={[
                  tw`ml-2 font-medium text-sm`,
                  selectedTab === tab.key ? tw`text-white` : tw`text-gray-600`
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={tw`flex-1`} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        >
          {selectedTab === 'overview' && <VetOverview />}
          {selectedTab === 'farms' && <VetDashboardFarms />}
          {selectedTab === 'schedules' && <VetDashSchedules />}
        </ScrollView>
      </Animated.View>
      {/* Bottom Tabs */}
      <BottomTabs />

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </View>
  );
}
