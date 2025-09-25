import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useSchedules } from '@/hooks/useCrud';
import { useDataRelationships } from '@/hooks/useCrud';
import DrawerButton from '@/components/DrawerButton';

export default function HistoryScreen() {
  const { state } = useApp();
  const { getSchedulesByUser } = useSchedules();
  const { getRelatedData } = useDataRelationships();
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!state.currentUser) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600`}>Please log in to view history</Text>
      </SafeAreaView>
    );
  }

  const userSchedules = getSchedulesByUser(state.currentUser.id);
  
  const filteredSchedules = selectedFilter === 'all' 
    ? userSchedules 
    : userSchedules.filter(schedule => schedule.status === selectedFilter);

  const sortedSchedules = filteredSchedules.sort((a, b) => 
    new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  );

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
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw` pb-4`}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={tw` p-8 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <TouchableOpacity
                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>
              
              <Text style={tw`text-white text-xl font-bold`}>Activity History</Text>
              
              <DrawerButton />
            </View>

            <View style={tw`items-center`}>
              <Text style={tw`text-purple-100 text-base`}>
                Your complete activity timeline
              </Text>
              <Text style={tw`text-white text-2xl font-bold mt-2`}>
                {sortedSchedules.length} Activities
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Filter Tabs */}
        <View style={tw`px-4 mb-4`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={tw`flex-row gap-2`}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    tw`px-4 py-2 rounded-full border`,
                    selectedFilter === option.key
                      ? tw`bg-purple-500 border-purple-500`
                      : tw`bg-white border-gray-200`
                  ]}
                  onPress={() => setSelectedFilter(option.key)}
                >
                  <Text style={[
                    tw`font-medium`,
                    selectedFilter === option.key ? tw`text-white` : tw`text-gray-600`
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* History List */}
        <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
          {sortedSchedules.length === 0 ? (
            <View style={tw`bg-white rounded-2xl p-8 items-center shadow-sm`}>
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text style={tw`text-gray-500 font-medium mt-4 text-center`}>
                No {selectedFilter === 'all' ? '' : selectedFilter} activities found
              </Text>
              <Text style={tw`text-gray-400 text-sm text-center mt-2`}>
                Your activity history will appear here
              </Text>
            </View>
          ) : (
            sortedSchedules.map((schedule, index) => {
              const relatedData = getRelatedData('schedule', schedule.id);
              const statusColors = getStatusColor(schedule.status);
              
              return (
                <View key={schedule.id} style={tw`mb-4`}>
                  <TouchableOpacity
                    style={tw`bg-white rounded-2xl p-5 shadow-sm`}
                    onPress={() => router.push(`/schedule-detail/${schedule.id}` as any)}
                  >
                    <View style={tw`flex-row items-start justify-between mb-3`}>
                      <View style={tw`flex-1`}>
                        <View style={tw`flex-row items-center mb-2`}>
                          <View style={tw`w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3`}>
                            <Ionicons name={getTypeIcon(schedule.type)} size={20} color="#8B5CF6" />
                          </View>
                          <View style={tw`flex-1`}>
                            <Text style={tw`font-bold text-gray-800`}>{schedule.title}</Text>
                            <Text style={tw`text-gray-600 text-sm`}>{schedule.description}</Text>
                          </View>
                        </View>
                        
                        <View style={tw`ml-13`}>
                          <Text style={tw`text-gray-500 text-sm mb-1`}>
                            📅 {schedule.scheduledDate.toLocaleDateString()} • {schedule.startTime}-{schedule.endTime}
                          </Text>
                          
                          {relatedData?.farm && (
                            <Text style={tw`text-gray-500 text-sm mb-1`}>
                              🏡 {relatedData.farm.name}
                            </Text>
                          )}
                          
                          {state.currentUser.role === 'farmer' && relatedData?.veterinary && (
                            <Text style={tw`text-gray-500 text-sm mb-1`}>
                              👨‍⚕️ {relatedData.veterinary.name}
                            </Text>
                          )}
                          
                          {state.currentUser.role === 'veterinary' && relatedData?.farmer && (
                            <Text style={tw`text-gray-500 text-sm mb-1`}>
                              👨‍🌾 {relatedData.farmer.name}
                            </Text>
                          )}
                        </View>
                      </View>
                      
                      <View style={tw`${statusColors.bg} ${statusColors.border} border px-3 py-1 rounded-full`}>
                        <Text style={tw`${statusColors.text} text-xs font-bold capitalize`}>
                          {schedule.status.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>

                    {/* Results for completed schedules */}
                    {schedule.results && schedule.status === 'completed' && (
                      <View style={tw`bg-gray-50 rounded-xl p-4 mt-3`}>
                        <Text style={tw`font-semibold text-gray-800 mb-2`}>Results</Text>
                        <Text style={tw`text-gray-600 text-sm mb-2`}>
                          {schedule.results.findings}
                        </Text>
                        {schedule.results.recommendations && schedule.results.recommendations.length > 0 && (
                          <View>
                            <Text style={tw`font-medium text-gray-700 text-sm mb-1`}>Recommendations:</Text>
                            {schedule.results.recommendations.slice(0, 2).map((rec, idx) => (
                              <Text key={idx} style={tw`text-gray-600 text-sm`}>
                                • {rec}
                              </Text>
                            ))}
                            {schedule.results.recommendations.length > 2 && (
                              <Text style={tw`text-purple-600 text-sm mt-1`}>
                                +{schedule.results.recommendations.length - 2} more
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    )}

                    {/* Priority indicator */}
                    <View style={tw`flex-row items-center justify-between mt-3`}>
                      <View style={[
                        tw`px-2 py-1 rounded-full`,
                        schedule.priority === 'urgent' ? tw`bg-red-100` :
                        schedule.priority === 'high' ? tw`bg-orange-100` :
                        schedule.priority === 'medium' ? tw`bg-yellow-100` : tw`bg-gray-100`
                      ]}>
                        <Text style={[
                          tw`text-xs font-bold capitalize`,
                          schedule.priority === 'urgent' ? tw`text-red-600` :
                          schedule.priority === 'high' ? tw`text-orange-600` :
                          schedule.priority === 'medium' ? tw`text-yellow-600` : tw`text-gray-600`
                        ]}>
                          {schedule.priority} priority
                        </Text>
                      </View>
                      
                      <Text style={tw`text-gray-400 text-xs`}>
                        {schedule.type.replace('_', ' ')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
          
          <View style={tw`h-6`} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
