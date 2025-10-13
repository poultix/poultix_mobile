import BottomTabs from '@/components/BottomTabs';
import CustomDrawer from '@/components/CustomDrawer';
import DrawerButton from '@/components/DrawerButton';
import { useDrawer } from '@/contexts/DrawerContext';
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Context and hook imports
import FarmsDashboard from '@/components/dashboard/farmer/farms';
import FarmerOverview from '@/components/dashboard/farmer/overview';
import FarmerSchedulesDashboard from '@/components/dashboard/farmer/schedules';
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { getRoleTheme } from '@/utils/theme';
import { VerificationStatus } from '@/types/pharmacy';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedContainer, ThemedText, ThemedButton } from '@/components/ui/ThemedComponents';
import { DashboardHeader } from '@/components/ui/ThemedHeader';


export default function FarmerDashboardScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { currentUser } = useAuth();
  const { farms } = useFarms();
  const theme = getRoleTheme(currentUser?.role);

  const [selectedTab, setSelectedTab] = useState<'overview' | 'farms' | 'schedules'>('overview');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'FARMER') {
      Alert.alert('Access Denied', 'Farmer access required', [
        { text: 'OK' }
      ]);
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentUser, fadeAnim]);

  if (!currentUser || currentUser.role !== 'FARMER') {
    return (
      <View className={`flex-1 bg-gray-50 justify-center items-center`}>
        <Ionicons name="lock-closed-outline" size={64} color="#6B7280" />
        <Text className={`text-gray-600 text-lg mt-4`}>Access Denied</Text>
      </View>
    );
  }

  // Filter data for current user
  const myFarms = farms

  return (
    <View className={'flex-1 bg-transparent'}>
      <Animated.View style={{ opacity: fadeAnim }}
        className={'flex-1'}>
        {/* Header */}
        <View className={`pb-4`}>
          <LinearGradient
            colors={[theme.primary, theme.primary + 'CC']}
            className={`p-8 shadow-xl`}
          >
            <View className={`flex-row items-center justify-between mb-4`}>
              <View className="flex-1">
                <Text className={`text-white text-sm opacity-90`}>
                  Farmer Dashboard
                </Text>
                <Text className={`text-white text-2xl font-bold`}>
                  Welcome, {currentUser.name} 🚜
                </Text>
                <Text className={`text-white opacity-80 text-sm mt-1`}>
                  Farmer • {myFarms.length} farms
                </Text>
              </View>
              <DrawerButton />
            </View>
            
            {/* Verification Status Banner */}
            {currentUser.isVerified === false && (
              <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-4 mx-4">
                <View className="flex-row items-center">
                  <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                  <Text className="text-yellow-800 font-medium ml-2 flex-1">
                    Account verification pending
                  </Text>
                  <TouchableOpacity 
                    className="bg-yellow-500 px-3 py-1 rounded-lg"
                    onPress={() => Alert.alert('Verification', 'Please complete your profile verification to access all features.')}
                  >
                    <Text className="text-white text-xs font-semibold">Verify</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Navigation Tabs */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-2 flex-row shadow-sm">
            {[
              { key: 'overview', label: 'Overview', icon: 'analytics-outline' },
              { key: 'farms', label: 'My Farms', icon: 'leaf-outline' },
              { key: 'medicines', label: 'Medicines', icon: 'medical-outline' },
              { key: 'schedules', label: 'Schedules', icon: 'calendar-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  { backgroundColor: selectedTab === tab.key ? theme.primary : 'transparent' }
                ]}
                className={`flex-1 py-3 rounded-xl flex-row items-center justify-center`}
                onPress={() => {
                  if (tab.key === 'medicines') {
                    router.push('/medicine');
                  } else {
                    setSelectedTab(tab.key as any);
                  }
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={selectedTab === tab.key ? 'white' : '#6B7280'}
                />
                <Text className={`ml-2 font-medium ${selectedTab === tab.key ? 'text-white' : 'text-gray-600'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName={`pb-40`}
        >
          {selectedTab === 'overview' && <FarmerOverview />}
          {selectedTab === 'farms' && <FarmsDashboard />}
          {selectedTab === 'schedules' && <FarmerSchedulesDashboard />}
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