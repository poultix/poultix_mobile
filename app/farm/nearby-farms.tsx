import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';

export default function NearbyFarmsScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { farms, loading } = useFarms();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Calculate distance (mock function)
    const calculateDistance = (farm: any) => {
        return Math.floor(Math.random() * 50) + 1; // Mock distance in km
    };

    // Get health status color
    const getHealthStatusColor = (farm: any) => {
        const sickPercentage = (farm.livestock.sick / farm.livestock.total) * 100;
        if (sickPercentage > 20) return '#EF4444';
        if (sickPercentage > 10) return '#F59E0B';
        return '#10B981';
    };

    // Get health status text
    const getHealthStatusText = (farm: any) => {
        const sickPercentage = (farm.livestock.sick / farm.livestock.total) * 100;
        if (sickPercentage > 20) return 'Critical';
        if (sickPercentage > 10) return 'At Risk';
        return 'Healthy';
    };

    // Filter out current user's farm and sort by distance
    const nearbyFarms = farms
        .filter(farm => farm.owner.id !== currentUser?.id)
        .map(farm => ({
            ...farm,
            distance: calculateDistance(farm)
        }))
        .sort((a, b) => a.distance - b.distance);

    const handleCallFarmer = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleGetDirections = (farm: any) => {
        const url = `https://maps.google.com/?q=${encodeURIComponent(farm.location.address)}`;
        Linking.openURL(url);
    };

    if (loading || !currentUser) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading nearby farms...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
            
            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Header */}
                <View style={tw`px-4 pt-2 pb-4`}>
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        style={tw`rounded-3xl p-6 shadow-xl`}
                    >
                        <View style={tw`flex-row items-center justify-between`}>
                            <TouchableOpacity
                                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>
                            <View style={tw`flex-1 ml-4`}>
                                <Text style={tw`text-white font-medium`}>Farm Network</Text>
                                <Text style={tw`text-white text-2xl font-bold`}>Nearby Farms 🗺️</Text>
                                <Text style={tw`text-blue-100 text-sm`}>
                                    Connect with local farmers
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Farms List */}
                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                    {nearbyFarms.length === 0 ? (
                        <View style={tw`flex-1 justify-center items-center py-20`}>
                            <Ionicons name="location-outline" size={64} color="#9CA3AF" />
                            <Text style={tw`text-gray-500 text-lg font-medium mt-4`}>
                                No nearby farms found
                            </Text>
                            <Text style={tw`text-gray-400 text-center mt-2`}>
                                Check back later for farms in your area
                            </Text>
                        </View>
                    ) : (
                        nearbyFarms.map((farm, index) => (
                            <View
                                key={farm.id}
                                style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100`}
                            >
                                <View style={tw`flex-row items-start justify-between mb-4`}>
                                    <View style={tw`flex-1 mr-3`}>
                                        <Text style={tw`font-bold text-gray-800 text-lg mb-1`}>
                                            {farm.name}
                                        </Text>
                                        <Text style={tw`text-gray-600 text-sm mb-2`}>
                                            Owner: {farm.owner.name}
                                        </Text>
                                        <Text style={tw`text-gray-500 text-sm`}>
                                            {farm.location.address}
                                        </Text>
                                    </View>
                                    <View style={tw`items-end`}>
                                        <View style={tw`flex-row items-center mb-2`}>
                                            <Ionicons name="location" size={16} color="#6B7280" />
                                            <Text style={tw`text-gray-600 text-sm ml-1`}>
                                                {farm.distance} km
                                            </Text>
                                        </View>
                                        <View style={tw`flex-row items-center`}>
                                            <View style={[
                                                tw`w-3 h-3 rounded-full mr-2`,
                                                { backgroundColor: getHealthStatusColor(farm) }
                                            ]} />
                                            <Text style={[
                                                tw`text-sm font-medium`,
                                                { color: getHealthStatusColor(farm) }
                                            ]}>
                                                {getHealthStatusText(farm)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Farm Stats */}
                                <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                                    <View style={tw`flex-row justify-between items-center`}>
                                        <View style={tw`items-center flex-1`}>
                                            <Text style={tw`text-gray-800 text-xl font-bold`}>
                                                {farm.livestock.total}
                                            </Text>
                                            <Text style={tw`text-gray-500 text-xs`}>Total Birds</Text>
                                        </View>
                                        <View style={tw`items-center flex-1`}>
                                            <Text style={tw`text-green-600 text-xl font-bold`}>
                                                {farm.livestock.healthy}
                                            </Text>
                                            <Text style={tw`text-gray-500 text-xs`}>Healthy</Text>
                                        </View>
                                        <View style={tw`items-center flex-1`}>
                                            <Text style={tw`text-yellow-600 text-xl font-bold`}>
                                                {farm.livestock.atRisk}
                                            </Text>
                                            <Text style={tw`text-gray-500 text-xs`}>At Risk</Text>
                                        </View>
                                        <View style={tw`items-center flex-1`}>
                                            <Text style={tw`text-red-600 text-xl font-bold`}>
                                                {farm.livestock.sick}
                                            </Text>
                                            <Text style={tw`text-gray-500 text-xs`}>Sick</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View style={tw`flex-row gap-3`}>
                                    <TouchableOpacity
                                        style={tw`flex-1 bg-blue-500 py-3 px-4 rounded-xl flex-row items-center justify-center`}
                                        onPress={() => handleCallFarmer(farm.owner.phone || '123-456-7890')}
                                    >
                                        <Ionicons name="call" size={16} color="white" />
                                        <Text style={tw`text-white font-medium ml-2`}>Call</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        style={tw`flex-1 bg-green-500 py-3 px-4 rounded-xl flex-row items-center justify-center`}
                                        onPress={() => handleGetDirections(farm)}
                                    >
                                        <Ionicons name="navigate" size={16} color="white" />
                                        <Text style={tw`text-white font-medium ml-2`}>Directions</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Last Visit Info */}
                                <View style={tw`pt-3 border-t border-gray-100 mt-4`}>
                                    <Text style={tw`text-gray-400 text-xs`}>
                                        Farm registered: {new Date(farm.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
}
