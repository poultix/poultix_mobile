import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc';
import { i18n } from '../../services/i18n/i18n';

// Mock map data for learning
const mockMapPoints = [
    {
        id: '1',
        type: 'pharmacy',
        name: 'VetCare Pharmacy',
        address: 'KG 15 Ave, Nyarugenge, Kigali',
        coordinate: { latitude: -1.9441, longitude: 30.0619 },
        rating: 4.8,
        isOpen: true
    },
    {
        id: '2',
        type: 'veterinary',
        name: 'Dr. John Uwimana',
        address: 'KK 19 St, Gasabo, Kigali',
        coordinate: { latitude: -1.9356, longitude: 30.0719 },
        rating: 4.9,
        isOpen: true
    },
    {
        id: '3',
        type: 'farm',
        name: 'Kigali Dairy Farm',
        address: 'KG 23 Ave, Kicukiro, Kigali',
        coordinate: { latitude: -1.9536, longitude: 30.0819 },
        rating: 4.5,
        isOpen: true
    }
];

const MapScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [filteredPoints, setFilteredPoints] = useState(mockMapPoints);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const filters = [
        { id: 'all', label: i18n.common('all'), icon: 'grid-outline', color: 'bg-gray-500' },
        { id: 'pharmacy', label: i18n.map('pharmacies'), icon: 'storefront-outline', color: 'bg-orange-500' },
        { id: 'veterinary', label: i18n.map('veterinarians'), icon: 'person-outline', color: 'bg-green-500' },
        { id: 'farm', label: i18n.map('farms'), icon: 'home-outline', color: 'bg-blue-500' }
    ];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        let filtered = mockMapPoints;
        if (selectedFilter !== 'all') {
            filtered = filtered.filter(point => point.type === selectedFilter);
        }
        setFilteredPoints(filtered);
    }, [selectedFilter]);

    const getMarkerIcon = (type: string) => {
        switch (type) {
            case 'pharmacy': return 'storefront';
            case 'veterinary': return 'person';
            case 'farm': return 'home';
            default: return 'location';
        }
    };

    const getMarkerColor = (type: string) => {
        switch (type) {
            case 'pharmacy': return '#F59E0B';
            case 'veterinary': return '#10B981';
            case 'farm': return '#3B82F6';
            default: return '#6B7280';
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <View style={tw`flex-row items-center justify-between mb-4`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                        onPress={() => {}}
                    >
                        <Ionicons name="locate-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <Text style={tw`text-white text-2xl font-bold`}>
                        {i18n.map('interactiveMap')}
                    </Text>
                    <Text style={tw`text-purple-100 text-sm mt-1`}>
                        {i18n.map('exploreServices')}
                    </Text>
                </Animated.View>
            </LinearGradient>

            {/* Filters */}
            <View style={tw`bg-white border-b border-gray-200`}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-4 py-3`}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={tw`mr-3 px-4 py-2 rounded-xl flex-row items-center ${
                                selectedFilter === filter.id
                                    ? `${filter.color} shadow-lg`
                                    : 'bg-gray-100 border border-gray-200'
                            }`}
                            onPress={() => setSelectedFilter(filter.id)}
                        >
                            <Ionicons
                                name={filter.icon as any}
                                size={18}
                                color={selectedFilter === filter.id ? 'white' : '#6B7280'}
                                style={tw`mr-2`}
                            />
                            <Text
                                style={tw`font-medium ${
                                    selectedFilter === filter.id ? 'text-white' : 'text-gray-700'
                                }`}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Map */}
            <View style={tw`flex-1`}>
                <MapView
                    style={tw`flex-1`}
                    initialRegion={{
                        latitude: -1.9441,
                        longitude: 30.0619,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    showsUserLocation={true}
                    showsCompass={true}
                    mapType='standard'
                >
                    {filteredPoints.map((point) => (
                        <Marker
                            key={point.id}
                            coordinate={point.coordinate}
                            title={point.name}
                            description={point.address}
                        >
                            <View style={[tw`bg-white p-2 rounded-full shadow-lg border-2`, { borderColor: getMarkerColor(point.type) }]}>
                                <Ionicons
                                    name={getMarkerIcon(point.type) as any}
                                    size={20}
                                    color={getMarkerColor(point.type)}
                                />
                            </View>
                        </Marker>
                    ))}
                </MapView>

                {/* Quick Actions */}
                <View style={tw`absolute bottom-6 right-4 space-y-3`}>
                    <TouchableOpacity
                        style={tw`bg-orange-500 p-4 rounded-full shadow-lg`}
                        onPress={() => router.push('/map/pharmacy-locator')}
                    >
                        <Ionicons name="storefront" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`bg-green-500 p-4 rounded-full shadow-lg`}
                        onPress={() => router.push('/map/veterinary-locator')}
                    >
                        <Ionicons name="person" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default MapScreen;
