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
import tw from 'twrnc';
import { router } from 'expo-router';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import DrawerButton from '@/components/DrawerButton';
import { useRoleBasedData, useFarms, useSchedules } from '@/hooks/useCrud';
import { useDataRelationships } from '@/hooks/useCrud';

export default function FarmerDashboardScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { currentUser, isFarmer, getCurrentUserData } = useRoleBasedData();
  const { getFarmsByUser } = useFarms();
  const { getSchedulesByUser } = useSchedules();
  const { getRelatedData } = useDataRelationships();
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'farms' | 'schedules'>('overview');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isFarmer) {
      Alert.alert('Access Denied', 'Farmer access required', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      return;
    }
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [isFarmer]);

  if (!isFarmer || !currentUser) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Ionicons name="lock-closed-outline" size={64} color="#6B7280" />
        <Text style={tw`text-gray-600 text-lg mt-4`}>Access Denied</Text>
      </SafeAreaView>
    );
  }

  const userData = getCurrentUserData();
  const myFarms = getFarmsByUser(currentUser.id);
  const mySchedules = getSchedulesByUser(currentUser.id);

  // Calculate statistics
  const totalChickens = myFarms.reduce((sum, farm) => sum + farm.livestock.chickens.total, 0);
  const healthyChickens = myFarms.reduce((sum, farm) => sum + farm.livestock.chickens.healthy, 0);
  const sickChickens = myFarms.reduce((sum, farm) => sum + farm.livestock.chickens.sick, 0);
  const atRiskChickens = myFarms.reduce((sum, farm) => sum + farm.livestock.chickens.atRisk, 0);
  
  const upcomingSchedules = mySchedules.filter(s => 
    s.status === 'scheduled' && new Date(s.scheduledDate) >= new Date()
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
    <View style={tw`px-4`}>
      {/* Statistics Cards */}
      <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
        <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Ionicons name="leaf-outline" size={24} color="#10B981" />
            <Text style={tw`text-2xl font-bold text-gray-800`}>{myFarms.length}</Text>
          </View>
          <Text style={tw`text-gray-600 font-medium`}>My Farms</Text>
          <Text style={tw`text-xs text-gray-500 mt-1`}>
            {myFarms.reduce((sum, farm) => sum + farm.size, 0).toFixed(1)} hectares total
          </Text>
        </View>
        
        <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Ionicons name="analytics-outline" size={24} color="#3B82F6" />
            <Text style={tw`text-2xl font-bold text-gray-800`}>{totalChickens.toLocaleString()}</Text>
          </View>
          <Text style={tw`text-gray-600 font-medium`}>Total Chickens</Text>
          <Text style={tw`text-xs text-gray-500 mt-1`}>
            {((healthyChickens / totalChickens) * 100).toFixed(1)}% healthy
          </Text>
        </View>
        
        <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Ionicons name="calendar-outline" size={24} color="#F59E0B" />
            <Text style={tw`text-2xl font-bold text-gray-800`}>{upcomingSchedules.length}</Text>
          </View>
          <Text style={tw`text-gray-600 font-medium`}>Upcoming Visits</Text>
          <Text style={tw`text-xs text-gray-500 mt-1`}>
            Next: {upcomingSchedules[0]?.scheduledDate.toLocaleDateString() || 'None'}
          </Text>
        </View>
        
        <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Ionicons name="warning-outline" size={24} color="#EF4444" />
            <Text style={tw`text-2xl font-bold text-gray-800`}>{sickChickens + atRiskChickens}</Text>
          </View>
          <Text style={tw`text-gray-600 font-medium`}>Need Attention</Text>
          <Text style={tw`text-xs text-gray-500 mt-1`}>
            {sickChickens} sick, {atRiskChickens} at risk
          </Text>
        </View>
      </View>

      {/* Health Overview Chart */}
      <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-6`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Flock Health Overview</Text>
        
        <View style={tw`flex-row items-center justify-center mb-4`}>
          <View style={tw`relative w-32 h-32 rounded-full border-8 border-gray-200 items-center justify-center`}>
            <View 
              style={[
                tw`absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-green-500`,
                { 
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  transform: [{ rotate: `${(healthyChickens / totalChickens) * 360}deg` }]
                }
              ]} 
            />
            <Text style={tw`text-2xl font-bold text-gray-800`}>
              {((healthyChickens / totalChickens) * 100).toFixed(0)}%
            </Text>
            <Text style={tw`text-gray-600 text-sm`}>Healthy</Text>
          </View>
        </View>
        
        <View style={tw`flex-row justify-between`}>
          <View style={tw`items-center flex-1`}>
            <View style={tw`w-4 h-4 rounded-full bg-green-500 mb-1`} />
            <Text style={tw`text-gray-800 font-semibold`}>{healthyChickens}</Text>
            <Text style={tw`text-gray-600 text-xs`}>Healthy</Text>
          </View>
          <View style={tw`items-center flex-1`}>
            <View style={tw`w-4 h-4 rounded-full bg-yellow-500 mb-1`} />
            <Text style={tw`text-gray-800 font-semibold`}>{atRiskChickens}</Text>
            <Text style={tw`text-gray-600 text-xs`}>At Risk</Text>
          </View>
          <View style={tw`items-center flex-1`}>
            <View style={tw`w-4 h-4 rounded-full bg-red-500 mb-1`} />
            <Text style={tw`text-gray-800 font-semibold`}>{sickChickens}</Text>
            <Text style={tw`text-gray-600 text-xs`}>Sick</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-6`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Quick Actions</Text>
        <View style={tw`flex-row flex-wrap gap-3`}>
          <TouchableOpacity
            style={tw`flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[45%]`}
            onPress={() => router.push('/farm/create' as any)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
            <Text style={tw`text-blue-600 font-semibold mt-2`}>Add Farm</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw`flex-1 bg-green-50 border border-green-200 rounded-xl p-4 min-w-[45%]`}
            onPress={() => router.push('/communication/schedule-request' as any)}
          >
            <Ionicons name="calendar-outline" size={24} color="#10B981" />
            <Text style={tw`text-green-600 font-semibold mt-2`}>Request Visit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw`flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 min-w-[45%]`}
            onPress={() => router.push('/communication/messages' as any)}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#8B5CF6" />
            <Text style={tw`text-purple-600 font-semibold mt-2`}>Messages</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw`flex-1 bg-orange-50 border border-orange-200 rounded-xl p-4 min-w-[45%]`}
            onPress={() => router.push('/farm-reports' as any)}
          >
            <Ionicons name="document-text-outline" size={24} color="#F59E0B" />
            <Text style={tw`text-orange-600 font-semibold mt-2`}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={tw`bg-white rounded-2xl p-5 shadow-sm`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Recent Activity</Text>
        {mySchedules.slice(0, 3).map((schedule) => {
          const farm = myFarms.find(f => f.id === schedule.farmId);
          
          return (
            <View key={schedule.id} style={tw`flex-row items-center py-3 border-b border-gray-100 last:border-b-0`}>
              <View style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3`}>
                <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`font-medium text-gray-800`}>{schedule.title}</Text>
                <Text style={tw`text-sm text-gray-600`}>{farm?.name}</Text>
                <Text style={tw`text-xs text-gray-500`}>
                  {schedule.scheduledDate.toLocaleDateString()}
                </Text>
              </View>
              <View style={[
                tw`px-2 py-1 rounded-full`,
                schedule.status === 'completed' ? tw`bg-green-100` :
                schedule.status === 'scheduled' ? tw`bg-blue-100` : tw`bg-gray-100`
              ]}>
                <Text style={[
                  tw`text-xs font-medium capitalize`,
                  schedule.status === 'completed' ? tw`text-green-600` :
                  schedule.status === 'scheduled' ? tw`text-blue-600` : tw`text-gray-600`
                ]}>
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
    <View style={tw`px-4`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-xl font-bold text-gray-800`}>My Farms</Text>
        <TouchableOpacity
          style={tw`bg-green-500 px-4 py-2 rounded-xl flex-row items-center`}
          onPress={() => router.push('/farm/create' as any)}
        >
          <Ionicons name="add-outline" size={16} color="white" />
          <Text style={tw`text-white font-semibold ml-1`}>Add Farm</Text>
        </TouchableOpacity>
      </View>
      
      {myFarms.map((farm) => {
        const healthColors = getHealthStatusColor(farm.healthStatus);
        
        return (
          <TouchableOpacity
            key={farm.id}
            style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}
            onPress={() => router.push(`/farm-detail/${farm.id}` as any)}
          >
            <View style={tw`flex-row items-start justify-between mb-3`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold text-gray-800`}>{farm.name}</Text>
                <Text style={tw`text-gray-600`}>{farm.location.address}</Text>
                <Text style={tw`text-sm text-gray-500`}>
                  {farm.size} hectares • Est. {farm.establishedDate.getFullYear()}
                </Text>
              </View>
              <View style={tw`${healthColors.bg} ${healthColors.border} border px-3 py-1 rounded-full`}>
                <Text style={tw`${healthColors.text} text-xs font-bold capitalize`}>
                  {farm.healthStatus}
                </Text>
              </View>
            </View>
            
            <View style={tw`bg-gray-50 rounded-xl p-4 mb-3`}>
              <Text style={tw`font-semibold text-gray-800 mb-2`}>Livestock Overview</Text>
              <View style={tw`flex-row justify-between`}>
                <View style={tw`items-center flex-1`}>
                  <Text style={tw`text-xl font-bold text-gray-800`}>{farm.livestock.chickens.total}</Text>
                  <Text style={tw`text-gray-600 text-xs`}>Total</Text>
                </View>
                <View style={tw`items-center flex-1`}>
                  <Text style={tw`text-xl font-bold text-green-600`}>{farm.livestock.chickens.healthy}</Text>
                  <Text style={tw`text-gray-600 text-xs`}>Healthy</Text>
                </View>
                <View style={tw`items-center flex-1`}>
                  <Text style={tw`text-xl font-bold text-yellow-600`}>{farm.livestock.chickens.atRisk}</Text>
                  <Text style={tw`text-gray-600 text-xs`}>At Risk</Text>
                </View>
                <View style={tw`items-center flex-1`}>
                  <Text style={tw`text-xl font-bold text-red-600`}>{farm.livestock.chickens.sick}</Text>
                  <Text style={tw`text-gray-600 text-xs`}>Sick</Text>
                </View>
              </View>
            </View>
            
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-gray-500 text-sm`}>
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
    <View style={tw`px-4`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-xl font-bold text-gray-800`}>My Schedules</Text>
        <TouchableOpacity
          style={tw`bg-blue-500 px-4 py-2 rounded-xl flex-row items-center`}
          onPress={() => router.push('/communication/schedule-request' as any)}
        >
          <Ionicons name="add-outline" size={16} color="white" />
          <Text style={tw`text-white font-semibold ml-1`}>Request Visit</Text>
        </TouchableOpacity>
      </View>
      
      {mySchedules.map((schedule) => {
        const farm = myFarms.find(f => f.id === schedule.farmId);
        const relatedData = getRelatedData('schedule', schedule.id);
        
        return (
          <TouchableOpacity
            key={schedule.id}
            style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}
            onPress={() => router.push(`/schedule-detail/${schedule.id}` as any)}
          >
            <View style={tw`flex-row items-start justify-between mb-3`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold text-gray-800`}>{schedule.title}</Text>
                <Text style={tw`text-gray-600`}>{schedule.description}</Text>
                <Text style={tw`text-sm text-gray-500`}>
                  {farm?.name} • {relatedData?.veterinary?.name}
                </Text>
              </View>
              <View style={[
                tw`px-3 py-1 rounded-full border`,
                schedule.status === 'completed' ? tw`bg-green-100 border-green-200` :
                schedule.status === 'scheduled' ? tw`bg-blue-100 border-blue-200` :
                schedule.status === 'cancelled' ? tw`bg-red-100 border-red-200` : tw`bg-gray-100 border-gray-200`
              ]}>
                <Text style={[
                  tw`text-xs font-bold capitalize`,
                  schedule.status === 'completed' ? tw`text-green-600` :
                  schedule.status === 'scheduled' ? tw`text-blue-600` :
                  schedule.status === 'cancelled' ? tw`text-red-600` : tw`text-gray-600`
                ]}>
                  {schedule.status}
                </Text>
              </View>
            </View>
            
            <View style={tw`bg-gray-50 rounded-xl p-4 mb-3`}>
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={tw`text-gray-600 ml-2`}>
                    {schedule.scheduledDate.toLocaleDateString()}
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={tw`text-gray-600 ml-2`}>
                    {schedule.startTime} - {schedule.endTime}
                  </Text>
                </View>
              </View>
            </View>
            
            {schedule.notes && (
              <Text style={tw`text-gray-600 text-sm mb-3`}>
                Note: {schedule.notes}
              </Text>
            )}
            
            <View style={tw`flex-row items-center justify-between`}>
              <View style={[
                tw`px-2 py-1 rounded-full`,
                schedule.priority === 'urgent' ? tw`bg-red-100` :
                schedule.priority === 'high' ? tw`bg-orange-100` :
                schedule.priority === 'medium' ? tw`bg-yellow-100` : tw`bg-gray-100`
              ]}>
                <Text style={[
                  tw`text-xs font-bold capitalize`,
                  schedule.priority === 'urgent' ? tw`text-red-600` :
                  schedule.priority === 'high' ? tw`text-orange-600` :
                  schedule.priority === 'medium' ? tw`text-yellow-600` : tw`text-gray-600`
                ]}>
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
        <View style={tw`px-4 pt-2 pb-4`}>
          <LinearGradient
            colors={['#F97316', '#EA580C']}
            style={tw`rounded-3xl p-8 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white text-sm opacity-90`}>
                  Farmer Dashboard
                </Text>
                <Text style={tw`text-white text-2xl font-bold`}>
                  Welcome, {currentUser.name} 🚜
                </Text>
                <Text style={tw`text-orange-100 text-sm mt-1`}>
                  {currentUser.farmerData?.experience} years experience • {myFarms.length} farms
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
              { key: 'schedules', label: 'Schedules', icon: 'calendar-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  tw`flex-1 py-3 rounded-xl flex-row items-center justify-center`,
                  selectedTab === tab.key ? tw`bg-orange-500` : tw`bg-transparent`
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
        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
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
