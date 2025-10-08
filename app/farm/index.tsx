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
import BottomTabs from '@/components/BottomTabs';
const { width } = Dimensions.get('window');
const isLargePhone = width >= 428;

export default function FarmDataScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'MY_FARMS'>('ALL');
  
  // Use new contexts
  const { currentUser } = useAuth();
  const { farms, loading, setCurrentFarm, assignVeterinary, unassignVeterinary } = useFarms();

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
    if (selectedFilter === 'MY_FARMS') {
      filtered = filtered.filter(farm => farm.assignedVeterinary?.id === currentUser?.id);
    } else if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(farm => farm.healthStatus === selectedFilter);
    }
    
    return filtered;
  }, [farms, searchQuery, selectedFilter, currentUser?.id]);

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
    router.push(`/farm/farm-detail` );
  };

  const handleAssignFarm = async (farm: Farm) => {
    if (!currentUser) return;
    
    try {
      await assignVeterinary(farm.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (error) {
      console.error('Error assigning farm:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  };

  const handleRemoveFarm = async (farm: Farm) => {
    try {
      await unassignVeterinary(farm.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (error) {
      console.error('Error removing farm assignment:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  };

  const isAssignedToCurrentUser = (farm: Farm): boolean => {
    return farm.assignedVeterinary?.id === currentUser?.id;
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
          <ActivityIndicator size="large" color="#D97706" />
          <Text style={tw`text-gray-600 text-lg mt-4`}>Loading farms...</Text>
        </View>
      </View>
    );
  }

  if (!farms || farms.length === 0) {
    return (
      <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <View style={tw`items-center p-8`}>
          <View style={tw`bg-amber-100 p-6 rounded-full mb-4`}>
            <Ionicons name="home-outline" size={64} color="#D97706" />
          </View>
          <Text style={tw`text-gray-800 text-xl font-bold mb-2`}>No farms available</Text>
          <Text style={tw`text-gray-600 text-sm text-center`}>
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
          colors={['#F59E0B', '#D97706']}
          style={tw`p-6 shadow-xl`}
        >
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white text-sm opacity-90`}>
                Farm Directory
              </Text>
              <Text style={tw`text-white text-2xl font-bold`}>
                {selectedFilter === 'MY_FARMS' ? 'My Assigned Farms' : 'All Farms'}
              </Text>
              {currentUser?.role === 'VETERINARY' && (
                <TouchableOpacity
                  style={tw`bg-white bg-opacity-20 px-3 py-1 rounded-full mt-2 self-start`}
                  onPress={() => setSelectedFilter(selectedFilter === 'MY_FARMS' ? 'ALL' : 'MY_FARMS')}
                >
                  <Text style={tw`text-white text-xs font-semibold`}>
                    {selectedFilter === 'MY_FARMS' ? 'Show All Farms' : 'Show My Farms'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <DrawerButton />
          </View>
          
          {/* Overall Stats */}
          <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4`}>
            <View style={tw`flex-row justify-between`}>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-white text-2xl font-bold`}>{stats.totalFarms}</Text>
                <Text style={tw`text-amber-100 text-xs font-medium`}>Total Farms</Text>
              </View>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-amber-200 text-2xl font-bold`}>{stats.totalLivestock}</Text>
                <Text style={tw`text-amber-100 text-xs font-medium`}>Total Birds</Text>
              </View>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-amber-200 text-2xl font-bold`}>{stats.healthPercentage}%</Text>
                <Text style={tw`text-amber-100 text-xs font-medium`}>Healthy</Text>
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
                  <View style={tw`w-12 h-12 rounded-full bg-amber-100 items-center justify-center mr-4`}>
                    <Ionicons name="home" size={20} color="#D97706" />
                  </View>

                  {/* Farm Info */}
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row items-center justify-between mb-1`}>
                      <View style={tw`flex-row items-center flex-1`}>
                        <Text style={tw`text-lg font-semibold text-gray-900`}>{farm.name}</Text>
                        {currentUser?.role === 'VETERINARY' && isAssignedToCurrentUser(farm) && (
                          <View style={tw`bg-amber-100 px-2 py-1 rounded-full ml-2`}>
                            <Text style={tw`text-amber-700 text-xs font-semibold`}>MY FARM</Text>
                          </View>
                        )}
                      </View>
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

                  {/* Assignment Button for Veterinary Users */}
                  {currentUser?.role === 'VETERINARY' ? (
                    <TouchableOpacity
                      style={[
                        tw`px-4 py-2 rounded-xl flex-row items-center`,
                        isAssignedToCurrentUser(farm) 
                          ? tw`bg-red-100 border border-red-200` 
                          : tw`bg-amber-100 border border-amber-200`
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (isAssignedToCurrentUser(farm)) {
                          handleRemoveFarm(farm);
                        } else {
                          handleAssignFarm(farm);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={isAssignedToCurrentUser(farm) ? "remove-circle-outline" : "add-circle-outline"} 
                        size={16} 
                        color={isAssignedToCurrentUser(farm) ? "#DC2626" : "#D97706"} 
                      />
                      <Text style={[
                        tw`ml-1 text-xs font-semibold`,
                        isAssignedToCurrentUser(farm) ? tw`text-red-600` : tw`text-amber-600`
                      ]}>
                        {isAssignedToCurrentUser(farm) ? 'Remove' : 'Assign'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  )}
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
