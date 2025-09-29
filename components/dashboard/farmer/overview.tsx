import { useFarms } from "@/contexts/FarmContext";
import { useSchedules } from "@/contexts/ScheduleContext";
import { ScheduleStatus } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function FarmerOverview() {
    const { farms, } = useFarms()
    const { schedules } = useSchedules()
    // Calculate statistics
    const totalChickens = farms.reduce((sum, farm) => sum + farm.livestock.total, 0);
    const healthyChickens = farms.reduce((sum, farm) => sum + farm.livestock.healthy, 0);
    const sickChickens = farms.reduce((sum, farm) => sum + farm.livestock.sick, 0);
    const atRiskChickens = farms.reduce((sum, farm) => sum + farm.livestock.atRisk, 0);
    const upcomingSchedules = schedules.filter(s =>
        s.status === ScheduleStatus.SCHEDULED && new Date(s.scheduledDate) >= new Date()
    );

    return (
        <View className="px-4 pb-40">
            {/* Statistics Cards */}
            <View className="flex-row flex-wrap gap-3 mb-6">
                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Ionicons name="leaf-outline" size={24} color="#10B981" />
                        <Text className="text-2xl font-bold text-gray-800">{farms.length}</Text>
                    </View>
                    <Text className="text-gray-600 font-medium">My Farms</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        {farms.reduce((sum, farm) => sum + farm.size, 0).toFixed(1)} hectares total
                    </Text>
                </View>

                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Ionicons name="analytics-outline" size={24} color="#3B82F6" />
                        <Text className="text-2xl font-bold text-gray-800">{totalChickens.toLocaleString()}</Text>
                    </View>
                    <Text className="text-gray-600 font-medium">Total Chickens</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        {((healthyChickens / totalChickens) * 100).toFixed(1)}% healthy
                    </Text>
                </View>

                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Ionicons name="calendar-outline" size={24} color="#F59E0B" />
                        <Text className="text-2xl font-bold text-gray-800">{upcomingSchedules.length}</Text>
                    </View>
                    <Text className="text-gray-600 font-medium">Upcoming Visits</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        Next: {upcomingSchedules[0]?.scheduledDate.toLocaleDateString() || 'None'}
                    </Text>
                </View>

                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Ionicons name="warning-outline" size={24} color="#EF4444" />
                        <Text className="text-2xl font-bold text-gray-800">{sickChickens + atRiskChickens}</Text>
                    </View>
                    <Text className="text-gray-600 font-medium">Need Attention</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        {sickChickens} sick, {atRiskChickens} at risk
                    </Text>
                </View>
            </View>

            {/* Health Overview Chart */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 ">
                <Text className="text-lg font-bold text-gray-800 mb-4">Flock Health Overview</Text>

                <View className="flex-row items-center justify-center mb-4">
                    <View className="relative w-32 h-32 rounded-full border-8 border-gray-200 items-center justify-center">
                        <View
                            className="absolute -top-2 -left-2 w-32 h-32 rounded-full border-8 border-green-500"
                            style={{
                                borderTopColor: 'transparent',
                                borderRightColor: 'transparent',
                                transform: [{ rotate: `${(healthyChickens / totalChickens) * 360}deg` }]
                            }}
                        />
                        <Text className="text-2xl font-bold text-gray-800">
                            {((healthyChickens / totalChickens) * 100).toFixed(0)}%
                        </Text>
                        <Text className="text-gray-600 text-sm">Healthy</Text>
                    </View>
                </View>

                <View className="flex-row justify-between">
                    <View className="items-center flex-1">
                        <View className="w-4 h-4 rounded-full bg-green-500 mb-1" />
                        <Text className="text-gray-800 font-semibold">{healthyChickens}</Text>
                        <Text className="text-gray-600 text-xs">Healthy</Text>
                    </View>
                    <View className="items-center flex-1">
                        <View className="w-4 h-4 rounded-full bg-yellow-500 mb-1" />
                        <Text className="text-gray-800 font-semibold">{atRiskChickens}</Text>
                        <Text className="text-gray-600 text-xs">At Risk</Text>
                    </View>
                    <View className="items-center flex-1">
                        <View className="w-4 h-4 rounded-full bg-red-500 mb-1" />
                        <Text className="text-gray-800 font-semibold">{sickChickens}</Text>
                        <Text className="text-gray-600 text-xs">Sick</Text>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
                <View className="flex-row flex-wrap gap-3">
                    <TouchableOpacity
                        className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[45%] items-center"
                        onPress={() => router.push('/farm/create')}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
                        <Text className="text-blue-500 font-semibold mt-2">Add Farm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 min-w-[45%] items-center"
                        onPress={() => router.push('/communication/schedule-request')}
                    >
                        <Ionicons name="calendar-outline" size={24} color="#10B981" />
                        <Text className="text-green-500 font-semibold mt-2">Request Visit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 min-w-[45%] items-center"
                        onPress={() => router.push('/communication/messages')}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color="#8B5CF6" />
                        <Text className="text-purple-500 font-semibold mt-2">Messages</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 bg-orange-50 border border-orange-200 rounded-xl p-4 min-w-[45%] items-center"
                        onPress={() => router.push('/farm/farm-reports')}
                    >
                        <Ionicons name="document-text-outline" size={24} color="#F59E0B" />
                        <Text className="text-orange-500 font-semibold mt-2">Reports</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Recent Activity */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-">
                <Text className="text-lg font-bold text-gray-800 mb-4">Recent Activity</Text>
                {schedules.slice(0, 3).map((schedule) => {
                    // For now, we'll show the first farm or a default message
                    const farm = farms[0];

                    return (
                        <View key={schedule.id} className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
                            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                                <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium text-gray-800">{schedule.title}</Text>
                                <Text className="text-sm text-gray-600">{farm?.name}</Text>
                                <Text className="text-xs text-gray-500">
                                    {schedule.scheduledDate.toLocaleDateString()}
                                </Text>
                            </View>
                            <View className={`px-2 py-1 rounded-full ${schedule.status === 'completed' ? 'bg-green-100' : schedule.status === 'scheduled' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <Text className={`text-xs font-medium capitalize ${schedule.status === 'completed' ? 'text-green-600' : schedule.status === 'scheduled' ? 'text-blue-600' : 'text-gray-600'}`}>
                                    {schedule.status}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    )
}