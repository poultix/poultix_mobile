import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

interface OrderItem {
    id: string;
    medicineName: string;
    quantity: number;
    price: number;
    prescriptionRequired: boolean;
    dosage?: string;
}

interface OrderDetails {
    id: string;
    customerName: string;
    customerPhone: string;
    customerLocation: string;
    status: 'Pending' | 'Processing' | 'Ready' | 'Delivered' | 'Cancelled';
    items: OrderItem[];
    totalAmount: number;
    orderDate: string;
    deliveryDate?: string;
    prescriptionUrl?: string;
    notes?: string;
    paymentMethod: string;
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
}

const OrderDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Mock order data - in real app, fetch from API
    const mockOrder: OrderDetails = {
        id: id as string,
        customerName: 'John Farmer',
        customerPhone: '+250 788 123 456',
        customerLocation: 'Kigali, Gasabo District',
        status: 'Pending',
        items: [
            {
                id: '1',
                medicineName: 'Amoxicillin Injectable 150mg/ml',
                quantity: 5,
                price: 2500,
                prescriptionRequired: true,
                dosage: '15mg/kg body weight'
            },
            {
                id: '2',
                medicineName: 'Ivermectin Pour-On Solution',
                quantity: 2,
                price: 1800,
                prescriptionRequired: true,
                dosage: '0.2mg/kg'
            }
        ],
        totalAmount: 11600,
        orderDate: '2024-10-13',
        notes: 'Urgent delivery required for sick cattle',
        paymentMethod: 'Mobile Money',
        paymentStatus: 'Paid'
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setOrder(mockOrder);
            setLoading(false);
        }, 1000);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
            case 'Processing': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
            case 'Ready': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
            case 'Delivered': return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
            default: return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return { bg: 'bg-green-100', text: 'text-green-800' };
            case 'Pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
            case 'Failed': return { bg: 'bg-red-100', text: 'text-red-800' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-800' };
        }
    };

    const updateOrderStatus = async (newStatus: OrderDetails['status']) => {
        setUpdating(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setOrder(prev => prev ? { ...prev, status: newStatus } : null);
            Alert.alert('Success', `Order status updated to ${newStatus}`);
        } catch (error) {
            Alert.alert('Error', 'Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const callCustomer = () => {
        Alert.alert('Call Customer', `Call ${order?.customerPhone}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Call', onPress: () => {/* Implement phone call */} }
        ]);
    };

    if (loading) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={tw`text-gray-600 mt-4`}>Loading order details...</Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                <Text style={tw`text-gray-500 text-lg mt-4`}>Order not found</Text>
                <TouchableOpacity
                    style={tw`mt-4 bg-blue-500 px-6 py-3 rounded-xl`}
                    onPress={() => router.back()}
                >
                    <Text style={tw`text-white font-medium`}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const statusColors = getStatusColor(order.status);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`bg-white bg-opacity-20 p-2 rounded-xl mb-4 self-start`}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <Text style={tw`text-white text-2xl font-bold mb-2`}>
                        Order #{order.id}
                    </Text>
                    <Text style={tw`text-blue-100 text-sm`}>
                        Placed on {order.orderDate}
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Order Status */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <Text style={tw`text-gray-900 font-bold text-lg`}>Order Status</Text>
                            <View style={tw`px-3 py-1 rounded-full ${statusColors.bg} border ${statusColors.border}`}>
                                <Text style={tw`text-xs font-bold ${statusColors.text}`}>
                                    {order.status}
                                </Text>
                            </View>
                        </View>

                        {/* Status Actions */}
                        {order.status === 'Pending' && (
                            <TouchableOpacity
                                style={tw`bg-blue-500 py-3 rounded-xl flex-row items-center justify-center ${
                                    updating ? 'opacity-50' : ''
                                }`}
                                onPress={() => updateOrderStatus('Processing')}
                                disabled={updating}
                            >
                                {updating ? (
                                    <ActivityIndicator color="white" size="small" style={tw`mr-2`} />
                                ) : (
                                    <Ionicons name="checkmark-circle-outline" size={18} color="white" style={tw`mr-2`} />
                                )}
                                <Text style={tw`text-white font-medium`}>
                                    {updating ? 'Updating...' : 'Start Processing'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {order.status === 'Processing' && (
                            <TouchableOpacity
                                style={tw`bg-green-500 py-3 rounded-xl flex-row items-center justify-center ${
                                    updating ? 'opacity-50' : ''
                                }`}
                                onPress={() => updateOrderStatus('Ready')}
                                disabled={updating}
                            >
                                {updating ? (
                                    <ActivityIndicator color="white" size="small" style={tw`mr-2`} />
                                ) : (
                                    <Ionicons name="checkmark-done-circle-outline" size={18} color="white" style={tw`mr-2`} />
                                )}
                                <Text style={tw`text-white font-medium`}>
                                    {updating ? 'Updating...' : 'Mark as Ready'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Customer Details */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Customer Details</Text>

                        <View style={tw`space-y-3`}>
                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="person-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                                <Text style={tw`text-gray-800 flex-1`}>{order.customerName}</Text>
                            </View>

                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="call-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                                <Text style={tw`text-gray-800 flex-1`}>{order.customerPhone}</Text>
                                <TouchableOpacity
                                    style={tw`bg-green-500 px-3 py-1 rounded-lg`}
                                    onPress={callCustomer}
                                >
                                    <Text style={tw`text-white text-sm font-medium`}>Call</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="location-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                                <Text style={tw`text-gray-800 flex-1`}>{order.customerLocation}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Order Items */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Order Items</Text>

                        {order.items.map((item, index) => (
                            <View key={item.id} style={tw`mb-4 pb-4 ${index < order.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <View style={tw`flex-row justify-between mb-2`}>
                                    <Text style={tw`text-gray-900 font-semibold flex-1 mr-4`}>
                                        {item.medicineName}
                                    </Text>
                                    <Text style={tw`text-gray-900 font-bold`}>
                                        ₹{item.price * item.quantity}
                                    </Text>
                                </View>

                                <View style={tw`flex-row justify-between items-center mb-2`}>
                                    <Text style={tw`text-gray-600 text-sm`}>
                                        Quantity: {item.quantity} × ₹{item.price}
                                    </Text>
                                    {item.prescriptionRequired && (
                                        <View style={tw`bg-orange-100 px-2 py-1 rounded-full`}>
                                            <Text style={tw`text-orange-700 text-xs font-medium`}>
                                                Prescription Required
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {item.dosage && (
                                    <Text style={tw`text-gray-600 text-sm`}>
                                        Dosage: {item.dosage}
                                    </Text>
                                )}
                            </View>
                        ))}

                        <View style={tw`border-t border-gray-200 pt-4 mt-4`}>
                            <View style={tw`flex-row justify-between items-center`}>
                                <Text style={tw`text-gray-900 font-bold text-lg`}>Total Amount</Text>
                                <Text style={tw`text-gray-900 font-bold text-xl`}>₹{order.totalAmount}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Payment Details */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Payment Details</Text>

                        <View style={tw`space-y-3`}>
                            <View style={tw`flex-row justify-between`}>
                                <Text style={tw`text-gray-600`}>Payment Method</Text>
                                <Text style={tw`text-gray-900 font-medium`}>{order.paymentMethod}</Text>
                            </View>

                            <View style={tw`flex-row justify-between items-center`}>
                                <Text style={tw`text-gray-600`}>Payment Status</Text>
                                <View style={tw`px-3 py-1 rounded-full ${getPaymentStatusColor(order.paymentStatus).bg}`}>
                                    <Text style={tw`text-xs font-bold ${getPaymentStatusColor(order.paymentStatus).text}`}>
                                        {order.paymentStatus}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Additional Notes */}
                    {order.notes && (
                        <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-3`}>Additional Notes</Text>
                            <Text style={tw`text-gray-700 leading-5`}>{order.notes}</Text>
                        </View>
                    )}

                    {/* Prescription */}
                    {order.prescriptionUrl && (
                        <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-3`}>Prescription</Text>
                            <TouchableOpacity style={tw`bg-blue-50 p-4 rounded-xl flex-row items-center`}>
                                <Ionicons name="document-text-outline" size={24} color="#3B82F6" style={tw`mr-3`} />
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-blue-700 font-medium`}>View Prescription</Text>
                                    <Text style={tw`text-blue-600 text-sm`}>PDF Document</Text>
                                </View>
                                <Ionicons name="download-outline" size={20} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default OrderDetailScreen;
