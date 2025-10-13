import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';

// Mock AI-generated veterinarian data for learning
const mockVeterinarians = [
    {
        id: '1',
        name: 'Dr. John Uwimana',
        rvcNumber: 'RVC-12345',
        specialization: 'Large Animal Medicine',
        clinic: 'Kigali Veterinary Clinic',
        location: 'Nyarugenge, Kigali',
        phone: '+250 788 123 456',
        email: 'john.uwimana@kvc.rw',
        experience: '8 years',
        rating: 4.9,
        reviewCount: 127,
        isVerified: true,
        aiScore: 98,
        availability: 'Available Today',
        consultationFee: '₹15,000',
        languages: ['Kinyarwanda', 'English', 'French'],
        services: ['Emergency Care', 'Surgery', 'Vaccination', 'Health Checkups'],
        workingHours: '8:00 AM - 6:00 PM',
        education: 'DVM University of Rwanda, MSc Animal Health',
        distance: 2.3
    },
    {
        id: '2',
        name: 'Dr. Alice Mukamana',
        rvcNumber: 'RVC-67890',
        specialization: 'Small Ruminants & Poultry',
        clinic: 'Gasabo Animal Health Center',
        location: 'Gasabo, Kigali',
        phone: '+250 788 234 567',
        email: 'alice.mukamana@gahc.rw',
        experience: '6 years',
        rating: 4.7,
        reviewCount: 89,
        isVerified: true,
        aiScore: 95,
        availability: 'Available Tomorrow',
        consultationFee: '₹12,000',
        languages: ['Kinyarwanda', 'English'],
        services: ['Disease Prevention', 'Nutrition Planning', 'Breeding Consultation'],
        workingHours: '7:00 AM - 5:00 PM',
        education: 'DVM University of Nairobi, Certificate in Poultry Medicine',
        distance: 4.8
    },
    {
        id: '3',
        name: 'Dr. Samuel Nkurunziza',
        rvcNumber: 'RVC-11111',
        specialization: 'Dairy Cattle Health',
        clinic: 'Kicukiro Veterinary Services',
        location: 'Kicukiro, Kigali',
        phone: '+250 788 345 678',
        email: 'samuel.nkurunziza@kvs.rw',
        experience: '12 years',
        rating: 4.8,
        reviewCount: 203,
        isVerified: true,
        aiScore: 97,
        availability: 'Busy Today',
        consultationFee: '₹18,000',
        languages: ['Kinyarwanda', 'English', 'Swahili'],
        services: ['Milk Quality Testing', 'Mastitis Treatment', 'Fertility Management'],
        workingHours: '6:00 AM - 8:00 PM',
        education: 'DVM Makerere University, PhD Animal Reproduction',
        distance: 7.1
    },
    {
        id: '4',
        name: 'Dr. Grace Uwase',
        rvcNumber: 'RVC-22222',
        specialization: 'Veterinary Surgery',
        clinic: 'Advanced Veterinary Hospital',
        location: 'Remera, Gasabo',
        phone: '+250 788 456 789',
        email: 'grace.uwase@avh.rw',
        experience: '10 years',
        rating: 4.9,
        reviewCount: 156,
        isVerified: true,
        aiScore: 99,
        availability: 'Emergency Only',
        consultationFee: '₹25,000',
        languages: ['English', 'French', 'Kinyarwanda'],
        services: ['Complex Surgery', 'Orthopedics', 'Emergency Care', 'Critical Care'],
        workingHours: '24/7 Emergency',
        education: 'DVM University of Glasgow, Residency in Veterinary Surgery',
        distance: 5.2
    }
];

const specializations = [
    { name: 'All', icon: 'people-outline', count: mockVeterinarians.length },
    { name: 'Large Animal Medicine', icon: 'home-outline', count: 1 },
    { name: 'Small Ruminants & Poultry', icon: 'leaf-outline', count: 1 },
    { name: 'Dairy Cattle Health', icon: 'water-outline', count: 1 },
    { name: 'Veterinary Surgery', icon: 'medical-outline', count: 1 }
];

const VeterinaryScreen = () => {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');
    const [filteredVeterinarians, setFilteredVeterinarians] = useState(mockVeterinarians);
    const [loading, setLoading] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    // Start animations
    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(searchAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Filter veterinarians
    useEffect(() => {
        let filtered = mockVeterinarians;

        if (selectedSpecialization !== 'All') {
            filtered = filtered.filter(vet => vet.specialization === selectedSpecialization);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(vet =>
                vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort by distance
        filtered.sort((a, b) => a.distance - b.distance);
        setFilteredVeterinarians(filtered);
    }, [searchQuery, selectedSpecialization]);

    const handleVeterinarianPress = (vet: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/veterinary/detail?id=${vet.id}&name=${encodeURIComponent(vet.name)}`);
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'Available Today': return 'text-green-600 bg-green-100';
            case 'Available Tomorrow': return 'text-blue-600 bg-blue-100';
            case 'Busy Today': return 'text-orange-600 bg-orange-100';
            case 'Emergency Only': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    useEffect(() => {
        startAnimations();
    }, []);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <ScrollView
                style={tw`flex-1`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`flexGrow pb-2`}
            >
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={tw`pb-4`}>
                        <LinearGradient
                            colors={['#059669', '#10B981']}
                            style={tw`p-8 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                                >
                                    <Ionicons name="arrow-back" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                    onPress={() => router.push('/veterinary/nearby')}
                                >
                                    <Ionicons name="location-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View style={tw`flex-1`}>
                                <Text style={tw`text-white text-sm opacity-90`}>
                                    AI-Verified Professional Network
                                </Text>
                                <Text style={tw`text-white text-2xl font-bold`}>
                                    Find Veterinarians
                                </Text>
                                <Text style={tw`text-green-100 text-sm mt-1`}>
                                    Connect with certified veterinary professionals
                                </Text>
                            </View>

                            {/* Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mt-4`}>
                                <Text style={tw`text-white font-bold text-base mb-3`}>Network Stats</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-white text-xl font-bold`}>
                                            {mockVeterinarians.filter(v => v.isVerified).length}
                                        </Text>
                                        <Text style={tw`text-green-100 text-xs`}>Verified</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-xl font-bold`}>
                                            {mockVeterinarians.filter(v => v.availability === 'Available Today').length}
                                        </Text>
                                        <Text style={tw`text-green-100 text-xs`}>Available</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-blue-200 text-xl font-bold`}>AI</Text>
                                        <Text style={tw`text-green-100 text-xs`}>Matched</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={tw`px-4`}>
                        {/* Search Bar */}
                        <Animated.View
                            style={[
                                tw`mb-6`,
                                {
                                    opacity: searchAnim,
                                    transform: [{
                                        translateY: searchAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    }],
                                },
                            ]}
                        >
                            <View style={tw`flex-row items-center bg-white rounded-2xl p-4 border border-gray-200 shadow-sm`}>
                                <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                                <TextInput
                                    style={tw`flex-1 text-gray-800 text-base`}
                                    placeholder="Search veterinarians..."
                                    placeholderTextColor="#6B7280"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoCapitalize="none"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>

                        {/* Specialization Filters */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={tw`mb-6`}
                            contentContainerStyle={tw`px-1`}
                        >
                            {specializations.map((spec) => (
                                <TouchableOpacity
                                    key={spec.name}
                                    style={tw`mr-3 px-4 py-3 rounded-xl flex-row items-center ${
                                        selectedSpecialization === spec.name
                                            ? 'bg-green-500 shadow-lg'
                                            : 'bg-white border border-gray-200'
                                    }`}
                                    onPress={() => setSelectedSpecialization(spec.name)}
                                >
                                    <Ionicons
                                        name={spec.icon as any}
                                        size={18}
                                        color={selectedSpecialization === spec.name ? 'white' : '#6B7280'}
                                        style={tw`mr-2`}
                                    />
                                    <Text
                                        style={tw`font-medium ${
                                            selectedSpecialization === spec.name
                                                ? 'text-white'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {spec.name} ({spec.count})
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Veterinarian List */}
                        {loading ? (
                            <View style={tw`items-center py-20`}>
                                <ActivityIndicator size="large" color="#059669" />
                                <Text style={tw`text-gray-600 mt-4`}>Loading veterinarians...</Text>
                            </View>
                        ) : filteredVeterinarians.length === 0 ? (
                            <View style={tw`items-center py-20`}>
                                <Ionicons name="person-outline" size={64} color="#D1D5DB" />
                                <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No veterinarians found</Text>
                                <Text style={tw`text-gray-400 text-center px-8`}>
                                    Try adjusting your search or specialization filter
                                </Text>
                            </View>
                        ) : (
                            filteredVeterinarians.map((vet, index) => (
                                <Animated.View
                                    key={vet.id}
                                    style={[
                                        tw`mb-4`,
                                        {
                                            opacity: cardAnim,
                                            transform: [{
                                                translateY: cardAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [10 * (index + 1), 0],
                                                }),
                                            }],
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-5`}
                                        onPress={() => handleVeterinarianPress(vet)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={tw`flex-row items-start`}>
                                            <View style={tw`w-16 h-16 rounded-full mr-4 items-center justify-center bg-green-100`}>
                                                <Ionicons name="person" size={28} color="#059669" />
                                            </View>
                                            
                                            <View style={tw`flex-1`}>
                                                <View style={tw`flex-row items-center justify-between mb-2`}>
                                                    <Text style={tw`text-gray-900 font-bold text-lg flex-1 mr-2`}>
                                                        {vet.name}
                                                    </Text>
                                                    {vet.isVerified && (
                                                        <View style={tw`bg-green-100 px-2 py-1 rounded-full flex-row items-center`}>
                                                            <Ionicons name="checkmark-circle" size={14} color="#059669" />
                                                            <Text style={tw`text-green-600 text-xs font-bold ml-1`}>Verified</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                
                                                <Text style={tw`text-gray-600 text-sm mb-1`}>
                                                    RVC: {vet.rvcNumber}
                                                </Text>
                                                
                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <View style={tw`px-2 py-1 rounded bg-green-50 mr-3`}>
                                                        <Text style={tw`text-green-700 text-xs font-medium`}>
                                                            {vet.specialization}
                                                        </Text>
                                                    </View>
                                                    <View style={tw`flex-row items-center`}>
                                                        <Ionicons name="sparkles" size={14} color="#10B981" />
                                                        <Text style={tw`text-green-600 text-xs font-medium ml-1`}>
                                                            AI Score: {vet.aiScore}%
                                                        </Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <Ionicons name="business" size={14} color="#6B7280" />
                                                    <Text style={tw`text-gray-600 text-sm ml-2 flex-1`}>
                                                        {vet.clinic}
                                                    </Text>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center mb-3`}>
                                                    <Ionicons name="location" size={14} color="#6B7280" />
                                                    <Text style={tw`text-gray-600 text-sm ml-2 flex-1`}>
                                                        {vet.location} • {vet.distance} km away
                                                    </Text>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center justify-between mb-3`}>
                                                    <View style={tw`flex-row items-center`}>
                                                        <Ionicons name="star" size={16} color="#F59E0B" />
                                                        <Text style={tw`text-gray-700 font-bold ml-1`}>
                                                            {vet.rating} ({vet.reviewCount} reviews)
                                                        </Text>
                                                    </View>
                                                    <Text style={tw`text-green-600 font-bold text-lg`}>
                                                        {vet.consultationFee}
                                                    </Text>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center justify-between mb-4`}>
                                                    <View style={tw`px-3 py-1 rounded-full ${getAvailabilityColor(vet.availability)}`}>
                                                        <Text style={tw`text-xs font-bold`}>
                                                            {vet.availability}
                                                        </Text>
                                                    </View>
                                                    <Text style={tw`text-gray-500 text-sm`}>
                                                        {vet.experience} experience
                                                    </Text>
                                                </View>

                                                {/* Services */}
                                                <View style={tw`mb-4`}>
                                                    <Text style={tw`text-gray-700 font-medium mb-2 text-sm`}>Services:</Text>
                                                    <View style={tw`flex-row flex-wrap`}>
                                                        {vet.services.slice(0, 3).map((service, idx) => (
                                                            <View key={idx} style={tw`bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1`}>
                                                                <Text style={tw`text-gray-600 text-xs`}>
                                                                    {service}
                                                                </Text>
                                                            </View>
                                                        ))}
                                                        {vet.services.length > 3 && (
                                                            <View style={tw`bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1`}>
                                                                <Text style={tw`text-gray-600 text-xs`}>
                                                                    +{vet.services.length - 3} more
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                                
                                                <View style={tw`flex-row space-x-3`}>
                                                    <TouchableOpacity
                                                        style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                        onPress={() => handleVeterinarianPress(vet)}
                                                    >
                                                        <Ionicons name="person-circle" size={18} color="#6B7280" style={tw`mr-2`} />
                                                        <Text style={tw`text-gray-700 font-bold`}>View Profile</Text>
                                                    </TouchableOpacity>
                                                    
                                                    <TouchableOpacity
                                                        style={tw`flex-1 bg-green-500 py-3 rounded-xl flex-row items-center justify-center`}
                                                        onPress={() => router.push('/schedule/schedule-request')}
                                                    >
                                                        <Ionicons name="calendar" size={18} color="white" style={tw`mr-2`} />
                                                        <Text style={tw`text-white font-bold`}>Book Visit</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))
                        )}
                    </View>
                </Animated.View>
            </ScrollView>

            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </View>
    );
};

export default VeterinaryScreen;
