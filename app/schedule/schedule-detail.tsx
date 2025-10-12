import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Context and hook imports
import { useAuth } from '@/contexts/AuthContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { useScheduleActions } from '@/hooks/useScheduleActions';
import { SchedulePriority, ScheduleStatus, ScheduleType, ScheduleUpdateRequest } from '@/types/schedule';

export default function ScheduleDetailScreen() {
    const { currentUser } = useAuth();
    const { currentSchedule, loading } = useSchedules();
    const { updateSchedule } = useScheduleActions();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        priority: SchedulePriority.MEDIUM,
        scheduledDate: '',
    });

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleStatusUpdate = async (status: ScheduleStatus) => {
        if (!currentSchedule) return;

        try {
            const updateRequest: ScheduleUpdateRequest = {
                // type: ScheduleType;
                // title: string;
                // description: string;
                // scheduledDate: string;
                // priority: SchedulePriority
            }
            await updateSchedule(currentSchedule.id, updateRequest);
            Alert.alert('Success', `Schedule ${status.toLowerCase()} successfully!`);
        } catch (error) {
            console.error('Error updating schedule:', error);
            Alert.alert('Error', 'Failed to update schedule');
        }
    };

    const getStatusClasses = (status: ScheduleStatus) => {
        switch (status) {
            case ScheduleStatus.COMPLETED: return { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' };
            case ScheduleStatus.SCHEDULED: return { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' };
            case ScheduleStatus.IN_PROGRESS: return { bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' };
            case ScheduleStatus.CANCELLED: return { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' };
            case ScheduleStatus.RESCHEDULED: return { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500' };
        }
    };

    const getPriorityClasses = (priority: SchedulePriority) => {
        switch (priority) {
            case SchedulePriority.URGENT: return { bg: 'bg-red-100', text: 'text-red-600', icon: 'alert-circle' };
            case SchedulePriority.HIGH: return { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'chevron-up' };
            case SchedulePriority.MEDIUM: return { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: 'remove' };
            case SchedulePriority.LOW: return { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'chevron-down' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'remove' };
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) {
            return 'N/A';
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }

        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const openEditModal = () => {
        if (currentSchedule) {
            setEditFormData({
                title: currentSchedule.title,
                description: currentSchedule.description || '',
                priority: currentSchedule.priority,
                scheduledDate: currentSchedule.scheduledDate,
            });
            setIsEditModalVisible(true);
        }
    };

    const handleSaveEdit = async () => {
        if (!currentSchedule) return;

        try {
            const updateRequest: ScheduleUpdateRequest = {
                title: editFormData.title,
                description: editFormData.description,
                priority: editFormData.priority,
                scheduledDate: editFormData.scheduledDate,
            }
            await updateSchedule(currentSchedule.id, updateRequest);
            setIsEditModalVisible(false);
            Alert.alert('Success', 'Schedule updated successfully!');
        } catch (error) {
            console.error('Error updating schedule:', error);
            Alert.alert('Error', 'Failed to update schedule. Please try again.');
        }
    };

    // Check if current user can edit (farmers can edit their own schedules, vets can edit assigned ones)
    const canEdit = currentUser && currentSchedule && (
        (currentUser.role === 'FARMER' && currentSchedule.farmer?.id === currentUser.id) ||
        (currentUser.role === 'VETERINARY' && currentSchedule.veterinary?.id === currentUser.id)
    );

    if (loading || !currentSchedule || !currentUser) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-600 text-lg mt-4">Loading schedule details...</Text>
            </View>
        );
    }

    const statusClasses = getStatusClasses(currentSchedule.status);
    const priorityClasses = getPriorityClasses(currentSchedule.priority);

    return (
        <View className="flex-1 bg-gray-50">
            <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
                {/* Header */}
                <View
                    className="px-6 py-12 shadow-lg"
                    style={{
                        backgroundColor: '#F59E0B',
                        backgroundImage: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`
                    }}
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            className="bg-white/20 p-3 rounded-2xl"
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1 ml-4">
                            <Text className="text-white font-medium text-sm">Schedule Details</Text>
                            <Text className="text-white text-2xl font-bold">{currentSchedule.title}</Text>
                            <Text className="text-orange-100 text-sm">
                                {currentSchedule.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Text>
                        </View>
                        {canEdit && (
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
                    {/* Schedule Info */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm -mt-6 mb-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            📅 Appointment Information
                        </Text>

                        <View className="space-y-4">
                            <View className="flex-row justify-between items-start py-3 border-b border-gray-100">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-sm font-medium mb-1">Scheduled Date</Text>
                                    <Text className="text-gray-800 text-lg font-semibold">
                                        {formatDate(currentSchedule.scheduledDate)}
                                    </Text>
                                    <View className="mt-3">
                                        <View
                                            className="px-4 py-3 rounded-xl flex-row items-center justify-center self-start"
                                            style={{ backgroundColor: '#F59E0B' }}
                                        >
                                            <Ionicons name="calendar" size={16} color="white" />
                                            <Text className="text-white text-sm font-bold ml-2">
                                                {formatDate(currentSchedule.scheduledDate)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="items-center">
                                    <Ionicons name="calendar-outline" size={24} color="#F59E0B" />
                                    <Text className="text-orange-600 text-xs font-medium mt-1">
                                        Schedule
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-sm font-medium mb-2">Status</Text>
                                    <View className={`px-3 py-2 rounded-xl ${statusClasses.bg} self-start`}>
                                        <View className="flex-row items-center">
                                            <View className={`w-2 h-2 rounded-full ${statusClasses.dot} mr-2`} />
                                            <Text className={`text-sm font-semibold ${statusClasses.text}`}>
                                                {currentSchedule.status.replace('_', ' ')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-sm font-medium mb-2">Priority</Text>
                                    <View className={`px-3 py-2 rounded-xl ${priorityClasses.bg} self-start`}>
                                        <View className="flex-row items-center">
                                            <Ionicons name={priorityClasses.icon as any} size={16} color={priorityClasses.text.replace('text-', '#')} />
                                            <Text className={`text-sm font-semibold ${priorityClasses.text} ml-1 capitalize`}>
                                                {currentSchedule.priority.toLowerCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="py-3">
                                <Text className="text-gray-500 text-sm font-medium mb-2">Description</Text>
                                <Text className="text-gray-800 leading-6 bg-gray-50 p-4 rounded-xl">
                                    {currentSchedule.description}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    {currentUser.role === 'VETERINARY' && currentSchedule.status === ScheduleStatus.SCHEDULED && (
                        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                            <Text className="text-lg font-bold text-gray-800 mb-4">
                                ⚡ Quick Actions
                            </Text>

                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    className="flex-1 bg-green-500 py-4 px-6 rounded-xl flex-row items-center justify-center"
                                    onPress={() => handleStatusUpdate(ScheduleStatus.IN_PROGRESS)}
                                >
                                    <Ionicons name="checkmark" size={20} color="white" />
                                    <Text className="text-white font-bold text-center text-base ml-2">
                                        Start Visit
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 bg-red-500 py-4 px-6 rounded-xl flex-row items-center justify-center"
                                    onPress={() => handleStatusUpdate(ScheduleStatus.CANCELLED)}
                                >
                                    <Ionicons name="close" size={20} color="white" />
                                    <Text className="text-white font-bold text-center text-base ml-2">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Participants & Info */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            👥 Participants & Details
                        </Text>

                        <View className="space-y-3">
                            <View className="flex-row items-center py-2 border-b border-gray-100">
                                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="person" size={18} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs font-medium">Farmer</Text>
                                    <Text className="text-gray-800 font-semibold">{currentSchedule.farmer?.name || 'N/A'}</Text>
                                </View>
                            </View>

                            {currentSchedule.veterinary && (
                                <View className="flex-row items-center py-2 border-b border-gray-100">
                                    <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                                        <Ionicons name="medical" size={18} color="#10B981" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-500 text-xs font-medium">Veterinary</Text>
                                        <Text className="text-gray-800 font-semibold">{currentSchedule.veterinary.name}</Text>
                                    </View>
                                </View>
                            )}

                            <View className="flex-row items-center py-2 border-b border-gray-100">
                                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="create-outline" size={18} color="#6B7280" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs font-medium">Created</Text>
                                    <Text className="text-gray-800 font-semibold">{new Date(currentSchedule.createdAt).toLocaleDateString()}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center py-2">
                                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="time-outline" size={18} color="#F59E0B" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs font-medium">Last Updated</Text>
                                    <Text className="text-gray-800 font-semibold">{new Date(currentSchedule.updatedAt).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>

            {/* Edit Schedule Modal */}
            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View className="flex-1 bg-gray-50">
                    {/* Modal Header */}
                    <View
                        className="px-6 py-12 shadow-lg"
                        style={{
                            backgroundColor: '#F59E0B',
                            backgroundImage: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`
                        }}
                    >
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity
                                className="bg-white/20 p-3 rounded-2xl"
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                            <View className="flex-1 ml-4">
                                <Text className="text-white font-medium text-sm">Edit Schedule</Text>
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
                        {/* Basic Information */}
                        <View className="bg-white rounded-2xl p-5 shadow-sm -mt-6 mb-6">
                            <Text className="text-lg font-bold text-gray-800 mb-4">📝 Basic Information</Text>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Title</Text>
                                <TextInput
                                    className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                    placeholder="Enter schedule title"
                                    value={editFormData.title}
                                    onChangeText={(text) => setEditFormData(prev => ({ ...prev, title: text }))}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Description</Text>
                                <TextInput
                                    className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                    placeholder="Enter description"
                                    value={editFormData.description}
                                    onChangeText={(text) => setEditFormData(prev => ({ ...prev, description: text }))}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        {/* Date Information */}
                        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                            <Text className="text-lg font-bold text-gray-800 mb-4">📅 Schedule Date</Text>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Scheduled Date</Text>
                                <TextInput
                                    className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                    placeholder="YYYY-MM-DD"
                                    value={editFormData.scheduledDate}
                                    onChangeText={(text) => setEditFormData(prev => ({ ...prev, scheduledDate: text }))}
                                />
                                <Text className="text-gray-500 text-xs mt-2">
                                    Enter date in YYYY-MM-DD format
                                </Text>
                            </View>
                        </View>

                        {/* Priority Selection */}
                        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                            <Text className="text-lg font-bold text-gray-800 mb-4">🎯 Priority Level</Text>

                            <View className="flex-row flex-wrap gap-2">
                                {Object.values(SchedulePriority).map((priority) => {
                                    const isSelected = editFormData.priority === priority;

                                    return (
                                        <TouchableOpacity
                                            key={priority}
                                            className={`px-4 py-3 rounded-xl border-2 ${isSelected ? 'border-orange-500' : 'border-gray-200'}`}
                                            style={{
                                                backgroundColor: isSelected ? '#FEF3C7' : '#F9FAFB'
                                            }}
                                            onPress={() => setEditFormData(prev => ({ ...prev, priority }))}
                                        >
                                            <Text
                                                className={`font-medium capitalize ${isSelected ? 'text-orange-600' : 'text-gray-600'}`}
                                            >
                                                {priority.toLowerCase()}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}
