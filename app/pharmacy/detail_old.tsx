import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Animated,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import tw from 'twrnc';
import { router } from 'expo-router';
import { usePharmacies } from '@/contexts/PharmacyContext';

export default function PharmacyDetailScreen() {
    const { currentPharmacy, isLoading } = usePharmacies();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Open Google Maps for directions
    const openDirections = (address: string) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'Unable to open Google Maps.')
        );
    };

    // Make phone call
    const makePhoneCall = (phone: string) => {
        const url = `tel:${phone}`;
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'Unable to make phone call.')
        );
    };

    if (isLoading || !currentPharmacy) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading pharmacy details...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            
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
                                        onPress={() => router.push('PharmacyDetails', { pharmacy })}
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