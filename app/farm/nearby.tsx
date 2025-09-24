import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Animated,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { MockDataService } from '@/services/mockData';

interface NearbyFarm {
    id: string;
    farmName: string;
    farmerName: string;
    location: string;
    distance: number;
    totalChickens: number;
    healthStatus: string;
    lastVisit: Date;
    phone: string;
    coordinates: { latitude: number; longitude: number };
}

export default function NearbyFarmsScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [nearbyFarms, setNearbyFarms] = useState<NearbyFarm[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'good' | 'attention_needed' | 'excellent'>('all');
    const [isLoading, setIsLoading] = useState(true);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadNearbyFarms();
        
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadNearbyFarms = async () => {
        try {
            const farms = await MockDataService.getNearbyFarms('Muhanga');
            setNearbyFarms(farms.map(farm => ({
                ...farm,
                lastVisit: new Date(farm.lastVisit)
            })));
        } catch (error) {
            console.error('Error loading nearby farms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return { bg: '#ECFDF5', text: '#059669', border: '#10B981', icon: 'checkmark-circle' };
            case 'good': return { bg: '#F0FDF4', text: '#16A34A', border: '#22C55E', icon: 'checkmark-circle-outline' };
            case 'attention_needed': return { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B', icon: 'warning-outline' };
            default: return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB', icon: 'help-circle-outline' };
        }
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    const handleCallFarmer = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleNavigateToFarm = (coordinates: { latitude: number; longitude: number }) => {
        const url = `https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
        Linking.openURL(url);
    };

    const filteredFarms = selectedFilter === 'all' 
        ? nearbyFarms 
        : nearbyFarms.filter(farm => farm.healthStatus === selectedFilter);

    const renderFarm = (farm: NearbyFarm) => {
        const healthColors = getHealthStatusColor(farm.healthStatus);

        return (
            <View key={farm.id} style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100`}>
                {/* Header */}
                <View style={tw`flex-row items-start justify-between mb-3`}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-lg font-bold text-gray-800`}>
                            {farm.farmName}
                        </Text>
                        <Text style={tw`text-gray-600 font-medium`}>
                            {farm.farmerName}
                        </Text>
                        <View style={tw`flex-row items-center mt-1`}>
                            <Ionicons name="location-outline" size={14} color="#6B7280" />
                            <Text style={tw`text-gray-500 text-sm ml-1`}>
                                {farm.location} • {farm.distance} km away
                            </Text>
                        </View>
                    </View>
                    
                    <View style={[
                        tw`px-3 py-1 rounded-full border flex-row items-center`,
                        { backgroundColor: healthColors.bg, borderColor: healthColors.border }
                    ]}>
                        <Ionicons 
                            name={healthColors.icon as any} 
                            size={14} 
                            color={healthColors.text} 
                        />
                        <Text style={[
                            tw`text-xs font-bold capitalize ml-1`,
                            { color: healthColors.text }
                        ]}>
                            {farm.healthStatus.replace('_', ' ')}
                        </Text>
                    </View>
                </View>

                {/* Farm Stats */}
                <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                    <View style={tw`flex-row justify-between items-center`}>
                        <View style={tw`items-center flex-1`}>
                            <Text style={tw`text-2xl font-bold text-gray-800`}>
                                {farm.totalChickens}
                            </Text>
                            <Text style={tw`text-gray-600 text-xs font-medium`}>
                                Total Chickens
                            </Text>
                        </View>
                        
                        <View style={tw`w-px h-8 bg-gray-300`} />
                        
                        <View style={tw`items-center flex-1`}>
                            <Text style={tw`text-lg font-bold text-gray-600`}>
                                {formatDate(farm.lastVisit)}
                            </Text>
                            <Text style={tw`text-gray-600 text-xs font-medium`}>
                                Last Visit
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity
                        style={tw`flex-1 bg-blue-50 border border-blue-200 rounded-xl py-3 flex-row items-center justify-center`}
                        onPress={() => handleCallFarmer(farm.phone)}
                    >
                        <Ionicons name="call-outline" size={18} color="#3B82F6" />
                        <Text style={tw`text-blue-600 font-semibold ml-2`}>
                            Call
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`flex-1 bg-green-50 border border-green-200 rounded-xl py-3 flex-row items-center justify-center`}
                        onPress={() => router.push('/communication/messages')}
                    >
                        <Ionicons name="chatbubble-outline" size={18} color="#10B981" />
                        <Text style={tw`text-green-600 font-semibold ml-2`}>
                            Message
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`bg-gray-50 border border-gray-200 rounded-xl py-3 px-4`}
                        onPress={() => handleNavigateToFarm(farm.coordinates)}
                    >
                        <Ionicons name="navigate-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600`}>Loading nearby farms...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            
            
            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Header */}
                <View style={tw`px-4 pt-2 pb-4`}>
                    <LinearGradient
                        colors={['#059669', '#047857']}
                        style={tw`rounded-3xl p-8 shadow-xl`}
                    >
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-white text-sm opacity-90`}>
                                    Farm Network
                                </Text>
                                <Text style={tw`text-white text-2xl font-bold`}>
                                    Nearby Farms 🚜
                                </Text>
                                <Text style={tw`text-green-100 text-sm mt-1`}>
                                    Farms in your service area
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Stats */}
                        <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                            <Text style={tw`text-white font-bold text-lg mb-4`}>Farm Overview</Text>
                            <View style={tw`flex-row justify-between`}>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-2xl font-bold`}>
                                        {nearbyFarms.length}
                                    </Text>
                                    <Text style={tw`text-green-100 text-xs font-medium`}>Total Farms</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-green-200 text-2xl font-bold`}>
                                        {nearbyFarms.filter(f => f.healthStatus === 'excellent' || f.healthStatus === 'good').length}
                                    </Text>
                                    <Text style={tw`text-green-100 text-xs font-medium`}>Healthy</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-yellow-200 text-2xl font-bold`}>
                                        {nearbyFarms.filter(f => f.healthStatus === 'attention_needed').length}
                                    </Text>
                                    <Text style={tw`text-green-100 text-xs font-medium`}>Need Attention</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Filter Tabs */}
                <View style={tw`px-4 mb-4`}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={tw`flex-row gap-3`}>
                            {[
                                { key: 'all', label: 'All Farms', count: nearbyFarms.length },
                                { key: 'excellent', label: 'Excellent', count: nearbyFarms.filter(f => f.healthStatus === 'excellent').length },
                                { key: 'good', label: 'Good', count: nearbyFarms.filter(f => f.healthStatus === 'good').length },
                                { key: 'attention_needed', label: 'Need Attention', count: nearbyFarms.filter(f => f.healthStatus === 'attention_needed').length },
                            ].map((filter) => (
                                <TouchableOpacity
                                    key={filter.key}
                                    style={[
                                        tw`px-4 py-2 rounded-full border flex-row items-center`,
                                        selectedFilter === filter.key
                                            ? tw`bg-green-500 border-green-500`
                                            : tw`bg-white border-gray-200`
                                    ]}
                                    onPress={() => setSelectedFilter(filter.key as any)}
                                >
                                    <Text style={[
                                        tw`font-medium`,
                                        selectedFilter === filter.key ? tw`text-white` : tw`text-gray-600`
                                    ]}>
                                        {filter.label}
                                    </Text>
                                    {filter.count > 0 && (
                                        <View style={[
                                            tw`ml-2 px-2 py-0.5 rounded-full`,
                                            selectedFilter === filter.key ? tw`bg-white bg-opacity-20` : tw`bg-gray-100`
                                        ]}>
                                            <Text style={[
                                                tw`text-xs font-bold`,
                                                selectedFilter === filter.key ? tw`text-white` : tw`text-gray-600`
                                            ]}>
                                                {filter.count}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Farms List */}
                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                    {filteredFarms.length === 0 ? (
                        <View style={tw`flex-1 justify-center items-center py-20`}>
                            <Ionicons name="leaf-outline" size={64} color="#9CA3AF" />
                            <Text style={tw`text-gray-500 text-lg font-medium mt-4`}>
                                No farms found
                            </Text>
                            <Text style={tw`text-gray-400 text-center mt-2`}>
                                No farms match the selected filter
                            </Text>
                        </View>
                    ) : (
                        filteredFarms.map(renderFarm)
                    )}
                </ScrollView>
            </Animated.View>

            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </SafeAreaView>
    );
}
