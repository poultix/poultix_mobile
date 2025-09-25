import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import DrawerButton from '@/components/DrawerButton';
import { useSchedules, useFarms } from '@/hooks/useCrud';
import { useDataRelationships } from '@/hooks/useCrud';

export default function ScheduleDetailScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const { id } = useLocalSearchParams();
  const { getSchedulesByUser } = useSchedules();
  const { getFarmsByUser} = useFarms();
  const { getRelatedData } = useDataRelationships();
  const [schedule, setSchedule] = useState<any>(null);
  const [farm, setFarm] = useState<any>(null);
  const [relatedData, setRelatedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const scheduleData = getSchedulesByUser()
      if (scheduleData) {
        setSchedule(scheduleData);
        const farmData = getFarmById(scheduleData.farmId);
        setFarm(farmData);
        const related = getRelatedData('schedule', scheduleData.id);
        setRelatedData(related);
      } else {
        Alert.alert('Error', 'Schedule not found', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-600 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!schedule) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Ionicons name="alert-circle-outline" size={64} color="#6B7280" />
        <Text className="text-gray-600 text-lg mt-4">Schedule Not Found</Text>
        <TouchableOpacity
          className="mt-6 bg-blue-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
      case 'good': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
      case 'fair': return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
      case 'poor': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const farmHealthColors = farm ? getHealthStatusColor(farm.healthStatus) : { bg: '', text: '', border: '' };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="pb-4">
        <LinearGradient
          colors={['#F97316', '#EA580C']}
          className="rounded-3xl p-8 shadow-xl"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-white text-sm opacity-90">Schedule Details</Text>
              <Text className="text-white text-2xl font-bold">{schedule.title}</Text>
              <Text className="text-orange-100 text-sm mt-1">
                {schedule.scheduledDate.toLocaleDateString()} • {schedule.startTime}
              </Text>
            </View>
            <DrawerButton />
          </View>
        </LinearGradient>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-2">
          {/* Status and Priority */}
          <View className="flex-row items-center justify-between mb-6">
            <View className={`px-3 py-1 rounded-full border ${schedule.status === 'completed' ? 'bg-green-100 border-green-200' : schedule.status === 'scheduled' ? 'bg-blue-100 border-blue-200' : schedule.status === 'cancelled' ? 'bg-red-100 border-red-200' : 'bg-gray-100 border-gray-200'}`}>
              <Text className={`text-xs font-bold capitalize ${schedule.status === 'completed' ? 'text-green-600' : schedule.status === 'scheduled' ? 'text-blue-600' : schedule.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}`}>
                {schedule.status}
              </Text>
            </View>
            <View className={`px-3 py-1 rounded-full border ${schedule.priority === 'urgent' ? 'bg-red-100 border-red-200' : schedule.priority === 'high' ? 'bg-orange-100 border-orange-200' : schedule.priority === 'medium' ? 'bg-yellow-100 border-yellow-200' : 'bg-gray-100 border-gray-200'}`}>
              <Text className={`text-xs font-bold capitalize ${schedule.priority === 'urgent' ? 'text-red-600' : schedule.priority === 'high' ? 'text-orange-600' : schedule.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'}`}>
                {schedule.priority} priority
              </Text>
            </View>
          </View>

          {/* Description Card */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">Description</Text>
            <Text className="text-gray-600 leading-5">{schedule.description}</Text>
          </View>

          {/* Schedule Details */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Schedule Information</Text>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <Text className="text-gray-800 font-medium ml-3">Date</Text>
              </View>
              <Text className="text-gray-600 ml-7">{schedule.scheduledDate.toLocaleDateString()}</Text>
            </View>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text className="text-gray-800 font-medium ml-3">Time</Text>
              </View>
              <Text className="text-gray-600 ml-7">{schedule.startTime} - {schedule.endTime}</Text>
            </View>
            {schedule.notes && (
              <View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="document-text-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-800 font-medium ml-3">Notes</Text>
                </View>
                <Text className="text-gray-600 ml-7">{schedule.notes}</Text>
              </View>
            )}
          </View>

          {/* Farm Information */}
          {farm && (
            <TouchableOpacity 
              className="bg-white rounded-2xl p-5 shadow-sm mb-6"
              onPress={() => router.push(`/farm-detail/${farm.id}` as any)}
            >
              <Text className="text-lg font-bold text-gray-800 mb-4">Farm Information</Text>
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800">{farm.name}</Text>
                  <Text className="text-gray-600 text-sm">{farm.location.address}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{farm.size} hectares</Text>
                </View>
                <View className={`${farmHealthColors.bg} ${farmHealthColors.border} border px-3 py-1 rounded-full`}>
                  <Text className={`${farmHealthColors.text} text-xs font-bold capitalize`}>{farm.healthStatus}</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-gray-500 text-sm">Tap to view farm details</Text>
                <Ionicons name="chevron-forward-outline" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          )}

          {/* Veterinary Information */}
          {relatedData?.veterinary && (
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">Veterinary Information</Text>
              <View className="mb-3">
                <Text className="text-base font-semibold text-gray-800">{relatedData.veterinary.name}</Text>
                <Text className="text-gray-600 text-sm">{relatedData.veterinary.specialization}</Text>
                <Text className="text-gray-600 text-sm">{relatedData.veterinary.contact}</Text>
              </View>
              <TouchableOpacity
                className="flex-row items-center border border-blue-200 bg-blue-50 rounded-xl px-4 py-3 mt-3"
                onPress={() => router.push(`/communication/messages?recipientId=${relatedData.veterinary.id}` as any)}
              >
                <Ionicons name="chatbubble-outline" size={18} color="#3B82F6" />
                <Text className="text-blue-600 font-medium ml-2">Message Veterinary</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-4 mb-6">
            {schedule.status === 'scheduled' && (
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-xl px-5 py-4"
                onPress={() => {
                  Alert.alert('Cancel Schedule', 'Are you sure you want to cancel this schedule?', [
                    { text: 'No', style: 'cancel' },
                    { text: 'Yes, Cancel', onPress: () => {
                      // Logic to cancel schedule would go here
                      router.back();
                    }, style: 'destructive' }
                  ]);
                }}
              >
                <Text className="text-white font-semibold text-center">Cancel Schedule</Text>
              </TouchableOpacity>
            )}
            {schedule.status !== 'completed' && schedule.status !== 'cancelled' && (
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-xl px-5 py-4"
                onPress={() => {
                  // Logic to reschedule would go here
                  Alert.alert('Reschedule', 'Rescheduling functionality would be implemented here.');
                }}
              >
                <Text className="text-white font-semibold text-center">Reschedule</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}
