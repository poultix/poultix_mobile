import { Text, TouchableOpacity, View } from "react-native";

export default function PharmacyOrders() {
    // Mock orders data
    const orders = [
        {
            id: "ORD-001",
            type: "Prescription",
            customer: "Farm A",
            items: ["Amoxicillin", "Vitamin B"],
            status: "Pending",
            date: "2024-10-10",
            total: 450
        },
        {
            id: "ORD-002",
            type: "Purchase",
            customer: "Vet Clinic B",
            items: ["Electrolyte Solution", "Wound Spray"],
            status: "Processing",
            date: "2024-10-09",
            total: 320
        },
        {
            id: "ORD-003",
            type: "Prescription",
            customer: "Farm C",
            items: ["Coccidiosis Vaccine"],
            status: "Completed",
            date: "2024-10-08",
            total: 180
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "#F59E0B";
            case "Processing": return "#3B82F6";
            case "Completed": return "#10B981";
            default: return "#6B7280";
        }
    };

    return (
        <View className="px-4">
            {/* Header */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-bold text-gray-800">Orders & Prescriptions</Text>
                    <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-xl">
                        <Text className="text-white font-medium">New Order</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-600">Manage prescriptions and purchase orders</Text>
            </View>

            {/* Orders List */}
            <View className="space-y-3">
                {orders.map((order) => (
                    <TouchableOpacity
                        key={order.id}
                        className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-1">
                                <Text className="text-gray-800 font-semibold">{order.id}</Text>
                                <Text className="text-gray-500 text-sm">{order.customer}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-gray-800 font-bold">${order.total}</Text>
                                <View
                                    className="px-2 py-1 rounded-full mt-1"
                                    style={{ backgroundColor: getStatusColor(order.status) + "20" }}
                                >
                                    <Text
                                        className="text-xs font-medium"
                                        style={{ color: getStatusColor(order.status) }}
                                    >
                                        {order.status}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="mb-3">
                            <Text className="text-gray-600 text-sm mb-1">Items:</Text>
                            <Text className="text-gray-800">{order.items.join(", ")}</Text>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <Text className="text-gray-500 text-sm">{order.date}</Text>
                            <View className="flex-row space-x-2">
                                {order.status === "Pending" && (
                                    <TouchableOpacity className="bg-green-500 px-3 py-1 rounded-lg">
                                        <Text className="text-white text-sm font-medium">Fulfill</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity className="bg-gray-500 px-3 py-1 rounded-lg">
                                    <Text className="text-white text-sm font-medium">View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Order Summary */}
            <View className="bg-white rounded-2xl p-5 shadow-sm mt-6">
                <Text className="text-lg font-bold text-gray-800 mb-4">Order Summary</Text>
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-600">Pending Orders</Text>
                    <Text className="text-gray-800 font-semibold">
                        {orders.filter(o => o.status === "Pending").length}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-600">Processing</Text>
                    <Text className="text-gray-800 font-semibold">
                        {orders.filter(o => o.status === "Processing").length}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">Completed Today</Text>
                    <Text className="text-gray-800 font-semibold">
                        {orders.filter(o => o.status === "Completed").length}
                    </Text>
                </View>
            </View>
        </View>
    );
}
