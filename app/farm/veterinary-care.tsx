import CustomDrawer from '@/components/CustomDrawer';
import DrawerButton from '@/components/DrawerButton';
import { useAuth } from '@/contexts/AuthContext';
import { useDrawer } from '@/contexts/DrawerContext';
import { useFarms } from '@/contexts/FarmContext';
import { User } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';
 

export default function VeterinaryCareScreen() {
    const { currentUser } = useAuth();
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const { farms } = useFarms();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(-50)).current;

    const specializations = ['All', 'Poultry Health', 'Vaccination', 'Nutrition', 'Emergency Care'];

    // Get unique veterinaries from farms
    const veterinaries = React.useMemo(() => {
        const vetMap = new Map<string, User>();

        farms.forEach(farm => {
            if (farm.assignedVeterinary) {
                vetMap.set(farm.assignedVeterinary.id, farm.assignedVeterinary);
            }
        });

        return Array.from(vetMap.values());
    }, [farms]);

    const [filteredVets, setFilteredVets] = useState<User[]>(veterinaries);

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
        let filtered = veterinaries;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(vet =>
                vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // For now, we'll skip specialization filtering since User type doesn't have this field
        // In a real app, you might want to extend the User type or add metadata

        // Sort by name for consistency
        filtered.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredVets(filtered);
    }, [searchQuery, veterinaries]);

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

    const handleBookAppointment = (vet: User) => {
        // Check if farmer has any farms registered
        const farmerFarms = farms.filter(farm => currentUser && farm.owner.id === currentUser.id);

        if (farmerFarms.length === 0) {
            Alert.alert(
                'No Farms Registered',
                'You need to register at least one farm before booking a veterinary appointment.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Add Farm',
                        onPress: () => router.push('/farm/create')
                    }
                ]
            );
            return;
        }

        // Navigate to schedule request screen for booking
        router.push('/schedule/schedule-request');
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
        <View style={tw`flex-1 bg-gray-50`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />

            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Header */}
                <Animated.View style={[tw`pb-4`, { transform: [{ translateY: headerAnim }] }]}>
                    <LinearGradient
                        colors={['#F59E0B', '#D97706']}
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
                                        ? 'bg-amber-500'
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
                        filteredVets.map((vet: User, index: number) => (
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
                                            <View style={tw`bg-green-100 px-2 py-1 rounded-full`}>
                                                <Text style={tw`text-green-700 text-xs font-semibold`}>Available</Text>
                                            </View>
                                        </View>
                                        <Text style={tw`text-gray-600 text-sm`}>{vet.email}</Text>
                                        <Text style={tw`text-gray-500 text-sm`}>Veterinarian</Text>
                                    </View>
                                    <View style={tw`items-end`}>
                                        <View style={tw`flex-row items-center mb-1`}>
                                            <Ionicons name="star" size={16} color="#F59E0B" />
                                            <Ionicons name="star" size={16} color="#F59E0B" />
                                            <Ionicons name="star" size={16} color="#F59E0B" />
                                            <Ionicons name="star" size={16} color="#F59E0B" />
                                            <Ionicons name="star-half" size={16} color="#F59E0B" />
                                            <Text style={tw`text-gray-600 text-sm ml-1`}>4.5</Text>
                                        </View>
                                        <Text style={tw`text-gray-500 text-xs`}>Licensed Vet</Text>
                                    </View>
                                </View>

                                {/* Next Available */}
                                <View style={tw`bg-gray-50 rounded-xl p-3 mb-4`}>
                                    <Text style={tw`text-gray-600 text-sm mb-1`}>Next Available:</Text>
                                    <Text style={tw`text-gray-800 font-semibold`}>Today 2:00 PM</Text>
                                </View>

                                {/* Action Buttons */}
                                <View style={tw`flex-row justify-between`}>
                                    <TouchableOpacity
                                        style={tw`bg-blue-100 rounded-xl py-3 px-4 flex-row items-center flex-1 mr-2`}
                                        onPress={() => handleCallVet('')} // User doesn't have phone, would need to add
                                    >
                                        <Ionicons name="call-outline" size={18} color="#3B82F6" style={tw`mr-2`} />
                                        <Text style={tw`text-blue-600 font-semibold`}>Call</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={tw`bg-amber-500 rounded-xl py-3 px-4 flex-row items-center flex-1 ml-2`}
                                        onPress={() => handleBookAppointment(vet)}
                                    >
                                        <Ionicons
                                            name="calendar-outline"
                                            size={18}
                                            color="white"
                                            style={tw`mr-2`}
                                        />
                                        <Text style={tw`text-white font-semibold`}>
                                            Book
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
}
