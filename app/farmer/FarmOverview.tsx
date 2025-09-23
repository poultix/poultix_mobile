import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import hostConfig from '../../config/hostConfig';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NavigationProps } from '@/interfaces/Navigation';
import { BlurView } from 'expo-blur';
import { SharedElement } from 'react-navigation-shared-element';
import { FarmData } from '@/interfaces/Farm';
import TopNavigation from '../navigation/TopNavigation';

const { width } = Dimensions.get('window');
const isPad = width >= 768;
const isLargePhone = width >= 428;

export default function FarmDataScreen() {
  const router = useNavigation<NavigationProps>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [farmData, setFarmData] = useState<FarmData>({
    _id: '0',
    farmName: 'loading...',
    chickens: {
      healthyChickens: 0,
      sickChickens: 0,
      riskChickens: 0
    },
    locations: 'loading...'
  })
  const totalChickens = farmData.chickens.healthyChickens + farmData.chickens.sickChickens + farmData.chickens.riskChickens
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


  // Card health colors based on farm status
  const healthColors = useMemo(() => {
    const sickPercentage = farmData.chickens ? (farmData.chickens.sickChickens / totalChickens) * 100 : 0;
    return {
      primary: sickPercentage > 20 ? '#EF4444' : sickPercentage > 10 ? '#F59E0B' : '#10B981',
      secondary: sickPercentage > 20 ? '#FF6B6B' : sickPercentage > 10 ? '#FBBF24' : '#34D399',
      background: sickPercentage > 20 ? '#FEF2F2' : sickPercentage > 10 ? '#FEF3C7' : '#ECFDF5',
    };
  }, [farmData]);

  const fetchfarmData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await axios.get(hostConfig.host + '/userFarm', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      setFarmData(response.data)

      setWeatherPreview({
        temp: Math.floor(Math.random() * 20) + 15,
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * 30) + 50,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          router.navigate("NetworkError")
          return
        }


        if (error.response.status == 401) {
          await AsyncStorage.removeItem('token');
          router.navigate('SignIn');
          return
        }
        Alert.alert('Error occured', error.response.data.message)
      } else {
        Alert.alert('Network error', ' Please check your connection.');
      }
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {

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
    fetchfarmData()
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchfarmData(false);
    }, [])
  );

  const handleNavigation = (path: string) => {
    console.log(path)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => router.navigate(path));
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

  const healthyPercentage = farmData.chickens ? (farmData.chickens.healthyChickens / totalChickens) * 100 : 0;
  const sickPercentage = farmData.chickens ? (farmData.chickens.sickChickens / totalChickens) * 100 : 0;
  const atRiskPercentage = farmData.chickens ? (farmData.chickens.riskChickens / totalChickens) * 100 : 0;



  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <View style={tw`w-20 h-20 rounded-full justify-center items-center mb-4 bg-orange-500`}>
          <ActivityIndicator color="white" size="large" />
        </View>
        <Text style={tw`text-lg font-medium text-gray-700`}>Loading farm data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <TopNavigation />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw` pb-10 bg-white`}
      >
        <View
          style={[tw`flex-1 px-5 `]}
        >
          <Text style={tw`text-4xl font-extrabold tracking-tight mb-2 leading-tight text-orange-600`}>
            {farmData.farmName}
          </Text>

          <Text style={tw`text-gray-500 text-lg mb-8`}>Your farm at a testing</Text>

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

          {/* Farm Overview Card */}
          <View style={[tw`rounded-3xl overflow-hidden shadow-xl mb-6 border border-white/30`,]}
          >
            <SharedElement id='' >
              <View style={tw`bg-orange-600 p-6 relative`}>
                <BlurView intensity={25} tint="light" style={tw`absolute inset-0 rounded-3xl`} />
                <View style={tw`absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 rounded-full bg-white/10`} />
                <View style={tw`absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 rounded-full bg-white/5`} />

                {/* Card Header */}
                <View style={tw`flex-row items-center justify-between mb-6 z-10 relative`}>
                  <View style={tw`flex-row items-center`}>
                    <FontAwesome5 name='' size={20} color="white" style={tw`mr-3`} />
                    <Text style={tw`text-white text-xl font-bold`}>Farm Overview</Text>
                  </View>
                  <TouchableOpacity
                    style={tw`rounded-full bg-white/20 p-2`}
                    onPress={() => handleNavigation('FarmDetails')}
                  >
                    <Ionicons name="information-circle-outline" size={22} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Main Stats */}
                <View style={tw`flex-row items-center mb-6 z-10 relative`}>
                  <View
                    style={[tw`justify-center items-center`,]}
                  >
                    <View style={tw`relative justify-center items-center mb-2`}>
                      <View style={tw`w-26 h-26 rounded-full border-8 border-white/30`} />
                      <View
                        style={[
                          tw`absolute top-0 left-0 w-26 h-26 rounded-full border-8`,
                          {
                            borderColor: '#10B981',
                            borderLeftColor: 'transparent',
                            borderBottomColor: 'transparent',
                            borderRightColor: 'transparent',
                            transform: [{ rotateZ: `${healthyPercentage * 3.6}deg` }],
                          },
                        ]}
                      />
                      <View
                        style={[
                          tw`absolute top-0 left-0 w-26 h-26 rounded-full border-8`,
                          {
                            borderColor: '#F59E0B',
                            borderTopColor: 'transparent',
                            borderRightColor: 'transparent',
                            transform: [{ rotateZ: `${healthyPercentage * 3.6 + 90}deg` }],
                          },
                        ]}
                      />
                      <View
                        style={[
                          tw`absolute top-0 left-0 w-26 h-26 rounded-full border-8`,
                          {
                            borderColor: '#EF4444',
                            borderTopColor: 'transparent',
                            borderLeftColor: 'transparent',
                            transform: [{ rotateZ: `${(healthyPercentage + atRiskPercentage) * 3.6 + 180}deg` }],
                          },
                        ]}
                      />
                      <View style={tw`absolute flex items-center justify-center`}>
                        <Text style={tw`text-white text-2xl font-bold`}> {totalChickens}</Text>
                        <Text style={tw`text-white/80 text-xs`}>chickens</Text>
                      </View>
                    </View>
                  </View>

                  <View style={tw`flex-1 ml-5`}>
                    <View style={tw`flex-row items-center mb-3`}>
                      <View style={tw`w-3 h-3 rounded-full bg-green-500 mr-2`} />
                      <Text style={tw`text-white text-base font-medium`}>Healthy:</Text>
                      <Text style={tw`text-white font-bold ml-auto`}>{farmData.chickens.healthyChickens}</Text>
                    </View>
                    <View style={tw`flex-row items-center mb-3`}>
                      <View style={tw`w-3 h-3 rounded-full bg-yellow-500 mr-2`} />
                      <Text style={tw`text-white text-base font-medium`}>At Risk:</Text>
                      <Text style={tw`text-white font-bold ml-auto`}>{farmData.chickens.riskChickens}</Text>
                    </View>
                    <View style={tw`flex-row items-center`}>
                      <View style={tw`w-3 h-3 rounded-full bg-red-500 mr-2`} />
                      <Text style={tw`text-white text-base font-medium`}>Sick:</Text>
                      <Text style={tw`text-white font-bold ml-auto`}>{farmData.chickens.sickChickens}</Text>
                    </View>
                  </View>
                </View>

                {/* Quick Action Buttons */}
                <View style={tw`flex-row justify-between z-10 relative`}>
                  <View>
                    <TouchableOpacity
                      style={tw`bg-transparent rounded-xl py-3 px-4 flex-row items-center justify-center border border-white/30 flex-1 mr-3 shadow-md`}
                      onPress={() => handleNavigation('FarmDetails')}
                    >
                      <Ionicons name="analytics-outline" size={18} color="white" style={tw`mr-2`} />
                      <Text style={tw`text-white font-semibold bg-transparent`}>Analytics</Text>
                    </TouchableOpacity>
                  </View>

                  <View                  >
                    <TouchableOpacity
                      style={tw`bg-transparent rounded-xl py-3 px-4 flex-row items-center justify-center border border-white/30  shadow-md`}
                      onPress={() => handleNavigation('AddChicken')}
                    >
                      <Ionicons name="add-circle-outline" size={18} color="white" style={tw`mr-2`} />
                      <Text style={tw`text-white font-semibold`}>Add Chicken</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </SharedElement>
          </View>

          {/* Weather & Tools Row */}
          <View style={tw`flex-row justify-between h-96`}>
            {/* Weather Preview */}
            <View
              style={[tw`flex mr-3 rounded-3xl shadow-lg border border-gray-100 h-full `]}
            >
              <TouchableOpacity
                style={tw`bg-white p-4 h-full`}
                onPress={() => handleNavigation('WeatherCheck')}
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
              style={[tw`flex rounded-3xl shadow-lg border border-gray-100`]}
            >
              <TouchableOpacity
                style={tw`bg-white p-4 h-full justify-between`}
                onPress={() => handleNavigation('Ph_Reader')}
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
                path: 'Ph_Reader',
                bgColor: 'bg-purple-50',
                iconColor: 'text-purple-600',
                borderColor: 'border-purple-100',
              },
              {
                title: 'Chat with AI',
                description: 'Get smart recommendations from our AI assistant',
                icon: 'chatbox-ellipses-outline',
                path: 'ChatWithAI',
                bgColor: 'bg-blue-50',
                iconColor: 'text-blue-600',
                borderColor: 'border-blue-100',
              },
              {
                title: 'Find Pharmacies',
                description: 'Locate veterinary pharmacies nearby',
                icon: 'location-outline',
                path: 'Pharmacies',
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
                    <Ionicons name={item.icon} size={24} color={item.iconColor.replace('text-', '')} />
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
                      <Ionicons name={activity.icon} size={18} color={activity.iconColor} />
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
      </ScrollView>


    </SafeAreaView>
  );
}
