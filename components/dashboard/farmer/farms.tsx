import { useFarms } from "@/contexts/FarmContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function FarmsDashboard() {
    const { farms, setCurrentFarm } = useFarms()

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
        <View className="px-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">My Farms</Text>
                <TouchableOpacity
                    className="bg-green-500 px-4 py-2 rounded-xl flex-row items-center"
                    onPress={() => router.push('/farm/create')}
                >
                    <Ionicons name="add-outline" size={16} color="white" />
                    <Text className="text-white font-semibold ml-1">Add Farm</Text>
                </TouchableOpacity>
            </View>

            {farms.map((farm) => {
                const healthColors = getHealthStatusColor(farm.healthStatus);

                return (
                    <TouchableOpacity
                        key={farm.id}
                        className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
                        onPress={() => { setCurrentFarm(farm); router.push('/farm/farm-detail') }}
                    >
                        <View className="flex-row items-start justify-between mb-3">
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-gray-800">{farm.name}</Text>
                                <Text className="text-gray-600">{farm.location.address}</Text>
                                <Text className="text-sm text-gray-500">
                                    {farm.size} hectares • Est. {farm.establishedDate.getFullYear()}
                                </Text>
                            </View>
                            <View className={`${healthColors.bg} ${healthColors.border} border px-3 py-1 rounded-full`}>
                                <Text className={`${healthColors.text} text-xs font-bold capitalize`}>
                                    {farm.healthStatus}
                                </Text>
                            </View>
                        </View>

                        <View className="bg-gray-50 rounded-xl p-4 mb-3">
                            <Text className="font-semibold text-gray-800 mb-2">Livestock Overview</Text>
                            <View className="flex-row justify-between">
                                <View className="items-center flex-1">
                                    <Text className="text-xl font-bold text-gray-800">{farm.livestock.total}</Text>
                                    <Text className="text-gray-600 text-xs">Total</Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Text className="text-xl font-bold text-green-600">{farm.livestock.healthy}</Text>
                                    <Text className="text-gray-600 text-xs">Healthy</Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Text className="text-xl font-bold text-yellow-600">{farm.livestock.atRisk}</Text>
                                    <Text className="text-gray-600 text-xs">At Risk</Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Text className="text-xl font-bold text-red-600">{farm.livestock.sick}</Text>
                                    <Text className="text-gray-600 text-xs">Sick</Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <Text className="text-gray-500 text-sm">
                                Last inspection: {farm.lastInspection?.toLocaleDateString() || 'Never'}
                            </Text>
                            <Ionicons name="chevron-forward-outline" size={16} color="#9CA3AF" />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}