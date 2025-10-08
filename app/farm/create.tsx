import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { FarmCreateRequest, FarmStatus } from '@/types/farm';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Context imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { useFarmActions } from '@/hooks/useFarmActions';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function CreateFarmScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { currentUser } = useAuth();
  const { loading } = useFarms();
  const { createFarm } = useFarmActions();
  
  // Form state
  const [farmName, setFarmName] = useState('');
  const [totalChickens, setTotalChickens] = useState('');
  const [healthyChickens, setHealthyChickens] = useState('');
  const [sickChickens, setSickChickens] = useState('');
  const [atRiskChickens, setAtRiskChickens] = useState('');
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to set farm location');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      Alert.alert('Success', 'Location has been set successfully!');
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!farmName.trim() || !totalChickens || !location) {
      Alert.alert('Error', 'Please fill in all required fields and set farm location');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    const total = parseInt(totalChickens);
    const healthy = parseInt(healthyChickens) || 0;
    const sick = parseInt(sickChickens) || 0;
    const atRisk = parseInt(atRiskChickens) || 0;

    if (healthy + sick + atRisk > total) {
      Alert.alert('Error', 'Total chickens count does not match individual counts');
      return;
    }

    try {
      setIsSubmitting(true);

      const newFarm: FarmCreateRequest = {
        name: farmName.trim(),
        location: location,
        livestock: {
          total,
          healthy,
          sick,
          atRisk,
        },
        facilities: {
          coops: 1,
          feedStorage: true,
          waterSystem: 'Manual',
          electricityAccess: false
        },
        healthStatus: FarmStatus.GOOD,
      }
      
      await createFarm(newFarm)
      Alert.alert(
        'Success!',
        'Your farm has been created successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error creating farm:', error);
      Alert.alert('Error', 'Failed to create farm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-600 text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
      
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
          {/* Header */}
          <View className="pb-4">
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-6 py-12 shadow-lg"
            >
              <View className="flex-row items-center justify-between mb-6">
                <TouchableOpacity
                  className="p-3 rounded-full"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
                
                <Text className="text-white text-xl font-bold">Create Farm</Text>
                
                <View className="w-12" />
              </View>

              {/* Header Content */}
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-white bg-opacity-20 items-center justify-center mb-4">
                  <Ionicons name="home-outline" size={32} color="white" />
                </View>
                <Text className="text-white text-2xl font-bold mb-2">New Poultry Farm</Text>
                <Text className="text-orange-100 text-center text-sm">
                  Set up your farm with livestock information and location
                </Text>
              </View>
            </LinearGradient>
          </View>

          <ScrollView 
            className="flex-1 px-4" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
          >
            {/* Basic Information */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg -mt-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
                </View>
                <Text className="text-lg font-bold text-gray-800">
                  Basic Information
                </Text>
              </View>
              <View>
                <Text className="text-gray-700 font-medium mb-2">Farm Name *</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-4 text-gray-800 border border-gray-200"
                  style={{ fontSize: 16 }}
                  placeholder="Enter your farm name"
                  placeholderTextColor="#9CA3AF"
                  value={farmName}
                  onChangeText={setFarmName}
                />
              </View>
            </View>

            {/* Location */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="location-outline" size={20} color="#F59E0B" />
                </View>
                <Text className="text-lg font-bold text-gray-800">
                  Farm Location
                </Text>
              </View>
              <View className="mb-2">
                <Text className="text-gray-700 font-medium mb-3">
                  Current Location {location ? '✅' : '📍'}
                </Text>
                {location ? (
                  <View className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text className="text-green-800 font-semibold ml-2">Location Set Successfully</Text>
                    </View>
                    <Text className="text-green-600 text-sm">
                      Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 items-center"
                    style={{ opacity: isGettingLocation ? 0.6 : 1 }}
                    onPress={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-3">
                      <Ionicons name="location-outline" size={24} color="#3B82F6" />
                    </View>
                    <Text className="text-blue-700 font-semibold text-base">
                      {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                    </Text>
                    <Text className="text-blue-500 text-sm mt-2 text-center leading-5">
                      {isGettingLocation ? 'Please wait while we locate your position' : 'We need your location to set farm coordinates'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Livestock Information */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="nutrition-outline" size={20} color="#D97706" />
                </View>
                <Text className="text-lg font-bold text-gray-800">
                  Livestock Information
                </Text>
              </View>
              
              <View className="mb-5">
                <Text className="text-gray-700 font-medium mb-2">Total Chickens *</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-4 text-gray-800 border border-gray-200"
                  style={{ fontSize: 16 }}
                  placeholder="Total number of chickens"
                  placeholderTextColor="#9CA3AF"
                  value={totalChickens}
                  onChangeText={setTotalChickens}
                  keyboardType="numeric"
                />
              </View>
              
              <Text className="text-gray-600 font-medium mb-3 text-sm">Health Distribution (Optional)</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                    <Text className="text-gray-700 font-medium text-sm">Healthy</Text>
                  </View>
                  <TextInput
                    className="bg-gray-50 rounded-xl px-3 py-3 text-gray-800 border border-gray-200"
                    style={{ fontSize: 15 }}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    value={healthyChickens}
                    onChangeText={setHealthyChickens}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                    <Text className="text-gray-700 font-medium text-sm">At Risk</Text>
                  </View>
                  <TextInput
                    className="bg-gray-50 rounded-xl px-3 py-3 text-gray-800 border border-gray-200"
                    style={{ fontSize: 15 }}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    value={atRiskChickens}
                    onChangeText={setAtRiskChickens}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <Text className="text-gray-700 font-medium text-sm">Sick</Text>
                  </View>
                  <TextInput
                    className="bg-gray-50 rounded-xl px-3 py-3 text-gray-800 border border-gray-200"
                    style={{ fontSize: 15 }}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    value={sickChickens}
                    onChangeText={setSickChickens}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="rounded-2xl py-5 px-6 mb-8 shadow-lg"
              style={{
                backgroundColor: '#D97706',
                opacity: isSubmitting ? 0.7 : 1,
                shadowColor: '#D97706',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8
              }}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <View className="flex-row items-center justify-center">
                {isSubmitting && (
                  <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" 
                    style={{ 
                      transform: [{ rotate: '0deg' }] // Animation would be added here
                    }} 
                  />
                )}
                <Ionicons name="home-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-lg">
                  {isSubmitting ? 'Creating Farm...' : 'Create Farm'}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
