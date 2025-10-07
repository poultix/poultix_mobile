import CustomDrawer from '@/components/CustomDrawer';
import DrawerButton from '@/components/DrawerButton';
import { useDrawer } from '@/contexts/DrawerContext';
import { Farm, FarmStatus } from '@/types/farm';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import tw from 'twrnc';


// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import BottomTabs from '@/components/BottomTabs';
const { width } = Dimensions.get('window');
const isLargePhone = width >= 428;

export default function FarmDataScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'>('ALL');
  
  // Use new contexts
  const { currentUser } = useAuth();
  const { farms, loading,setCurrentFarm } = useFarms();
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
        `${farm.location.latitude}, ${farm.location.longitude}`.toLowerCase().includes(searchQuery.toLowerCase())
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
    setCurrentFarm(farm)
    router.push(`/farm/farm-detail`);
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
      <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <View style={tw`items-center`}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={tw`text-gray-600 text-lg mt-4`}>Loading farms...</Text>
        </View>
      </View>
    );
  }

  if (!farms || farms.length === 0) {
    return (
      <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <View style={tw`items-center p-8`}>
          <Ionicons name="home-outline" size={64} color="#9CA3AF" />
          <Text style={tw`text-gray-600 text-lg mt-4`}>No farms available</Text>
          <Text style={tw`text-gray-500 text-sm text-center mt-2`}>
            Farms will appear here once they are registered in the system
          </Text>
        </View>
      </View>
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

            return (
              <Animated.View
                style={[
                  tw`mb-2 mx-4`,
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
                  style={tw`bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-row items-center`}
                  onPress={() => handleFarmPress(farm)}
                  activeOpacity={0.7}
                >
                  {/* Farm Icon */}
                  <View style={tw`w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-4`}>
                    <Ionicons name="home" size={20} color="#10B981" />
                  </View>

                  {/* Farm Info */}
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row items-center justify-between mb-1`}>
                      <Text style={tw`text-lg font-semibold text-gray-900`}>{farm.name}</Text>
                      <View style={tw`${healthColor.bg} ${healthColor.border} border px-2 py-1 rounded-full`}>
                        <Text style={tw`${healthColor.text} text-xs font-medium`}>{farm.healthStatus}</Text>
                      </View>
                    </View>

                    <View style={tw`flex-row items-center justify-between`}>
                      <Text style={tw`text-gray-600 text-sm`}>{farm.owner.name}</Text>
                      <Text style={tw`text-gray-600 text-sm`}>
                        {farm.livestock.total} birds
                      </Text>
                    </View>

                    <Text style={tw`text-gray-500 text-xs mt-1`}>
                      {farm.location.latitude.toFixed(4)}, {farm.location.longitude.toFixed(4)}
                    </Text>
                  </View>

                  {/* Arrow */}
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      </Animated.View>
      <BottomTabs />
      
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </View>
  );
}
