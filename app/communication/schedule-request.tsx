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
import { ScheduleType, SchedulePriority } from '@/types/schedule';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { useScheduleActions } from '@/hooks/useScheduleActions';
import { useUsers } from '@/contexts/UserContext';

export default function ScheduleRequestScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [selectedVet, setSelectedVet] = useState<any>(null);
    const [requestedDate, setRequestedDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [reason, setReason] = useState('');
    const [urgency, setUrgency] = useState<SchedulePriority>(SchedulePriority.MEDIUM);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { isLoading } = useSchedules();
    const { createSchedule } = useScheduleActions();
    const { users } = useUsers();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Get veterinaries from users
    const veterinaries = users.filter(user => user.role === 'VETERINARY');

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSubmit = async () => {
        if (!selectedVet || !requestedDate || !reason.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (!currentUser) {
            Alert.alert('Error', 'User not authenticated');
            return;
        }

        try {
            setIsSubmitting(true);
            
            await createSchedule({
                title: `Veterinary Visit - ${reason}`,
                description: notes || reason,
                type: ScheduleType.VETERINARY_VISIT,
                priority: urgency,
                scheduledDate: new Date(requestedDate),
                scheduledTime: preferredTime,
                farmerId: currentUser.id,
                veterinaryId: selectedVet.id,
                notes: notes
            });

            Alert.alert(
                'Success!',
                'Your veterinary appointment request has been submitted successfully.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error submitting request:', error);
            Alert.alert('Error', 'Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !currentUser) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading...</Text>
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
                        colors={['#10B981', '#059669']}
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
                                <Text style={tw`text-white font-medium`}>Schedule Request</Text>
                                <Text style={tw`text-white text-2xl font-bold`}>Book Veterinary Visit 🏥</Text>
                                <Text style={tw`text-green-100 text-sm`}>
                                    Request professional veterinary care
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                    {/* Veterinary Selection */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                            Select Veterinary *
                        </Text>
                        {veterinaries.map((vet, index) => (
                            <TouchableOpacity
                                key={vet.id}
                                style={tw`flex-row items-center p-4 rounded-xl mb-2 ${
                                    selectedVet?.id === vet.id ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'
                                }`}
                                onPress={() => setSelectedVet(vet)}
                            >
                                <View style={tw`w-12 h-12 rounded-full bg-green-500 items-center justify-center mr-4`}>
                                    <Text style={tw`text-white font-bold text-lg`}>
                                        {vet.name.charAt(0)}
                                    </Text>
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`font-semibold text-gray-800`}>{vet.name}</Text>
                                    <Text style={tw`text-gray-600 text-sm`}>{vet.email}</Text>
                                </View>
                                {selectedVet?.id === vet.id && (
                                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Date & Time */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                            Preferred Date & Time *
                        </Text>
                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-700 font-medium mb-2`}>Date</Text>
                            <TextInput
                                style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                                placeholder="YYYY-MM-DD"
                                value={requestedDate}
                                onChangeText={setRequestedDate}
                            />
                        </View>
                        <View>
                            <Text style={tw`text-gray-700 font-medium mb-2`}>Preferred Time</Text>
                            <TextInput
                                style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                                placeholder="e.g., Morning, 10:00 AM, Afternoon"
                                value={preferredTime}
                                onChangeText={setPreferredTime}
                            />
                        </View>
                    </View>

                    {/* Reason & Priority */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                            Visit Details *
                        </Text>
                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-700 font-medium mb-2`}>Reason for Visit</Text>
                            <TextInput
                                style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800`}
                                placeholder="e.g., Routine checkup, Disease outbreak, Vaccination"
                                value={reason}
                                onChangeText={setReason}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                        <View>
                            <Text style={tw`text-gray-700 font-medium mb-2`}>Priority Level</Text>
                            <View style={tw`flex-row gap-2`}>
                                {Object.values(SchedulePriority).map((priority) => (
                                    <TouchableOpacity
                                        key={priority}
                                        style={tw`flex-1 py-3 px-4 rounded-xl ${
                                            urgency === priority ? 'bg-green-500' : 'bg-gray-100'
                                        }`}
                                        onPress={() => setUrgency(priority)}
                                    >
                                        <Text style={tw`text-center font-medium ${
                                            urgency === priority ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            {priority}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Additional Notes */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm`}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                            Additional Notes
                        </Text>
                        <TextInput
                            style={tw`bg-gray-50 rounded-xl px-4 py-3 text-gray-800 h-24`}
                            placeholder="Any additional information or special requests..."
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={tw`bg-green-500 rounded-2xl py-4 px-6 shadow-lg mb-6 ${
                            isSubmitting ? 'opacity-50' : ''
                        }`}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Text style={tw`text-white font-bold text-lg text-center`}>
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}
