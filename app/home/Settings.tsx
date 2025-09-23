import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Switch,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native'
import { NavigationProps } from '@/interfaces/Navigation'
import TopNavigation from '../navigation/TopNavigation'
import { FarmerData } from '@/interfaces/Farmer'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function SettingsScreen() {
  const router = useNavigation<NavigationProps>()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [farmerData, setFarmerData] = useState<FarmerData>({
    _id: '0',
    email: 'loading',
    names: 'loading'
  })

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const cardAnim = useRef(new Animated.Value(0)).current
  const navAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loadFarmerData = async () => {
      try {
        const savedFarmerData = await AsyncStorage.getItem('farmerData')
        if (!savedFarmerData) return
        const proccessedData: FarmerData = JSON.parse(savedFarmerData)
        setFarmerData(proccessedData)
      } catch (error) {
        console.error(error)
      }
    }



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
    ]).start()
    loadFarmerData()
  }, [])

  const handleNavigation = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { })
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => router.navigate(path))
  }


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token')
    } catch (error) {
      console.error(error)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { })
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <TopNavigation />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-30 pt-5`}>
        <Animated.View style={[tw`flex-1 px-5 `, { opacity: fadeAnim }]}>
          {/* Profile Section */}
          <Animated.View
            style={[
              tw`flex-row items-center mb-8`,
              {
                opacity: cardAnim,
                transform: [
                  {
                    translateY: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              source={require('@/assets/logo.png')} // Replace with actual user image
              style={tw`w-16 h-16 rounded-full mr-4 border-2 border-[#EF4444]`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-900 text-xl font-bold`}>{farmerData.names}</Text>
              <Text style={tw`text-gray-500 text-sm`}>Trust your feelings, be a good human being</Text>
            </View>
            <TouchableOpacity onPress={() => handleNavigation('Profile')}>
              <Ionicons name="chevron-forward" size={24} color="#6B7280" />
            </TouchableOpacity>
          </Animated.View>

          {/* Settings Options */}
          <View style={tw`mb-6`}>
            {[
              {
                icon: 'moon-outline',
                title: 'Dark mode',
                action: () => (
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
                    thumbColor={isDarkMode ? '#FFFFFF' : '#F3F4F6'}
                  />
                ),
              },
              { icon: 'person-outline', title: 'Account', path: 'AccountSettings' },
              { icon: 'notifications-outline', title: 'Notification', path: 'NotificationSettings' },
              { icon: 'chatbox-ellipses-outline', title: 'Chat settings', path: 'ChatSettings' },
              { icon: 'pie-chart-outline', title: 'Data and storage', path: 'DataAndStorage' },
              { icon: 'lock-closed-outline', title: 'Privacy and security', path: 'PrivacyAndSecurity' },
              { icon: 'information-circle-outline', title: 'About', path: 'About' },
            ].map((item, index) => (
              <Animated.View
                key={item.title}
                style={[
                  tw`mb-2`,
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
                  onPress={() => item.path && handleNavigation(item.path)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={item.icon} size={24} color="#EF4444" style={tw`mr-4`} />
                  <Text style={tw`flex-1 text-gray-900 font-semibold text-lg`}>{item.title}</Text>
                  {item.action ? (
                    item.action()
                  ) : (
                    <Ionicons name="chevron-forward" size={22} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={tw`flex-row items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100`}
          >
            <Ionicons name='log-out' color="#EF4444" size={24} style={tw`mr-4`} />
            <Text style={tw`flex-1 text-gray-900 font-semibold text-lg`}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>


    </SafeAreaView>
  )
}
