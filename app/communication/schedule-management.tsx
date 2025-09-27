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
import { Schedule, ScheduleStatus } from '@/types/schedule';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { useScheduleActions } from '@/hooks/useScheduleActions';

export default function ScheduleManagementScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'completed'>('pending');
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { schedules, currentSchedule, setCurrentSchedule, isLoading } = useSchedules();
    const { updateSchedule } = useScheduleActions();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Filter schedules by status
    const filteredSchedules = schedules.filter(schedule => {
        switch (selectedTab) {
            case 'pending':
                return schedule.status === ScheduleStatus.PENDING;
            case 'approved':
                return schedule.status === ScheduleStatus.CONFIRMED;
            case 'completed':
                return schedule.status === ScheduleStatus.COMPLETED;
            default:
                return true;
        }
    });

    const handleApprove = async (schedule: Schedule) => {
        try {
            await updateSchedule({
                ...schedule,
                status: ScheduleStatus.CONFIRMED
            });
            Alert.alert('Success', 'Schedule request approved!');
        } catch (error) {
            console.error('Error approving request:', error);
            Alert.alert('Error', 'Failed to approve request');
        }
    };

    const handleReject = async (schedule: Schedule) => {
        try {
            await updateSchedule({
                ...schedule,
                status: ScheduleStatus.CANCELLED
            });
            Alert.alert('Success', 'Schedule request rejected!');
        } catch (error) {
            console.error('Error rejecting request:', error);
            Alert.alert('Error', 'Failed to reject request');
        }
    };

    const handleSchedulePress = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        router.push('/communication/schedule-detail');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#F59E0B';
            case 'approved': return '#10B981';
            case 'completed': return '#6B7280';
            default: return '#9CA3AF';
        }
    };

    if (isLoading || !currentUser) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600`}>Loading schedule requests...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
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
                                <Text style={tw`text-white font-medium`}>Schedule Management</Text>
                                <Text style={tw`text-white text-2xl font-bold`}>Appointments 📅</Text>
                                <Text style={tw`text-blue-100 text-sm`}>
                                    Manage your veterinary appointments
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Tab Navigation */}
                <View style={tw`px-4 mb-4`}>
                    <View style={tw`flex-row bg-white rounded-2xl p-1 shadow-sm`}>
                        {(['pending', 'approved', 'completed'] as const).map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={tw`flex-1 py-3 px-4 rounded-xl ${selectedTab === tab ? 'bg-blue-500' : ''}`}
                                onPress={() => setSelectedTab(tab)}
                            >
                                <Text style={tw`text-center font-medium ${selectedTab === tab ? 'text-white' : 'text-gray-600'}`}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Schedule List */}
                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                    {filteredSchedules.length === 0 ? (
                        <View style={tw`flex-1 justify-center items-center py-20`}>
                            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
                            <Text style={tw`text-gray-500 text-lg font-medium mt-4`}>
                                No {selectedTab} appointments
                            </Text>
                            <Text style={tw`text-gray-400 text-center mt-2`}>
                                {selectedTab === 'pending' 
                                    ? 'New appointment requests will appear here'
                                    : `No ${selectedTab} appointments found`
                                }
                            </Text>
                        </View>
                    ) : (
                        filteredSchedules.map((schedule, index) => (
                            <TouchableOpacity
                                key={schedule.id}
                                style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100`}
                                onPress={() => handleSchedulePress(schedule)}
                            >
                                <View style={tw`flex-row items-start justify-between mb-3`}>
                                    <View style={tw`flex-1 mr-3`}>
                                        <Text style={tw`font-bold text-gray-800 text-lg`}>{schedule.title}</Text>
                                        <Text style={tw`text-gray-600 text-sm`}>{schedule.type}</Text>
                                        <Text style={tw`text-gray-700 mt-2`}>{schedule.description}</Text>
                                    </View>
                                    <View style={tw`items-end`}>
                                        <View style={[
                                            tw`px-2 py-1 rounded-full`,
                                            { backgroundColor: getStatusColor(selectedTab) + '20' }
                                        ]}>
                                            <Text style={[
                                                tw`text-xs font-medium`,
                                                { color: getStatusColor(selectedTab) }
                                            ]}>
                                                {schedule.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={tw`flex-row items-center justify-between pt-3 border-t border-gray-100`}>
                                    <View>
                                        <Text style={tw`text-blue-600 font-medium`}>{new Date(schedule.scheduledDate).toLocaleDateString()}</Text>
                                        <Text style={tw`text-gray-500 text-sm`}>{schedule.scheduledTime || 'TBD'}</Text>
                                    </View>
                                    
                                    {selectedTab === 'pending' && (
                                        <View style={tw`flex-row gap-2`}>
                                            <TouchableOpacity
                                                style={tw`bg-green-500 py-2 px-4 rounded-xl`}
                                                onPress={() => handleApprove(schedule)}
                                            >
                                                <Text style={tw`text-white font-medium text-sm`}>Approve</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={tw`bg-red-500 py-2 px-4 rounded-xl`}
                                                onPress={() => handleReject(schedule)}
                                            >
                                                <Text style={tw`text-white font-medium text-sm`}>Reject</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}
