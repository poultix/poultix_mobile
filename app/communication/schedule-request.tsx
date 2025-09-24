import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
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
import { MockDataService, mockVeterinaries } from '@/services/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScheduleRequestScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [selectedVet, setSelectedVet] = useState<any>(null);
    const [requestedDate, setRequestedDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [reason, setReason] = useState('');
    const [urgency, setUrgency] = useState('medium');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSubmitRequest = async () => {
        if (!selectedVet || !requestedDate || !preferredTime || !reason) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const farmerData = await AsyncStorage.getItem('farmerData');
            const farmer = farmerData ? JSON.parse(farmerData) : null;

            const request = {
                farmerId: farmer?._id || 'farmer_001',
                veterinaryId: selectedVet.id || 'vet_001',
                farmerName: farmer?.names || 'John Uwimana',
                veterinaryName: selectedVet.name,
                farmName: 'Sunrise Poultry Farm', // This should come from farmer data
                requestedDate: new Date(requestedDate),
                preferredTime,
                reason,
                urgency,
                notes,
            };

            const result = await MockDataService.createScheduleRequest(request);

            if (result.success) {
                Alert.alert(
                    'Request Sent!',
                    'Your schedule request has been sent to the veterinary. You will be notified once they respond.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            Alert.alert('Error', 'Failed to send request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const urgencyColors = {
        low: { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' },
        medium: { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B' },
        high: { bg: '#FEE2E2', text: '#DC2626', border: '#EF4444' },
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={tw`px-4 pt-2 pb-4`}>
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            style={tw`rounded-3xl p-8 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-white text-sm opacity-90`}>
                                        Schedule Request
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>
                                        Book Veterinary Visit 📅
                                    </Text>
                                    <Text style={tw`text-blue-100 text-sm mt-1`}>
                                        Request a visit from a veterinary professional
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={tw`px-4`}>
                        {/* Select Veterinary */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                                Select Veterinary
                            </Text>
                            {mockVeterinaries.map((vet, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        tw`p-4 rounded-xl mb-3 border-2`,
                                        selectedVet?.name === vet.name
                                            ? tw`bg-blue-50 border-blue-500`
                                            : tw`bg-gray-50 border-gray-200`
                                    ]}
                                    onPress={() => setSelectedVet({ ...vet, id: `vet_00${index + 1}` })}
                                >
                                    <View style={tw`flex-row items-center justify-between`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`font-semibold text-gray-800`}>
                                                {vet.name}
                                            </Text>
                                            <Text style={tw`text-gray-600 text-sm`}>
                                                {vet.location} • {vet.specialization}
                                            </Text>
                                            <Text style={tw`text-gray-500 text-xs`}>
                                                {vet.experience} • ⭐ {vet.rating}
                                            </Text>
                                        </View>
                                        {selectedVet?.name === vet.name && (
                                            <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Date and Time */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                                Preferred Date & Time
                            </Text>
                            
                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-700 font-medium mb-2`}>Date *</Text>
                                <TextInput
                                    style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                                    placeholder="YYYY-MM-DD (e.g., 2024-06-28)"
                                    value={requestedDate}
                                    onChangeText={setRequestedDate}
                                />
                            </View>

                            <View>
                                <Text style={tw`text-gray-700 font-medium mb-2`}>Preferred Time *</Text>
                                <View style={tw`flex-row flex-wrap gap-2`}>
                                    {['08:00', '10:00', '14:00', '16:00'].map((time) => (
                                        <TouchableOpacity
                                            key={time}
                                            style={[
                                                tw`px-4 py-2 rounded-full border`,
                                                preferredTime === time
                                                    ? tw`bg-blue-500 border-blue-500`
                                                    : tw`bg-gray-100 border-gray-300`
                                            ]}
                                            onPress={() => setPreferredTime(time)}
                                        >
                                            <Text style={[
                                                tw`font-medium`,
                                                preferredTime === time ? tw`text-white` : tw`text-gray-700`
                                            ]}>
                                                {time}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Reason and Urgency */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                                Visit Details
                            </Text>
                            
                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-700 font-medium mb-2`}>Reason for Visit *</Text>
                                <TextInput
                                    style={tw`border border-gray-300 rounded-xl p-4 text-gray-800`}
                                    placeholder="e.g., Routine health check, Vaccination, Emergency"
                                    value={reason}
                                    onChangeText={setReason}
                                    multiline
                                />
                            </View>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-700 font-medium mb-2`}>Urgency Level</Text>
                                <View style={tw`flex-row gap-2`}>
                                    {(['low', 'medium', 'high'] as const).map((level) => (
                                        <TouchableOpacity
                                            key={level}
                                            style={[
                                                tw`flex-1 p-3 rounded-xl border-2`,
                                                urgency === level
                                                    ? { backgroundColor: urgencyColors[level].bg, borderColor: urgencyColors[level].border }
                                                    : tw`bg-gray-100 border-gray-300`
                                            ]}
                                            onPress={() => setUrgency(level)}
                                        >
                                            <Text style={[
                                                tw`text-center font-medium capitalize`,
                                                urgency === level
                                                    ? { color: urgencyColors[level].text }
                                                    : tw`text-gray-700`
                                            ]}>
                                                {level}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View>
                                <Text style={tw`text-gray-700 font-medium mb-2`}>Additional Notes</Text>
                                <TextInput
                                    style={tw`border border-gray-300 rounded-xl p-4 text-gray-800 h-20`}
                                    placeholder="Any additional information for the veterinary..."
                                    value={notes}
                                    onChangeText={setNotes}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[
                                tw`bg-blue-500 rounded-2xl p-4 mb-6`,
                                isSubmitting && tw`opacity-50`
                            ]}
                            onPress={handleSubmitRequest}
                            disabled={isSubmitting}
                        >
                            <Text style={tw`text-white text-center font-bold text-lg`}>
                                {isSubmitting ? 'Sending Request...' : 'Send Schedule Request'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>

            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </SafeAreaView>
    );
}
