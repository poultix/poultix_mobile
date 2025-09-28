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
const isPad = width >= 768;
const isLargePhone = width >= 428;

export default function FarmDataScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const [refreshing, setRefreshing] = useState(false);
  
  // Use new contexts
  const { currentUser } = useAuth();
  const { farms, currentFarm, setCurrentFarm, isLoading } = useFarms();
  const { schedules } = useSchedules();
  
  const totalChickens = currentFarm?.livestock ? currentFarm.livestock.total : 0
  const [weatherPreview, setWeatherPreview] = useState({
    temp: 24,
    condition: 'sunny',
    humidity: 65,
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'Increased risk of heat stress today' },
    { id: 2, type: 'info', message: 'Feeding schedule updated' },
  ]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const navAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(0)).current;


  // Set current farm for the user
  useEffect(() => {
    if (currentUser && farms.length > 0 && !currentFarm) {
      // Find user's farm
      const userFarm = farms.find(farm => farm.owner.id === currentUser.id);
      if (userFarm) {
        setCurrentFarm(userFarm);
      }
    }
  }, [currentUser, farms, currentFarm, setCurrentFarm]);

  // Card health colors based on farm status
  const healthColors = useMemo(() => {
    const sickPercentage = currentFarm?.livestock ? (currentFarm.livestock.sick / totalChickens) * 100 : 0;
    return {
      primary: sickPercentage > 20 ? '#EF4444' : sickPercentage > 10 ? '#F59E0B' : '#10B981',
      secondary: sickPercentage > 20 ? '#FF6B6B' : sickPercentage > 10 ? '#FBBF24' : '#34D399',
      background: sickPercentage > 20 ? '#FEF2F2' : sickPercentage > 10 ? '#FEF3C7' : '#ECFDF5',
    };
  }, [currentFarm, totalChickens]);
  // Start animations
  const startAnimations = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(cardAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(navAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(chartAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(buttonAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(notificationAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };


  useEffect(() => {
    startAnimations();
    // Update weather preview
    setWeatherPreview({
      temp: Math.floor(Math.random() * 20) + 15,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 30) + 50,
    });
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh will be handled by context
    setRefreshing(false);
  };

  const handleNavigation = (path: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => router.push(path));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'sunny-outline';
      case 'cloudy':
        return 'cloudy-outline';
      case 'rainy':
        return 'rainy-outline';
      default:
        return 'partly-sunny-outline';
    }
  };

  const sickPercentage = currentFarm?.livestock ? (currentFarm.livestock.sick / totalChickens) * 100 : 0;
  const atRiskPercentage = currentFarm?.livestock ? (currentFarm.livestock.atRisk / totalChickens) * 100 : 0;



  if (!currentFarm) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>No farm data available</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <View style={tw`w-20 h-20 rounded-full justify-center items-center mb-4 bg-orange-500`}>
          <ActivityIndicator color="white" size="large" />
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-10`}
      >
        <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
          {/* Enhanced Header */}
          <View style={tw`pb-4`}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={tw` p-8 shadow-xl`}
            >
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-sm opacity-90`}>
                    Farm Management
                  </Text>
                  <Text style={tw`text-white text-2xl font-bold`}>
                    {currentFarm.name} 🚜
                  </Text>
                  <Text style={tw`text-green-100 text-sm mt-1`}>
                    {currentFarm.location.address}
                  </Text>
                </View>
                <DrawerButton />
              </View>
              
              {/* Farm Stats */}
              <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                <Text style={tw`text-white font-bold text-lg mb-4`}>Farm Overview</Text>
                <View style={tw`flex-row justify-between`}>
                  <View style={tw`items-center flex-1`}>
                    <Text style={tw`text-white text-2xl font-bold`}>{totalChickens}</Text>
                    <Text style={tw`text-green-100 text-xs font-medium`}>Total Birds</Text>
                  </View>
                  <View style={tw`items-center flex-1`}>
                    <Text style={tw`text-green-200 text-2xl font-bold`}>{currentFarm.livestock.healthy}</Text>
                    <Text style={tw`text-green-100 text-xs font-medium`}>Healthy</Text>
                  </View>
                  <View style={tw`items-center flex-1`}>
                    <Text style={tw`text-yellow-200 text-2xl font-bold`}>{currentFarm.livestock.atRisk}</Text>
                    <Text style={tw`text-green-100 text-xs font-medium`}>At Risk</Text>
                  </View>
                  <View style={tw`items-center flex-1`}>
                    <Text style={tw`text-red-200 text-2xl font-bold`}>{currentFarm.livestock.sick}</Text>
                    <Text style={tw`text-green-100 text-xs font-medium`}>Sick</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={tw`px-5`}>

          {/* Notifications */}
          {/* {notifications.length > 0 && (
            <Animated.View
              style={{
                opacity: notificationAnim,
                transform: [
                  {
                    translateY: notificationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tw`p-2`}
              >
                {notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={tw`mr-3 p-3 w-96 bg-white rounded-xl border border-gray-100 shadow-sm flex-row items-center max-w-[${isPad ? '300px' : '260px'}]`}

                  >
                    <View
                      style={tw`mr-3 p-2 rounded-full bg-${notification.type === 'alert' ? 'red-100' : 'blue-100'}`}
                    >
                      <Ionicons
                        name={notification.type === 'alert' ? 'warning-outline' : 'information-circle-outline'}
                        size={20}
                        color={notification.type === 'alert' ? '#EF4444' : '#3B82F6'}
                      />
                    </View>
                    <Text style={tw`flex-1 text-gray-800 font-medium text-sm`} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="#6B7280" style={tw`ml-1`} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )} */}

        
          {/* Weather & Tools Row */}
          <View style={tw`flex-row justify-between flex-1 py-2`}>
            {/* Weather Preview */}
            <View
              style={[tw`flex mr-3  border border-gray-400 `]}
            >
              <TouchableOpacity
                style={tw`bg-white p-4 h-full`}
                onPress={() => handleNavigation('/weather-check' as any)}
                activeOpacity={0.9}
              >
                <View style={tw`flex-row items-center justify-between mb-3`}>
                  <Text style={tw`text-gray-800 font-semibold`}>Weather</Text>
                  <Ionicons name={getWeatherIcon(weatherPreview.condition)} size={24} color="#EF4444" />
                </View>
                <View style={tw`items-center`}>
                  <Text style={tw`text-3xl font-bold text-gray-800`}>{weatherPreview.temp}°</Text>
                  <Text style={tw`text-gray-500 text-sm`}>{weatherPreview.humidity}% humidity</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Stool Analysis Quick Access */}
            <View
              style={[tw`flex-1 border border-gray-400`]}
            >
              <TouchableOpacity
                style={tw`bg-white p-4 h-full justify-between`}
                onPress={() => handleNavigation('/bluetooth/ph-reader' as any)}
                activeOpacity={0.9}
              >
                <View style={tw`flex-row items-center justify-between`}>
                  <Text style={tw`text-gray-800 font-semibold`}>Quick Scan</Text>
                  <Ionicons name="scan-outline" size={24} color="#EF4444" />
                </View>
                <View style={tw`bg-gray-500 rounded-xl p-3 mt-2 border border-gray-100`}>
                  <Text style={tw`text-gray-800 text-xs text-center`}>Tap to analyze stool samples</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Health Monitoring Section */}
          <View style={tw`mb-6 p-3`}>
            <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>Health Tools</Text>

            {[
              {
                title: 'Stool Analysis',
                description: 'Scan and analyze chicken stool samples',
                icon: 'mic-circle-outline',
                path: '/bluetooth/ph-reader',
                bgColor: 'bg-purple-50',
                iconColor: 'text-purple-600',
                borderColor: 'border-purple-100',
              },
              {
                title: 'Chat with AI',
                description: 'Get smart recommendations from our AI assistant',
                icon: 'chatbox-ellipses-outline',
                path: '/general/ai',
                bgColor: 'bg-blue-50',
                iconColor: 'text-blue-600',
                borderColor: 'border-blue-100',
              },
              {
                title: 'Find Pharmacies',
                description: 'Locate veterinary pharmacies nearby',
                icon: 'location-outline',
                path: '/pharmacy',
                bgColor: 'bg-green-50',
                iconColor: 'text-green-600',
                borderColor: 'border-green-100',
              },
            ].map((item, index) => (
              <Animated.View
                key={item.title}
                style={[
                  tw`mb-3`,
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
                  style={tw`flex-row items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100`}
                  onPress={() => handleNavigation(item.path)}
                  activeOpacity={0.7}
                >
                  <View style={tw`${item.bgColor} p-3 rounded-xl mr-4 ${item.borderColor} border`}>
                    <Ionicons name={item.icon as any} size={24} color={item.iconColor.replace('text-', '#').replace('purple-600', '#9333EA').replace('blue-600', '#2563EB').replace('green-600', '#059669')} />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-900 font-semibold text-lg`}>{item.title}</Text>
                    <Text style={tw`text-gray-500 text-sm`}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="#6B7280" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Recent Activity Section */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-2xl font-bold text-gray-900`}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={tw`font-medium text-[#EF4444]`}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}>
              {[
                {
                  title: 'Added new chicken',
                  time: '2 hours ago',
                  icon: 'add-circle-outline',
                  iconBg: 'bg-green-100',
                  iconColor: '#10B981',
                },
                {
                  title: 'Updated feeding schedule',
                  time: 'Yesterday',
                  icon: 'calendar-outline',
                  iconBg: 'bg-blue-100',
                  iconColor: '#3B82F6',
                },
                {
                  title: 'Detected sick chicken',
                  time: '2 days ago',
                  icon: 'medkit-outline',
                  iconBg: 'bg-red-100',
                  iconColor: '#EF4444',
                },
              ].map((activity, index, array) => (
                <View key={activity.title}>
                  <View style={tw`flex-row items-center p-4`}>
                    <View style={tw`${activity.iconBg} p-2 rounded-full mr-3`}>
                      <Ionicons name={activity.icon as any} size={18} color={activity.iconColor} />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-gray-900 font-medium`}>{activity.title}</Text>
                      <Text style={tw`text-gray-500 text-xs`}>{activity.time}</Text>
                    </View>
                  </View>
                  {index < array.length - 1 && <View style={tw`h-px bg-gray-100 ml-12`} />}
                </View>
              ))}
            </View>
          </View>
          </View>
        </Animated.View>
      </ScrollView>
      
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}
