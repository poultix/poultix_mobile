import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
import tw from 'twrnc';

// Mock notifications data
const notificationsData = [
    {
        id: '1',
        type: 'vaccination',
        title: 'Vaccination Reminder',
        message: 'FMD vaccination due for 5 dairy cattle in Kigali Dairy Farm',
        time: '2 hours ago',
        read: false,
        priority: 'High',
        action: 'Schedule',
        route: '/vaccination/schedule'
    },
    {
        id: '2',
        type: 'disease_alert',
        title: 'Disease Alert',
        message: 'FMD outbreak reported in Gasabo district. Enhanced biosecurity recommended.',
        time: '5 hours ago',
        read: false,
        priority: 'Critical',
        action: 'View Details',
        route: '/resources/disease-info'
    },
    {
        id: '3',
        type: 'appointment',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. John Uwimana is scheduled for tomorrow at 10:00 AM',
        time: '1 day ago',
        read: true,
        priority: 'Medium',
        action: 'View Details',
        route: '/schedule/schedule-detail'
    },
    {
        id: '4',
        type: 'medicine',
        title: 'Medicine Low Stock Alert',
        message: 'Amoxicillin Injectable is running low. Only 5 doses remaining.',
        time: '2 days ago',
        read: true,
        priority: 'Medium',
        action: 'Reorder',
        route: '/medicine/nearby-pharmacies'
    },
    {
        id: '5',
        type: 'update',
        title: 'New Guidelines Available',
        message: 'Updated vaccination protocols for Newcastle disease have been published.',
        time: '3 days ago',
        read: true,
        priority: 'Low',
        action: 'Read Now',
        route: '/resources/guidelines'
    },
    {
        id: '6',
        type: 'emergency',
        title: 'Emergency Contact Update',
        message: 'New emergency veterinary clinic opened in Kicukiro district.',
        time: '1 week ago',
        read: true,
        priority: 'Low',
        action: 'View Location',
        route: '/emergency/contacts'
    }
];

const NotificationsScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [notifications, setNotifications] = useState(notificationsData);
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleNotificationPress = (notification: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Mark as read
        setNotifications(prev =>
            prev.map(n =>
                n.id === notification.id ? { ...n, read: true } : n
            )
        );

        // Navigate to route
        router.push(notification.route);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'vaccination': return 'shield-checkmark-outline';
            case 'disease_alert': return 'warning-outline';
            case 'appointment': return 'calendar-outline';
            case 'medicine': return 'medical-outline';
            case 'update': return 'document-text-outline';
            case 'emergency': return 'call-outline';
            default: return 'notifications-outline';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'vaccination': return '#10B981';
            case 'disease_alert': return '#EF4444';
            case 'appointment': return '#3B82F6';
            case 'medicine': return '#F59E0B';
            case 'update': return '#8B5CF6';
            case 'emergency': return '#DC2626';
            default: return '#6B7280';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-600 bg-red-100';
            case 'High': return 'text-orange-600 bg-orange-100';
            case 'Medium': return 'text-blue-600 bg-blue-100';
            case 'Low': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const filters = [
        { id: 'all', label: 'All', count: notifications.length },
        { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
        { id: 'critical', label: 'Critical', count: notifications.filter(n => n.priority === 'Critical').length },
        { id: 'high', label: 'High', count: notifications.filter(n => n.priority === 'High').length }
    ];

    const filteredNotifications = selectedFilter === 'all'
        ? notifications
        : selectedFilter === 'unread'
        ? notifications.filter(n => !n.read)
        : selectedFilter === 'critical'
        ? notifications.filter(n => n.priority === 'Critical')
        : selectedFilter === 'high'
        ? notifications.filter(n => n.priority === 'High')
        : notifications;

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#059669', '#10B981']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`bg-white bg-opacity-20 p-2 rounded-xl mb-4 self-start`}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <Text style={tw`text-white text-2xl font-bold mb-2`}>
                        Notifications
                    </Text>
                    <Text style={tw`text-green-100 text-sm`}>
                        Stay updated with important alerts
                    </Text>
                </Animated.View>
            </LinearGradient>

            {/* Filter Tabs */}
            <View style={tw`bg-white border-b border-gray-200`}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-4 py-3`}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={tw`mr-3 px-4 py-2 rounded-xl ${
                                selectedFilter === filter.id
                                    ? 'bg-green-500'
                                    : 'bg-gray-100 border border-gray-200'
                            }`}
                            onPress={() => setSelectedFilter(filter.id)}
                        >
                            <Text
                                style={tw`font-medium ${
                                    selectedFilter === filter.id ? 'text-white' : 'text-gray-700'
                                }`}
                            >
                                {filter.label} ({filter.count})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Mark All Read Button */}
            {notifications.some(n => !n.read) && (
                <View style={tw`px-4 py-3 bg-white border-b border-gray-200`}>
                    <TouchableOpacity
                        style={tw`flex-row items-center justify-center py-2`}
                        onPress={markAllAsRead}
                    >
                        <Ionicons name="checkmark-done-outline" size={20} color="#059669" style={tw`mr-2`} />
                        <Text style={tw`text-green-600 font-bold`}>Mark All as Read</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {filteredNotifications.length === 0 ? (
                        <View style={tw`items-center py-20`}>
                            <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
                            <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No notifications</Text>
                            <Text style={tw`text-gray-400 text-center px-8`}>
                                {selectedFilter === 'unread'
                                    ? 'All caught up! No unread notifications.'
                                    : `No ${selectedFilter} notifications at this time.`
                                }
                            </Text>
                        </View>
                    ) : (
                        filteredNotifications.map((notification, index) => (
                            <Animated.View
                                key={notification.id}
                                style={[
                                    tw`mb-3`,
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
                                    style={tw`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${
                                        !notification.read ? 'border-l-4 border-l-green-500' : ''
                                    }`}
                                    onPress={() => handleNotificationPress(notification)}
                                    activeOpacity={0.7}
                                >
                                    <View style={tw`flex-row items-start`}>
                                        <View
                                            style={[tw`w-12 h-12 rounded-xl items-center justify-center mr-4`, { backgroundColor: getTypeColor(notification.type) + '20' }]}
                                        >
                                            <Ionicons
                                                name={getTypeIcon(notification.type) as any}
                                                size={24}
                                                color={getTypeColor(notification.type)}
                                            />
                                        </View>

                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex-row items-center justify-between mb-2`}>
                                                <Text style={tw`text-gray-900 font-bold text-lg flex-1 mr-2`}>
                                                    {notification.title}
                                                </Text>
                                                {!notification.read && (
                                                    <View style={tw`w-3 h-3 bg-green-500 rounded-full`} />
                                                )}
                                            </View>

                                            <Text style={tw`text-gray-700 leading-5 mb-3`}>
                                                {notification.message}
                                            </Text>

                                            <View style={tw`flex-row items-center justify-between`}>
                                                <View style={tw`flex-row items-center`}>
                                                    <Text style={tw`text-gray-500 text-sm mr-3`}>
                                                        {notification.time}
                                                    </Text>
                                                    <View style={tw`px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                                        <Text style={tw`text-xs font-bold`}>
                                                            {notification.priority}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <TouchableOpacity
                                                    style={tw`bg-green-500 px-4 py-2 rounded-xl flex-row items-center`}
                                                    onPress={() => handleNotificationPress(notification)}
                                                >
                                                    <Text style={tw`text-white font-medium text-sm mr-1`}>
                                                        {notification.action}
                                                    </Text>
                                                    <Ionicons name="chevron-forward" size={16} color="white" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))
                    )}

                    {/* Notification Settings */}
                    <View style={tw`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <Ionicons name="settings-outline" size={24} color="#6B7280" />
                            <Text style={tw`text-gray-900 font-bold text-lg ml-3`}>Notification Preferences</Text>
                        </View>

                        <Text style={tw`text-gray-600 mb-4 leading-5`}>
                            Customize which notifications you want to receive and how you want to be alerted.
                        </Text>

                        <TouchableOpacity
                            style={tw`bg-gray-100 py-3 px-4 rounded-xl flex-row items-center justify-center`}
                            onPress={() => router.push('/settings/settings-notifications')}
                        >
                            <Ionicons name="notifications-outline" size={20} color="#6B7280" style={tw`mr-2`} />
                            <Text style={tw`text-gray-700 font-bold`}>Manage Notification Settings</Text>
                            <Ionicons name="chevron-forward" size={20} color="#6B7280" style={tw`ml-auto`} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default NotificationsScreen;
