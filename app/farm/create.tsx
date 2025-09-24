import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { useFarms } from '@/hooks/useCrud';
import { useApp } from '@/contexts/AppContext';

export default function CreateFarmScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { createFarm, loading, error } = useFarms();
  const { state } = useApp();
  
  // Form state
  const [farmName, setFarmName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');
  const [size, setSize] = useState('');
  const [totalChickens, setTotalChickens] = useState('');
  const [healthyChickens, setHealthyChickens] = useState('');
  const [sickChickens, setSickChickens] = useState('');
  const [atRiskChickens, setAtRiskChickens] = useState('');
  const [breeds, setBreeds] = useState('');
  const [coops, setCoops] = useState('');
  const [waterSystem, setWaterSystem] = useState('Manual');
  const [electricityAccess, setElectricityAccess] = useState(true);
  const [feedStorage, setFeedStorage] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    if (!farmName.trim()) {
      Alert.alert('Validation Error', 'Farm name is required');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    if (!district.trim()) {
      Alert.alert('Validation Error', 'District is required');
      return false;
    }
    if (!sector.trim()) {
      Alert.alert('Validation Error', 'Sector is required');
      return false;
    }
    if (!size || isNaN(parseFloat(size))) {
      Alert.alert('Validation Error', 'Please enter a valid farm size in hectares');
      return false;
    }
    if (!totalChickens || isNaN(parseInt(totalChickens))) {
      Alert.alert('Validation Error', 'Please enter a valid total number of chickens');
      return false;
    }
    if (!healthyChickens || isNaN(parseInt(healthyChickens))) {
      Alert.alert('Validation Error', 'Please enter a valid number of healthy chickens');
      return false;
    }
    if (!coops || isNaN(parseInt(coops))) {
      Alert.alert('Validation Error', 'Please enter a valid number of coops');
      return false;
    }

    const total = parseInt(totalChickens);
    const healthy = parseInt(healthyChickens);
    const sick = parseInt(sickChickens) || 0;
    const atRisk = parseInt(atRiskChickens) || 0;

    if (healthy + sick + atRisk !== total) {
      Alert.alert('Validation Error', 'The sum of healthy, sick, and at-risk chickens must equal the total number of chickens');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!state.currentUser) {
      Alert.alert('Error', 'You must be logged in to create a farm');
      return;
    }

    const farmData = {
      name: farmName.trim(),
      ownerId: state.currentUser.id,
      location: {
        address: address.trim(),
        coordinates: {
          latitude: -2.0853 + (Math.random() - 0.5) * 0.1, // Random coordinates near Rwanda
          longitude: 29.7564 + (Math.random() - 0.5) * 0.1,
        },
        district: district.trim(),
        sector: sector.trim(),
      },
      size: parseFloat(size),
      establishedDate: new Date(),
      livestock: {
        chickens: {
          total: parseInt(totalChickens),
          healthy: parseInt(healthyChickens),
          sick: parseInt(sickChickens) || 0,
          atRisk: parseInt(atRiskChickens) || 0,
          breeds: breeds.trim() ? breeds.split(',').map(b => b.trim()) : ['Mixed Breed'],
        },
      },
      facilities: {
        coops: parseInt(coops),
        feedStorage,
        waterSystem,
        electricityAccess,
      },
      healthStatus: 'good' as const,
      certifications: [],
      isActive: true,
    };

    try {
      const newFarm = await createFarm(farmData);
      if (newFarm) {
        Alert.alert(
          'Success!',
          'Your farm has been created successfully.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to create farm. Please try again.');
    }
  };

  const waterSystemOptions = ['Manual', 'Semi-automated', 'Automated', 'Natural'];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      
      <KeyboardAvoidingView 
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={tw`px-4 pt-2 pb-4`}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={tw`rounded-3xl p-8 shadow-xl`}
            >
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-sm opacity-90`}>
                    Farm Management
                  </Text>
                  <Text style={tw`text-white text-2xl font-bold`}>
                    Create New Farm 🚜
                  </Text>
                  <Text style={tw`text-green-100 text-sm mt-1`}>
                    Add a new farm to your portfolio
                  </Text>
                </View>
                <TouchableOpacity
                  style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
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
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  placeholder="Enter farm name"
                  value={farmName}
                  onChangeText={setFarmName}
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Address *</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  placeholder="Enter farm address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </View>

              <View style={tw`flex-row gap-3 mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>District *</Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                    placeholder="District"
                    value={district}
                    onChangeText={setDistrict}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Sector *</Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                    placeholder="Sector"
                    value={sector}
                    onChangeText={setSector}
                  />
                </View>
              </View>

              <View>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Farm Size (hectares) *</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  placeholder="Enter size in hectares"
                  value={size}
                  onChangeText={setSize}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Livestock Information */}
            <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Livestock Information
              </Text>
              
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Total Chickens *</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  placeholder="Total number of chickens"
                  value={totalChickens}
                  onChangeText={setTotalChickens}
                  keyboardType="numeric"
                />
              </View>

              <View style={tw`flex-row gap-3 mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Healthy *</Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                    placeholder="Healthy"
                    value={healthyChickens}
                    onChangeText={setHealthyChickens}
                    keyboardType="numeric"
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Sick</Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                    placeholder="Sick"
                    value={sickChickens}
                    onChangeText={setSickChickens}
                    keyboardType="numeric"
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>At Risk</Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                    placeholder="At Risk"
                    value={atRiskChickens}
                    onChangeText={setAtRiskChickens}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Chicken Breeds</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  placeholder="Enter breeds separated by commas"
                  value={breeds}
                  onChangeText={setBreeds}
                  multiline
                />
                <Text style={tw`text-gray-500 text-xs mt-1`}>
                  Example: Rhode Island Red, Leghorn, Broiler
                </Text>
              </View>
            </View>

            {/* Facilities */}
            <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Facilities & Infrastructure
              </Text>
              
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Number of Coops *</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                  placeholder="Number of chicken coops"
                  value={coops}
                  onChangeText={setCoops}
                  keyboardType="numeric"
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Water System</Text>
                <View style={tw`flex-row flex-wrap gap-2`}>
                  {waterSystemOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        tw`px-4 py-2 rounded-full border`,
                        waterSystem === option
                          ? tw`bg-green-500 border-green-500`
                          : tw`bg-gray-100 border-gray-300`
                      ]}
                      onPress={() => setWaterSystem(option)}
                    >
                      <Text style={[
                        tw`font-medium`,
                        waterSystem === option ? tw`text-white` : tw`text-gray-700`
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={tw`flex-row justify-between mb-4`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Feed Storage</Text>
                  <View style={tw`flex-row gap-2`}>
                    <TouchableOpacity
                      style={[
                        tw`flex-1 p-3 rounded-xl border`,
                        feedStorage ? tw`bg-green-500 border-green-500` : tw`bg-gray-100 border-gray-300`
                      ]}
                      onPress={() => setFeedStorage(true)}
                    >
                      <Text style={[
                        tw`text-center font-medium`,
                        feedStorage ? tw`text-white` : tw`text-gray-700`
                      ]}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        tw`flex-1 p-3 rounded-xl border`,
                        !feedStorage ? tw`bg-red-500 border-red-500` : tw`bg-gray-100 border-gray-300`
                      ]}
                      onPress={() => setFeedStorage(false)}
                    >
                      <Text style={[
                        tw`text-center font-medium`,
                        !feedStorage ? tw`text-white` : tw`text-gray-700`
                      ]}>
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={tw`flex-1 ml-2`}>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Electricity Access</Text>
                  <View style={tw`flex-row gap-2`}>
                    <TouchableOpacity
                      style={[
                        tw`flex-1 p-3 rounded-xl border`,
                        electricityAccess ? tw`bg-green-500 border-green-500` : tw`bg-gray-100 border-gray-300`
                      ]}
                      onPress={() => setElectricityAccess(true)}
                    >
                      <Text style={[
                        tw`text-center font-medium`,
                        electricityAccess ? tw`text-white` : tw`text-gray-700`
                      ]}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        tw`flex-1 p-3 rounded-xl border`,
                        !electricityAccess ? tw`bg-red-500 border-red-500` : tw`bg-gray-100 border-gray-300`
                      ]}
                      onPress={() => setElectricityAccess(false)}
                    >
                      <Text style={[
                        tw`text-center font-medium`,
                        !electricityAccess ? tw`text-white` : tw`text-gray-700`
                      ]}>
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                tw`bg-green-500 rounded-2xl p-4 mb-6`,
                loading && tw`opacity-50`
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={tw`text-white text-center font-bold text-lg`}>
                {loading ? 'Creating Farm...' : 'Create Farm'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}
