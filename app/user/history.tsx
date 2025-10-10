import DrawerButton from '@/components/DrawerButton';
import { useAuth } from '@/contexts/AuthContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function HistoryScreen() {
  const { currentUser } = useAuth();
  const { schedules ,setCurrentSchedule} = useSchedules();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { 
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return { primary: '#7C3AED', secondary: '#6D28D9', light: '#EDE9FE', text: '#7C3AED' };
      case 'FARMER': return { primary: '#F59E0B', secondary: '#D97706', light: '#FEF3C7', text: '#F59E0B' };
      case 'VETERINARY': return { primary: '#10B981', secondary: '#059669', light: '#D1FAE5', text: '#10B981' };
      default: return { primary: '#3B82F6', secondary: '#2563EB', light: '#DBEAFE', text: '#3B82F6' };
    }
  };

  if (!currentUser) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Ionicons name="time-outline" size={64} color="#D1D5DB" />
        <Text className="text-gray-600 text-lg mt-4">Please log in to view history</Text>
      </View>
    );
  }

  const roleColors = getRoleColor(currentUser.role);

  // Filter schedules for current user
  const userSchedules = schedules.filter(schedule =>
    schedule.farmer.id === currentUser.id || schedule.veterinary.id === currentUser.id
  );

  const filteredSchedules = selectedFilter === 'all'
    ? userSchedules
    : userSchedules.filter(schedule => schedule.status === selectedFilter);

  const sortedSchedules = filteredSchedules.sort((a, b) =>
    new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
      case 'scheduled': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
      case 'in_progress': return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return 'search-outline';
      case 'vaccination': return 'medical-outline';
      case 'treatment': return 'bandage-outline';
      case 'consultation': return 'chatbubble-outline';
      case 'emergency': return 'warning-outline';
      case 'routine_checkup': return 'checkmark-circle-outline';
      default: return 'calendar-outline';
    }
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
        {/* Header */}
        <View
          className="px-6 py-12 shadow-lg"
          style={{
            backgroundColor: roleColors.primary,
            backgroundImage: `linear-gradient(135deg, ${roleColors.primary} 0%, ${roleColors.secondary} 100%)`
          }}
        >
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              className="bg-white/20 p-3 rounded-2xl"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-xl font-bold">Activity History</Text>

            <DrawerButton />
          </View>

          <View className="items-center">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4 border-4 border-white/30">
              <Ionicons name="time-outline" size={32} color="white" />
            </View>
            <Text className="text-white/80 text-base text-center">
              Your complete activity timeline
            </Text>
            <Text className="text-white text-2xl font-bold mt-2">
              {sortedSchedules.length} {sortedSchedules.length === 1 ? 'Activity' : 'Activities'}
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="px-4 mb-4 -mt-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}
            contentContainerClassName='pt-10'>
            <View className="flex-row gap-3">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  className={`px-4 py-3 rounded-xl border-2 min-w-20 items-center ${selectedFilter === option.key
                      ? 'border-transparent shadow-sm'
                      : 'border-gray-200 bg-white'
                    }`}
                  style={{
                    backgroundColor: selectedFilter === option.key ? roleColors.primary : '#FFFFFF',
                    shadowColor: selectedFilter === option.key ? roleColors.secondary : 'transparent',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: selectedFilter === option.key ? 0.3 : 0,
                    shadowRadius: 4,
                    elevation: selectedFilter === option.key ? 4 : 0,
                  }}
                  onPress={() => setSelectedFilter(option.key)}
                >
                  <Text className={`font-semibold text-sm ${selectedFilter === option.key ? 'text-white' : 'text-gray-600'
                    }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* History List */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {sortedSchedules.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: roleColors.light }}
              >
                <Ionicons name="time-outline" size={32} color={roleColors.primary} />
              </View>
              <Text className="text-gray-500 font-semibold mt-2 text-center text-lg">
                No {selectedFilter === 'all' ? '' : selectedFilter} activities found
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2">
                Your activity history will appear here
              </Text>
            </View>
          ) : (
            sortedSchedules.map((schedule, index) => {
              const statusColors = getStatusColor(schedule.status);

              return (
                <View key={schedule.id} className="mb-4">
                  <TouchableOpacity
                    className="bg-white rounded-2xl p-5 shadow-sm border-l-4"
                    style={{ borderLeftColor: roleColors.primary }}
                    onPress={() => {
                      setCurrentSchedule(schedule)
                      router.push(`/schedule/schedule-detail`)
                    }}
                  >
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          <View
                            className="w-12 h-12 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: roleColors.light }}
                          >
                            <Ionicons name={getTypeIcon(schedule.type) as any} size={20} color={roleColors.primary} />
                          </View>
                          <View className="flex-1">
                            <Text className="font-bold text-gray-800 text-base">{schedule.title}</Text>
                            <Text className="text-gray-600 text-sm">{schedule.description}</Text>
                          </View>
                        </View>

                        <View className="ml-15">
                          <View className="flex-row items-center mb-2">
                            <Ionicons name="calendar-outline" size={16} color={roleColors.primary} />
                            <Text className="text-gray-600 text-sm ml-2 font-medium">
                              {formatDate(schedule.scheduledDate)}
                            </Text>
                          </View>

                          {currentUser.role === 'FARMER' && (
                            <View className="flex-row items-center mb-1">
                              <Ionicons name="medical-outline" size={16} color="#10B981" />
                              <Text className="text-gray-500 text-sm ml-2">
                                Dr. {schedule.veterinary.name}
                              </Text>
                            </View>
                          )}

                          {currentUser.role === 'VETERINARY' && (
                            <View className="flex-row items-center mb-1">
                              <Ionicons name="leaf-outline" size={16} color="#F59E0B" />
                              <Text className="text-gray-500 text-sm ml-2">
                                {schedule.farmer.name}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View className={`${statusColors.bg} ${statusColors.border} border px-3 py-1 rounded-full`}>
                        <Text className={`${statusColors.text} text-xs font-bold capitalize`}>
                          {schedule.status.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>


                    {/* Priority indicator */}
                    <View className="flex-row items-center justify-between mt-4">
                      <View
                        className="px-3 py-2 rounded-full flex-row items-center"
                        style={{
                          backgroundColor:
                            schedule.priority === 'URGENT' ? '#FEE2E2' :
                              schedule.priority === 'HIGH' ? '#FED7AA' :
                                schedule.priority === 'MEDIUM' ? '#FEF3C7' : '#F3F4F6'
                        }}
                      >
                        <Ionicons
                          name={schedule.priority === 'URGENT' ? 'warning' : schedule.priority === 'HIGH' ? 'alert-circle' : 'information-circle'}
                          size={12}
                          color={
                            schedule.priority === 'URGENT' ? '#DC2626' :
                              schedule.priority === 'HIGH' ? '#EA580C' :
                                schedule.priority === 'MEDIUM' ? '#D97706' : '#6B7280'
                          }
                        />
                        <Text
                          className="text-xs font-bold capitalize ml-1"
                          style={{
                            color:
                              schedule.priority === 'URGENT' ? '#DC2626' :
                                schedule.priority === 'HIGH' ? '#EA580C' :
                                  schedule.priority === 'MEDIUM' ? '#D97706' : '#6B7280'
                          }}
                        >
                          {schedule.priority.toLowerCase()}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Ionicons name="pricetag-outline" size={12} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs ml-1 capitalize">
                          {schedule.type.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          )}

          <View className="h-6" />
        </ScrollView>
      </Animated.View>
    </View>
  );
}
