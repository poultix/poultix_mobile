import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useUsers } from '@/hooks/useCrud';
import DrawerButton from '@/components/DrawerButton';

export default function ProfileScreen() {
  const { state, logout } = useApp();
  const { updateUser, loading } = useUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(state.currentUser?.name || '');
  const [phone, setPhone] = useState(state.currentUser?.phone || '');
  const [location, setLocation] = useState(state.currentUser?.location || '');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = async () => {
    if (!state.currentUser) return;
    
    try {
      await updateUser(state.currentUser.id, {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });
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
            router.replace('/auth/sign-in');
          }
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return ['#7C3AED', '#6D28D9'];
      case 'farmer': return ['#F97316', '#EA580C'];
      case 'veterinary': return ['#EF4444', '#DC2626'];
      default: return ['#3B82F6', '#2563EB'];
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'shield-outline';
      case 'farmer': return 'leaf-outline';
      case 'veterinary': return 'medical-outline';
      default: return 'person-outline';
    }
  };

  if (!state.currentUser) {
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
            colors={getRoleColor(state.currentUser.role)}
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
                <Ionicons name={getRoleIcon(state.currentUser.role)} size={40} color="white" />
              </View>
              <Text style={tw`text-white text-2xl font-bold`}>{state.currentUser.name}</Text>
              <View style={tw`bg-white bg-opacity-20 px-4 py-2 rounded-full mt-2`}>
                <Text style={tw`text-white font-semibold capitalize`}>
                  {state.currentUser.role}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
          {/* Profile Information */}
          <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
              Personal Information
            </Text>
            
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
                <Text style={tw`text-gray-800 font-medium text-base`}>{state.currentUser.name}</Text>
              )}
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2`}>Email</Text>
              <Text style={tw`text-gray-800 font-medium text-base`}>{state.currentUser.email}</Text>
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
                <Text style={tw`text-gray-800 font-medium text-base`}>{state.currentUser.phone}</Text>
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
                <Text style={tw`text-gray-800 font-medium text-base`}>{state.currentUser.location}</Text>
              )}
            </View>

            {isEditing && (
              <TouchableOpacity
                style={[tw`bg-green-500 rounded-xl p-4 mt-4`, loading && tw`opacity-50`]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={tw`text-white text-center font-bold`}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Role-specific Information */}
          {state.currentUser.farmerData && (
            <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Farmer Information
              </Text>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-gray-600`}>Experience</Text>
                <Text style={tw`text-gray-800 font-medium`}>{state.currentUser.farmerData.experience} years</Text>
              </View>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-gray-600`}>Total Farms</Text>
                <Text style={tw`text-gray-800 font-medium`}>{state.currentUser.farmerData.totalFarms}</Text>
              </View>
              <View style={tw`mb-2`}>
                <Text style={tw`text-gray-600 mb-1`}>Specializations</Text>
                <View style={tw`flex-row flex-wrap gap-2`}>
                  {state.currentUser.farmerData.specialization.map((spec, index) => (
                    <View key={index} style={tw`bg-green-100 px-3 py-1 rounded-full`}>
                      <Text style={tw`text-green-700 text-sm`}>{spec}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {state.currentUser.veterinaryData && (
            <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Veterinary Information
              </Text>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-gray-600`}>License Number</Text>
                <Text style={tw`text-gray-800 font-medium`}>{state.currentUser.veterinaryData.licenseNumber}</Text>
              </View>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-gray-600`}>Experience</Text>
                <Text style={tw`text-gray-800 font-medium`}>{state.currentUser.veterinaryData.yearsExperience} years</Text>
              </View>
              <View style={tw`mb-2`}>
                <Text style={tw`text-gray-600 mb-1`}>Specializations</Text>
                <View style={tw`flex-row flex-wrap gap-2`}>
                  {state.currentUser.veterinaryData.specialization.map((spec, index) => (
                    <View key={index} style={tw`bg-red-100 px-3 py-1 rounded-full`}>
                      <Text style={tw`text-red-700 text-sm`}>{spec}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

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
