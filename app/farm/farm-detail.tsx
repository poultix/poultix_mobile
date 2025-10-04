import { useFarms } from '@/contexts/FarmContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';



export default function FarmDetailScreen() {
    const { loading, currentFarm } = useFarms();

    const getHealthStatusClasses = (status: string) => {
        switch (status) {
            case 'EXCELLENT': return { bg: 'bg-green-100', text: 'text-green-600' };
            case 'GOOD': return { bg: 'bg-blue-100', text: 'text-blue-600' };
            case 'FAIR': return { bg: 'bg-orange-100', text: 'text-orange-600' };
            case 'POOR': return { bg: 'bg-red-100', text: 'text-red-600' };
            case 'CRITICAL': return { bg: 'bg-red-100', text: 'text-red-600' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
        }
    };

    const getHealthStatusText = (status: string) => {
        switch (status) {
            case 'EXCELLENT': return 'Excellent';
            case 'GOOD': return 'Good';
            case 'FAIR': return 'Fair';
            case 'POOR': return 'Poor';
            case 'CRITICAL': return 'Critical';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Loading farm details...</Text>
                </View>
            </View>
        );
    }

    if (!currentFarm) {
        return (
            <View className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Farm not found</Text>
                </View>
            </View>
        );
    }

    const healthClasses = getHealthStatusClasses(currentFarm.healthStatus);


    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-10 bg-amber-500 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-white flex-1">Farm Details</Text>
                <TouchableOpacity onPress={() => router.push('/communication/messages')}>
                    <Ionicons name="chatbubble-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4">

                    {/* Farm Basic Info */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="leaf" size={24} color="#10B981" />
                            <Text className="ml-2 text-lg font-semibold text-gray-900">{currentFarm.name}</Text>
                        </View>
                        <Text className="text-gray-500 mb-2">📍 {currentFarm.location.latitude}, {currentFarm.location.longitude}</Text>
                        <View className="flex-row items-center">
                            <Text className="text-gray-500">Status:</Text>
                            <View className={`ml-2 px-2 py-1 rounded ${healthClasses.bg}`}>
                                <Text className={`text-xs font-semibold ${healthClasses.text}`}>
                                    {getHealthStatusText(currentFarm.healthStatus)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Owner Info */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Owner Information</Text>
                        <Text className="text-gray-800 font-medium mb-1">{currentFarm.owner.name}</Text>
                        <Text className="text-gray-500 mb-1">📞 N/A</Text>
                        <Text className="text-gray-500">✉️ {currentFarm.owner.email}</Text>
                    </View>

                    {/* Chicken Stats */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Chicken Health Statistics</Text>
                        <View className="flex-row flex-wrap gap-2">
                            <View className="flex-1 min-w-[45%] bg-blue-50 rounded-lg p-3">
                                <Text className="text-xl font-bold text-blue-600">{currentFarm.livestock.total.toLocaleString()}</Text>
                                <Text className="text-gray-500 text-sm">Total Chickens</Text>
                            </View>
                            <View className="flex-1 min-w-[45%] bg-green-50 rounded-lg p-3">
                                <Text className="text-xl font-bold text-green-600">{currentFarm.livestock.healthy.toLocaleString()}</Text>
                                <Text className="text-gray-500 text-sm">Healthy</Text>
                            </View>
                            <View className="flex-1 min-w-[45%] bg-orange-50 rounded-lg p-3">
                                <Text className="text-xl font-bold text-orange-600">{currentFarm.livestock.atRisk.toLocaleString()}</Text>
                                <Text className="text-gray-500 text-sm">At Risk</Text>
                            </View>
                            <View className="flex-1 min-w-[45%] bg-red-50 rounded-lg p-3">
                                <Text className="text-xl font-bold text-red-600">{currentFarm.livestock.sick.toLocaleString()}</Text>
                                <Text className="text-gray-500 text-sm">Sick</Text>
                            </View>
                        </View>
                    </View>

                    {/* Farm Info */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Farm Information</Text>
                        <Text className="text-gray-500 mb-1">Size: {currentFarm.size} hectares</Text>
                        <Text className="text-gray-500 mb-1">Coops: {currentFarm.facilities.coops}</Text>
                        <Text className="text-gray-500 mb-1">Established: {new Date(currentFarm.establishedDate).toLocaleDateString()}</Text>
                        {currentFarm.lastInspection && (
                            <Text className="text-gray-500 mb-1">Last Inspection: {new Date(currentFarm.lastInspection).toLocaleDateString()}</Text>
                        )}
                        <Text className="text-gray-500">Status: {currentFarm.isActive ? 'Active' : 'Inactive'}</Text>
                    </View>

                    {/* Notes */}
                    <View className="bg-white rounded-xl shadow p-4 mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">Farm Information</Text>
                        <Text className="text-gray-600 leading-6">Breeds: {currentFarm.livestock.breeds.join(', ')}</Text>
                        {currentFarm.certifications.length > 0 && (
                            <Text className="text-gray-600 leading-6 mt-2">Certifications: {currentFarm.certifications.join(', ')}</Text>
                        )}
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
        </View>
    );
}
