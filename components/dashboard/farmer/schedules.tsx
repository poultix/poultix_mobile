import { useFarms } from "@/contexts/FarmContext";
import { useSchedules } from "@/contexts/ScheduleContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function FarmerSchedulesDashboard() {
    const { schedules, setCurrentSchedule } = useSchedules()
    const { farms } = useFarms()
    return (
        <View className="px-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">My Schedules</Text>
                <TouchableOpacity
                    className="bg-amber-500 px-4 py-2 rounded-xl flex-row items-center"
                    onPress={() => router.push('/communication/schedule-request')}
                >
                    <Ionicons name="add-outline" size={16} color="white" />
                    <Text className="text-white font-semibold ml-1">Request Visit</Text>
                </TouchableOpacity>
            </View>

            {schedules.length > 0 ? (
                schedules.map((schedule) => {
                    // For now, we'll show the first farm or a default message
                    const farm = farms[0];

                    return (
                        <TouchableOpacity
                            key={schedule.id}
                            className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
                            onPress={() => { setCurrentSchedule(schedule); router.push(`/communication/schedule-detail`) }}
                        >
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-800">{schedule.title}</Text>
                                    <Text className="text-gray-600">{schedule.description}</Text>
                                    <Text className="text-sm text-gray-500">
                                        {farm?.name} • {schedule.veterinary?.name}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1 rounded-full border ${schedule.status === 'COMPLETED' ? 'bg-green-100 border-green-200' : schedule.status === 'SCHEDULED' ? 'bg-blue-100 border-blue-200' : schedule.status === 'CANCELLED' ? 'bg-red-100 border-red-200' : 'bg-gray-100 border-gray-200'}`}>
                                    <Text className={`text-xs font-bold capitalize ${schedule.status === 'COMPLETED' ? 'text-green-600' : schedule.status === 'SCHEDULED' ? 'text-blue-600' : schedule.status === 'CANCELLED' ? 'text-red-600' : 'text-gray-600'}`}>
                                        {schedule.status}
                                    </Text>
                                </View>
                            </View>

                            <View className="bg-gray-50 rounded-xl p-4 mb-3">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                        <Text className="text-gray-600 ml-2">
                                            {new Date(schedule.scheduledDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {schedule.description && (
                                <Text className="text-gray-600 text-sm mb-3">
                                    Note: {schedule.description}
                                </Text>
                            )}


                            <View className="flex-row items-center justify-between">
                                <View className={`px-2 py-1 rounded-full ${schedule.priority === 'URGENT' ? 'bg-red-100' : schedule.priority === 'HIGH' ? 'bg-orange-100' : schedule.priority === 'MEDIUM' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                                    <Text className={`text-xs font-bold capitalize ${schedule.priority === 'URGENT' ? 'text-red-600' : schedule.priority === 'HIGH' ? 'text-orange-600' : schedule.priority === 'MEDIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                                        {schedule.priority} priority
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward-outline" size={16} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <View className="flex-1 items-center justify-center py-16">
                    <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
                    <Text className="text-xl font-bold text-gray-800 mt-4">No Schedules Yet</Text>
                    <Text className="text-gray-600 text-center mt-2 px-8">
                        Schedule veterinary visits for your farms to maintain poultry health and prevent diseases. Regular check-ups keep your flock healthy and productive.
                    </Text>
                    <TouchableOpacity
                        className="bg-blue-500 px-8 py-4 rounded-xl mt-6 flex-row items-center"
                        onPress={() => router.push('/communication/schedule-request')}
                    >
                        <Ionicons name="add-outline" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">Request Your First Visit</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}