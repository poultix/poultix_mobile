import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert,  ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface Farm {
    id: string;
    name: string;
    location: string;
    size: string;
    owner: string;
    contact: string;
    email: string;
    totalChickens: number; 
    healthyChickens: number;
    sickChickens: number;
    atRiskChickens: number;
    lastVisit: string;
    nextVisit: string;
    healthStatus: 'excellent' | 'good' | 'warning' | 'critical';
    notes: string;
    established: string;
    farmType: string;
}

export default function FarmDetailScreen() {

    const [farm, setFarm] = useState<Farm | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFarmDetails();
    }, []);

    const loadFarmDetails = async () => {
        try {
            setLoading(true);
            const mockFarm: Farm = {
                id:  '1',
                name: 'Green Valley Poultry Farm',
                location: 'Nakuru County, Kenya',
                size: '5.2 hectares',
                owner: 'John Kamau',
                contact: '+254 712 345 678',
                email: 'john.kamau@greenvalley.co.ke',
                totalChickens: 2500,
                healthyChickens: 2350,
                sickChickens: 50,
                atRiskChickens: 100,
                lastVisit: '2024-01-15',
                nextVisit: '2024-02-15',
                healthStatus: 'good',
                notes: 'Regular vaccination schedule maintained. Minor respiratory issues detected in Block C.',
                established: '2019-03-15',
                farmType: 'Commercial Layer Farm',
            };
            setFarm(mockFarm);
        } catch (error) {
            console.error('Error loading farm details:', error);
            Alert.alert('Error', 'Failed to load farm details');
        } finally {
            setLoading(false);
        }
    };

    const getHealthStatusClasses = (status: string) => {
        switch (status) {
            case 'excellent': return { bg: 'bg-green-100', text: 'text-green-600' };
            case 'good': return { bg: 'bg-blue-100', text: 'text-blue-600' };
            case 'warning': return { bg: 'bg-orange-100', text: 'text-orange-600' };
            case 'critical': return { bg: 'bg-red-100', text: 'text-red-600' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
        }
    };

    const getHealthStatusText = (status: string) => {
        switch (status) {
            case 'excellent': return 'Excellent';
            case 'good': return 'Good';
            case 'warning': return 'Needs Attention';
            case 'critical': return 'Critical';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Loading farm details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!farm) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Farm not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const healthClasses = getHealthStatusClasses(farm.healthStatus);
 
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-white shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-gray-900 flex-1">Farm Details</Text>
                <TouchableOpacity onPress={() => router.push('/communication/messages')}>
                    <Ionicons name="chatbubble-outline" size={24} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4">

                    {/* Farm Basic Info */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="leaf" size={24} color="#10B981" />
                            <Text className="ml-2 text-lg font-semibold text-gray-900">{farm.name}</Text>
                        </View>
                        <Text className="text-gray-500 mb-2">📍 {farm.location}</Text>
                        <View className="flex-row items-center">
                            <Text className="text-gray-500">Status:</Text>
                            <View className={`ml-2 px-2 py-1 rounded ${healthClasses.bg}`}>
                                <Text className={`text-xs font-semibold ${healthClasses.text}`}>
                                    {getHealthStatusText(farm.healthStatus)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Owner Info */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Owner Information</Text>
                        <Text className="text-gray-800 font-medium mb-1">{farm.owner}</Text>
                        <Text className="text-gray-500 mb-1">📞 {farm.contact}</Text>
                        <Text className="text-gray-500">✉️ {farm.email}</Text>
                    </View>

                    {/* Chicken Stats */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Chicken Health Statistics</Text>
                        <View className="flex-row flex-wrap gap-2">
                            <View className="flex-1 min-w-[45%] bg-blue-50 rounded-lg p-3">
                                <Text className="text-xl font-bold text-blue-600">{farm.totalChickens.toLocaleString()}</Text>
                                <Text className="text-gray-500 text-sm">Total Chickens</Text>
                            </View>
                            <View className="flex-1 min-w-[45%] bg-green-50 rounded-lg p-3">
                                <Text className="text-xl font-bold text-green-600">{farm.healthyChickens.toLocaleString()}</Text>
                                <Text className="text-gray-500 text-sm">Healthy</Text>
                            </View>
                            <View className="flex-1 min-w-[45%] bg-orange-50 rounded-lg p-3">
                                <Text className="text-xl font-bold text-orange-600">{farm.atRiskChickens.toLocaleString()}</Text>
                                <Text className="text-gray-500 text-sm">At Risk</Text>
                            </View>
                            <View className="flex-1 min-w-[45%] bg-red-50 rounded-lg p-3">
                                <Text className="text-xl font-bold text-red-600">{farm.sickChickens.toLocaleString()}</Text>
                                <Text className="text-gray-500 text-sm">Sick</Text>
                            </View>
                        </View>
                    </View>

                    {/* Farm Info */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Farm Information</Text>
                        <Text className="text-gray-500 mb-1">Size: {farm.size}</Text>
                        <Text className="text-gray-500 mb-1">Type: {farm.farmType}</Text>
                        <Text className="text-gray-500 mb-1">Established: {new Date(farm.established).toLocaleDateString()}</Text>
                        <Text className="text-gray-500 mb-1">Last Visit: {new Date(farm.lastVisit).toLocaleDateString()}</Text>
                        <Text className="text-gray-500">Next Visit: {new Date(farm.nextVisit).toLocaleDateString()}</Text>
                    </View>

                    {/* Notes */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Veterinary Notes</Text>
                        <Text className="text-gray-600 leading-6">{farm.notes}</Text>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-3 mb-8">
                        <TouchableOpacity
                            className="flex-1 bg-blue-500 py-3 rounded-lg items-center shadow"
                            onPress={() => router.push('/communication/schedule-request')}
                        >
                            <Text className="text-white font-semibold">Schedule Visit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 bg-green-500 py-3 rounded-lg items-center shadow"
                            onPress={() => router.push('/communication/messages')}
                        >
                            <Text className="text-white font-semibold">Message Owner</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
