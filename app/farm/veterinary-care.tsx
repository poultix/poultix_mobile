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
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { mockVeterinaries } from '@/services/mockData';
import DrawerButton from '@/components/DrawerButton';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';

interface Veterinary {
    id: string;
    name: string;
    location: string;
    specialization: string;
    experience: string;
    rating: number;
    phone: string;
    email: string;
    isAvailable: boolean;
    nextAvailableSlot: string;
}

const mockVets: Veterinary[] = [
    {
        id: 'vet_001',
        name: 'Dr. Patricia Uwimana',
        location: 'Byose, Muhanga District',
        specialization: 'Poultry Health & Disease Prevention',
        experience: '8 years',
        rating: 4.8,
        phone: '+250 788 123 456',
        email: 'dr.patricia@example.com',
        isAvailable: true,
        nextAvailableSlot: 'Today 2:00 PM'
    },
    {
        id: 'vet_002',
        name: 'Dr. Mutesi Hadidja',
        location: 'Muhanga Center',
        specialization: 'Livestock Vaccination & Treatment',
        experience: '6 years',
        rating: 4.6,
        phone: '+250 788 234 567',
        email: 'dr.mutesi@example.com',
        isAvailable: true,
        nextAvailableSlot: 'Tomorrow 9:00 AM'
    },
    {
        id: 'vet_003',
        name: 'Dr. Teta Liana',
        location: 'Nyamirambo, Kigali',
        specialization: 'Animal Nutrition & Feed Management',
        experience: '10 years',
        rating: 4.9,
        phone: '+250 788 345 678',
        email: 'dr.teta@example.com',
        isAvailable: false,
        nextAvailableSlot: 'Monday 10:00 AM'
    },
    {
        id: 'vet_004',
        name: 'Dr. Jean Baptiste',
        location: 'Huye District',
        specialization: 'Emergency Care & Surgery',
        experience: '12 years',
        rating: 4.7,
        phone: '+250 788 456 789',
        email: 'dr.jean@example.com',
        isAvailable: true,
        nextAvailableSlot: 'Today 4:00 PM'
    }
];

export default function VeterinaryCareScreen() {
    const { currentUser } = useAuth();
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');
    const [filteredVets, setFilteredVets] = useState(mockVets);
    const [isEmergency, setIsEmergency] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(-50)).current;

    const specializations = ['All', 'Poultry Health', 'Vaccination', 'Nutrition', 'Emergency Care'];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(headerAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        let filtered = mockVets;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(vet =>
                vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.specialization.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by specialization
        if (selectedSpecialization !== 'All') {
            filtered = filtered.filter(vet =>
                vet.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase())
            );
        }

        // Sort by availability and rating
        filtered.sort((a, b) => {
            if (a.isAvailable && !b.isAvailable) return -1;
            if (!a.isAvailable && b.isAvailable) return 1;
            return b.rating - a.rating;
        });

        setFilteredVets(filtered);
    }, [searchQuery, selectedSpecialization]);

    const handleCallVet = (phone: string) => {
        Alert.alert(
            'Call Veterinarian',
            'Do you want to call this veterinarian now?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Call',
                    onPress: () => Linking.openURL(`tel:${phone}`)
                }
            ]
        );
    };

    const handleBookAppointment = (vet: Veterinary) => {
        Alert.alert(
            'Book Appointment',
            `Book an appointment with ${vet.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Book',
                    onPress: () => {
                        // Here you would typically navigate to a booking screen
                        Alert.alert('Success', 'Appointment request sent! You will be contacted shortly.');
                    }
                }
            ]
        );
    };

    const handleEmergencyCall = () => {
        Alert.alert(
            'Emergency Veterinary Care',
            'This will connect you to the nearest available veterinarian for emergency care.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Call Emergency',
                    style: 'destructive',
                    onPress: () => {
                        const emergencyVet = mockVets.find(vet => vet.isAvailable);
                        if (emergencyVet) {
                            Linking.openURL(`tel:${emergencyVet.phone}`);
                        }
                    }
                }
            ]
        );
    };

    const getRatingStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Ionicons key={i} name="star" size={16} color="#F59E0B" />);
        }
        if (hasHalfStar) {
            stars.push(<Ionicons key="half" name="star-half" size={16} color="#F59E0B" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#D1D5DB" />);
        }
        return stars;
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />

            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Header */}
                <Animated.View style={[tw`pb-4`, { transform: [{ translateY: headerAnim }] }]}>
                    <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        style={tw`p-8 shadow-xl`}
                    >
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <TouchableOpacity
                                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back-outline" size={24} color="white" />
                            </TouchableOpacity>

                            <Text style={tw`text-white text-xl font-bold`}>Veterinary Care</Text>

                            <DrawerButton />
                        </View>

                        {/* Emergency Button */}
                        <TouchableOpacity
                            style={tw`bg-red-600 rounded-2xl p-4 mb-4 flex-row items-center justify-center`}
                            onPress={handleEmergencyCall}
                        >
                            <Ionicons name="call-outline" size={24} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white font-bold text-lg`}>Emergency Call</Text>
                        </TouchableOpacity>

                        {/* Stats */}
                        <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6`}>
                            <Text style={tw`text-white font-bold text-lg mb-4`}>Available Now</Text>
                            <View style={tw`flex-row justify-between`}>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-3xl font-bold`}>
                                        {mockVets.filter(v => v.isAvailable).length}
                                    </Text>
                                    <Text style={tw`text-red-100 text-xs font-medium`}>Available</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-3xl font-bold`}>
                                        {mockVets.length}
                                    </Text>
                                    <Text style={tw`text-red-100 text-xs font-medium`}>Total Vets</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-3xl font-bold`}>4.8</Text>
                                    <Text style={tw`text-red-100 text-xs font-medium`}>Avg Rating</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                    {/* Search Bar */}
                    <View style={tw`flex-row items-center bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-200`}>
                        <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-2`} />
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

                    {/* Specialization Filter */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={tw`mb-6`}
                    >
                        {specializations.map((spec) => (
                            <TouchableOpacity
                                key={spec}
                                style={tw`mr-3 px-4 py-2 rounded-full ${selectedSpecialization === spec
                                        ? 'bg-red-500'
                                        : 'bg-white border border-gray-200'
                                    }`}
                                onPress={() => setSelectedSpecialization(spec)}
                            >
                                <Text style={tw`${selectedSpecialization === spec
                                        ? 'text-white'
                                        : 'text-gray-600'
                                    } font-medium`}>
                                    {spec}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Veterinarians List */}
                    {filteredVets.length === 0 ? (
                        <View style={tw`items-center py-10`}>
                            <Ionicons name="medical-outline" size={48} color="#6B7280" />
                            <Text style={tw`text-gray-500 text-lg mt-4`}>No veterinarians found</Text>
                        </View>
                    ) : (
                        filteredVets.map((vet, index) => (
                            <View
                                key={vet.id}
                                style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4`}
                            >
                                {/* Vet Header */}
                                <View style={tw`flex-row items-center justify-between mb-3`}>
                                    <View style={tw`flex-1`}>
                                        <View style={tw`flex-row items-center mb-1`}>
                                            <Text style={tw`text-lg font-bold text-gray-800 mr-2`}>
                                                {vet.name}
                                            </Text>
                                            {vet.isAvailable && (
                                                <View style={tw`bg-green-100 px-2 py-1 rounded-full`}>
                                                    <Text style={tw`text-green-700 text-xs font-semibold`}>Available</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={tw`text-gray-600 text-sm`}>{vet.specialization}</Text>
                                        <Text style={tw`text-gray-500 text-sm`}>{vet.location}</Text>
                                    </View>
                                    <View style={tw`items-end`}>
                                        <View style={tw`flex-row items-center mb-1`}>
                                            {getRatingStars(vet.rating)}
                                            <Text style={tw`text-gray-600 text-sm ml-1`}>{vet.rating}</Text>
                                        </View>
                                        <Text style={tw`text-gray-500 text-xs`}>{vet.experience}</Text>
                                    </View>
                                </View>

                                {/* Next Available */}
                                <View style={tw`bg-gray-50 rounded-xl p-3 mb-4`}>
                                    <Text style={tw`text-gray-600 text-sm mb-1`}>Next Available:</Text>
                                    <Text style={tw`text-gray-800 font-semibold`}>{vet.nextAvailableSlot}</Text>
                                </View>

                                {/* Action Buttons */}
                                <View style={tw`flex-row justify-between`}>
                                    <TouchableOpacity
                                        style={tw`bg-blue-100 rounded-xl py-3 px-4 flex-row items-center flex-1 mr-2`}
                                        onPress={() => handleCallVet(vet.phone)}
                                    >
                                        <Ionicons name="call-outline" size={18} color="#3B82F6" style={tw`mr-2`} />
                                        <Text style={tw`text-blue-600 font-semibold`}>Call</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={tw`${vet.isAvailable ? 'bg-red-500' : 'bg-gray-300'
                                            } rounded-xl py-3 px-4 flex-row items-center flex-1 ml-2`}
                                        onPress={() => handleBookAppointment(vet)}
                                        disabled={!vet.isAvailable}
                                    >
                                        <Ionicons
                                            name="calendar-outline"
                                            size={18}
                                            color={vet.isAvailable ? "white" : "#6B7280"}
                                            style={tw`mr-2`}
                                        />
                                        <Text style={tw`${vet.isAvailable ? 'text-white' : 'text-gray-500'
                                            } font-semibold`}>
                                            Book
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}
