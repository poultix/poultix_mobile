import { View, Text } from "react-native";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useUsers } from '@/contexts/UserContext';
import { useFarms } from '@/contexts/FarmContext';
import { useSchedules } from '@/contexts/ScheduleContext';

export default function AdminOverview() {
    const { users } = useUsers();
    const { farms } = useFarms();
    const { schedules } = useSchedules();

    return (
        <View style={tw`px-4`}>
            {/* Statistics Cards */}
            <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
                <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                        <Ionicons name="people-outline" size={24} color="#3B82F6" />
                        <Text style={tw`text-2xl font-bold text-gray-800`}>{users.length}</Text>
                    </View>
                    <Text style={tw`text-gray-600 font-medium`}>Total Users</Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        {users.filter(u => u.role === 'FARMER').length} Farmers, {users.filter(u => u.role === 'VETERINARY').length} Vets
                    </Text>
                </View>

                <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                        <Ionicons name="leaf-outline" size={24} color="#10B981" />
                        <Text style={tw`text-2xl font-bold text-gray-800`}>{farms.length}</Text>
                    </View>
                    <Text style={tw`text-gray-600 font-medium`}>Active Farms</Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        {farms.reduce((sum, farm) => sum + farm.livestock.total, 0).toLocaleString()} Total Chickens
                    </Text>
                </View>

                <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                        <Ionicons name="calendar-outline" size={24} color="#F59E0B" />
                        <Text style={tw`text-2xl font-bold text-gray-800`}>{schedules.length}</Text>
                    </View>
                    <Text style={tw`text-gray-600 font-medium`}>Schedules</Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        {schedules.filter(s => s.status === 'SCHEDULED').length} Pending
                    </Text>
                </View>

                <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                        <Ionicons name="medical-outline" size={24} color="#EF4444" />
                        <Text style={tw`text-2xl font-bold text-gray-800`}>{users.filter(u => u.role === 'VETERINARY').length}</Text>
                    </View>
                    <Text style={tw`text-gray-600 font-medium`}>Veterinaries</Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        {users.filter(u => u.role === 'VETERINARY' && u.isActive).length} Active
                    </Text>
                </View>
            </View>

            {/* Recent Activity */}
            <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Recent Activity</Text>
                {schedules.slice(0, 5).map((schedule) => {
                    // For now, we'll show the first farm or a default message
                    const farm = farms[0];
                    const farmer = schedule.farmer;

                    return (
                        <View key={schedule.id} style={tw`flex-row items-center py-3 border-b border-gray-100 last:border-b-0`}>
                            <View style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3`}>
                                <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-medium text-gray-800`}>{schedule.title}</Text>
                                <Text style={tw`text-sm text-gray-600`}>
                                    {farm?.name} • {farmer?.name}
                                </Text>
                                <Text style={tw`text-xs text-gray-500`}>
                                    {new Date(schedule.scheduledDate).toLocaleDateString()}
                                </Text>
                            </View>
                            <View style={[
                                tw`px-2 py-1 rounded-full`,
                                schedule.status === 'COMPLETED' ? tw`bg-green-100` :
                                    schedule.status === 'SCHEDULED' ? tw`bg-blue-100` : tw`bg-gray-100`
                            ]}>
                                <Text style={[
                                    tw`text-xs font-medium capitalize`,
                                    schedule.status === 'COMPLETED' ? tw`text-green-600` :
                                        schedule.status === 'SCHEDULED' ? tw`text-blue-600` : tw`text-gray-600`
                                ]}>
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