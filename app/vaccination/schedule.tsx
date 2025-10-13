import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// Mock vaccination schedule data
const mockSchedules = [
    {
        id: '1',
        animalType: 'Dairy Cow',
        animalId: 'COW-001',
        farmName: 'Kigali Dairy Farm',
        nextVaccination: '2024-10-15',
        daysRemaining: 5,
        priority: 'High',
        vaccines: [
            {
                name: 'Foot and Mouth Disease',
                dueDate: '2024-10-15',
                status: 'Upcoming',
                lastGiven: '2024-04-15',
                dosage: '2ml subcutaneous',
                veterinarian: 'Dr. John Uwimana'
            },
            {
                name: 'Black Quarter',
                dueDate: '2024-11-01',
                status: 'Scheduled',
                lastGiven: '2023-11-01',
                dosage: '5ml subcutaneous',
                veterinarian: 'Dr. Alice Mukamana'
            }
        ]
    },
    {
        id: '2',
        animalType: 'Goat',
        animalId: 'GOAT-045',
        farmName: 'Musanze Goat Cooperative',
        nextVaccination: '2024-10-20',
        daysRemaining: 10,
        priority: 'Medium',
        vaccines: [
            {
                name: 'Peste des Petits Ruminants',
                dueDate: '2024-10-20',
                status: 'Upcoming',
                lastGiven: '2021-10-20',
                dosage: '1ml subcutaneous',
                veterinarian: 'Dr. Grace Uwase'
            }
        ]
    }
];

const VaccinationScheduleScreen = () => {
    const [selectedTab, setSelectedTab] = useState('upcoming');
    const [filteredSchedules, setFilteredSchedules] = useState(mockSchedules);
    const [loading, setLoading] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;

    // Start animations
    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Filter schedules
    useEffect(() => {
        let filtered = mockSchedules;

        if (selectedTab === 'upcoming') {
            filtered = filtered.filter(schedule => schedule.daysRemaining > 0);
        } else if (selectedTab === 'overdue') {
            filtered = filtered.filter(schedule => schedule.daysRemaining < 0);
        }

        setFilteredSchedules(filtered);
    }, [selectedTab]);

    const handleSchedulePress = (schedule: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            'Schedule Vaccination',
            `Book vaccination appointment for ${schedule.animalType} ${schedule.animalId}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Book Now', onPress: () => router.push('/veterinary/nearby') }
            ]
        );
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-100';
            case 'Medium': return 'text-orange-600 bg-orange-100';
            case 'Low': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return 'text-blue-600 bg-blue-100';
            case 'Scheduled': return 'text-green-600 bg-green-100';
            case 'Overdue': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const tabs = [
        { id: 'upcoming', label: 'Upcoming', count: mockSchedules.filter(s => s.daysRemaining > 0).length },
        { id: 'overdue', label: 'Overdue', count: mockSchedules.filter(s => s.daysRemaining < 0).length },
        { id: 'all', label: 'All', count: mockSchedules.length }
    ];

    useEffect(() => {
        startAnimations();
    }, []);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#F59E0B', '#D97706']}
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
                        onPress={() => {
                            Alert.alert(
                                'Add New Schedule',
                                'Create a new vaccination schedule for your animals?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Create', onPress: () => {} }
                                ]
                            );
                        }}
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-white text-sm opacity-90`}>
                            AI-Powered Vaccination Management
                        </Text>
                        <Text style={tw`text-white text-2xl font-bold`}>
                            Vaccination Schedule
                        </Text>
                        <Text style={tw`text-orange-100 text-sm mt-1`}>
                            Track and manage animal vaccination schedules
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mt-4`}>
                        <View style={tw`flex-row justify-between`}>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {mockSchedules.filter(s => s.daysRemaining <= 7 && s.daysRemaining > 0).length}
                                </Text>
                                <Text style={tw`text-orange-100 text-xs`}>Due Soon</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {mockSchedules.filter(s => s.daysRemaining > 0).length}
                                </Text>
                                <Text style={tw`text-orange-100 text-xs`}>Upcoming</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-red-200 text-xl font-bold`}>
                                    {mockSchedules.filter(s => s.daysRemaining < 0).length}
                                </Text>
                                <Text style={tw`text-orange-100 text-xs`}>Overdue</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </LinearGradient>

            {/* Tabs */}
            <View style={tw`bg-white border-b border-gray-200`}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-4 py-3`}
                >
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={tw`mr-6 pb-2 ${selectedTab === tab.id ? 'border-b-2 border-orange-500' : ''}`}
                            onPress={() => setSelectedTab(tab.id)}
                        >
                            <View style={tw`flex-row items-center`}>
                                <Text
                                    style={tw`font-medium ${
                                        selectedTab === tab.id ? 'text-orange-600' : 'text-gray-600'
                                    }`}
                                >
                                    {tab.label}
                                </Text>
                                <View style={tw`ml-2 bg-gray-200 rounded-full px-2 py-1`}>
                                    <Text style={tw`text-gray-700 text-xs font-bold`}>{tab.count}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {loading ? (
                        <View style={tw`items-center py-20`}>
                            <ActivityIndicator size="large" color="#F59E0B" />
                            <Text style={tw`text-gray-600 mt-4`}>Loading schedules...</Text>
                        </View>
                    ) : filteredSchedules.length === 0 ? (
                        <View style={tw`items-center py-20`}>
                            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
                            <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No schedules found</Text>
                            <Text style={tw`text-gray-400 text-center px-8`}>
                                {selectedTab === 'overdue' 
                                    ? 'Great! No overdue vaccinations'
                                    : 'Try adjusting your filter'
                                }
                            </Text>
                        </View>
                    ) : (
                        filteredSchedules.map((schedule, index) => (
                            <Animated.View
                                key={schedule.id}
                                style={[
                                    tw`mb-6`,
                                    {
                                        opacity: cardAnim,
                                        transform: [{
                                            translateY: cardAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [10 * (index + 1), 0],
                                            }),
                                        }],
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-5`}
                                    onPress={() => handleSchedulePress(schedule)}
                                    activeOpacity={0.7}
                                >
                                    {/* Header */}
                                    <View style={tw`flex-row items-start justify-between mb-4`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>
                                                {schedule.animalType} • {schedule.animalId}
                                            </Text>
                                            <Text style={tw`text-gray-600 text-sm mb-2`}>
                                                {schedule.farmName}
                                            </Text>
                                            <View style={tw`flex-row items-center`}>
                                                <View style={tw`px-3 py-1 rounded-full ${getPriorityColor(schedule.priority)} mr-3`}>
                                                    <Text style={tw`text-xs font-bold`}>
                                                        {schedule.priority} Priority
                                                    </Text>
                                                </View>
                                                <Text style={tw`text-gray-500 text-sm`}>
                                                    Next: {schedule.nextVaccination}
                                                </Text>
                                            </View>
                                        </View>
                                        
                                        <View style={tw`items-end`}>
                                            <Text style={tw`text-orange-600 font-bold text-lg mb-1`}>
                                                {schedule.daysRemaining} days
                                            </Text>
                                            <Text style={tw`text-gray-500 text-xs`}>remaining</Text>
                                        </View>
                                    </View>

                                    {/* Vaccines */}
                                    <View style={tw`space-y-3`}>
                                        {schedule.vaccines.map((vaccine, idx) => (
                                            <View key={idx} style={tw`bg-gray-50 rounded-xl p-4`}>
                                                <View style={tw`flex-row items-center justify-between mb-2`}>
                                                    <Text style={tw`text-gray-900 font-bold`}>
                                                        {vaccine.name}
                                                    </Text>
                                                    <View style={tw`px-2 py-1 rounded-full ${getStatusColor(vaccine.status)}`}>
                                                        <Text style={tw`text-xs font-bold`}>
                                                            {vaccine.status}
                                                        </Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center justify-between text-sm mb-1`}>
                                                    <Text style={tw`text-gray-600`}>
                                                        Due: {vaccine.dueDate}
                                                    </Text>
                                                    <Text style={tw`text-gray-600`}>
                                                        Dosage: {vaccine.dosage}
                                                    </Text>
                                                </View>
                                                
                                                <Text style={tw`text-gray-500 text-xs`}>
                                                    Last given: {vaccine.lastGiven} • Vet: {vaccine.veterinarian}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* Action Buttons */}
                                    <View style={tw`flex-row space-x-3 mt-4`}>
                                        <TouchableOpacity
                                            style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                            onPress={() => router.push('/vaccination/history')}
                                        >
                                            <Ionicons name="time-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                            <Text style={tw`text-gray-700 font-bold`}>View History</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={tw`flex-1 bg-orange-500 py-3 rounded-xl flex-row items-center justify-center`}
                                            onPress={() => handleSchedulePress(schedule)}
                                        >
                                            <Ionicons name="calendar-outline" size={18} color="white" style={tw`mr-2`} />
                                            <Text style={tw`text-white font-bold`}>Book Now</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default VaccinationScheduleScreen;
