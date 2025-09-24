import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { router } from 'expo-router';

const CustomDrawerContent = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation for drawer opening
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Handle logout
  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      router.push('/(auth)/sign-in' as any)
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Animated.View style={[tw`flex-1 bg-white`, { opacity: fadeAnim }]}>
      {/* Drawer Header */}
      <View style={tw`p-5 border-b border-gray-200 mb-4`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-12 h-12 rounded-full bg-orange-500 justify-center items-center`}>
            <Ionicons name="leaf-outline" size={24} color="white" />
          </View>
          <View style={tw`ml-3`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>FarmCare</Text>
            <Text style={tw`text-sm text-gray-500`}>User Name</Text>
          </View>
        </View>
      </View>

      {/* Drawer Items */}
      <View style={tw`flex-1`}>
        {[
          { name: 'Home', icon: 'home-outline', route: '/' },
          { name: 'Farmer', icon: 'person-outline', route: '/farmer' },
          { name: 'Farm', icon: 'leaf-outline', route: '/farm' },
          { name: 'AI Assistant', icon: 'chatbox-ellipses-outline', route: '/ai' },
          { name: 'Pharmacies', icon: 'medical-outline', route: '/pharmacies' },
          { name: 'News', icon: 'newspaper-outline', route: '/news' },
          { name: 'Settings', icon: 'settings-outline', route: '/settings' },
        ].map((item) => (
          <TouchableOpacity
            key={item.name}
            style={tw`flex-row items-center p-4`}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
              router.push(item.route as any);
            }}
          >
            <Ionicons name={item.icon as any} size={24} color="#6B7280" style={tw`mr-4`} />
            <Text style={tw`text-base font-medium text-gray-600`}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        {/* Help & Support */}
        <TouchableOpacity
          style={tw`flex-row items-center p-4 mt-4`}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
            router.push('/settings' as any);
          }}
        >
          <Ionicons name="help-circle-outline" size={24} color="#6B7280" style={tw`mr-4`} />
          <Text style={tw`text-base font-medium text-gray-600`}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      {/* Footer with Logout Button */}
      <View style={tw`p-5 border-t border-gray-200`}>
        <TouchableOpacity
          style={tw`flex-row items-center`}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" style={tw`mr-4`} />
          <Text style={tw`text-base font-medium text-red-500`}>Logout</Text>
        </TouchableOpacity>
      </View>


      {/* Testing */}
      <View style={tw`p-5 border-t border-gray-200`}>
        <TouchableOpacity
          style={tw`flex-row items-center`}
          onPress={()=>router.push('/tester' as any)}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" style={tw`mr-4`} />
          <Text style={tw`text-base font-medium text-red-500`}>Tester</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>


  );
};

export default CustomDrawerContent;