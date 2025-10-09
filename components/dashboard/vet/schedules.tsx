import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import tw from "twrnc";
import { useSchedules } from "@/contexts/ScheduleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useFarms } from "@/contexts/FarmContext";

export default function VetDashSchedules() {
    const { schedules, setCurrentSchedule } = useSchedules();
    const { currentUser } = useAuth();
    const { farms } = useFarms();
    const assignedFarms = farms.filter(farm => farm.assignedVeterinary?.id === currentUser?.id);
    const mySchedules = schedules.filter(schedule => schedule.veterinary.id === currentUser?.id);

    return (
        <View style={tw`px-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>My Schedule</Text>
                <TouchableOpacity
                    style={tw`bg-red-500 px-4 py-2 rounded-xl flex-row items-center`}
                    onPress={() => router.push('/communication/schedule-management')}
                >
                    <Ionicons name="settings-outline" size={16} color="white" />
                    <Text style={tw`text-white font-semibold ml-1`}>Manage</Text>
                </TouchableOpacity>
            </View>

            {mySchedules.map((schedule) => {
                // For now, we'll show the first farm or a default message
                const farm = assignedFarms[0];
console.log(schedule)
                return (
                    <TouchableOpacity
                        key={schedule.id}
                        style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}
                        onPress={() => { setCurrentSchedule(schedule); router.push('/communication/schedule-detail') }}
                    >
                        <View style={tw`flex-row items-start justify-between mb-3`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-lg font-bold text-gray-800`}>{schedule.title}</Text>
                                <Text style={tw`text-gray-600`}>{schedule.description}</Text>
                                <Text style={tw`text-sm text-gray-500`}>
                                    {farm?.name} • {schedule.farmer?.name}
                                </Text>
                            </View>
                            <View style={[
                                tw`px-3 py-1 rounded-full border`,
                                schedule.status === 'COMPLETED' ? tw`bg-green-100 border-green-200` :
                                    schedule.status === 'SCHEDULED' ? tw`bg-blue-100 border-blue-200` :
                                        schedule.status === 'IN_PROGRESS' ? tw`bg-yellow-100 border-yellow-200` :
                                            schedule.status === 'CANCELLED' ? tw`bg-red-100 border-red-200` : tw`bg-gray-100 border-gray-200`
                            ]}>
                                <Text style={[
                                    tw`text-xs font-bold capitalize`,
                                    schedule.status === 'COMPLETED' ? tw`text-green-600` :
                                        schedule.status === 'SCHEDULED' ? tw`text-blue-600` :
                                            schedule.status === 'IN_PROGRESS' ? tw`text-yellow-600` :
                                                schedule.status === 'CANCELLED' ? tw`text-red-600` : tw`text-gray-600`
                                ]}>
                                    {schedule.status.replace('_', ' ')}
                                </Text>
                            </View>
                        </View>

                        <View style={tw`bg-gray-50 rounded-xl p-4 mb-3`}>
                            <View style={tw`flex-row items-center justify-between mb-2`}>
                                <View style={tw`flex-row items-center`}>
                                    <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                    <Text style={tw`text-gray-600 ml-2`}>
                                        {new Date(schedule.scheduledDate).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>

                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="location-outline" size={16} color="#6B7280" />
                                <Text style={tw`text-gray-600 ml-2`}>{farm?.location.latitude}, {farm?.location.longitude}</Text>
                            </View>
                        </View>

                        {schedule.description && (
                            <Text style={tw`text-gray-600 text-sm mb-3`}>
                                Note: {schedule.description}
                            </Text>
                        )}

                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={[
                                tw`px-2 py-1 rounded-full`,
                                schedule.priority === 'URGENT' ? tw`bg-red-100` :
                                    schedule.priority === 'HIGH' ? tw`bg-orange-100` :
                                        schedule.priority === 'MEDIUM' ? tw`bg-yellow-100` : tw`bg-gray-100`
                            ]}>
                                <Text style={[
                                    tw`text-xs font-bold capitalize`,
                                    schedule.priority === 'URGENT' ? tw`text-red-600` :
                                        schedule.priority === 'HIGH' ? tw`text-orange-600` :
                                            schedule.priority === 'MEDIUM' ? tw`text-yellow-600` : tw`text-gray-600`
                                ]}>
                                    {schedule.priority} priority
                                </Text>
                            </View>

                            {schedule.status === 'SCHEDULED' && (
                                <TouchableOpacity
                                    style={tw`bg-blue-500 px-3 py-1 rounded-full`}
                                    onPress={() => {
                                        // Start visit functionality
                                        Alert.alert('Start Visit', 'Mark this visit as in progress?', [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Start', onPress: () => {
                                                    // Update schedule status to in_progress
                                                }
                                            }
                                        ]);
                                    }}
                                >
                                    <Text style={tw`text-white text-xs font-bold`}>Start Visit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}