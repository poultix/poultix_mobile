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

// Mock AI-generated pharmacy data for learning
const mockPharmacies = [
    {
        id: '1',
        name: 'VetCare Pharmacy Kigali',
        address: 'KG 15 Ave, Nyarugenge, Kigali',
        phone: '+250 788 123 456',
        isOpen: true,
        openingHours: '24/7',
        distance: 2.3,
        location: { latitude: -1.9441, longitude: 30.0619 },
        rating: 4.8,
        specialties: ['Emergency Medicines', 'Livestock Vaccines', 'Prescription Drugs'],
        aiVerified: true,
        stockLevel: 'High',
        deliveryAvailable: true,
        estimatedDelivery: '30 mins'
    },
    {
        id: '2',
        name: 'AgriVet Solutions Hub',
        address: 'KK 19 St, Gasabo, Kigali',
        phone: '+250 788 234 567',
        isOpen: true,
        openingHours: '7:00 AM - 9:00 PM',
        distance: 4.7,
        location: { latitude: -1.9356, longitude: 30.0719 },
        rating: 4.6,
        specialties: ['Antiparasitic', 'Nutritional Supplements', 'Farm Equipment'],
        aiVerified: true,
        stockLevel: 'Medium',
        deliveryAvailable: true,
        estimatedDelivery: '45 mins'
    },
    {
        id: '3',
        name: 'Rwanda Veterinary Supplies',
        address: 'KG 23 Ave, Kicukiro, Kigali',
        phone: '+250 788 345 678',
        isOpen: false,
        openingHours: '8:00 AM - 6:00 PM',
        distance: 6.2,
        location: { latitude: -1.9536, longitude: 30.0819 },
        rating: 4.4,
        specialties: ['Antibiotics', 'Pain Management', 'Surgical Supplies'],
        aiVerified: true,
        stockLevel: 'Low',
        deliveryAvailable: false,
        estimatedDelivery: null
    },
    {
        id: '4',
        name: 'Smart Animal Health Center',
        address: 'KG 45 St, Nyarugenge, Kigali',
        phone: '+250 788 456 789',
        isOpen: true,
        openingHours: '6:00 AM - 10:00 PM',
        distance: 8.1,
        location: { latitude: -1.9326, longitude: 30.0519 },
        rating: 4.9,
        specialties: ['AI-Guided Treatment', 'Specialized Vaccines', 'Emergency Care'],
        aiVerified: true,
        stockLevel: 'High',
        deliveryAvailable: true,
        estimatedDelivery: '1 hour'
    }
];

const NearbyPharmaciesScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPharmacies, setFilteredPharmacies] = useState(mockPharmacies);
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

    // Request location permissions and get user location
    const getUserLocation = async () => {
        setLoading(true);
        try {
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

            // Animate map to user location
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
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

    // Filter pharmacies based on search query
    useEffect(() => {
        let filtered = mockPharmacies;

        if (searchQuery.trim()) {
            filtered = filtered.filter(pharmacy =>
                pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pharmacy.specialties.some(specialty => 
                    specialty.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        // Sort by distance
        filtered.sort((a, b) => a.distance - b.distance);
        setFilteredPharmacies(filtered);
    }, [searchQuery]);

    const handlePharmacyPress = (pharmacy: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            pharmacy.name,
            `Would you like to call or get directions to this pharmacy?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => Linking.openURL(`tel:${pharmacy.phone}`) },
                { text: 'Directions', onPress: () => openDirections(pharmacy) }
            ]
        );
    };

    const openDirections = (pharmacy: any) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${pharmacy.location.latitude},${pharmacy.location.longitude}`,
            android: `geo:0,0?q=${pharmacy.location.latitude},${pharmacy.location.longitude}(${pharmacy.name})`,
        });

        if (url) {
            Linking.openURL(url);
        }
    };

    const getStockLevelColor = (level: string) => {
        switch (level) {
            case 'High': return 'text-green-600 bg-green-100';
            case 'Medium': return 'text-orange-600 bg-orange-100';
            case 'Low': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
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
                colors={['#10B981', '#059669']}
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
                            AI-Powered Pharmacy Locator
                        </Text>
                        <Text style={tw`text-white text-2xl font-bold`}>
                            Nearby Pharmacies
                        </Text>
                        <Text style={tw`text-green-100 text-sm mt-1`}>
                            Find verified veterinary pharmacies near you
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mt-4`}>
                        <View style={tw`flex-row justify-between`}>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>{filteredPharmacies.length}</Text>
                                <Text style={tw`text-green-100 text-xs`}>Found</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {filteredPharmacies.filter(p => p.isOpen).length}
                                </Text>
                                <Text style={tw`text-green-100 text-xs`}>Open Now</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {filteredPharmacies.filter(p => p.deliveryAvailable).length}
                                </Text>
                                <Text style={tw`text-green-100 text-xs`}>Delivery</Text>
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
                        placeholder="Search pharmacies, specialties..."
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
                        {filteredPharmacies.map((pharmacy) => (
                            <Marker
                                key={pharmacy.id}
                                coordinate={pharmacy.location}
                                title={pharmacy.name}
                                description={pharmacy.address}
                                onPress={() => handlePharmacyPress(pharmacy)}
                            >
                                <View style={tw`bg-green-500 p-3 rounded-full shadow-lg ${!pharmacy.isOpen ? 'opacity-60' : ''}`}>
                                    <Ionicons name="storefront" size={24} color="white" />
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
                                <ActivityIndicator size="large" color="#10B981" />
                                <Text style={tw`text-gray-600 mt-4`}>Finding nearby pharmacies...</Text>
                            </View>
                        ) : filteredPharmacies.length === 0 ? (
                            <View style={tw`items-center py-20`}>
                                <Ionicons name="storefront-outline" size={64} color="#D1D5DB" />
                                <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No pharmacies found</Text>
                                <Text style={tw`text-gray-400 text-center px-8`}>
                                    Try adjusting your search or location settings
                                </Text>
                            </View>
                        ) : (
                            filteredPharmacies.map((pharmacy, index) => (
                                <Animated.View
                                    key={pharmacy.id}
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
                                        onPress={() => handlePharmacyPress(pharmacy)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={tw`flex-row items-start justify-between mb-3`}>
                                            <View style={tw`flex-1 mr-4`}>
                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <Text style={tw`text-gray-900 font-bold text-lg flex-1`}>
                                                        {pharmacy.name}
                                                    </Text>
                                                    {pharmacy.aiVerified && (
                                                        <View style={tw`bg-green-100 px-2 py-1 rounded-full ml-2`}>
                                                            <View style={tw`flex-row items-center`}>
                                                                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                                                                <Text style={tw`text-green-600 text-xs font-bold ml-1`}>AI Verified</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                </View>
                                                
                                                <View style={tw`flex-row items-center justify-between mb-2`}>
                                                    <View
                                                        style={tw`px-3 py-1 rounded-full ${
                                                            pharmacy.isOpen ? 'bg-green-100' : 'bg-red-100'
                                                        }`}
                                                    >
                                                        <Text
                                                            style={tw`text-xs font-bold ${
                                                                pharmacy.isOpen ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                        >
                                                            {pharmacy.isOpen ? 'Open Now' : 'Closed'}
                                                        </Text>
                                                    </View>
                                                    
                                                    <View style={tw`px-3 py-1 rounded-full ${getStockLevelColor(pharmacy.stockLevel)}`}>
                                                        <Text style={tw`text-xs font-bold`}>
                                                            {pharmacy.stockLevel} Stock
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            
                                            <View style={tw`items-end`}>
                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <Ionicons name="star" size={16} color="#F59E0B" />
                                                    <Text style={tw`text-gray-700 font-bold ml-1`}>{pharmacy.rating}</Text>
                                                </View>
                                                <Text style={tw`text-green-600 font-bold text-lg`}>
                                                    {pharmacy.distance} km
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row items-center mb-3`}>
                                            <Ionicons name="location-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                            <Text style={tw`text-gray-600 text-sm flex-1`}>{pharmacy.address}</Text>
                                        </View>

                                        <View style={tw`flex-row items-center mb-3`}>
                                            <Ionicons name="time-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                            <Text style={tw`text-gray-600 text-sm`}>{pharmacy.openingHours}</Text>
                                        </View>

                                        {/* Specialties */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-700 font-medium mb-2 text-sm`}>Specialties:</Text>
                                            <View style={tw`flex-row flex-wrap`}>
                                                {pharmacy.specialties.map((specialty, idx) => (
                                                    <View key={idx} style={tw`bg-green-50 rounded-full px-3 py-1 mr-2 mb-1`}>
                                                        <Text style={tw`text-green-700 text-xs font-medium`}>
                                                            {specialty}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Action Buttons */}
                                        <View style={tw`flex-row space-x-3`}>
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)}
                                            >
                                                <Ionicons name="call-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                                <Text style={tw`text-gray-700 font-bold`}>Call</Text>
                                            </TouchableOpacity>

                                            {pharmacy.deliveryAvailable && (
                                                <TouchableOpacity
                                                    style={tw`flex-1 bg-blue-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                >
                                                    <Ionicons name="bicycle-outline" size={18} color="#3B82F6" style={tw`mr-2`} />
                                                    <Text style={tw`text-blue-600 font-bold`}>
                                                        {pharmacy.estimatedDelivery}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}

                                            <TouchableOpacity
                                                style={tw`flex-1 bg-green-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => openDirections(pharmacy)}
                                            >
                                                <Ionicons name="navigate-outline" size={18} color="#059669" style={tw`mr-2`} />
                                                <Text style={tw`text-green-600 font-bold`}>Directions</Text>
                                            </TouchableOpacity>
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

export default NearbyPharmaciesScreen;
