import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { MockDataService } from '@/services/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScheduleRequest {
    id: string;
    farmerId: string;
    veterinaryId: string;
    farmerName: string;
    veterinaryName: string;
    farmName: string;
    requestedDate: Date;
    preferredTime: string;
    reason: string;
    urgency: string;
    status: string;
    createdAt: Date;
    notes: string;
}

export default function ScheduleManagementScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [scheduleRequests, setScheduleRequests] = useState<ScheduleRequest[]>([]);
    const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'completed'>('pending');
    const [isLoading, setIsLoading] = useState(true);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadScheduleRequests();
        
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadScheduleRequests = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            
            if (role === 'veterinary') {
                const requests = await MockDataService.getScheduleRequests('vet_001');
                setScheduleRequests(requests.map(req => ({
                    ...req,
                    requestedDate: new Date(req.requestedDate),
                    createdAt: new Date(req.createdAt)
                })));
            }
        } catch (error) {
            console.error('Error loading schedule requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
        try {
            const status = action === 'approve' ? 'approved' : 'rejected';
            await MockDataService.updateScheduleRequest(requestId, status);
            
            // Update local state
            setScheduleRequests(prev => 
                prev.map(req => 
                    req.id === requestId ? { ...req, status } : req
                )
            );

            Alert.alert(
                'Success',
                `Schedule request has been ${action === 'approve' ? 'approved' : 'rejected'}.`
            );
        } catch (error) {
            console.error('Error updating request:', error);
            Alert.alert('Error', 'Failed to update request. Please try again.');
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return { bg: '#FEE2E2', text: '#DC2626', border: '#EF4444' };
            case 'medium': return { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B' };
            case 'low': return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
            default: return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return { bg: '#ECFDF5', text: '#059669', border: '#10B981' };
            case 'rejected': return { bg: '#FEF2F2', text: '#DC2626', border: '#EF4444' };
            case 'completed': return { bg: '#F0F9FF', text: '#0284C7', border: '#0EA5E9' };
            default: return { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B' };
        }
    };

    const filteredRequests = scheduleRequests.filter(req => {
        if (selectedTab === 'pending') return req.status === 'pending';
        if (selectedTab === 'approved') return req.status === 'approved';
        if (selectedTab === 'completed') return req.status === 'completed';
        return false;
    });

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderScheduleRequest = (request: ScheduleRequest) => {
        const urgencyColors = getUrgencyColor(request.urgency);
        const statusColors = getStatusColor(request.status);

        return (
            <View key={request.id} style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100`}>
                {/* Header */}
                <View style={tw`flex-row items-start justify-between mb-3`}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-lg font-bold text-gray-800`}>
                            {request.farmName}
                        </Text>
                        <Text style={tw`text-gray-600 font-medium`}>
                            {request.farmerName}
                        </Text>
                    </View>
                    
                    <View style={tw`flex-row gap-2`}>
                        <View style={[
                            tw`px-2 py-1 rounded-full border`,
                            { backgroundColor: urgencyColors.bg, borderColor: urgencyColors.border }
                        ]}>
                            <Text style={[
                                tw`text-xs font-bold capitalize`,
                                { color: urgencyColors.text }
                            ]}>
                                {request.urgency}
                            </Text>
                        </View>
                        
                        <View style={[
                            tw`px-2 py-1 rounded-full border`,
                            { backgroundColor: statusColors.bg, borderColor: statusColors.border }
                        ]}>
                            <Text style={[
                                tw`text-xs font-bold capitalize`,
                                { color: statusColors.text }
                            ]}>
                                {request.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Request Details */}
                <View style={tw`mb-4`}>
                    <View style={tw`flex-row items-center mb-2`}>
                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={tw`text-gray-600 ml-2`}>
                            {formatDate(request.requestedDate)} at {request.preferredTime}
                        </Text>
                    </View>
                    
                    <View style={tw`flex-row items-start mb-2`}>
                        <Ionicons name="medical-outline" size={16} color="#6B7280" style={tw`mt-0.5`} />
                        <Text style={tw`text-gray-600 ml-2 flex-1`}>
                            {request.reason}
                        </Text>
                    </View>
                    
                    {request.notes && (
                        <View style={tw`flex-row items-start`}>
                            <Ionicons name="document-text-outline" size={16} color="#6B7280" style={tw`mt-0.5`} />
                            <Text style={tw`text-gray-500 ml-2 flex-1 text-sm`}>
                                {request.notes}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                {request.status === 'pending' && (
                    <View style={tw`flex-row gap-3 pt-3 border-t border-gray-100`}>
                        <TouchableOpacity
                            style={tw`flex-1 bg-red-50 border border-red-200 rounded-xl py-3`}
                            onPress={() => handleRequestAction(request.id, 'reject')}
                        >
                            <Text style={tw`text-red-600 font-semibold text-center`}>
                                Reject
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={tw`flex-1 bg-green-500 rounded-xl py-3`}
                            onPress={() => handleRequestAction(request.id, 'approve')}
                        >
                            <Text style={tw`text-white font-semibold text-center`}>
                                Approve
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {request.status === 'approved' && (
                    <View style={tw`pt-3 border-t border-gray-100`}>
                        <TouchableOpacity
                            style={tw`bg-blue-500 rounded-xl py-3`}
                            onPress={() => {
                                // Navigate to messages or call farmer
                                router.push('/communication/messages');
                            }}
                        >
                            <Text style={tw`text-white font-semibold text-center`}>
                                Contact Farmer
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Request Time */}
                <View style={tw`pt-3 border-t border-gray-100 mt-3`}>
                    <Text style={tw`text-gray-400 text-xs`}>
                        Requested on {formatDate(request.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600`}>Loading schedule requests...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            
            
            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Header */}
                <View style={tw`px-4 pt-2 pb-4`}>
                    <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        style={tw`rounded-3xl p-8 shadow-xl`}
                    >
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-white text-sm opacity-90`}>
                                    Schedule Management
                                </Text>
                                <Text style={tw`text-white text-2xl font-bold`}>
                                    Visit Requests 📋
                                </Text>
                                <Text style={tw`text-red-100 text-sm mt-1`}>
                                    Manage farmer visit requests
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
                            <Text style={tw`text-white font-bold text-lg mb-4`}>Request Overview</Text>
                            <View style={tw`flex-row justify-between`}>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-2xl font-bold`}>
                                        {scheduleRequests.filter(r => r.status === 'pending').length}
                                    </Text>
                                    <Text style={tw`text-red-100 text-xs font-medium`}>Pending</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-green-200 text-2xl font-bold`}>
                                        {scheduleRequests.filter(r => r.status === 'approved').length}
                                    </Text>
                                    <Text style={tw`text-red-100 text-xs font-medium`}>Approved</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-blue-200 text-2xl font-bold`}>
                                        {scheduleRequests.filter(r => r.status === 'completed').length}
                                    </Text>
                                    <Text style={tw`text-red-100 text-xs font-medium`}>Completed</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Tabs */}
                <View style={tw`px-4 mb-4`}>
                    <View style={tw`bg-white rounded-2xl p-2 flex-row shadow-sm`}>
                        {(['pending', 'approved', 'completed'] as const).map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    tw`flex-1 py-3 rounded-xl`,
                                    selectedTab === tab ? tw`bg-red-500` : tw`bg-transparent`
                                ]}
                                onPress={() => setSelectedTab(tab)}
                            >
                                <Text style={[
                                    tw`text-center font-semibold capitalize`,
                                    selectedTab === tab ? tw`text-white` : tw`text-gray-600`
                                ]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Requests List */}
                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                    {filteredRequests.length === 0 ? (
                        <View style={tw`flex-1 justify-center items-center py-20`}>
                            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
                            <Text style={tw`text-gray-500 text-lg font-medium mt-4`}>
                                No {selectedTab} requests
                            </Text>
                            <Text style={tw`text-gray-400 text-center mt-2`}>
                                {selectedTab === 'pending' 
                                    ? 'New requests will appear here'
                                    : `No ${selectedTab} requests found`
                                }
                            </Text>
                        </View>
                    ) : (
                        filteredRequests.map(renderScheduleRequest)
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
