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

// Mock veterinary locator data
const mockVeterinarians = [
    {
        id: '1',
        name: 'Dr. John Uwimana',
        clinic: 'Kigali Veterinary Clinic',
        address: 'KG 15 Ave, Nyarugenge, Kigali',
        phone: '+250 788 123 456',
        distance: 2.3,
        rating: 4.9,
        isOpen: true,
        consultationFee: '₹15,000',
        specialization: 'Large Animal Medicine',
        languages: ['Kinyarwanda', 'English', 'French'],
        emergencyAvailable: true,
        location: { latitude: -1.9441, longitude: 30.0619 }
    },
    {
        id: '2',
        name: 'Dr. Alice Mukamana',
        clinic: 'Gasabo Animal Health Center',
        address: 'KK 19 St, Gasabo, Kigali',
        phone: '+250 788 234 567',
        distance: 4.7,
        rating: 4.7,
        isOpen: true,
        consultationFee: '₹12,000',
        specialization: 'Small Ruminants & Poultry',
        languages: ['Kinyarwanda', 'English'],
        emergencyAvailable: false,
        location: { latitude: -1.9356, longitude: 30.0719 }
    },
    {
        id: '3',
        name: 'Dr. Samuel Nkurunziza',
        clinic: 'Kicukiro Veterinary Services',
        address: 'KG 23 Ave, Kicukiro, Kigali',
        phone: '+250 788 345 678',
        distance: 6.2,
        rating: 4.8,
        isOpen: false,
        consultationFee: '₹18,000',
        specialization: 'Dairy Cattle Health',
        languages: ['Kinyarwanda', 'English', 'Swahili'],
        emergencyAvailable: true,
        location: { latitude: -1.9536, longitude: 30.0819 }
    }
];

const VeterinaryLocatorScreen = () => {
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
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
                Alert.alert('Permission Denied', 'Location permission is required to find nearby veterinarians.');
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

    const handleVeterinarianPress = (vet: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            vet.name,
            `${vet.distance} km away\n${vet.clinic}\nSpecialization: ${vet.specialization}\n\nRating: ⭐ ${vet.rating}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => Linking.openURL(`tel:${vet.phone}`) },
                { text: 'View Profile', onPress: () => router.push(`/veterinary/detail?id=${vet.id}`) },
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
                        Veterinary Locator
                    </Text>
                    <Text style={tw`text-green-100 text-sm mt-1`}>
                        Find certified veterinarians near you
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
                        {mockVeterinarians.map((vet) => (
                            <Marker
                                key={vet.id}
                                coordinate={vet.location}
                                title={vet.name}
                                description={`${vet.distance} km • ${vet.isOpen ? 'Available' : 'Unavailable'}`}
                                onPress={() => handleVeterinarianPress(vet)}
                            >
                                <View style={tw`bg-green-500 p-3 rounded-full shadow-lg ${!vet.isOpen ? 'opacity-60' : ''}`}>
                                    <Ionicons name="person" size={24} color="white" />
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
                                <ActivityIndicator size="large" color="#10B981" />
                                <Text style={tw`text-gray-600 mt-4`}>Finding nearby veterinarians...</Text>
                            </View>
                        ) : (
                            mockVeterinarians.map((vet, index) => (
                                <Animated.View
                                    key={vet.id}
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
                                        onPress={() => handleVeterinarianPress(vet)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={tw`flex-row items-start justify-between mb-3`}>
                                            <View style={tw`flex-1 mr-4`}>
                                                <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>
                                                    {vet.name}
                                                </Text>
                                                <Text style={tw`text-gray-600 text-sm mb-2`}>
                                                    {vet.clinic} • {vet.specialization}
                                                </Text>
                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <Ionicons name="star" size={16} color="#F59E0B" />
                                                    <Text style={tw`text-gray-700 font-bold ml-1 mr-3`}>{vet.rating}</Text>
                                                    <Text style={tw`text-green-600 font-bold`}>{vet.consultationFee}</Text>
                                                </View>
                                            </View>
                                            
                                            <View style={tw`items-end`}>
                                                <Text style={tw`text-green-600 font-bold text-lg mb-1`}>
                                                    {vet.distance} km
                                                </Text>
                                                <View style={tw`px-2 py-1 rounded-full ${
                                                    vet.isOpen ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                    <Text style={tw`text-xs font-bold ${
                                                        vet.isOpen ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {vet.isOpen ? 'Available' : 'Unavailable'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={tw`flex-row items-center mb-3`}>
                                            <Ionicons name="location" size={16} color="#6B7280" />
                                            <Text style={tw`text-gray-600 text-sm ml-2 flex-1`}>
                                                {vet.address}
                                            </Text>
                                        </View>

                                        <View style={tw`flex-row items-center mb-4`}>
                                            <Ionicons name="call" size={16} color="#6B7280" />
                                            <Text style={tw`text-gray-600 text-sm ml-2 mr-4`}>
                                                {vet.phone}
                                            </Text>
                                            {vet.emergencyAvailable && (
                                                <View style={tw`bg-red-100 px-2 py-1 rounded-full`}>
                                                    <Text style={tw`text-red-600 text-xs font-bold`}>Emergency</Text>
                                                </View>
                                            )}
                                        </View>

                                        <View style={tw`flex-row space-x-3`}>
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => Linking.openURL(`tel:${vet.phone}`)}
                                            >
                                                <Ionicons name="call-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                                <Text style={tw`text-gray-700 font-bold`}>Call</Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-green-500 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => router.push('/veterinary/detail')}
                                            >
                                                <Ionicons name="person-circle-outline" size={18} color="white" style={tw`mr-2`} />
                                                <Text style={tw`text-white font-bold`}>View Profile</Text>
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

export default VeterinaryLocatorScreen;
