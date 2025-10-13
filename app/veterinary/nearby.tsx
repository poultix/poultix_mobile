import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc';

// Mock nearby veterinarians with GPS locations
const mockNearbyVeterinarians = [
    {
        id: '1',
        name: 'Dr. John Uwimana',
        clinic: 'Kigali Veterinary Clinic',
        address: 'KG 15 Ave, Nyarugenge, Kigali',
        phone: '+250 788 123 456',
        distance: 1.2,
        rating: 4.9,
        reviewCount: 127,
        isOpen: true,
        openingHours: '8:00 AM - 6:00 PM',
        location: { latitude: -1.9441, longitude: 30.0619 },
        specialization: 'Large Animal Medicine',
        consultationFee: '₹15,000',
        languages: ['Kinyarwanda', 'English', 'French'],
        emergencyAvailable: true,
        aiVerified: true
    },
    {
        id: '2',
        name: 'Dr. Alice Mukamana',
        clinic: 'Gasabo Animal Health Center',
        address: 'KK 19 St, Gasabo, Kigali',
        phone: '+250 788 234 567',
        distance: 2.8,
        rating: 4.7,
        reviewCount: 89,
        isOpen: true,
        openingHours: '7:00 AM - 5:00 PM',
        location: { latitude: -1.9356, longitude: 30.0719 },
        specialization: 'Small Ruminants & Poultry',
        consultationFee: '₹12,000',
        languages: ['Kinyarwanda', 'English'],
        emergencyAvailable: false,
        aiVerified: true
    },
    {
        id: '3',
        name: 'Dr. Samuel Nkurunziza',
        clinic: 'Kicukiro Veterinary Services',
        address: 'KG 23 Ave, Kicukiro, Kigali',
        phone: '+250 788 345 678',
        distance: 4.1,
        rating: 4.8,
        reviewCount: 203,
        isOpen: false,
        openingHours: '6:00 AM - 8:00 PM',
        location: { latitude: -1.9536, longitude: 30.0819 },
        specialization: 'Dairy Cattle Health',
        consultationFee: '₹18,000',
        languages: ['Kinyarwanda', 'English', 'Swahili'],
        emergencyAvailable: true,
        aiVerified: true
    },
    {
        id: '4',
        name: 'Dr. Grace Uwase',
        clinic: 'Advanced Veterinary Hospital',
        address: 'KG 45 St, Remera, Gasabo',
        phone: '+250 788 456 789',
        distance: 5.7,
        rating: 4.9,
        reviewCount: 156,
        isOpen: true,
        openingHours: '24/7 Emergency',
        location: { latitude: -1.9326, longitude: 30.0519 },
        specialization: 'Veterinary Surgery',
        consultationFee: '₹25,000',
        languages: ['English', 'French', 'Kinyarwanda'],
        emergencyAvailable: true,
        aiVerified: true
    }
];

const NearbyVeterinariansScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredVeterinarians, setFilteredVeterinarians] = useState(mockNearbyVeterinarians);
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [mapView, setMapView] = useState(true);
    const [loading, setLoading] = useState(false);
    const mapRef = useRef<MapView>(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;

    // Get user location
    const getUserLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to find nearby veterinarians.');
                return;
            }
            
            let location = await Location.getCurrentPositionAsync({});
            const newLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setUserLocation(newLocation);

            // Animate map to user location
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: newLocation.latitude,
                    longitude: newLocation.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }, 1000);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to get your location. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
        ]).start();
    };

    // Filter veterinarians
    useEffect(() => {
        let filtered = mockNearbyVeterinarians;

        if (searchQuery.trim()) {
            filtered = filtered.filter(vet =>
                vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vet.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort by distance
        filtered.sort((a, b) => a.distance - b.distance);
        setFilteredVeterinarians(filtered);
    }, [searchQuery]);

    const handleVeterinarianPress = (vet: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            vet.name,
            `Distance: ${vet.distance} km\n${vet.clinic}\n\nWhat would you like to do?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => Linking.openURL(`tel:${vet.phone}`) },
                { text: 'View Details', onPress: () => router.push(`/veterinary/detail?id=${vet.id}`) },
                { text: 'Directions', onPress: () => openDirections(vet) }
            ]
        );
    };

    const openDirections = (vet: any) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${vet.location.latitude},${vet.location.longitude}`,
            android: `geo:0,0?q=${vet.location.latitude},${vet.location.longitude}(${vet.name})`,
        });

        if (url) {
            Linking.openURL(url);
        }
    };

    useEffect(() => {
        getUserLocation();
        startAnimations();
    }, []);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#059669', '#10B981']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <View style={tw`flex-row items-center justify-between mb-4`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <View style={tw`flex-row`}>
                        <TouchableOpacity
                            style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-3`}
                            onPress={() => setMapView(!mapView)}
                        >
                            <Ionicons 
                                name={mapView ? "list" : "map"} 
                                size={24} 
                                color="white" 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                            onPress={getUserLocation}
                        >
                            <Ionicons name="location-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-white text-sm opacity-90`}>
                            GPS-Enabled Veterinary Locator
                        </Text>
                        <Text style={tw`text-white text-2xl font-bold`}>
                            Nearby Veterinarians
                        </Text>
                        <Text style={tw`text-green-100 text-sm mt-1`}>
                            Find certified veterinarians in your area
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mt-4`}>
                        <View style={tw`flex-row justify-between`}>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {filteredVeterinarians.length}
                                </Text>
                                <Text style={tw`text-green-100 text-xs`}>Found</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {filteredVeterinarians.filter(v => v.isOpen).length}
                                </Text>
                                <Text style={tw`text-green-100 text-xs`}>Open Now</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {filteredVeterinarians.filter(v => v.emergencyAvailable).length}
                                </Text>
                                <Text style={tw`text-green-100 text-xs`}>Emergency</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </LinearGradient>

            {/* Search Bar */}
            <View style={tw`px-4 py-4 bg-white border-b border-gray-200`}>
                <View style={tw`flex-row items-center bg-gray-100 rounded-2xl p-3`}>
                    <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                    <TextInput
                        style={tw`flex-1 text-gray-800 text-base`}
                        placeholder="Search veterinarians, clinics..."
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
            </View>

            {/* Content */}
            {mapView ? (
                // Map View
                <View style={tw`flex-1`}>
                    <MapView
                        ref={mapRef}
                        style={tw`flex-1`}
                        initialRegion={{
                            latitude: userLocation?.latitude || -1.9441,
                            longitude: userLocation?.longitude || 30.0619,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        }}
                        showsUserLocation={true}
                        showsCompass={true}
                        mapType='standard'
                    >
                        {filteredVeterinarians.map((vet) => (
                            <Marker
                                key={vet.id}
                                coordinate={vet.location}
                                title={vet.name}
                                description={`${vet.clinic} • ${vet.distance} km`}
                                onPress={() => handleVeterinarianPress(vet)}
                            >
                                <View style={tw`bg-green-500 p-3 rounded-full shadow-lg ${!vet.isOpen ? 'opacity-60' : ''}`}>
                                    <Ionicons 
                                        name={vet.emergencyAvailable ? "medical" : "person"} 
                                        size={24} 
                                        color="white" 
                                    />
                                </View>
                            </Marker>
                        ))}
                    </MapView>

                    {/* Floating Action Button */}
                    <TouchableOpacity
                        style={tw`absolute bottom-4 right-4 bg-green-500 p-4 rounded-full shadow-lg`}
                        onPress={() => setMapView(false)}
                    >
                        <Ionicons name="list" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ) : (
                // List View
                <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                    <Animated.View style={[{ opacity: fadeAnim }]}>
                        {loading ? (
                            <View style={tw`items-center py-20`}>
                                <ActivityIndicator size="large" color="#059669" />
                                <Text style={tw`text-gray-600 mt-4`}>Finding nearby veterinarians...</Text>
                            </View>
                        ) : filteredVeterinarians.length === 0 ? (
                            <View style={tw`items-center py-20`}>
                                <Ionicons name="person-outline" size={64} color="#D1D5DB" />
                                <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No veterinarians found</Text>
                                <Text style={tw`text-gray-400 text-center px-8`}>
                                    Try adjusting your search or location settings
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
                                                    <View style={tw`flex-row items-center`}>
                                                        <Text style={tw`text-green-600 font-bold text-lg mr-2`}>
                                                            {vet.distance} km
                                                        </Text>
                                                        {vet.aiVerified && (
                                                            <Ionicons name="checkmark-circle" size={20} color="#059669" />
                                                        )}
                                                    </View>
                                                </View>
                                                
                                                <Text style={tw`text-gray-600 font-medium mb-1`}>
                                                    {vet.clinic}
                                                </Text>
                                                
                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <View style={tw`px-2 py-1 rounded bg-green-50 mr-3`}>
                                                        <Text style={tw`text-green-700 text-xs font-medium`}>
                                                            {vet.specialization}
                                                        </Text>
                                                    </View>
                                                    <View style={tw`flex-row items-center`}>
                                                        <Ionicons name="star" size={14} color="#F59E0B" />
                                                        <Text style={tw`text-gray-600 text-sm ml-1`}>
                                                            {vet.rating} ({vet.reviewCount})
                                                        </Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center mb-3`}>
                                                    <Ionicons name="location" size={14} color="#6B7280" />
                                                    <Text style={tw`text-gray-600 text-sm ml-2 flex-1`}>
                                                        {vet.address}
                                                    </Text>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center justify-between mb-3`}>
                                                    <View style={tw`flex-row items-center`}>
                                                        <View
                                                            style={tw`px-3 py-1 rounded-full ${
                                                                vet.isOpen ? 'bg-green-100' : 'bg-red-100'
                                                            }`}
                                                        >
                                                            <Text
                                                                style={tw`text-xs font-bold ${
                                                                    vet.isOpen ? 'text-green-600' : 'text-red-600'
                                                                }`}
                                                            >
                                                                {vet.isOpen ? 'Open Now' : 'Closed'}
                                                            </Text>
                                                        </View>
                                                        
                                                        {vet.emergencyAvailable && (
                                                            <View style={tw`bg-red-100 px-2 py-1 rounded-full ml-2`}>
                                                                <Text style={tw`text-red-600 text-xs font-bold`}>Emergency</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    
                                                    <Text style={tw`text-green-600 font-bold text-lg`}>
                                                        {vet.consultationFee}
                                                    </Text>
                                                </View>

                                                <View style={tw`flex-row items-center mb-4`}>
                                                    <Ionicons name="time" size={14} color="#6B7280" />
                                                    <Text style={tw`text-gray-600 text-sm ml-2`}>
                                                        {vet.openingHours}
                                                    </Text>
                                                </View>

                                                {/* Action Buttons */}
                                                <View style={tw`flex-row space-x-3`}>
                                                    <TouchableOpacity
                                                        style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                        onPress={() => Linking.openURL(`tel:${vet.phone}`)}
                                                    >
                                                        <Ionicons name="call-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                                        <Text style={tw`text-gray-700 font-bold`}>Call</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={tw`flex-1 bg-blue-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                        onPress={() => router.push(`/veterinary/detail?id=${vet.id}`)}
                                                    >
                                                        <Ionicons name="person-circle-outline" size={18} color="#3B82F6" style={tw`mr-2`} />
                                                        <Text style={tw`text-blue-600 font-bold`}>Profile</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={tw`flex-1 bg-green-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                        onPress={() => openDirections(vet)}
                                                    >
                                                        <Ionicons name="navigate-outline" size={18} color="#059669" style={tw`mr-2`} />
                                                        <Text style={tw`text-green-600 font-bold`}>Directions</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))
                        )}
                    </Animated.View>
                </ScrollView>
            )}
        </View>
    );
};

export default NearbyVeterinariansScreen;
