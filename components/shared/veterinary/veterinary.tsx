import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import * as Haptics from 'expo-haptics';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Doctor {
  name: string;
  location: string;
}

interface VeterinaryComponentProps {
  locations?: string[];
  doctors?: Doctor[];
  onLocationSelect?: (location: string) => void;
  onDoctorSelect?: (doctor: Doctor) => void;
}

export default function VeterinaryComponent({
  locations = ['Byose', 'Kibuye', 'Muhanga'],
  doctors = [
    { name: 'Dr. Mutesi Hadidja', location: 'Muhanga' },
    { name: 'Dr. Teta Liana', location: 'Nyamirambo' },
  ],
  onLocationSelect,
  onDoctorSelect,
}: VeterinaryComponentProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade-in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLocationPress = (location: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLocation(location === selectedLocation ? null : location);
    if (onLocationSelect) onLocationSelect(location);
  };

  const handleDoctorPress = (doctor: Doctor) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDoctor(doctor.name === selectedDoctor ? null : doctor.name);
    if (onDoctorSelect) onDoctorSelect(doctor);
  };

  return (
    <Animated.View style={[tw`mb-6 px-4`, { opacity: fadeAnim }]}>
      <Text style={tw`text-2xl font-bold text-center text-gray-800 my-6`}>
        Find Veterinarians Near You
      </Text>
      <Text style={tw`text-lg font-semibold text-center text-gray-700 mb-5`}>
        Select a Location
      </Text>
      <View style={tw`flex-row gap-3 mb-6`}>
        {locations.map((location) => (
          <TouchableOpacity
            key={location}
            style={[
              tw`flex-1 p-4 rounded-xl shadow-sm border border-orange-200`,
              selectedLocation === location ? tw`bg-orange-100` : tw`bg-white`,
            ]}
            onPress={() => handleLocationPress(location)}
            activeOpacity={0.8}
          >
            <Text style={tw`text-gray-800 text-base font-semibold text-center`}>
              {location}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {doctors.map((doctor) => (
        <TouchableOpacity
          key={doctor.name}
          style={[
            tw`bg-white rounded-xl p-4 mb-4 shadow-md flex-row items-center border border-orange-200`,
            selectedDoctor === doctor.name ? tw`bg-orange-50` : tw``,
          ]}
          onPress={() => handleDoctorPress(doctor)}
          activeOpacity={0.9}
        >
          <Image
            source={require('@/assets/logo.png')}
            style={tw`w-14 h-14 rounded-full mr-4 border border-orange-200`}
            defaultSource={require('@/assets/logo.png')}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-800 text-lg font-semibold`}>{doctor.name}</Text>
            <Text style={tw`text-gray-600 text-sm mt-1`}>{doctor.location}</Text>
          </View>
          <View style={tw`p-2 bg-orange-100 rounded-full`}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#EA580C" />
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}