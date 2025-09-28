import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import { useAuth} from '@/contexts/AuthContext';
import DrawerButton from '@/components/DrawerButton';

export default function ProfileScreen() {
  const { currentUser,logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = async () => {
    if (!currentUser) return;
    
    try {
      // For now, just simulate the update
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return ['#7C3AED', '#6D28D9'];
      case 'FARMER': return ['#F97316', '#EA580C'];
      case 'VETERINARY': return ['#EF4444', '#DC2626'];
      default: return ['#3B82F6', '#2563EB'];
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'shield-outline';
      case 'FARMER': return 'leaf-outline';
      case 'VETERINARY': return 'medical-outline';
      default: return 'person-outline';
    }
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600`}>Please log in to view profile</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw` pb-4`}>
          <LinearGradient
            colors={getRoleColor(currentUser.role) as any}
            style={tw` p-8 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <TouchableOpacity
                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>
              
              <Text style={tw`text-white text-xl font-bold`}>My Profile</Text>
              
              <DrawerButton />
            </View>

            {/* Profile Avatar */}
            <View style={tw`items-center mb-6`}>
              <View style={tw`w-24 h-24 bg-white bg-opacity-20 rounded-full items-center justify-center mb-4`}>
                <Ionicons name={getRoleIcon(currentUser.role)} size={40} color="white" />
              </View>
              <Text style={tw`text-white text-2xl font-bold`}>{currentUser.name}</Text>
              <View style={tw`bg-white bg-opacity-20 px-4 py-2 rounded-full mt-2`}>
                <Text style={tw`text-white font-semibold capitalize`}>
                  {currentUser.role}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
          {/* Profile Information */}
          <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                Personal Information
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                style={tw`px-4 py-2 rounded-xl ${isEditing ? 'bg-gray-500' : 'bg-blue-500'}`}
              >
                <Text style={tw`text-white font-semibold`}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2`}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              ) : (
                <Text style={tw`text-gray-800 font-medium text-base`}>{currentUser.name}</Text>
              )}
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2`}>Email</Text>
              <Text style={tw`text-gray-800 font-medium text-base`}>{currentUser.email}</Text>
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2`}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={tw`text-gray-800 font-medium text-base`}>{currentUser.phone}</Text>
              )}
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2`}>Location</Text>
              {isEditing ? (
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                />
              ) : (
                <Text style={tw`text-gray-800 font-medium text-base`}>{currentUser.location}</Text>
              )}
            </View>

            {isEditing && (
              <TouchableOpacity
                style={tw`bg-green-500 rounded-xl p-4 mt-4`}
                onPress={handleSave}
              >
                <Text style={tw`text-white text-center font-bold`}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Role Information */}
          <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
              Role Information
            </Text>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-600`}>Role</Text>
              <Text style={tw`text-gray-800 font-medium capitalize`}>{currentUser.role.toLowerCase()}</Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-600`}>Status</Text>
              <Text style={tw`text-green-600 font-medium`}>{currentUser.isActive ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>

          {/* Account Actions */}
          <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
              Account Actions
            </Text>
            
            <TouchableOpacity
              style={tw`flex-row items-center p-4 bg-gray-50 rounded-xl mb-3`}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings-outline" size={24} color="#6B7280" />
              <Text style={tw`text-gray-800 font-medium ml-3 flex-1`}>Settings</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center p-4 bg-gray-50 rounded-xl mb-3`}
              onPress={() => router.push('/user/history')}
            >
              <Ionicons name="time-outline" size={24} color="#6B7280" />
              <Text style={tw`text-gray-800 font-medium ml-3 flex-1`}>History</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center p-4 bg-red-50 rounded-xl`}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={tw`text-red-600 font-medium ml-3 flex-1`}>Logout</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
