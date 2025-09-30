import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { useAuth } from "@/contexts/AuthContext";
import { useFarms } from "@/contexts/FarmContext";
import { useSchedules } from "@/contexts/ScheduleContext";
import { router } from "expo-router";
import { useState } from "react";

export default function VetOverview() {
    const { currentUser } = useAuth();
    const { farms } = useFarms();
    const { schedules } = useSchedules();
    const [selectedTab, setSelectedTab] = useState<'overview' | 'farms' | 'schedules'>('overview');


    const assignedFarms = farms.filter(farm => farm.assignedVeterinary?.id === currentUser?.id);
    const mySchedules = schedules.filter(schedule => schedule.veterinary.id === currentUser?.id);

    // Calculate statistics
    const totalFarms = assignedFarms.length;
    const totalAnimals = assignedFarms.reduce((sum, farm) => sum + farm.livestock.total, 0);
    const healthyFarms = assignedFarms.filter(farm => farm.healthStatus === 'EXCELLENT' || farm.healthStatus === 'GOOD').length;
    const farmsNeedingAttention = assignedFarms.filter(farm => farm.healthStatus === 'FAIR' || farm.healthStatus === 'POOR').length;
    const todaySchedules = mySchedules.filter(s => {
        const today = new Date();
        const scheduleDate = new Date(s.scheduledDate);
        return scheduleDate.toDateString() === today.toDateString();
    });
    const upcomingSchedules = mySchedules.filter(s =>
        s.status === 'scheduled' && new Date(s.scheduledDate) >= new Date()
    );

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
            case 'good': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
            case 'fair': return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
            case 'poor': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
        }
    };
    return (
        <View style={tw`px-4`}>
            {/* Statistics Cards */}
            <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
                <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                        <Ionicons name="leaf-outline" size={24} color="#10B981" />
                        <Text style={tw`text-2xl font-bold text-gray-800`}>{totalFarms}</Text>
                    </View>
                    <Text style={tw`text-gray-600 font-medium`}>Assigned Farms</Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        {healthyFarms} healthy, {farmsNeedingAttention} need attention
                    </Text>
                </View>

                <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                        <Ionicons name="analytics-outline" size={24} color="#3B82F6" />
                        <Text style={tw`text-2xl font-bold text-gray-800`}>{totalAnimals.toLocaleString()}</Text>
                    </View>
                    <Text style={tw`text-gray-600 font-medium`}>Animals Under Care</Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        Across {totalFarms} farms
                    </Text>
                </View>

                <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                        <Ionicons name="calendar-outline" size={24} color="#F59E0B" />
                        <Text style={tw`text-2xl font-bold text-gray-800`}>{todaySchedules.length}</Text>
                    </View>
                    <Text style={tw`text-gray-600 font-medium`}>Today's Visits</Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        {upcomingSchedules.length} upcoming total
                    </Text>
                </View>

                <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                        <Ionicons name="star-outline" size={24} color="#8B5CF6" />
                        <Text style={tw`text-2xl font-bold text-gray-800`}>4.8</Text>
                    </View>
                    <Text style={tw`text-gray-600 font-medium`}>Rating</Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        {mySchedules.filter(s => s.status === 'completed').length} total visits
                    </Text>
                </View>
            </View>

            {/* Today's Schedule */}
            <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-6`}>
                <View style={tw`flex-row justify-between items-center mb-4`}>
                    <Text style={tw`text-lg font-bold text-gray-800`}>Today's Schedule</Text>
                    <TouchableOpacity onPress={() => setSelectedTab('schedules')}>
                        <Text style={tw`text-red-600 font-semibold`}>View All</Text>
                    </TouchableOpacity>
                </View>

                {todaySchedules.length === 0 ? (
                    <View style={tw`items-center py-8`}>
                        <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
                        <Text style={tw`text-gray-500 font-medium mt-2`}>No visits scheduled today</Text>
                        <Text style={tw`text-gray-400 text-sm`}>Enjoy your free day!</Text>
                    </View>
                ) : (
                    todaySchedules.map((schedule) => {
                        // For now, we'll show the first farm or a default message
                        const farm = assignedFarms[0];

                        return (
                            <TouchableOpacity
                                key={schedule.id}
                                style={tw`bg-red-50 border border-red-100 rounded-xl p-4 mb-3 last:mb-0`}
                                onPress={() => router.push('/communication/schedule-detail')}
                            >
                                <View style={tw`flex-row items-start justify-between mb-2`}>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`font-bold text-gray-800`}>{schedule.title}</Text>
                                        <Text style={tw`text-gray-600 text-sm`}>{farm?.name}</Text>
                                        <Text style={tw`text-gray-500 text-xs`}>{schedule.farmer?.name}</Text>
                                    </View>
                                    <Text style={tw`text-red-600 font-semibold`}>
                                        {schedule.startTime} - {schedule.endTime}
                                    </Text>
                                </View>

                                <View style={tw`flex-row items-center justify-between`}>
                                    <View style={tw`flex-row items-center`}>
                                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                                        <Text style={tw`text-gray-500 text-xs ml-1`}>{farm?.location.address}</Text>
                                    </View>
                                    <View style={[
                                        tw`px-2 py-1 rounded-full`,
                                        schedule.priority === 'urgent' ? tw`bg-red-100` :
                                            schedule.priority === 'high' ? tw`bg-orange-100` : tw`bg-yellow-100`
                                    ]}>
                                        <Text style={[
                                            tw`text-xs font-bold capitalize`,
                                            schedule.priority === 'urgent' ? tw`text-red-600` :
                                                schedule.priority === 'high' ? tw`text-orange-600` : tw`text-yellow-600`
                                        ]}>
                                            {schedule.priority}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </View>

            {/* Quick Actions */}
            <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-6`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Quick Actions</Text>
                <View style={tw`flex-row flex-wrap gap-3`}>
                    <TouchableOpacity
                        style={tw`flex-1 bg-red-50 border border-red-200 rounded-xl p-4 min-w-[45%]`}
                        onPress={() => router.push('/communication/schedule-management')}
                    >
                        <Ionicons name="calendar-outline" size={24} color="#EF4444" />
                        <Text style={tw`text-red-600 font-semibold mt-2`}>Manage Schedules</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={tw`flex-1 bg-green-50 border border-green-200 rounded-xl p-4 min-w-[45%]`}
                        onPress={() => router.push('/farm/nearby-farms')}
                    >
                        <Ionicons name="leaf-outline" size={24} color="#10B981" />
                        <Text style={tw`text-green-600 font-semibold mt-2`}>View Farms</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={tw`flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[45%]`}
                        onPress={() => router.push('/communication/messages')}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color="#3B82F6" />
                        <Text style={tw`text-blue-600 font-semibold mt-2`}>Messages</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={tw`flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 min-w-[45%]`}
                        onPress={() => router.push('/veterinary/vet-reports')}
                    >
                        <Ionicons name="document-text-outline" size={24} color="#8B5CF6" />
                        <Text style={tw`text-purple-600 font-semibold mt-2`}>Reports</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Farm Health Overview */}
            <View style={tw`bg-white rounded-2xl p-5 shadow-sm`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Farm Health Overview</Text>

                <View style={tw`flex-row justify-between mb-4`}>
                    <View style={tw`items-center flex-1`}>
                        <Text style={tw`text-2xl font-bold text-green-600`}>{healthyFarms}</Text>
                        <Text style={tw`text-gray-600 text-sm`}>Healthy Farms</Text>
                    </View>
                    <View style={tw`items-center flex-1`}>
                        <Text style={tw`text-2xl font-bold text-yellow-600`}>{farmsNeedingAttention}</Text>
                        <Text style={tw`text-gray-600 text-sm`}>Need Attention</Text>
                    </View>
                    <View style={tw`items-center flex-1`}>
                        <Text style={tw`text-2xl font-bold text-blue-600`}>{((healthyFarms / totalFarms) * 100).toFixed(0)}%</Text>
                        <Text style={tw`text-gray-600 text-sm`}>Success Rate</Text>
                    </View>
                </View>

                {assignedFarms.slice(0, 3).map((farm) => {
                    const healthColors = getHealthStatusColor(farm.healthStatus);

                    return (
                        <View key={farm.id} style={tw`flex-row items-center py-3 border-b border-gray-100 last:border-b-0`}>
                            <View style={tw`w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3`}>
                                <Ionicons name="leaf-outline" size={16} color="#10B981" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-medium text-gray-800`}>{farm.name}</Text>
                                <Text style={tw`text-sm text-gray-600`}>{farm.location.address}</Text>
                                <Text style={tw`text-xs text-gray-500`}>
                                    {farm.livestock.total} chickens • Last visit: {farm.lastInspection?.toLocaleDateString() || 'Never'}
                                </Text>
                            </View>
                            <View style={tw`${healthColors.bg} ${healthColors.border} border px-2 py-1 rounded-full`}>
                                <Text style={tw`${healthColors.text} text-xs font-bold capitalize`}>
                                    {farm.healthStatus}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    )
}