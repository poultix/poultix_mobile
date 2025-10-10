import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function PharmacyOverview() {
    // Mock data for demonstration
    const totalMedicines = 150;
    const lowStockItems = 12;
    const pendingOrders = 8;
    const monthlyRevenue = 12500;

    return (
        <View className="px-4">
            {/* Statistics Cards */}
            <View className="flex-row flex-wrap gap-3 mb-6">
                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Ionicons name="medkit-outline" size={24} color="#059669" />
                        <Text className="text-2xl font-bold text-gray-800">{totalMedicines}</Text>
                    </View>
                    <Text className="text-gray-600 font-medium">Total Medicines</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        In inventory
                    </Text>
                </View>

                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Ionicons name="warning-outline" size={24} color="#EF4444" />
                        <Text className="text-2xl font-bold text-gray-800">{lowStockItems}</Text>
                    </View>
                    <Text className="text-gray-600 font-medium">Low Stock</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        Need restocking
                    </Text>
                </View>

                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Ionicons name="clipboard-outline" size={24} color="#F59E0B" />
                        <Text className="text-2xl font-bold text-gray-800">{pendingOrders}</Text>
                    </View>
                    <Text className="text-gray-600 font-medium">Pending Orders</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        Awaiting fulfillment
                    </Text>
                </View>

                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm min-w-[45%]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Ionicons name="cash-outline" size={24} color="#10B981" />
                        <Text className="text-2xl font-bold text-gray-800">${monthlyRevenue.toLocaleString()}</Text>
                    </View>
                    <Text className="text-gray-600 font-medium">Monthly Revenue</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        This month
                    </Text>
                </View>
            </View>

            {/* Quick Actions */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
                <View className="flex-row flex-wrap gap-3">
                    <View className="bg-green-50 rounded-xl p-4 flex-1 min-w-[45%] items-center">
                        <Ionicons name="add-circle-outline" size={24} color="#059669" />
                        <Text className="text-green-700 font-medium mt-2">Add Medicine</Text>
                    </View>
                    <View className="bg-blue-50 rounded-xl p-4 flex-1 min-w-[45%] items-center">
                        <Ionicons name="cart-outline" size={24} color="#3B82F6" />
                        <Text className="text-blue-700 font-medium mt-2">New Order</Text>
                    </View>
                    <View className="bg-orange-50 rounded-xl p-4 flex-1 min-w-[45%] items-center">
                        <Ionicons name="stats-chart-outline" size={24} color="#F59E0B" />
                        <Text className="text-orange-700 font-medium mt-2">Reports</Text>
                    </View>
                    <View className="bg-purple-50 rounded-xl p-4 flex-1 min-w-[45%] items-center">
                        <Ionicons name="settings-outline" size={24} color="#8B5CF6" />
                        <Text className="text-purple-700 font-medium mt-2">Settings</Text>
                    </View>
                </View>
            </View>

            {/* Recent Activity */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-4">Recent Activity</Text>
                <View className="space-y-3">
                    <View className="flex-row items-center py-2">
                        <View className="bg-green-100 p-2 rounded-full mr-3">
                            <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-medium">Order #1234 fulfilled</Text>
                            <Text className="text-gray-500 text-sm">2 hours ago</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center py-2">
                        <View className="bg-blue-100 p-2 rounded-full mr-3">
                            <Ionicons name="cart-outline" size={16} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-medium">New order received</Text>
                            <Text className="text-gray-500 text-sm">4 hours ago</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center py-2">
                        <View className="bg-orange-100 p-2 rounded-full mr-3">
                            <Ionicons name="warning-outline" size={16} color="#F59E0B" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-medium">Low stock alert: Amoxicillin</Text>
                            <Text className="text-gray-500 text-sm">1 day ago</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
