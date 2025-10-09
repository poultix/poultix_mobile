import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { SchedulePriority, ScheduleType } from '@/types/schedule';
import { Ionicons } from '@expo/vector-icons';
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
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-600 text-lg mt-4">Loading schedule request...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
            
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
                            <Text className="text-white font-medium text-sm">Schedule Request</Text>
                            <Text className="text-white text-2xl font-bold">Book Veterinary Visit 🏥</Text>
                            <Text className="text-orange-100 text-sm">
                                Request professional veterinary care
                            </Text>
                        </View>
                    </View> 
                </View>

                <ScrollView className="flex-1 px-4 pt-10" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    {/* Farm Selection */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm -mt-6 mb-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            🏠 Select Farm *
                        </Text>
                        {farmerFarms.length === 0 ? (
                            <View className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                <Text className="text-orange-800 font-medium text-center">
                                    No farms registered. Please register a farm first.
                                </Text>
                            </View>
                        ) : (
                            farmerFarms.map((farm, index) => (
                                <TouchableOpacity
                                    key={farm.id}
                                    className={`flex-row items-center p-4 rounded-xl mb-3 ${
                                        selectedFarm?.id === farm.id ? 'bg-orange-50 border-2 border-orange-500' : 'bg-gray-50'
                                    }`}
                                    onPress={() => setSelectedFarm(farm)}
                                >
                                    <View 
                                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                        style={{ backgroundColor: '#F59E0B' }}
                                    >
                                        <Ionicons name="home" size={20} color="white" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-800">{farm.name}</Text>
                                        <Text className="text-gray-600 text-sm">
                                            {farm.location.latitude.toFixed(4)}, {farm.location.longitude.toFixed(4)}
                                        </Text>
                                        <Text className="text-gray-500 text-xs">
                                            {farm.livestock.total} chickens • {farm.facilities.coops} coops
                                        </Text>
                                    </View>
                                    {selectedFarm?.id === farm.id && (
                                        <Ionicons name="checkmark-circle" size={24} color="#F59E0B" />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    {/* Veterinary Selection */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            👩‍⚕️ Select Veterinary *
                        </Text>
                        {veterinaries.length === 0 ? (
                            <View className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                <Text className="text-orange-800 font-medium text-center">
                                    No veterinaries available at the moment. Please try again later.
                                </Text>
                            </View>
                        ) : (
                            veterinaries.map((vet, index) => (
                                <TouchableOpacity
                                    key={vet.id}
                                    className={`flex-row items-center p-4 rounded-xl mb-3 ${
                                        selectedVet?.id === vet.id ? 'bg-orange-50 border-2 border-orange-500' : 'bg-gray-50'
                                    }`}
                                    onPress={() => setSelectedVet(vet)}
                                >
                                    <View 
                                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                        style={{ backgroundColor: '#D97706' }}
                                    >
                                        <Text className="text-white font-bold text-lg">
                                            {vet.name.charAt(0)}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-800">{vet.name}</Text>
                                        <Text className="text-gray-600 text-sm">{vet.email}</Text>
                                    </View>
                                    {selectedVet?.id === vet.id && (
                                        <Ionicons name="checkmark-circle" size={24} color="#F59E0B" />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    {/* Date & Time */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            📅 Preferred Date & Time *
                        </Text>
                        <View className="mb-4">
                            <Text className="text-gray-700 font-medium mb-2">Date</Text>
                            <TouchableOpacity
                                className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center justify-between border-2 border-transparent"
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text className="text-gray-800 font-medium">{formatDate(requestedDate)}</Text>
                                <Ionicons name="calendar-outline" size={20} color="#F59E0B" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Preferred Time</Text>
                            <TouchableOpacity
                                className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center justify-between border-2 border-transparent"
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text className="text-gray-800 font-medium">{formatTime(preferredTime)}</Text>
                                <Ionicons name="time-outline" size={20} color="#D97706" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Reason & Priority */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            📝 Visit Details *
                        </Text>
                        <View className="mb-4">
                            <Text className="text-gray-700 font-medium mb-2">Reason for Visit</Text>
                            <TextInput
                                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                                placeholder="e.g., Routine checkup, Disease outbreak, Vaccination"
                                value={reason}
                                onChangeText={setReason}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Priority Level</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {Object.values(SchedulePriority).map((priority) => (
                                    <TouchableOpacity
                                        key={priority}
                                        className={`py-3 px-4 rounded-xl border-2 ${
                                            urgency === priority ? 'border-orange-500' : 'border-gray-200'
                                        }`}
                                        style={{
                                            backgroundColor: urgency === priority ? '#FEF3C7' : '#F9FAFB'
                                        }}
                                        onPress={() => setUrgency(priority)}
                                    >
                                        <Text className={`text-center font-medium text-sm capitalize ${
                                            urgency === priority ? 'text-orange-600' : 'text-gray-700'
                                        }`}>
                                            {priority.toLowerCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className={`rounded-2xl py-4 px-6 shadow-lg mb-6 flex-row items-center justify-center ${
                            isSubmitting ? 'opacity-50' : ''
                        }`}
                        style={{
                            backgroundColor: '#F59E0B',
                            shadowColor: '#D97706',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {!isSubmitting && (
                            <Ionicons name="paper-plane" size={20} color="white" style={{ marginRight: 8 }} />
                        )}
                        <Text className="text-white font-bold text-lg text-center">
                            {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
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
