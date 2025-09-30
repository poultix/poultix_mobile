import { usePharmacies } from '@/contexts/PharmacyContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Alert,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc';

export default function PharmacyDetailScreen() {
    const { currentPharmacy, loading } = usePharmacies();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const mapRef = useRef<MapView>(null);

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

    if (loading || !currentPharmacy) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading pharmacy details...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Header */}
                <View style={tw`px-4 pt-2 pb-4`}>
                    <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        style={tw`rounded-3xl p-8 shadow-xl`}
                    >
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <TouchableOpacity
                                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>
                            <View style={tw`flex-1 ml-4`}>
                                <Text style={tw`text-white text-sm opacity-90`}>
                                    Pharmacy Details
                                </Text>
                                <Text style={tw`text-white text-2xl font-bold`}>
                                    {currentPharmacy.name}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                    {/* Map View */}
                    <View style={tw`h-64 mb-6 rounded-2xl overflow-hidden shadow-lg`}>
                        <MapView
                            ref={mapRef}
                            style={tw`flex-1`}
                            initialRegion={{
                                latitude: currentPharmacy.location.latitude,
                                longitude: currentPharmacy.location.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                coordinate={currentPharmacy.location}
                                title={currentPharmacy.name}
                                description={currentPharmacy.address}
                            >
                                <View style={tw`bg-red-500 p-3 rounded-full shadow-lg`}>
                                    <Ionicons name="medkit" size={24} color="white" />
                                </View>
                            </Marker>
                        </MapView>
                    </View>

                    {/* Pharmacy Info */}
                    <View style={tw`bg-white rounded-2xl p-6 mb-6 shadow-md`}>
                        <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
                            {currentPharmacy.name}
                        </Text>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="location-outline" size={20} color="#6B7280" />
                            <Text style={tw`text-gray-600 ml-2 flex-1`}>
                                {currentPharmacy.address}
                            </Text>
                        </View>
                        
                        {currentPharmacy.phone && (
                            <View style={tw`flex-row items-center mb-3`}>
                                <Ionicons name="call-outline" size={20} color="#6B7280" />
                                <Text style={tw`text-gray-600 ml-2`}>
                                    {currentPharmacy.phone}
                                </Text>
                            </View>
                        )}

                        <View style={tw`flex-row items-center mb-4`}>
                            <Ionicons 
                                name={currentPharmacy.isOpen ? "checkmark-circle" : "close-circle"} 
                                size={20} 
                                color={currentPharmacy.isOpen ? "#10B981" : "#EF4444"} 
                            />
                            <Text style={tw`ml-2 font-medium ${currentPharmacy.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                {currentPharmacy.isOpen ? 'Open Now' : 'Closed'}
                            </Text>
                        </View>

                        {currentPharmacy.rating && (
                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="star" size={20} color="#F59E0B" />
                                <Text style={tw`text-gray-600 ml-2`}>
                                    {currentPharmacy.rating} / 5.0
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Services */}
                    {currentPharmacy.services && currentPharmacy.services.length > 0 && (
                        <View style={tw`bg-white rounded-2xl p-6 mb-6 shadow-md`}>
                            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
                                Services Available
                            </Text>
                            {currentPharmacy.services.map((service, index) => (
                                <View key={index} style={tw`flex-row items-center mb-2`}>
                                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                    <Text style={tw`text-gray-600 ml-2`}>{service}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Vaccines */}
                    {currentPharmacy.vaccines && currentPharmacy.vaccines.length > 0 && (
                        <View style={tw`bg-white rounded-2xl p-6 mb-6 shadow-md`}>
                            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
                                Vaccines Available
                            </Text>
                            {currentPharmacy.vaccines.map((vaccine, index) => (
                                <View key={index} style={tw`bg-blue-50 rounded-xl p-4 mb-3`}>
                                    <Text style={tw`font-semibold text-blue-800 mb-1`}>
                                        {vaccine.name}
                                    </Text>
                                    <Text style={tw`text-blue-600 text-sm mb-2`}>
                                        {vaccine.description}
                                    </Text>
                                    <Text style={tw`text-blue-700 font-medium`}>
                                        {vaccine.price.toLocaleString()} RWF
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={tw`flex-row justify-between mb-8`}>
                        <TouchableOpacity
                            style={tw`bg-blue-500 rounded-2xl p-4 flex-1 mr-3 shadow-md`}
                            onPress={() => openDirections(currentPharmacy.address)}
                        >
                            <View style={tw`items-center`}>
                                <Ionicons name="navigate-outline" size={24} color="white" />
                                <Text style={tw`text-white font-semibold mt-2`}>
                                    Directions
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {currentPharmacy.phone && (
                            <TouchableOpacity
                                style={tw`bg-green-500 rounded-2xl p-4 flex-1 shadow-md`}
                                onPress={() => makePhoneCall(currentPharmacy.phone)}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="call-outline" size={24} color="white" />
                                    <Text style={tw`text-white font-semibold mt-2`}>
                                        Call Now
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </Animated.View>
        </View>
    );
}
