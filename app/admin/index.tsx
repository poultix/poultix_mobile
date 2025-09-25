import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import tw from 'twrnc'
import { router } from 'expo-router'
import CustomDrawer from '@/components/CustomDrawer'
import { useDrawer } from '@/contexts/DrawerContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window');

interface AdminStats {
  totalUsers: number;
  totalFarms: number;
  totalNews: number;
  totalPharmacies: number;
  totalVets: number;
}

interface QuickAction {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradientColors: string[];
  action: () => void;
  description: string;
}

export default function AdminScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer()
  const [userRole, setUserRole] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalFarms: 0,
    totalNews: 0,
    totalPharmacies: 0,
    totalVets: 0
  })

  // Enhanced Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const headerAnim = useRef(new Animated.Value(-50)).current
  const cardAnim = useRef(new Animated.Value(0)).current
  const contentAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    checkAdminAccess()
    loadAdminData()
    
    // Enhanced staggered animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(headerAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 600,
          delay: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const role = await AsyncStorage.getItem('role')
      const email = await AsyncStorage.getItem('userEmail')
      
      if (role !== 'admin') {
        Alert.alert('Access Denied', 'You need admin privileges to access this area.', [
          { text: 'OK', onPress: () => router.back() }
        ])
        return
      }
      
      setUserRole(role)
      setUserName(email?.split('@')[0] || 'Admin')
    } catch (error) {
      console.error('Error checking admin access:', error)
    }
  }

  const loadAdminData = async () => {
    try {
      // Simulate loading admin statistics
      setAdminStats({
        totalUsers: 156,
        totalFarms: 43,
        totalNews: 28,
        totalPharmacies: 15,
        totalVets: 12
      })
    } catch (error) {
      console.error('Error loading admin data:', error)
    }
  }

  const handleNavigation = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { })
    router.push(path as any)
  }

  const quickActions: QuickAction[] = [
    {
      title: 'Add News Article',
      icon: 'newspaper-outline',
      color: '#3B82F6',
      gradientColors: ['#3B82F6', '#2563EB'],
      description: 'Create and publish news articles',
      action: () => handleNavigation('/admin/add-news')
    },
    {
      title: 'Manage Users',
      icon: 'people-outline',
      color: '#10B981',
      gradientColors: ['#10B981', '#059669'],
      description: 'View and manage user accounts',
      action: () => handleNavigation('/admin/users')
    },
    {
      title: 'Farm Management',
      icon: 'leaf-outline',
      color: '#F59E0B',
      gradientColors: ['#F59E0B', '#D97706'],
      description: 'Monitor and manage farms',
      action: () => handleNavigation('/admin/farms')
    },
    {
      title: 'Add Pharmacy',
      icon: 'storefront-outline',
      color: '#8B5CF6',
      gradientColors: ['#8B5CF6', '#7C3AED'],
      description: 'Add new pharmacy locations',
      action: () => handleNavigation('/admin/add-pharmacy')
    },
    {
      title: 'Veterinary Network',
      icon: 'medical-outline',
      color: '#EF4444',
      gradientColors: ['#EF4444', '#DC2626'],
      description: 'Manage veterinary professionals',
      action: () => handleNavigation('/admin/veterinaries')
    },
    {
      title: 'System Settings',
      icon: 'settings-outline',
      color: '#6B7280',
      gradientColors: ['#6B7280', '#4B5563'],
      description: 'Configure system settings',
      action: () => handleNavigation('/admin/settings')
    },
  ]

  if (userRole !== 'admin') {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Ionicons name="lock-closed-outline" size={64} color="#6B7280" />
        <Text style={tw`text-gray-600 text-lg mt-4`}>Checking access...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={tw`flex-1`}
        contentContainerStyle={tw`flexGrow pb-2`}
        bounces={true}
      >
        <Animated.View style={[tw`flex-1 min-h-full`, { opacity: fadeAnim }]}>
          {/* Enhanced Header */}
          <Animated.View 
            style={[
              tw` pb-4`,
              { transform: [{ translateY: headerAnim }] }
            ]}
          >
            <LinearGradient
              colors={['#7C3AED', '#6D28D9']}
              style={tw`p-8 shadow-xl min-h-48`}
            >
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-sm opacity-90`}>
                    Admin Dashboard
                  </Text>
                  <Text style={tw`text-white text-2xl font-bold`}>
                    Welcome, {userName} 👑
                  </Text>
                  <Text style={tw`text-purple-100 text-sm mt-1`}>
                    System Administrator
                  </Text>
                </View>
                <TouchableOpacity
                  style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                >
                  <Ionicons name="analytics-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              {/* Admin Stats */}
              <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                <Text style={tw`text-white font-bold text-lg mb-4`}>System Overview</Text>
                <View style={tw`flex-row flex-wrap justify-between`}>
                  <View style={tw`items-center w-1/3 mb-2`}>
                    <Text style={tw`text-white text-2xl font-bold`}>{adminStats.totalUsers}</Text>
                    <Text style={tw`text-purple-100 text-xs font-medium`}>Users</Text>
                  </View>
                  <View style={tw`items-center w-1/3 mb-2`}>
                    <Text style={tw`text-green-200 text-2xl font-bold`}>{adminStats.totalFarms}</Text>
                    <Text style={tw`text-purple-100 text-xs font-medium`}>Farms</Text>
                  </View>
                  <View style={tw`items-center w-1/3 mb-2`}>
                    <Text style={tw`text-blue-200 text-2xl font-bold`}>{adminStats.totalNews}</Text>
                    <Text style={tw`text-purple-100 text-xs font-medium`}>News</Text>
                  </View>
                  <View style={tw`items-center w-1/3`}>
                    <Text style={tw`text-yellow-200 text-2xl font-bold`}>{adminStats.totalPharmacies}</Text>
                    <Text style={tw`text-purple-100 text-xs font-medium`}>Pharmacies</Text>
                  </View>
                  <View style={tw`items-center w-1/3`}>
                    <Text style={tw`text-red-200 text-2xl font-bold`}>{adminStats.totalVets}</Text>
                    <Text style={tw`text-purple-100 text-xs font-medium`}>Veterinaries</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View 
            style={[
              tw`px-4 mb-4`,
              { opacity: cardAnim }
            ]}
          >
            <Text style={tw`text-gray-800 text-lg font-bold mb-4`}>Admin Actions</Text>
            <View style={tw`flex-row flex-wrap justify-between`}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={action.title}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    action.action()
                  }}
                  style={tw`w-[48%] mb-4`}
                >
                  <LinearGradient
                    colors={action.gradientColors}
                    style={tw`rounded-2xl p-5 shadow-lg relative min-h-32`}
                  >
                    <View style={tw`bg-white bg-opacity-20 p-3 rounded-2xl mb-3 self-start`}>
                      <Ionicons name={action.icon} size={24} color="white" />
                    </View>
                    <Text style={tw`text-white font-bold text-base mb-2`}>
                      {action.title}
                    </Text>
                    <Text style={tw`text-white text-xs opacity-90`}>
                      {action.description}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Recent Activity */}
          <Animated.View 
            style={[
              tw`px-4 mb-4`,
              { opacity: contentAnim }
            ]}
          >
            <Text style={tw`text-gray-800 text-lg font-bold mb-4`}>Recent Activity</Text>
            <View style={tw`bg-white rounded-2xl p-5 shadow-sm`}>
              {[
                { action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago', icon: 'person-add-outline', color: '#10B981' },
                { action: 'News article published', user: 'admin', time: '1 hour ago', icon: 'newspaper-outline', color: '#3B82F6' },
                { action: 'Farm data updated', user: 'farmer.jane@example.com', time: '3 hours ago', icon: 'leaf-outline', color: '#F59E0B' },
                { action: 'Pharmacy added', user: 'admin', time: '1 day ago', icon: 'storefront-outline', color: '#8B5CF6' },
              ].map((activity, index) => (
                <View key={index} style={tw`flex-row items-center py-3 ${index !== 3 ? 'border-b border-gray-100' : ''}`}>
                  <View style={[tw`p-2 rounded-full mr-3`, { backgroundColor: activity.color + '20' }]}>
                    <Ionicons name={activity.icon as keyof typeof Ionicons.glyphMap} size={16} color={activity.color} />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-800 font-medium text-sm`}>{activity.action}</Text>
                    <Text style={tw`text-gray-500 text-xs`}>{activity.user} • {activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
      
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </SafeAreaView>
  )
}
