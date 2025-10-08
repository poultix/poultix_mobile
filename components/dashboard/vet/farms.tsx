import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useFarms } from "@/contexts/FarmContext";


export default function VetDashboardFarms() {
    const { currentUser } = useAuth();
    const { farms } = useFarms();
    const assignedFarms = farms.filter(farm => farm.assignedVeterinary?.id === currentUser?.id);
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
            <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>Assigned Farms</Text>
                <TouchableOpacity
                    style={tw`bg-green-500 px-4 py-2 rounded-xl flex-row items-center`}
                    onPress={() => router.push('/farm')}
                >
                    <Ionicons name="map-outline" size={16} color="white" />
                    <Text style={tw`text-white font-semibold ml-1`}>View Map</Text>
                </TouchableOpacity>
            </View>

            {assignedFarms.length === 0 ? (
                <View style={tw`items-center py-12 px-6`}>
                    <View style={tw`bg-amber-100 p-6 rounded-full mb-6`}>
                        <Ionicons name="leaf-outline" size={64} color="#D97706" />
                    </View>
                    <Text style={tw`text-xl font-bold text-gray-800 mb-3 text-center`}>No Farms Assigned</Text>
                    <Text style={tw`text-gray-600 text-center mb-6 leading-6`}>
                        You don&apos;t have any farms assigned to your veterinary care yet.{'\n'}
                        Contact your administrator to get farm assignments.
                    </Text>
                    <TouchableOpacity
                        style={tw`bg-amber-600 px-8 py-3 rounded-xl flex-row items-center shadow-lg`}
                        onPress={() => router.push('/farm')}
                    >
                        <Ionicons name="map-outline" size={20} color="white" />
                        <Text style={tw`text-white font-semibold ml-2`}>Explore Available Farms</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                assignedFarms.map((farm) => {
                    const healthColors = getHealthStatusColor(farm.healthStatus);
                    const owner = farm.owner;

                    return (
                    <TouchableOpacity
                        key={farm.id}
                        style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}
                        onPress={() => router.push('/farm/farm-detail')}
                    >
                        <View style={tw`flex-row items-start justify-between mb-3`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-lg font-bold text-gray-800`}>{farm.name}</Text>
                                <Text style={tw`text-gray-600`}>{owner?.name}</Text>
                                <Text style={tw`text-sm text-gray-500`}>
                                    {farm.location.latitude}, {farm.location.longitude} • {farm.size} hectares
                                </Text>
                            </View>
                            <View style={tw`${healthColors.bg} ${healthColors.border} border px-3 py-1 rounded-full`}>
                                <Text style={tw`${healthColors.text} text-xs font-bold capitalize`}>
                                    {farm.healthStatus}
                                </Text>
                            </View>
                        </View>

                        <View style={tw`bg-gray-50 rounded-xl p-4 mb-3`}>
                            <Text style={tw`font-semibold text-gray-800 mb-2`}>Livestock Status</Text>
                            <View style={tw`flex-row justify-between`}>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-xl font-bold text-gray-800`}>{farm.livestock.total}</Text>
                                    <Text style={tw`text-gray-600 text-xs`}>Total</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-xl font-bold text-green-600`}>{farm.livestock.healthy}</Text>
                                    <Text style={tw`text-gray-600 text-xs`}>Healthy</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-xl font-bold text-yellow-600`}>{farm.livestock.atRisk}</Text>
                                    <Text style={tw`text-gray-600 text-xs`}>At Risk</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-xl font-bold text-red-600`}>{farm.livestock.sick}</Text>
                                    <Text style={tw`text-gray-600 text-xs`}>Sick</Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="call-outline" size={16} color="#6B7280" />
                                <Text style={tw`text-gray-500 text-sm ml-1`}>{owner?.email}</Text>
                            </View>
                            <Text style={tw`text-gray-500 text-sm`}>
                                Last visit: {farm.lastInspection ? new Date(farm.lastInspection).toLocaleDateString() : 'Never'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    );
                })
            )}
        </View>
    );
}