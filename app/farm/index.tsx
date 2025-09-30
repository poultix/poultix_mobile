import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import { Farm, FarmStatus } from '@/types/farm';
import { User } from '@/types/user';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import DrawerButton from '@/components/DrawerButton';
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";


// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { useSchedules } from '@/contexts/ScheduleContext';
const { width } = Dimensions.get('window');
const isLargePhone = width >= 428;

export default function FarmDataScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'>('ALL');
  
  // Use new contexts
  const { currentUser } = useAuth();
  const { farms, loading } = useFarms();
  const { schedules } = useSchedules();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  // Filter farms based on search and status
  const filteredFarms = useMemo(() => {
    let filtered = farms;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(farm => 
        farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(farm => farm.healthStatus === selectedFilter);
    }
    
    return filtered;
  }, [farms, searchQuery, selectedFilter]);

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalFarms = farms.length;
    const totalLivestock = farms.reduce((sum, farm) => sum + farm.livestock.total, 0);
    const totalHealthy = farms.reduce((sum, farm) => sum + farm.livestock.healthy, 0);
    const totalSick = farms.reduce((sum, farm) => sum + farm.livestock.sick, 0);
    
    return {
      totalFarms,
      totalLivestock,
      totalHealthy,
      totalSick,
      healthPercentage: totalLivestock > 0 ? Math.round((totalHealthy / totalLivestock) * 100) : 0
    };
  }, [farms]);
  // Start animations
  const startAnimations = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };


  useEffect(() => {
    startAnimations();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh will be handled by context
    setRefreshing(false);
  };

  const handleFarmPress = (farm: Farm) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(`/farm/farm-detail?farmId=${farm.id}`);
  };

  const getHealthStatusColor = (status: FarmStatus) => {
    switch (status) {
      case 'EXCELLENT':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case 'GOOD':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      case 'FAIR':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'POOR':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };



  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <View style={tw`items-center`}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={tw`text-gray-600 text-lg mt-4`}>Loading farms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!farms || farms.length === 0) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <View style={tw`items-center p-8`}>
          <Ionicons name="home-outline" size={64} color="#9CA3AF" />
          <Text style={tw`text-gray-600 text-lg mt-4`}>No farms available</Text>
          <Text style={tw`text-gray-500 text-sm text-center mt-2`}>
            Farms will appear here once they are registered in the system
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={tw`p-6 shadow-xl`}
        >
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white text-sm opacity-90`}>
                Farm Directory
              </Text>
              <Text style={tw`text-white text-2xl font-bold`}>
                All Farms 🏡
              </Text>
            </View>
            <DrawerButton />
          </View>
          
          {/* Overall Stats */}
          <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4`}>
            <View style={tw`flex-row justify-between`}>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-white text-2xl font-bold`}>{stats.totalFarms}</Text>
                <Text style={tw`text-green-100 text-xs font-medium`}>Total Farms</Text>
              </View>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-green-200 text-2xl font-bold`}>{stats.totalLivestock}</Text>
                <Text style={tw`text-green-100 text-xs font-medium`}>Total Birds</Text>
              </View>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-green-200 text-2xl font-bold`}>{stats.healthPercentage}%</Text>
                <Text style={tw`text-green-100 text-xs font-medium`}>Healthy</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Farm List */}
        <FlatList
          data={filteredFarms}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-6 pt-4`}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item: farm, index }) => {
            const healthColor = getHealthStatusColor(farm.healthStatus);
            const totalLivestock = farm.livestock.total;
            const healthPercentage = totalLivestock > 0 ? Math.round((farm.livestock.healthy / totalLivestock) * 100) : 0;

            return (
              <Animated.View
                style={[
                  tw`mb-4 mx-4`,
                  {
                    opacity: cardAnim,
                    transform: [
                      {
                        translateY: cardAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10 * (index + 1), 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}
                  onPress={() => handleFarmPress(farm)}
                  activeOpacity={0.7}
                >
                  {/* Farm Header */}
                  <View style={tw`p-4 border-b border-gray-100`}>
                    <View style={tw`flex-row justify-between items-start mb-2`}>
                      <View style={tw`flex-1`}>
                        <Text style={tw`text-xl font-bold text-gray-900`}>{farm.name}</Text>
                        <Text style={tw`text-gray-600 text-sm mt-1`}>{farm.location.address}</Text>
                      </View>
                      <View style={tw`${healthColor.bg} ${healthColor.border} border px-3 py-1 rounded-full`}>
                        <Text style={tw`${healthColor.text} text-xs font-medium`}>{farm.healthStatus}</Text>
                      </View>
                    </View>
                    <View style={tw`flex-row items-center`}>
                      <Ionicons name="person-outline" size={16} color="#6B7280" />
                      <Text style={tw`text-gray-600 text-sm ml-1`}>Owner: {farm.owner.name}</Text>
                    </View>
                  </View>

                  {/* Farm Stats */}
                  <View style={tw`p-4`}>
                    <View style={tw`flex-row justify-between mb-3`}>
                      <View style={tw`items-center flex-1`}>
                        <Text style={tw`text-2xl font-bold text-gray-900`}>{totalLivestock}</Text>
                        <Text style={tw`text-gray-500 text-xs`}>Total Birds</Text>
                      </View>
                      <View style={tw`items-center flex-1`}>
                        <Text style={tw`text-2xl font-bold text-green-600`}>{farm.livestock.healthy}</Text>
                        <Text style={tw`text-gray-500 text-xs`}>Healthy</Text>
                      </View>
                      <View style={tw`items-center flex-1`}>
                        <Text style={tw`text-2xl font-bold text-yellow-600`}>{farm.livestock.atRisk}</Text>
                        <Text style={tw`text-gray-500 text-xs`}>At Risk</Text>
                      </View>
                      <View style={tw`items-center flex-1`}>
                        <Text style={tw`text-2xl font-bold text-red-600`}>{farm.livestock.sick}</Text>
                        <Text style={tw`text-gray-500 text-xs`}>Sick</Text>
                      </View>
                    </View>

                    {/* Health Progress Bar */}
                    <View style={tw`mt-3`}>
                      <View style={tw`flex-row justify-between items-center mb-2`}>
                        <Text style={tw`text-gray-700 font-medium text-sm`}>Overall Health</Text>
                        <Text style={tw`text-gray-600 text-sm`}>{healthPercentage}%</Text>
                      </View>
                      <View style={tw`h-2 bg-gray-200 rounded-full overflow-hidden`}>
                        <View 
                          style={[
                            tw`h-full rounded-full`,
                            { 
                              width: `${healthPercentage}%`,
                              backgroundColor: healthPercentage >= 80 ? '#10B981' : healthPercentage >= 60 ? '#F59E0B' : '#EF4444'
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>

                  {/* Action Row */}
                  <View style={tw`flex-row border-t border-gray-100`}>
                    <TouchableOpacity 
                      style={tw`flex-1 p-3 items-center border-r border-gray-100`}
                      onPress={() => router.push('/communication/messages')}
                    >
                      <Ionicons name="chatbubble-outline" size={20} color="#3B82F6" />
                      <Text style={tw`text-blue-600 text-xs mt-1`}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={tw`flex-1 p-3 items-center border-r border-gray-100`}
                      onPress={() => router.push('/communication/schedule-request')}
                    >
                      <Ionicons name="calendar-outline" size={20} color="#059669" />
                      <Text style={tw`text-green-600 text-xs mt-1`}>Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={tw`flex-1 p-3 items-center`}
                      onPress={() => handleFarmPress(farm)}
                    >
                      <Ionicons name="eye-outline" size={20} color="#6B7280" />
                      <Text style={tw`text-gray-600 text-xs mt-1`}>View</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      </Animated.View>
      
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </View>
  );
}
