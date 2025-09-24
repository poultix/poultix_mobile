import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Animated,
    TextInput,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { MockDataService } from '@/services/mockData';
import tw from 'twrnc';
import { router } from 'expo-router';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { Pharmacy } from '@/interfaces/Pharmacy';


const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your API key

const PharmaciesScreen = () => {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const mapRef = useRef<MapView>(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    // Request location permissions and get user location
    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location permission is required to find nearby pharmacies.');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    };

    // Fetch pharmacies using mock data
    const fetchPharmacies = async () => {
        setLoading(true);
        try {
            const mockPharmacies = await MockDataService.getPharmacies();
            
            // Transform mock data to match the expected format
            const places = mockPharmacies.map((pharmacy) => ({
                id: pharmacy.id,
                name: pharmacy.name,
                address: pharmacy.address,
                distance: userLocation ? calculateDistance(
                    userLocation,
                    pharmacy.location.latitude,
                    pharmacy.location.longitude
                ) : pharmacy.distance, // Use default distance if no location
                phone: pharmacy.phone,
                isOpen: pharmacy.isOpen,
                location: {
                    latitude: pharmacy.location.latitude,
                    longitude: pharmacy.location.longitude,
                },
            }));

            setPharmacies(places);
            setFilteredPharmacies(places);

            // Fit map to show all markers
            if (places.length > 0 && mapRef.current) {
                const coordinates = places.map((p: Pharmacy) => p.location);
                if (userLocation) {
                    coordinates.push(userLocation);
                }
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch pharmacies. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate distance between two points (in km)
    const calculateDistance = (
        origin: { latitude: number; longitude: number },
        lat: number,
        lng: number
    ) => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat - origin.latitude) * Math.PI) / 180;
        const dLon = ((lng - origin.longitude) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((origin.latitude * Math.PI) / 180) *
            Math.cos((lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Number((R * c).toFixed(1));
    };

    // Filter pharmacies based on search query
    const filterPharmacies = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredPharmacies(pharmacies);
        } else {
            const lowerQuery = query.toLowerCase();
            setFilteredPharmacies(
                pharmacies.filter(
                    (pharmacy) =>
                        pharmacy.name.toLowerCase().includes(lowerQuery) ||
                        pharmacy.address.toLowerCase().includes(lowerQuery)
                )
            );
        }
    };

    // Open Google Maps for directions
    const openDirections = (address: string) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'Unable to open Google Maps.')
        );
    };

    // Animation setup and data fetching
    useEffect(() => {
        const initialize = async () => {
            // Load pharmacies immediately with default distances
            await fetchPharmacies();
            
            // Get location in background and update distances later
            getUserLocation().then(() => {
                if (userLocation) {
                    fetchPharmacies(); // Refresh with calculated distances
                }
            }).catch(console.error);
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(cardAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(searchAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        };
        initialize();
    }, []);

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <View style={tw`w-20 h-20 rounded-full justify-center items-center mb-4 bg-orange-500`}>
                    <ActivityIndicator color="white" size="large" />
                </View>
                <Text style={tw`text-lg font-medium text-gray-700`}>Loading pharmacies...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            
            <ScrollView 
                style={tw`flex-1`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`flexGrow pb-2`}
                bounces={true}
            >
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Enhanced Header */}
                    <View style={tw`px-4 pt-2 pb-4`}>
                        <LinearGradient
                            colors={['#EF4444', '#DC2626']}
                            style={tw`rounded-3xl p-8 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-white text-sm opacity-90`}>
                                        Veterinary Services
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>
                                        Find Pharmacies 🏥
                                    </Text>
                                    <Text style={tw`text-red-100 text-sm mt-1`}>
                                        Locate nearby veterinary pharmacies
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                    onPress={() => getUserLocation()}
                                >
                                    <Ionicons name="location-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            
                            {/* Pharmacy Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                                <Text style={tw`text-white font-bold text-lg mb-4`}>Available Services</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-white text-2xl font-bold`}>{pharmacies.length}</Text>
                                        <Text style={tw`text-red-100 text-xs font-medium`}>Pharmacies</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-2xl font-bold`}>24/7</Text>
                                        <Text style={tw`text-red-100 text-xs font-medium`}>Available</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-blue-200 text-2xl font-bold`}>GPS</Text>
                                        <Text style={tw`text-red-100 text-xs font-medium`}>Enabled</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Map View */}
                    <View style={tw`px-4 mb-4`}>
                        <View style={tw`h-80 rounded-2xl overflow-hidden shadow-lg`}>
                            <MapView
                                ref={mapRef}
                                style={tw`flex-1`}
                                initialRegion={{
                                    latitude: userLocation?.latitude || -1.9441, // Default to Kigali
                                    longitude: userLocation?.longitude || 30.0619,
                                    latitudeDelta: 0.05,
                                    longitudeDelta: 0.05,
                                }}
                                showsUserLocation={true}
                            >
                                {filteredPharmacies.map((pharmacy) => (
                                    <Marker
                                        key={pharmacy.id}
                                        coordinate={pharmacy.location}
                                        title={pharmacy.name}
                                        description={pharmacy.address}
                                    >
                                        <View style={tw`bg-red-500 p-2 rounded-full shadow-lg`}>
                                            <Ionicons name="medkit" size={20} color="white" />
                                        </View>
                                    </Marker>
                                ))}
                            </MapView>
                        </View>
                    </View>

                    <View style={tw`px-4`}>

                    {/* Search Bar */}
                    <Animated.View
                        style={[
                            tw`mb-6`,
                            {
                                opacity: searchAnim,
                                transform: [
                                    {
                                        translateY: searchAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <View style={tw`flex-row items-center bg-gray-100 rounded-2xl p-3 border border-gray-200`}>
                            <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-2`} />
                            <TextInput
                                style={tw`flex-1 text-gray-800 text-base`}
                                placeholder="Search pharmacies..."
                                placeholderTextColor="#6B7280"
                                value={searchQuery}
                                onChangeText={filterPharmacies}
                                autoCapitalize="none"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => filterPharmacies('')}>
                                    <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </Animated.View>

                    {/* Pharmacy List */}
                    {filteredPharmacies.length === 0 ? (
                        <View style={tw`items-center py-10`}>
                            <Ionicons name="search-outline" size={48} color="#6B7280" />
                            <Text style={tw`text-gray-500 text-lg mt-4`}>No pharmacies found</Text>
                        </View>
                    ) : (
                        filteredPharmacies.map((pharmacy, index) => (
                            <Animated.View
                                key={pharmacy.id}
                                style={[
                                    tw`mb-4`,
                                    {
                                        opacity: cardAnim,
                                        transform: [
                                            {
                                                translateY: cardAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [10 * (index + 1), 0],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                    <TouchableOpacity
                                        style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-4`}
                                        onPress={() => router.push('/pharmacy' as any)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={tw`flex-row items-center justify-between mb-3`}>
                                            <Text style={tw`text-gray-900 font-semibold text-lg`}>{pharmacy.name}</Text>
                                            <View
                                                style={tw`px-2 py-1 rounded-full ${pharmacy.isOpen ? 'bg-green-100' : 'bg-red-100'
                                                    }`}
                                            >
                                                <Text
                                                    style={tw`text-xs font-medium ${pharmacy.isOpen ? 'text-green-600' : 'text-red-600'
                                                        }`}
                                                >
                                                    {pharmacy.isOpen ? 'Open' : 'Closed'}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={tw`flex-row items-center mb-2`}>
                                            <Ionicons name="location-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                            <Text style={tw`text-gray-600 text-sm flex-1`}>{pharmacy.address}</Text>
                                        </View>
                                        <View style={tw`flex-row items-center mb-2`}>
                                            <Ionicons name="navigate-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                            <Text style={tw`text-gray-600 text-sm`}>{pharmacy.distance} km away</Text>
                                        </View>
                                        <View style={tw`flex-row items-center`}>
                                            <Ionicons name="call-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                            <Text style={tw`text-gray-600 text-sm`}>{pharmacy.phone}</Text>
                                        </View>
                                        <View style={tw`flex-row justify-end mt-3`}>
                                            <TouchableOpacity
                                                style={tw`bg-orange-100 rounded-xl py-2 px-4 flex-row items-center`}
                                                onPress={() => openDirections(pharmacy.address)}
                                            >
                                                <Ionicons name="navigate-circle-outline" size={18} color="#EF4444" style={tw`mr-2`} />
                                                <Text style={tw`text-orange-600 font-semibold`}>Get Directions</Text>
                                            </TouchableOpacity>
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
        </SafeAreaView>
    );
};

export default PharmaciesScreen;