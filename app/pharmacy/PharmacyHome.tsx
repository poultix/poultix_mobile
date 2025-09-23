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
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import axios from 'axios';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/interfaces/Navigation';
import { BlurView } from 'expo-blur';
import { SharedElement } from 'react-navigation-shared-element';
import TopNavigation from '../navigation/TopNavigation';
import { Pharmacy } from '@/interfaces/Pharmacy';


const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your API key

const PharmaciesScreen = () => {
    const navigation = useNavigation<NavigationProps>();
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

    // Fetch pharmacies using Google Places API
    const fetchPharmacies = async () => {
        setLoading(true);
        try {
            if (!userLocation) {
                Alert.alert('Location Unavailable', 'Please enable location services.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
                {
                    params: {
                        location: `${userLocation.latitude},${userLocation.longitude}`,
                        radius: 5000, // 5km radius
                        type: 'pharmacy',
                        keyword: 'veterinary',
                        key: GOOGLE_API_KEY,
                    },
                }
            );

            const places = response.data.results.map((place: any) => ({
                id: place.place_id,
                name: place.name,
                address: place.vicinity,
                distance: calculateDistance(
                    userLocation,
                    place.geometry.location.lat,
                    place.geometry.location.lng
                ),
                phone: place.phone_number || 'N/A',
                isOpen: place.opening_hours?.open_now || false,
                location: {
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                },
            }));

            setPharmacies(places);
            setFilteredPharmacies(places);

            // Fit map to show all markers
            if (places.length > 0 && mapRef.current) {
                mapRef.current.fitToCoordinates(
                    places.map((p: Pharmacy) => p.location).concat([userLocation]),
                    {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                    }
                );
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
            await getUserLocation();
            if (userLocation) {
                await fetchPharmacies();
            }
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

    if (loading || !userLocation) {
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
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <TopNavigation />
            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Map View */}
                <View style={tw`h-80 mb-6`}>
                    <MapView
                        ref={mapRef}
                        style={tw`flex-1 rounded-2xl`}
                        initialRegion={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
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
                                <View style={tw`bg-orange-500 p-2 rounded-full`}>
                                    <Ionicons name="medkit-outline" size={20} color="white" />
                                </View>
                            </Marker>
                        ))}
                    </MapView>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`pb-20 px-5`}
                >
                    {/* Header */}
                    <Text style={tw`text-4xl font-extrabold tracking-tight mb-2 text-orange-600`}>
                        Find Pharmacies
                    </Text>
                    <Text style={tw`text-gray-500 text-lg mb-8`}>Locate nearby veterinary pharmacies</Text>

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
                                <SharedElement id={`pharmacy-${pharmacy.id}`}>
                                    <TouchableOpacity
                                        style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-4`}
                                        onPress={() => navigation.navigate('PharmacyDetails', { pharmacy })}
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
                                </SharedElement>
                            </Animated.View>
                        ))
                    )}
                </ScrollView>
            </Animated.View>


        </SafeAreaView>
    );
};

// Shared element transition configuration
PharmaciesScreen.sharedElements = (route: any, otherRoute: any, showing: boolean) => {
    const { pharmacy } = route.params || {};
    if (pharmacy) {
        return [
            {
                id: `pharmacy-${pharmacy.id}`,
                animation: 'move',
                resize: 'auto',
                align: 'auto',
            },
        ];
    }
    return [];
};

export default PharmaciesScreen;