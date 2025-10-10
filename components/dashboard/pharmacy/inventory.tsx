import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function PharmacyInventory() {
    // Mock inventory data
    const inventory = [
        { id: 1, name: "Amoxicillin", category: "Antibiotic", stock: 25, minStock: 50, unit: "tablets" },
        { id: 2, name: "Vitamin B Complex", category: "Supplement", stock: 75, minStock: 30, unit: "bottles" },
        { id: 3, name: "Electrolyte Solution", category: "Supplement", stock: 12, minStock: 20, unit: "liters" },
        { id: 4, name: "Coccidiosis Vaccine", category: "Vaccine", stock: 8, minStock: 15, unit: "doses" },
        { id: 5, name: "Wound Spray", category: "Topical", stock: 45, minStock: 25, unit: "bottles" },
    ];

    const getStockStatus = (stock: number, minStock: number) => {
        if (stock <= minStock * 0.5) return { color: "#EF4444", status: "Critical" };
        if (stock <= minStock) return { color: "#F59E0B", status: "Low" };
        return { color: "#10B981", status: "Good" };
    };

    return (
        <View className="px-4">
            {/* Header */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-bold text-gray-800">Inventory Management</Text>
                    <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-xl">
                        <Text className="text-white font-medium">Add Item</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-600">Track and manage your pharmacy inventory</Text>
            </View>

            {/* Inventory List */}
            <View className="space-y-3">
                {inventory.map((item) => {
                    const stockStatus = getStockStatus(item.stock, item.minStock);
                    return (
                        <TouchableOpacity
                            key={item.id}
                            className="bg-white rounded-2xl p-4 shadow-sm"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">{item.name}</Text>
                                    <Text className="text-gray-500 text-sm">{item.category}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-gray-800 font-bold">{item.stock} {item.unit}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <View
                                            className="w-2 h-2 rounded-full mr-2"
                                            style={{ backgroundColor: stockStatus.color }}
                                        />
                                        <Text className="text-xs" style={{ color: stockStatus.color }}>
                                            {stockStatus.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex-row items-center justify-between mt-3">
                                <Text className="text-gray-500 text-sm">
                                    Min: {item.minStock} {item.unit}
                                </Text>
                                <TouchableOpacity className="bg-blue-500 px-3 py-1 rounded-lg">
                                    <Text className="text-white text-sm font-medium">Update</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Stock Alerts */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mt-6">
                <Text className="text-lg font-bold text-gray-800 mb-4">Stock Alerts</Text>
                <View className="space-y-3">
                    {inventory.filter(item => item.stock <= item.minStock).map((item) => (
                        <View key={item.id} className="flex-row items-center p-3 bg-orange-50 rounded-xl">
                            <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                            <View className="flex-1 ml-3">
                                <Text className="text-gray-800 font-medium">{item.name}</Text>
                                <Text className="text-gray-600 text-sm">
                                    Low stock: {item.stock} remaining (min: {item.minStock})
                                </Text>
                            </View>
                            <TouchableOpacity className="bg-orange-500 px-3 py-1 rounded-lg">
                                <Text className="text-white text-sm">Restock</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
