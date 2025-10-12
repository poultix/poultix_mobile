import BottomTabs from '@/components/BottomTabs';
import DrawerButton from '@/components/DrawerButton';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');

  const [location, setLocation] = useState(
    currentUser?.location ? `${currentUser.location.latitude}, ${currentUser.location.longitude}` : ''
  );

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
          }
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return { primary: '#7C3AED', secondary: '#6D28D9', light: '#EDE9FE', text: '#7C3AED' };
      case 'FARMER': return { primary: '#FF8C00', secondary: '#FF7F00', light: '#FFF4E6', text: '#FF8C00' };
      case 'VETERINARY': return { primary: '#DC2626', secondary: '#B91C1C', light: '#FEF2F2', text: '#DC2626' };
      case 'PHARMACY': return { primary: '#2563EB', secondary: '#1D4ED8', light: '#EFF6FF', text: '#2563EB' };
      default: return { primary: '#6B7280', secondary: '#4B5563', light: '#F9FAFB', text: '#6B7280' };
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'shield-outline';
      case 'FARMER': return 'leaf-outline';
      case 'VETERINARY': return 'medical-outline';
      case 'PHARMACY': return 'medical-outline';
      default: return 'person-outline';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'System Administrator with full access to manage users and system settings';
      case 'FARMER': return 'Poultry farm owner managing livestock and requesting veterinary services';
      case 'VETERINARY': return 'Licensed veterinarian providing professional animal care services';
      case 'PHARMACY': return 'Licensed veterinary pharmacy providing medications and health products';
      default: return 'Community member with basic access';
    }
  };

  const getRoleFeatures = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return [
          { icon: 'people-outline', title: 'User Management', description: 'Manage all system users' },
          { icon: 'analytics-outline', title: 'System Analytics', description: 'View system statistics' },
          { icon: 'server-outline', title: 'System Health', description: 'Monitor system status' },
          { icon: 'newspaper-outline', title: 'Content Management', description: 'Manage news and announcements' }
        ];
      case 'FARMER':
        return [
          { icon: 'home-outline', title: 'Farm Management', description: 'Manage your poultry farms' },
          { icon: 'calendar-outline', title: 'Schedule Visits', description: 'Book veterinary appointments' },
          { icon: 'chatbubbles-outline', title: 'Communication', description: 'Chat with veterinarians' },
          { icon: 'analytics-outline', title: 'Farm Analytics', description: 'View farm performance' }
        ];
      case 'VETERINARY':
        return [
          { icon: 'medical-outline', title: 'Medical Services', description: 'Provide veterinary care' },
          { icon: 'calendar-outline', title: 'Appointment Management', description: 'Manage your schedule' },
          { icon: 'chatbubbles-outline', title: 'Client Communication', description: 'Chat with farmers' },
          { icon: 'document-text-outline', title: 'Medical Records', description: 'Maintain health records' }
        ];
      case 'PHARMACY':
        return [
          { icon: 'medical-outline', title: 'Inventory Management', description: 'Manage pharmaceutical inventory' },
          { icon: 'shield-checkmark-outline', title: 'Verification Status', description: 'Track compliance status' },
          { icon: 'document-text-outline', title: 'Regulatory Docs', description: 'Manage licenses and certificates' },
          { icon: 'storefront-outline', title: 'Pharmacy Profile', description: 'Manage business information' }
        ];
      default: return [];
    }
  };

  if (!currentUser) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Ionicons name="person-outline" size={64} color="#D1D5DB" />
        <Text className="text-gray-600 text-lg mt-4">Please log in to view profile</Text>
      </View>
    );
  }

  const roleColors = getRoleColor(currentUser.role);
  const roleFeatures = getRoleFeatures(currentUser.role);

  return (
    <View className="flex-1 bg-gray-50">
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
        {/* Compact Header */}
        <View
          className="px-6 py-8 shadow-lg"
          style={{
            backgroundColor: roleColors.primary,
            backgroundImage: `linear-gradient(135deg, ${roleColors.primary} 0%, ${roleColors.secondary} 100%)`
          }}
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="bg-white/20 p-3 rounded-full"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-xl font-bold">My Profile</Text>

            <DrawerButton />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 pb-40" showsVerticalScrollIndicator={false}
          contentContainerClassName='py-10 pb-40'>
          {/* Profile Header Card */}
          <View className="bg-white rounded-2xl p-6 shadow-lg -mt-4 mb-6">
            {/* Profile Avatar & Info */}
            <View className="items-center mb-6">
              <View
                className="w-24 h-24 rounded-full items-center justify-center mb-4 border-4"
                style={{
                  backgroundColor: roleColors.light,
                  borderColor: roleColors.primary
                }}
              >
                <Ionicons name={getRoleIcon(currentUser.role)} size={40} color={roleColors.primary} />
              </View>
              <Text className="text-gray-800 text-2xl font-bold mb-2">{currentUser.name}</Text>
              <View
                className="px-4 py-2 rounded-full mb-3"
                style={{ backgroundColor: roleColors.light }}
              >
                <Text className="font-semibold capitalize" style={{ color: roleColors.primary }}>
                  {currentUser.role.toLowerCase()}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm text-center px-4 leading-5">
                {getRoleDescription(currentUser.role)}
              </Text>
              
              {/* Verification Badge */}
              <View className="mt-4">
                {currentUser.role === 'PHARMACY' ? (
                  <View className="flex-row items-center justify-center bg-green-50 px-4 py-2 rounded-full border border-green-200">
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text className="text-green-700 font-semibold ml-2 text-sm">✅ Verified Pharmacy</Text>
                  </View>
                ) : currentUser.role === 'VETERINARY' ? (
                  <View className="flex-row items-center justify-center bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    <Ionicons name="shield-checkmark" size={16} color="#3B82F6" />
                    <Text className="text-blue-700 font-semibold ml-2 text-sm">🩺 Licensed Veterinarian</Text>
                  </View>
                ) : currentUser.role === 'FARMER' ? (
                  <View className="flex-row items-center justify-center bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                    <Ionicons name="leaf" size={16} color="#FF8C00" />
                    <Text className="text-orange-700 font-semibold ml-2 text-sm">🌾 Registered Farmer</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-center bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                    <Ionicons name="shield" size={16} color="#7C3AED" />
                    <Text className="text-purple-700 font-semibold ml-2 text-sm">👑 System Admin</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <Ionicons name="person-outline" size={16} color="#3B82F6" />
                </View>
                <Text className="text-lg font-bold text-gray-800">
                  Personal Information
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl ${isEditing ? 'border-2 border-gray-400' : 'border-2 border-transparent'}`}
                style={{
                  backgroundColor: isEditing ? '#F3F4F6' : roleColors.primary
                }}
              >
                <Text className={`font-semibold ${isEditing ? 'text-gray-700' : 'text-white'}`}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">Full Name</Text>
              {isEditing ? (
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border-2 border-transparent"
                  style={{ borderColor: isEditing ? roleColors.primary : 'transparent' }}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              ) : (
                <Text className="text-gray-800 font-semibold text-base">{currentUser.name}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">Email Address</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="mail-outline" size={18} color={roleColors.primary} />
                <Text className="text-gray-800 font-semibold text-base ml-3">{currentUser.email}</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">Phone Number</Text>
              {isEditing ? (
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-gray-500"
                  value="N/A"
                  placeholder="Phone not available"
                  editable={false}
                  keyboardType="phone-pad"
                />
              ) : (
                <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
                  <Ionicons name="call-outline" size={18} color="#9CA3AF" />
                  <Text className="text-gray-500 font-medium text-base ml-3">Not available</Text>
                </View>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">Location</Text>
              {isEditing ? (
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border-2 border-transparent"
                  style={{ borderColor: isEditing ? roleColors.primary : 'transparent' }}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                />
              ) : (
                <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
                  <Ionicons name="location-outline" size={18} color={roleColors.primary} />
                  <Text className="text-gray-800 font-semibold text-base ml-3">
                    {currentUser.location ? `${currentUser.location.latitude}, ${currentUser.location.longitude}` : 'Not specified'}
                  </Text>
                </View>
              )}
            </View>

            {isEditing && (
              <TouchableOpacity
                className="rounded-xl p-4 mt-4 flex-row items-center justify-center"
                style={{ backgroundColor: roleColors.primary }}
                onPress={handleSave}
              >
                <Ionicons name="checkmark-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white text-center font-bold">
                  Save Changes
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Role Information */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <View className="flex-row items-center mb-4">
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: roleColors.light }}
              >
                <Ionicons name="shield-outline" size={16} color={roleColors.primary} />
              </View>
              <Text className="text-lg font-bold text-gray-800">
                Role Information
              </Text>
            </View>
            <View
              className="p-4 rounded-xl mb-4"
              style={{ backgroundColor: roleColors.light }}
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: roleColors.primary }}
                >
                  <Ionicons name={getRoleIcon(currentUser.role)} size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg" style={{ color: roleColors.text }}>
                    {currentUser.role.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {getRoleDescription(currentUser.role)}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-medium">Account Status</Text>
                <View className="flex-row items-center">
                  <View className={`w-2 h-2 rounded-full mr-2 ${currentUser.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <Text className={`font-semibold ${currentUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {currentUser.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Role Features */}
          {roleFeatures.length > 0 && (
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
              <View className="flex-row items-center mb-4">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: roleColors.light }}
                >
                  <Ionicons name="flash-outline" size={16} color={roleColors.primary} />
                </View>
                <Text className="text-lg font-bold text-gray-800">
                  Your Capabilities
                </Text>
              </View>
              <View className="space-y-3">
                {roleFeatures.map((feature, index) => (
                  <View key={index} className="flex-row items-start p-3 bg-gray-50 rounded-xl">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: roleColors.light }}
                    >
                      <Ionicons name={feature.icon as any} size={20} color={roleColors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-800 mb-1">{feature.title}</Text>
                      <Text className="text-gray-600 text-sm">{feature.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Account Actions */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                <Ionicons name="settings-outline" size={16} color="#6B7280" />
              </View>
              <Text className="text-lg font-bold text-gray-800">
                Account Actions
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3 border-2 border-transparent"
              onPress={() => router.push('/settings')}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: roleColors.light }}
              >
                <Ionicons name="settings-outline" size={20} color={roleColors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold">Settings</Text>
                <Text className="text-gray-500 text-sm">Manage your preferences</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3 border-2 border-transparent"
              onPress={() => router.push('/user/history')}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: roleColors.light }}
              >
                <Ionicons name="time-outline" size={20} color={roleColors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold">Activity History</Text>
                <Text className="text-gray-500 text-sm">View your recent activities</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-red-50 rounded-xl border-2 border-red-100"
              onPress={handleLogout}
            >
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text className="text-red-600 font-semibold">Sign Out</Text>
                <Text className="text-red-400 text-sm">Logout from your account</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
             <BottomTabs/>
      
    </View>
  );
}
