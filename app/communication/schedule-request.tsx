import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { SchedulePriority, ScheduleType } from '@/types/schedule';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { useUsers } from '@/contexts/UserContext';
import { useScheduleActions } from '@/hooks/useScheduleActions';
import { useFarms } from '@/contexts/FarmContext';
import { Farm } from '@/types/farm';

export default function ScheduleRequestScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [selectedVet, setSelectedVet] = useState<any>(null);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
    const [requestedDate, setRequestedDate] = useState(new Date());
    const [preferredTime, setPreferredTime] = useState(new Date());
    const [reason, setReason] = useState('');
    const [urgency, setUrgency] = useState<SchedulePriority>(SchedulePriority.MEDIUM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { loading } = useSchedules();
    const { createSchedule } = useScheduleActions();
    const { users } = useUsers();
    const { farms } = useFarms();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Get veterinaries from users
    const veterinaries = users.filter(user => user.role === 'VETERINARY');

    // Get farmer's farms (assuming currentUser is the farmer)
    const farmerFarms = farms.filter(farm => currentUser && farm.owner.id === currentUser.id);

    // Helper functions for date/time formatting
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        });
    };



    // Create combined DateTime for scheduling
    const getScheduledDateTime = () => {
        const date = new Date(requestedDate);
        const time = new Date(preferredTime);
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes()
        );
    };

    // Date/Time picker handlers
    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || requestedDate;
        setShowDatePicker(false);
        setRequestedDate(currentDate);
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        const currentTime = selectedTime || preferredTime;
        setShowTimePicker(false);
        setPreferredTime(currentTime);
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleSubmit = async () => {
        if (!selectedVet || !selectedFarm || !reason.trim()) {
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
                farm: selectedFarm,
                veterinary: selectedVet,
                type: ScheduleType.CONSULTATION,
                title: `Veterinary Visit - ${selectedFarm.name}`,
                description: reason,
                scheduledDate: getScheduledDateTime().toISOString(),
                priority: urgency
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

    if (loading || !currentUser) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
            
            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Header */}
                <View style={tw`pb-4`}>
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={tw` p-6 shadow-xl`}
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

                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}
                contentContainerClassName='pb-10'>
                    {/* Farm Selection */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                            Select Farm *
                        </Text>
                        {farmerFarms.length === 0 ? (
                            <View style={tw`bg-yellow-50 rounded-xl p-4 border border-yellow-200`}>
                                <Text style={tw`text-yellow-800 font-medium text-center`}>
                                    No farms registered. Please register a farm first.
                                </Text>
                            </View>
                        ) : (
                            farmerFarms.map((farm, index) => (
                                <TouchableOpacity
                                    key={farm.id}
                                    style={tw`flex-row items-center p-4 rounded-xl mb-2 ${
                                        selectedFarm?.id === farm.id ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'
                                    }`}
                                    onPress={() => setSelectedFarm(farm)}
                                >
                                    <View style={tw`w-12 h-12 rounded-full bg-green-500 items-center justify-center mr-4`}>
                                        <Ionicons name="home" size={20} color="white" />
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`font-semibold text-gray-800`}>{farm.name}</Text>
                                        <Text style={tw`text-gray-600 text-sm`}>
                                            {farm.location.latitude.toFixed(4)}, {farm.location.longitude.toFixed(4)}
                                        </Text>
                                        <Text style={tw`text-gray-500 text-xs`}>
                                            {farm.livestock.total} chickens • {farm.facilities.coops} coops
                                        </Text>
                                    </View>
                                    {selectedFarm?.id === farm.id && (
                                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    {/* Veterinary Selection */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                            Select Veterinary *
                        </Text>
                        {veterinaries.length === 0 ? (
                            <View style={tw`bg-yellow-50 rounded-xl p-4 border border-yellow-200`}>
                                <Text style={tw`text-yellow-800 font-medium text-center`}>
                                    No veterinaries available at the moment. Please try again later.
                                </Text>
                            </View>
                        ) : (
                            veterinaries.map((vet, index) => (
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
                            ))
                        )}
                    </View>

                    {/* Date & Time */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                            Preferred Date & Time *
                        </Text>
                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-700 font-medium mb-2`}>Date</Text>
                            <TouchableOpacity
                                style={tw`bg-gray-50 rounded-xl px-4 py-3 flex-row items-center justify-between`}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={tw`text-gray-800`}>{formatDate(requestedDate)}</Text>
                                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={tw`text-gray-700 font-medium mb-2`}>Preferred Time</Text>
                            <TouchableOpacity
                                style={tw`bg-gray-50 rounded-xl px-4 py-3 flex-row items-center justify-between`}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={tw`text-gray-800`}>{formatTime(preferredTime)}</Text>
                                <Ionicons name="time-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
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
                                        style={tw`py-2 px-4 rounded-xl ${
                                            urgency === priority ? 'bg-green-500' : 'bg-gray-100'
                                        }`}
                                        onPress={() => setUrgency(priority)}
                                    >
                                        <Text style={tw`text-center font-medium text-xs ${
                                            urgency === priority ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            {priority}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={tw`bg-green-600 rounded-2xl py-4 px-6 shadow-lg mb-6 ${
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

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={requestedDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* Time Picker */}
            {showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={preferredTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
}
