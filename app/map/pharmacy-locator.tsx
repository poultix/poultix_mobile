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
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc';

// Mock pharmacy locator data
const mockPharmacies = [
    {
        id: '1',
        name: 'VetCare Pharmacy Kigali',
        address: 'KG 15 Ave, Nyarugenge, Kigali',
        phone: '+250 788 123 456',
        distance: 2.3,
        rating: 4.8,
        isOpen: true,
        priceRange: '₹₹',
        specialties: ['Emergency Medicines', 'Livestock Vaccines', 'Prescription Drugs'],
        location: { latitude: -1.9441, longitude: 30.0619 },
        stockLevel: 'High'
    },
    {
        id: '2',
        name: 'AgriVet Solutions Hub',
        address: 'KK 19 St, Gasabo, Kigali',
        phone: '+250 788 234 567',
        distance: 4.7,
        rating: 4.6,
        isOpen: true,
        priceRange: '₹₹₹',
        specialties: ['Antiparasitic', 'Nutritional Supplements', 'Farm Equipment'],
        location: { latitude: -1.9356, longitude: 30.0719 },
        stockLevel: 'Medium'
    },
    {
        id: '3',
        name: 'Rwanda Veterinary Supplies',
        address: 'KG 23 Ave, Kicukiro, Kigali',
        phone: '+250 788 345 678',
        distance: 6.2,
        rating: 4.4,
        isOpen: false,
        priceRange: '₹',
        specialties: ['Antibiotics', 'Pain Management', 'Surgical Supplies'],
        location: { latitude: -1.9536, longitude: 30.0819 },
        stockLevel: 'Low'
    }
];

const PharmacyLocatorScreen = () => {
    const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
    const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
    const [loading, setLoading] = useState(false);
    const mapRef = useRef<MapView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
        getUserLocation();
    }, []);

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

    const handlePharmacyPress = (pharmacy: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            pharmacy.name,
            `${pharmacy.distance} km away\n${pharmacy.address}\n\nRating: ⭐ ${pharmacy.rating}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => Linking.openURL(`tel:${pharmacy.phone}`) },
                { text: 'Directions', onPress: () => openDirections(pharmacy) },
                { text: 'View Details', onPress: () => {} }
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

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#F59E0B', '#D97706']}
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
                            onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                        >
                            <Ionicons 
                                name={viewMode === 'map' ? "list" : "map"} 
                                size={24} 
                                color="white" 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                            onPress={getUserLocation}
                        >
                            <Ionicons name="locate-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <Text style={tw`text-white text-2xl font-bold`}>
                        Pharmacy Locator
                    </Text>
                    <Text style={tw`text-orange-100 text-sm mt-1`}>
                        Find veterinary pharmacies near you
                    </Text>
                </Animated.View>
            </LinearGradient>

            {viewMode === 'map' ? (
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
                        {mockPharmacies.map((pharmacy) => (
                            <Marker
                                key={pharmacy.id}
                                coordinate={pharmacy.location}
                                title={pharmacy.name}
                                description={`${pharmacy.distance} km • ${pharmacy.isOpen ? 'Open' : 'Closed'}`}
                                onPress={() => handlePharmacyPress(pharmacy)}
                            >
                                <View style={tw`bg-orange-500 p-3 rounded-full shadow-lg ${!pharmacy.isOpen ? 'opacity-60' : ''}`}>
                                    <Ionicons name="storefront" size={24} color="white" />
                                </View>
                            </Marker>
                        ))}
                    </MapView>
                </View>
            ) : (
                // List View
                <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                    <Animated.View style={[{ opacity: fadeAnim }]}>
                        {loading ? (
                            <View style={tw`items-center py-20`}>
                                <ActivityIndicator size="large" color="#F59E0B" />
                                <Text style={tw`text-gray-600 mt-4`}>Finding nearby pharmacies...</Text>
                            </View>
                        ) : (
                            mockPharmacies.map((pharmacy, index) => (
                                <Animated.View
                                    key={pharmacy.id}
                                    style={[
                                        tw`mb-4`,
                                        {
                                            opacity: fadeAnim,
                                            transform: [{
                                                translateY: fadeAnim.interpolate({
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
                                                <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>
                                                    {pharmacy.name}
                                                </Text>
                                                <Text style={tw`text-gray-600 text-sm mb-2`}>
                                                    {pharmacy.address}
                                                </Text>
                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <Ionicons name="star" size={16} color="#F59E0B" />
                                                    <Text style={tw`text-gray-700 font-bold ml-1 mr-3`}>{pharmacy.rating}</Text>
                                                    <Text style={tw`text-gray-500`}>{pharmacy.priceRange}</Text>
                                                </View>
                                            </View>
                                            
                                            <View style={tw`items-end`}>
                                                <Text style={tw`text-orange-600 font-bold text-lg mb-1`}>
                                                    {pharmacy.distance} km
                                                </Text>
                                                <View style={tw`px-2 py-1 rounded-full ${getStockLevelColor(pharmacy.stockLevel)}`}>
                                                    <Text style={tw`text-xs font-bold`}>
                                                        {pharmacy.stockLevel}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row items-center mb-3`}>
                                            <View
                                                style={tw`px-3 py-1 rounded-full ${
                                                    pharmacy.isOpen ? 'bg-green-100' : 'bg-red-100'
                                                } mr-3`}
                                            >
                                                <Text
                                                    style={tw`text-xs font-bold ${
                                                        pharmacy.isOpen ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                                >
                                                    {pharmacy.isOpen ? 'Open Now' : 'Closed'}
                                                </Text>
                                            </View>
                                            <Ionicons name="call-outline" size={16} color="#6B7280" />
                                            <Text style={tw`text-gray-600 text-sm ml-1`}>{pharmacy.phone}</Text>
                                        </View>

                                        {/* Specialties */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-700 font-medium mb-2 text-sm`}>Specialties:</Text>
                                            <View style={tw`flex-row flex-wrap`}>
                                                {pharmacy.specialties.map((specialty, idx) => (
                                                    <View key={idx} style={tw`bg-orange-50 rounded-full px-2 py-1 mr-2 mb-1`}>
                                                        <Text style={tw`text-orange-700 text-xs`}>
                                                            {specialty}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        <View style={tw`flex-row space-x-3`}>
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)}
                                            >
                                                <Ionicons name="call-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                                <Text style={tw`text-gray-700 font-bold`}>Call</Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-orange-500 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => openDirections(pharmacy)}
                                            >
                                                <Ionicons name="navigate-outline" size={18} color="#D97706" style={tw`mr-2`} />
                                                <Text style={tw`text-white font-bold`}>Directions</Text>
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

export default PharmacyLocatorScreen;
