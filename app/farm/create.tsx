import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { useFarmActions } from '@/hooks/useFarmActions';

export default function CreateFarmScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { currentUser } = useAuth();
  const { isLoading } = useFarms();
  const { createFarm } = useFarmActions();
  
  // Form state
  const [farmName, setFarmName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [totalChickens, setTotalChickens] = useState('');
  const [healthyChickens, setHealthyChickens] = useState('');
  const [sickChickens, setSickChickens] = useState('');
  const [atRiskChickens, setAtRiskChickens] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = async () => {
    if (!farmName.trim() || !address.trim() || !totalChickens) {
      Alert.alert('Error', 'Please fill in all required fields');
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
      
      await createFarm({
        name: farmName.trim(),
        description: description.trim(),
        location: {
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          coordinates: { latitude: 0, longitude: 0 }
        },
        livestock: {
          total,
          healthy,
          sick,
          atRisk
        },
        facilities: {
          coops: 1,
          feedStorage: 1,
          waterSystems: 1
        },
        owner: currentUser,
        isActive: true
      });

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

  if (isLoading || !currentUser) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
      
      <KeyboardAvoidingView 
        style={tw`flex-1`} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={tw`px-4 pt-2 pb-4`}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={tw`rounded-3xl p-6 shadow-xl`}
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

          <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
            {/* Basic Information */}
            <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Basic Information
              </Text>
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Farm Name *</Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                  placeholder="Enter farm name"
                  value={farmName}
                  onChangeText={setFarmName}
                />
              </View>
              <View>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Description</Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800 h-20`}
                  placeholder="Brief description of your farm"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Location */}
            <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Location
              </Text>
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Address *</Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                  placeholder="Street address"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
              <View style={tw`flex-row gap-3 mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>City</Text>
                  <TextInput
                    style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>State</Text>
                  <TextInput
                    style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                    placeholder="State"
                    value={state}
                    onChangeText={setState}
                  />
                </View>
              </View>
              <View>
                <Text style={tw`text-gray-700 font-medium mb-2`}>ZIP Code</Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                  placeholder="ZIP Code"
                  value={zipCode}
                  onChangeText={setZipCode}
                  keyboardType="numeric"
                />
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
              style={tw`bg-green-500 rounded-2xl py-4 px-6 shadow-lg mb-6 ${
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
    </SafeAreaView>
  );
}
