import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import tw from 'twrnc';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import DrawerButton from '@/components/DrawerButton';

// Context and hook imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { ScheduleStatus } from '@/types/schedule';


export default function FarmerDashboardScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { currentUser } = useAuth();
  const { farms } = useFarms();
  const { schedules } = useSchedules();

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
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Ionicons name="lock-closed-outline" size={64} color="#6B7280" />
        <Text style={tw`text-gray-600 text-lg mt-4`}>Access Denied</Text>
      </SafeAreaView>
    );
  }

  // Filter data for current user
  const myFarms = farms.filter(farm => farm.owner.id === currentUser.id);
  const mySchedules = schedules.filter(schedule => schedule.farmer.id === currentUser.id);

  // Calculate statistics
  const totalChickens = myFarms.reduce((sum, farm) => sum + farm.livestock.total, 0);
  const healthyChickens = myFarms.reduce((sum, farm) => sum + farm.livestock.healthy, 0);
  const sickChickens = myFarms.reduce((sum, farm) => sum + farm.livestock.sick, 0);
  const atRiskChickens = myFarms.reduce((sum, farm) => sum + farm.livestock.atRisk, 0);

  const upcomingSchedules = mySchedules.filter(s =>
    s.status === ScheduleStatus.SCHEDULED && new Date(s.scheduledDate) >= new Date()
  );

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
      case 'good': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
      case 'fair': return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
      case 'poor': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const renderOverview = () => (
    <View className="px-4">
      {/* Statistics Cards */}
      <View className="flex-row flex-wrap gap-3 mb-6">
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
          <View className="flex-row items-center justify-between mb-2">
            <Ionicons name="leaf-outline" size={24} color="#10B981" />
            <Text className="text-2xl font-bold text-gray-800">{myFarms.length}</Text>
          </View>
          <Text className="text-gray-600 font-medium">My Farms</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {myFarms.reduce((sum, farm) => sum + farm.size, 0).toFixed(1)} hectares total
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
          <View className="flex-row items-center justify-between mb-2">
            <Ionicons name="analytics-outline" size={24} color="#3B82F6" />
            <Text className="text-2xl font-bold text-gray-800">{totalChickens.toLocaleString()}</Text>
          </View>
          <Text className="text-gray-600 font-medium">Total Chickens</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {((healthyChickens / totalChickens) * 100).toFixed(1)}% healthy
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
          <View className="flex-row items-center justify-between mb-2">
            <Ionicons name="calendar-outline" size={24} color="#F59E0B" />
            <Text className="text-2xl font-bold text-gray-800">{upcomingSchedules.length}</Text>
          </View>
          <Text className="text-gray-600 font-medium">Upcoming Visits</Text>
          <Text className="text-xs text-gray-500 mt-1">
            Next: {upcomingSchedules[0]?.scheduledDate.toLocaleDateString() || 'None'}
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
          <View className="flex-row items-center justify-between mb-2">
            <Ionicons name="warning-outline" size={24} color="#EF4444" />
            <Text className="text-2xl font-bold text-gray-800">{sickChickens + atRiskChickens}</Text>
          </View>
          <Text className="text-gray-600 font-medium">Need Attention</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {sickChickens} sick, {atRiskChickens} at risk
          </Text>
        </View>
      </View>

      {/* Health Overview Chart */}
      <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Flock Health Overview</Text>

        <View className="flex-row items-center justify-center mb-4">
          <View className="relative w-32 h-32 rounded-full border-8 border-gray-200 items-center justify-center">
            <View
              className="absolute -top-2 -left-2 w-32 h-32 rounded-full border-8 border-green-500"
              style={{
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                transform: [{ rotate: `${(healthyChickens / totalChickens) * 360}deg` }]
              }}
            />
            <Text className="text-2xl font-bold text-gray-800">
              {((healthyChickens / totalChickens) * 100).toFixed(0)}%
            </Text>
            <Text className="text-gray-600 text-sm">Healthy</Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <View className="w-4 h-4 rounded-full bg-green-500 mb-1" />
            <Text className="text-gray-800 font-semibold">{healthyChickens}</Text>
            <Text className="text-gray-600 text-xs">Healthy</Text>
          </View>
          <View className="items-center flex-1">
            <View className="w-4 h-4 rounded-full bg-yellow-500 mb-1" />
            <Text className="text-gray-800 font-semibold">{atRiskChickens}</Text>
            <Text className="text-gray-600 text-xs">At Risk</Text>
          </View>
          <View className="items-center flex-1">
            <View className="w-4 h-4 rounded-full bg-red-500 mb-1" />
            <Text className="text-gray-800 font-semibold">{sickChickens}</Text>
            <Text className="text-gray-600 text-xs">Sick</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-3">
          <TouchableOpacity
            className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[45%]"
            onPress={() => router.push('/farm/create' )}
          >
            <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
            <Text className="text-blue-600 font-semibold mt-2">Add Farm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 min-w-[45%]"
            onPress={() => router.push('/communication/schedule-request')}
          >
            <Ionicons name="calendar-outline" size={24} color="#10B981" />
            <Text className="text-green-600 font-semibold mt-2">Request Visit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 min-w-[45%]"
            onPress={() => router.push('/communication/messages' )}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#8B5CF6" />
            <Text className="text-purple-600 font-semibold mt-2">Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-orange-50 border border-orange-200 rounded-xl p-4 min-w-[45%]"
            onPress={() => router.push('/farm/farm-reports')}
          >
            <Ionicons name="document-text-outline" size={24} color="#F59E0B" />
            <Text className="text-orange-600 font-semibold mt-2">Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-4">Recent Activity</Text>
        {mySchedules.slice(0, 3).map((schedule) => {
          // For now, we'll show the first farm or a default message
          const farm = myFarms[0];

          return (
            <View key={schedule.id} className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">{schedule.title}</Text>
                <Text className="text-sm text-gray-600">{farm?.name}</Text>
                <Text className="text-xs text-gray-500">
                  {schedule.scheduledDate.toLocaleDateString()}
                </Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${schedule.status === 'completed' ? 'bg-green-100' : schedule.status === 'scheduled' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Text className={`text-xs font-medium capitalize ${schedule.status === 'completed' ? 'text-green-600' : schedule.status === 'scheduled' ? 'text-blue-600' : 'text-gray-600'}`}>
                  {schedule.status}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderFarms = () => (
    <View className="px-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">My Farms</Text>
        <TouchableOpacity
          className="bg-green-500 px-4 py-2 rounded-xl flex-row items-center"
          onPress={() => router.push('/farm/create')}
        >
          <Ionicons name="add-outline" size={16} color="white" />
          <Text className="text-white font-semibold ml-1">Add Farm</Text>
        </TouchableOpacity>
      </View>

      {myFarms.map((farm) => {
        const healthColors = getHealthStatusColor(farm.healthStatus);

        return (
          <TouchableOpacity
            key={farm.id}
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
            onPress={() => router.push(`/farm/farm-detail`)}
          >
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">{farm.name}</Text>
                <Text className="text-gray-600">{farm.location.address}</Text>
                <Text className="text-sm text-gray-500">
                  {farm.size} hectares • Est. {farm.establishedDate.getFullYear()}
                </Text>
              </View>
              <View className={`${healthColors.bg} ${healthColors.border} border px-3 py-1 rounded-full`}>
                <Text className={`${healthColors.text} text-xs font-bold capitalize`}>
                  {farm.healthStatus}
                </Text>
              </View>
            </View>

            <View className="bg-gray-50 rounded-xl p-4 mb-3">
              <Text className="font-semibold text-gray-800 mb-2">Livestock Overview</Text>
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <Text className="text-xl font-bold text-gray-800">{farm.livestock.total}</Text>
                  <Text className="text-gray-600 text-xs">Total</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-xl font-bold text-green-600">{farm.livestock.healthy}</Text>
                  <Text className="text-gray-600 text-xs">Healthy</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-xl font-bold text-yellow-600">{farm.livestock.atRisk}</Text>
                  <Text className="text-gray-600 text-xs">At Risk</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-xl font-bold text-red-600">{farm.livestock.sick}</Text>
                  <Text className="text-gray-600 text-xs">Sick</Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm">
                Last inspection: {farm.lastInspection?.toLocaleDateString() || 'Never'}
              </Text>
              <Ionicons name="chevron-forward-outline" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderSchedules = () => (
    <View className="px-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">My Schedules</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-xl flex-row items-center"
          onPress={() => router.push('/communication/schedule-request')}
        >
          <Ionicons name="add-outline" size={16} color="white" />
          <Text className="text-white font-semibold ml-1">Request Visit</Text>
        </TouchableOpacity>
      </View>

      {mySchedules.map((schedule) => {
        // For now, we'll show the first farm or a default message
        const farm = myFarms[0];

        return (
          <TouchableOpacity
            key={schedule.id}
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
            onPress={() => router.push(`/communication/schedule-detail`)}
          >
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">{schedule.title}</Text>
                <Text className="text-gray-600">{schedule.description}</Text>
                <Text className="text-sm text-gray-500">
                  {farm?.name} • {schedule.veterinary?.name}
                </Text>
              </View>
              <View className={`px-3 py-1 rounded-full border ${schedule.status === 'completed' ? 'bg-green-100 border-green-200' : schedule.status === 'scheduled' ? 'bg-blue-100 border-blue-200' : schedule.status === 'cancelled' ? 'bg-red-100 border-red-200' : 'bg-gray-100 border-gray-200'}`}>
                <Text className={`text-xs font-bold capitalize ${schedule.status === 'completed' ? 'text-green-600' : schedule.status === 'scheduled' ? 'text-blue-600' : schedule.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}`}>
                  {schedule.status}
                </Text>
              </View>
            </View>

            <View className="bg-gray-50 rounded-xl p-4 mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">
                    {schedule.scheduledDate.toLocaleDateString()}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">
                    {schedule.startTime} - {schedule.endTime}
                  </Text>
                </View>
              </View>
            </View>

            {schedule.notes && (
              <Text className="text-gray-600 text-sm mb-3">
                Note: {schedule.notes}
              </Text>
            )}

            <View className="flex-row items-center justify-between">
              <View className={`px-2 py-1 rounded-full ${schedule.priority === 'urgent' ? 'bg-red-100' : schedule.priority === 'high' ? 'bg-orange-100' : schedule.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                <Text className={`text-xs font-bold capitalize ${schedule.priority === 'urgent' ? 'text-red-600' : schedule.priority === 'high' ? 'text-orange-600' : schedule.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'}`}>
                  {schedule.priority} priority
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw`pb-4`}>
          <LinearGradient
            colors={['#F97316', '#EA580C']}
            style={tw`p-8 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View className="flex-1">
                <Text style={tw`text-white text-sm opacity-90`}>
                  Farmer Dashboard
                </Text>
                <Text style={tw`text-white text-2xl font-bold`}>
                  Welcome, {currentUser.name} 🚜
                </Text>
                <Text style={tw`text-orange-100 text-sm mt-1`}>
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
                className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${selectedTab === tab.key ? 'bg-orange-500' : 'bg-transparent'}`}
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
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'farms' && renderFarms()}
          {selectedTab === 'schedules' && renderSchedules()}
        </ScrollView>
      </Animated.View>

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}