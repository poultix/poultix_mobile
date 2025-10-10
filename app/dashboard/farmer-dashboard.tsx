import BottomTabs from '@/components/BottomTabs';
import CustomDrawer from '@/components/CustomDrawer';
import DrawerButton from '@/components/DrawerButton';
import { useDrawer } from '@/contexts/DrawerContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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


export default function FarmerDashboardScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { currentUser } = useAuth();
  const { farms, loading } = useFarms();

  ;

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
  }, [currentUser]);

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
            colors={['#F59E0B', '#D97706']}
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
                <Text className={`text-orange-100 text-sm mt-1`}>
                  Farmer • {myFarms.length} farms
                </Text>
              </View>
              <DrawerButton />
            </View>
          </LinearGradient>
        </View>

        {/* Navigation Tabs */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-2 flex-row shadow-sm">
            {[
              { key: 'overview', label: 'Overview', icon: 'analytics-outline' },
              { key: 'farms', label: 'My Farms', icon: 'leaf-outline' },
              { key: 'schedules', label: 'Schedules', icon: 'calendar-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${selectedTab === tab.key ? 'bg-orange-400' : 'bg-transparent'}`}
                onPress={() => setSelectedTab(tab.key as any)}
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