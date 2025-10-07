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
import tw from 'twrnc';

// New context imports
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
  }, []);

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
      <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
      
      <KeyboardAvoidingView 
        style={tw`flex-1`} 
        behavior={'padding' }
      >
        <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={tw` pb-4`}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={tw`p-6 shadow-xl`}
            >
              <View style={tw`flex-row items-center justify-between`}>
                <TouchableOpacity
                  style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={tw`flex-1 ml-4`}>
                  <Text style={tw`text-white font-medium`}>Farm Management</Text>
                  <Text style={tw`text-white text-2xl font-bold`}>Create New Farm 🏡</Text>
                  <Text style={tw`text-green-100 text-sm`}>
                    Set up your poultry farm
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}
          contentContainerClassName='pb-10'>
            {/* Basic Information */}
            <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Basic Information
              </Text>
              <View>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Farm Name *</Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                  placeholder="Enter farm name"
                  value={farmName}
                  onChangeText={setFarmName}
                />
              </View>
            </View>

            {/* Location */}
            <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Farm Location
              </Text>
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>
                  Current Location {location ? '✅' : '❌'}
                </Text>
                {location ? (
                  <View style={tw`bg-green-50 border border-green-200 rounded-xl p-4`}>
                    <Text style={tw`text-green-800 font-medium`}>Location Set Successfully</Text>
                    <Text style={tw`text-green-600 text-sm mt-1`}>
                      Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={tw`bg-blue-50 border border-blue-200 rounded-xl p-4 items-center ${
                      isGettingLocation ? 'opacity-50' : ''
                    }`}
                    onPress={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    <Ionicons name="location-outline" size={24} color="#3B82F6" />
                    <Text style={tw`text-blue-600 font-medium mt-2`}>
                      {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                    </Text>
                    <Text style={tw`text-blue-500 text-xs mt-1 text-center`}>
                      We need access to your location to set the farm coordinates
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Livestock Information */}
            <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Livestock Information
              </Text>
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Total Chickens *</Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                  placeholder="Total number of chickens"
                  value={totalChickens}
                  onChangeText={setTotalChickens}
                  keyboardType="numeric"
                />
              </View>
              <View style={tw`flex-row gap-3`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Healthy</Text>
                  <TextInput
                    style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                    placeholder="0"
                    value={healthyChickens}
                    onChangeText={setHealthyChickens}
                    keyboardType="numeric"
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>At Risk</Text>
                  <TextInput
                    style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                    placeholder="0"
                    value={atRiskChickens}
                    onChangeText={setAtRiskChickens}
                    keyboardType="numeric"
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Sick</Text>
                  <TextInput
                    style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                    placeholder="0"
                    value={sickChickens}
                    onChangeText={setSickChickens}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={tw`bg-green-600 rounded-2xl py-4 px-6 shadow-lg mb-6 ${
                isSubmitting ? 'opacity-50' : ''
              }`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={tw`text-white font-bold text-lg text-center`}>
                {isSubmitting ? 'Creating Farm...' : 'Create Farm'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
