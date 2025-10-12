import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, Modal, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useFarmActions } from '@/hooks';



export default function FarmDetailScreen() {
    const { currentUser } = useAuth();
    const { loading, currentFarm } = useFarms();
    const { updateFarm } = useFarmActions()

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        totalChickens: '',
        healthyChickens: '',
        sickChickens: '',
        atRiskChickens: '',
    });

    const getHealthStatusClasses = (status: string) => {
        switch (status) {
            case 'EXCELLENT': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
            case 'GOOD': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
            case 'FAIR': return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
            case 'POOR': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
            case 'CRITICAL': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
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

    const isOwner = currentFarm && currentUser && currentFarm.owner.id === currentUser.id;

    const openEditModal = () => {
        if (currentFarm) {
            setEditFormData({
                name: currentFarm.name,
                totalChickens: currentFarm.livestock.total.toString(),
                healthyChickens: currentFarm.livestock.healthy.toString(),
                sickChickens: currentFarm.livestock.sick.toString(),
                atRiskChickens: currentFarm.livestock.atRisk.toString(),
            });
            setIsEditModalVisible(true);
        }
    };

    const handleSaveEdit = async () => {
        if (!currentFarm) return;

        const total = parseInt(editFormData.totalChickens);
        const healthy = parseInt(editFormData.healthyChickens) || 0;
        const sick = parseInt(editFormData.sickChickens) || 0;
        const atRisk = parseInt(editFormData.atRiskChickens) || 0;

        if (healthy + sick + atRisk > total) {
            Alert.alert('Error', 'Total chickens count does not match individual counts');
            return;
        }

        try {
            await updateFarm(currentFarm.id, {
                name: editFormData.name,
                livestock: {
                    total: total + 1,
                    healthy: healthy,
                    sick: sick,
                    atRisk: atRisk + 1,
                    breeds: currentFarm.livestock.breeds || [],
                },
            });
            setIsEditModalVisible(false);
            Alert.alert('Success', 'Farm updated successfully!');
        } catch (error) {
            console.error('Error updating farm:', error);
            Alert.alert('Error', 'Failed to update farm. Please try again.');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-gray-500 text-lg">Loading farm details...</Text>
            </View>
        );
    }

    if (!currentFarm) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Ionicons name="leaf-outline" size={64} color="#D1D5DB" />
                <Text className="text-xl font-bold text-gray-800 mt-4">Farm Not Found</Text>
                <Text className="text-gray-600 text-center mt-2 px-8">
                    The farm you&apos;re looking for doesn&apos;t exist or has been removed.
                </Text>
                <TouchableOpacity
                    className="bg-blue-500 px-8 py-4 rounded-xl mt-6 flex-row items-center"
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const healthClasses = getHealthStatusClasses(currentFarm.healthStatus);
    const healthPercentage = currentFarm.livestock.total > 0
        ? Math.round((currentFarm.livestock.healthy / currentFarm.livestock.total) * 100)
        : 0;


    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-amber-500 px-6 py-12 shadow-lg">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        className="bg-white/20 p-3 rounded-2xl"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1 ml-4">
                        <Text className="text-white font-medium text-sm">My Farm</Text>
                        <Text className="text-white text-2xl font-bold">{currentFarm.name}</Text>
                        <Text className="text-green-100 text-sm">
                            {isOwner ? 'Owner Dashboard' : 'Farm Details'}
                        </Text>
                    </View>
                    {isOwner && (
                        <TouchableOpacity
                            className="bg-white/20 p-3 rounded-2xl"
                            onPress={openEditModal}
                        >
                            <Ionicons name="pencil" size={24} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Health Overview */}
                <View className="bg-white rounded-2xl p-5 shadow-sm -mt-6 mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Health Overview</Text>

                    <View className="flex-row items-center justify-center mb-4">
                        <View className="relative w-32 h-32 rounded-full border-8 border-gray-200 items-center justify-center">
                            <View
                                className="absolute -top-2 -left-2 w-32 h-32 rounded-full border-8 border-green-500"
                                style={{
                                    borderTopColor: 'transparent',
                                    borderRightColor: 'transparent',
                                    transform: [{ rotate: `${healthPercentage * 3.6}deg` }]
                                }}
                            />
                            <Text className="text-2xl font-bold text-gray-800">
                                {healthPercentage}%
                            </Text>
                            <Text className="text-gray-600 text-sm">Healthy</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between mb-4">
                        <View className="items-center flex-1">
                            <View className="w-4 h-4 rounded-full bg-green-500 mb-1" />
                            <Text className="text-gray-800 font-semibold">{currentFarm.livestock.healthy}</Text>
                            <Text className="text-gray-600 text-xs">Healthy</Text>
                        </View>
                        <View className="items-center flex-1">
                            <View className="w-4 h-4 rounded-full bg-yellow-500 mb-1" />
                            <Text className="text-gray-800 font-semibold">{currentFarm.livestock.atRisk}</Text>
                            <Text className="text-gray-600 text-xs">At Risk</Text>
                        </View>
                        <View className="items-center flex-1">
                            <View className="w-4 h-4 rounded-full bg-red-500 mb-1" />
                            <Text className="text-gray-800 font-semibold">{currentFarm.livestock.sick}</Text>
                            <Text className="text-gray-600 text-xs">Sick</Text>
                        </View>
                    </View>

                    <View className={`px-4 py-3 rounded-xl border ${healthClasses.bg} ${healthClasses.border}`}>
                        <Text className={`text-center font-semibold ${healthClasses.text}`}>
                            Farm Health Status: {getHealthStatusText(currentFarm.healthStatus)}
                        </Text>
                    </View>
                </View>

                {/* Quick Stats */}
                <View className="flex-row flex-wrap gap-3 mb-6">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                        <View className="flex-row items-center justify-between mb-2">
                            <Ionicons name="analytics-outline" size={24} color="#3B82F6" />
                            <Text className="text-2xl font-bold text-gray-800">{currentFarm.livestock.total.toLocaleString()}</Text>
                        </View>
                        <Text className="text-gray-600 font-medium">Total Chickens</Text>
                        <Text className="text-xs text-gray-500 mt-1">
                            {currentFarm.size} hectares land
                        </Text>
                    </View>

                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                        <View className="flex-row items-center justify-between mb-2">
                            <Ionicons name="home-outline" size={24} color="#10B981" />
                            <Text className="text-2xl font-bold text-gray-800">{currentFarm.facilities.coops}</Text>
                        </View>
                        <Text className="text-gray-600 font-medium">Coops</Text>
                        <Text className="text-xs text-gray-500 mt-1">
                            {currentFarm.facilities.feedStorage ? 'Feed storage available' : 'No feed storage'}
                        </Text>
                    </View>

                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                        <View className="flex-row items-center justify-between mb-2">
                            <Ionicons name="location-outline" size={24} color="#8B5CF6" />
                            <Text className="text-2xl font-bold text-gray-800">
                                {currentFarm.location.latitude.toFixed(2)}
                            </Text>
                        </View>
                        <Text className="text-gray-600 font-medium">Latitude</Text>
                        <Text className="text-xs text-gray-500 mt-1">
                            {currentFarm.location.longitude.toFixed(2)} lng
                        </Text>
                    </View>
                </View>



                {/* Farm Details */}
                <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Farm Details</Text>
                    <View className="space-y-3">
                        <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                            <Text className="text-gray-600">Owner</Text>
                            <Text className="font-semibold text-gray-800">{currentFarm.owner.name}</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                            <Text className="text-gray-600">Water System</Text>
                            <Text className="font-semibold text-gray-800">{currentFarm.facilities.waterSystem}</Text>
                        </View>
                        <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                            <Text className="text-gray-600">Electricity</Text>
                            <Text className="font-semibold text-gray-800">{currentFarm.facilities.electricityAccess ? 'Available' : 'Not Available'}</Text>
                        </View>

                    </View>
                </View>
            </ScrollView>

            {/* Edit Farm Modal */}
            <Modal
                className='h-full bg-white'
                visible={isEditModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View className="flex-1 bg-gray-50">
                    {/* Modal Header */}
                    <View className="bg-amber-500 px-6 py-12 shadow-lg">
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity
                                className="bg-white/20 p-3 rounded-2xl"
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                            <View className="flex-1 ml-4">
                                <Text className="text-white font-medium text-sm">Edit Farm</Text>
                                <Text className="text-white text-2xl font-bold">Update Details</Text>
                            </View>
                            <TouchableOpacity
                                className="bg-white/20 p-3 rounded-2xl"
                                onPress={handleSaveEdit}
                            >
                                <Ionicons name="checkmark" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {/* Edit Form */}
                        <View className="bg-white rounded-2xl p-5 shadow-sm mt-6 mb-6">
                            <Text className="text-lg font-bold text-gray-800 mb-4">Farm Information</Text>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Farm Name</Text>
                                <TextInput
                                    className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                    placeholder="Enter farm name"
                                    value={editFormData.name}
                                    onChangeText={(text) => setEditFormData(prev => ({ ...prev, name: text }))}
                                />
                            </View>
                        </View>

                        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                            <Text className="text-lg font-bold text-gray-800 mb-4">Livestock Information</Text>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Total Chickens</Text>
                                <TextInput
                                    className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                    placeholder="Total number of chickens"
                                    value={editFormData.totalChickens}
                                    onChangeText={(text) => setEditFormData(prev => ({ ...prev, totalChickens: text }))}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-2">Healthy</Text>
                                    <TextInput
                                        className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                        placeholder="0"
                                        value={editFormData.healthyChickens}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, healthyChickens: text }))}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-2">At Risk</Text>
                                    <TextInput
                                        className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                        placeholder="0"
                                        value={editFormData.atRiskChickens}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, atRiskChickens: text }))}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-2">Sick</Text>
                                    <TextInput
                                        className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                        placeholder="0"
                                        value={editFormData.sickChickens}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, sickChickens: text }))}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}
