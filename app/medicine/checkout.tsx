import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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

interface CartItem {
    id: string;
    medicineName: string;
    pharmacyName: string;
    quantity: number;
    price: number;
    prescriptionRequired: boolean;
    image?: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
    description: string;
}

const CheckoutScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

    // Mock cart data
    const cartItems: CartItem[] = [
        {
            id: '1',
            medicineName: 'Amoxicillin Injectable 150mg/ml',
            pharmacyName: 'Kigali Veterinary Pharmacy',
            quantity: 2,
            price: 2500,
            prescriptionRequired: true
        },
        {
            id: '2',
            medicineName: 'Calcium Borogluconate Injection',
            pharmacyName: 'Kigali Veterinary Pharmacy',
            quantity: 1,
            price: 850,
            prescriptionRequired: false
        }
    ];

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'mobile_money',
            name: 'Mobile Money (MTN/Airtel)',
            icon: 'phone-portrait-outline',
            description: 'Pay with MTN Mobile Money or Airtel Money'
        },
        {
            id: 'bank_transfer',
            name: 'Bank Transfer',
            icon: 'business-outline',
            description: 'Direct bank transfer (2-3 business days)'
        },
        {
            id: 'cash_on_delivery',
            name: 'Cash on Delivery',
            icon: 'cash-outline',
            description: 'Pay when medicine is delivered'
        }
    ];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 5000 ? 0 : 500; // Free delivery over ₹5000
    const total = subtotal + deliveryFee;

    const hasPrescriptionRequiredItems = cartItems.some(item => item.prescriptionRequired);

    const handlePayment = async () => {
        if (!selectedPaymentMethod) {
            Alert.alert('Error', 'Please select a payment method');
            return;
        }

        if (!deliveryAddress.trim()) {
            Alert.alert('Error', 'Please enter delivery address');
            return;
        }

        if (hasPrescriptionRequiredItems && !prescriptionUploaded) {
            Alert.alert('Prescription Required', 'Please upload prescription for prescription-required medicines');
            return;
        }

        setLoading(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            Alert.alert(
                'Payment Successful!',
                'Your order has been placed successfully. You will receive a confirmation SMS shortly.',
                [
                    {
                        text: 'View Order',
                        onPress: () => router.push('/user/history')
                    },
                    {
                        text: 'Continue Shopping',
                        onPress: () => router.push('/medicine'),
                        style: 'cancel'
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Payment Failed', 'Please try again or contact support');
        } finally {
            setLoading(false);
        }
    };

    const uploadPrescription = () => {
        // In real app, implement file picker
        Alert.alert('Upload Prescription', 'Prescription upload functionality would be implemented here');
        setPrescriptionUploaded(true);
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#10B981', '#059669']}
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
                        Checkout
                    </Text>
                    <Text style={tw`text-green-100 text-sm`}>
                        Complete your medicine order
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Order Summary */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Order Summary</Text>

                        {cartItems.map((item) => (
                            <View key={item.id} style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}>
                                <View style={tw`flex-1 mr-4`}>
                                    <Text style={tw`text-gray-900 font-medium mb-1`}>
                                        {item.medicineName}
                                    </Text>
                                    <Text style={tw`text-gray-500 text-sm`}>
                                        {item.pharmacyName} • {item.quantity} × ₹{item.price}
                                    </Text>
                                    {item.prescriptionRequired && (
                                        <View style={tw`bg-orange-100 px-2 py-1 rounded-full self-start mt-1`}>
                                            <Text style={tw`text-orange-700 text-xs font-medium`}>
                                                Prescription Required
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={tw`text-gray-900 font-bold`}>
                                    ₹{item.price * item.quantity}
                                </Text>
                            </View>
                        ))}

                        <View style={tw`mt-4 space-y-2`}>
                            <View style={tw`flex-row justify-between`}>
                                <Text style={tw`text-gray-600`}>Subtotal</Text>
                                <Text style={tw`text-gray-900 font-medium`}>₹{subtotal}</Text>
                            </View>
                            <View style={tw`flex-row justify-between`}>
                                <Text style={tw`text-gray-600`}>Delivery Fee</Text>
                                <Text style={tw`text-gray-900 font-medium`}>
                                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                </Text>
                            </View>
                            <View style={tw`border-t border-gray-200 pt-2 mt-2`}>
                                <View style={tw`flex-row justify-between`}>
                                    <Text style={tw`text-gray-900 font-bold text-lg`}>Total</Text>
                                    <Text style={tw`text-gray-900 font-bold text-xl`}>₹{total}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Delivery Address */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Delivery Address</Text>

                        <TextInput
                            style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base min-h-[80px]`}
                            placeholder="Enter complete delivery address (including district, sector, cell)"
                            placeholderTextColor="#6B7280"
                            multiline
                            numberOfLines={3}
                            value={deliveryAddress}
                            onChangeText={setDeliveryAddress}
                        />

                        <Text style={tw`text-gray-500 text-xs mt-2`}>
                            Ensure the address is complete for smooth delivery
                        </Text>
                    </View>

                    {/* Prescription Upload */}
                    {hasPrescriptionRequiredItems && (
                        <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Prescription Required</Text>

                            <Text style={tw`text-gray-700 mb-4`}>
                                Some items in your order require a valid veterinary prescription.
                            </Text>

                            {!prescriptionUploaded ? (
                                <TouchableOpacity
                                    style={tw`bg-orange-50 border-2 border-orange-200 border-dashed rounded-xl p-6 items-center`}
                                    onPress={uploadPrescription}
                                >
                                    <Ionicons name="cloud-upload-outline" size={32} color="#F59E0B" />
                                    <Text style={tw`text-orange-700 font-medium mt-2`}>Upload Prescription</Text>
                                    <Text style={tw`text-orange-600 text-sm text-center mt-1`}>
                                        PDF, JPG, or PNG format
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={tw`bg-green-50 border border-green-200 rounded-xl p-4 flex-row items-center`}>
                                    <Ionicons name="checkmark-circle" size={24} color="#10B981" style={tw`mr-3`} />
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-green-700 font-medium`}>Prescription Uploaded</Text>
                                        <Text style={tw`text-green-600 text-sm`}>prescription.pdf</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setPrescriptionUploaded(false)}
                                        style={tw`p-2`}
                                    >
                                        <Ionicons name="close" size={16} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Payment Method */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Payment Method</Text>

                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={tw`flex-row items-center p-4 rounded-xl mb-3 ${
                                    selectedPaymentMethod === method.id
                                        ? 'bg-blue-50 border-2 border-blue-200'
                                        : 'bg-gray-50 border border-gray-200'
                                }`}
                                onPress={() => setSelectedPaymentMethod(method.id)}
                            >
                                <View style={tw`w-5 h-5 rounded-full border-2 mr-4 items-center justify-center ${
                                    selectedPaymentMethod === method.id
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-400'
                                }`}>
                                    {selectedPaymentMethod === method.id && (
                                        <Ionicons name="checkmark" size={12} color="white" />
                                    )}
                                </View>

                                <Ionicons
                                    name={method.icon as any}
                                    size={24}
                                    color={selectedPaymentMethod === method.id ? '#3B82F6' : '#6B7280'}
                                    style={tw`mr-3`}
                                />

                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-900 font-medium mb-1`}>
                                        {method.name}
                                    </Text>
                                    <Text style={tw`text-gray-600 text-sm`}>
                                        {method.description}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Special Instructions */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Special Instructions (Optional)</Text>

                        <TextInput
                            style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                            placeholder="Any special delivery instructions..."
                            placeholderTextColor="#6B7280"
                            value={specialInstructions}
                            onChangeText={setSpecialInstructions}
                        />
                    </View>

                    {/* Payment Button */}
                    <TouchableOpacity
                        style={tw`bg-green-500 py-4 rounded-2xl flex-row items-center justify-center mb-4 ${
                            loading ? 'opacity-50' : ''
                        }`}
                        onPress={handlePayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator color="white" size="small" style={tw`mr-3`} />
                                <Text style={tw`text-white font-bold text-lg`}>Processing Payment...</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="card-outline" size={20} color="white" style={tw`mr-3`} />
                                <Text style={tw`text-white font-bold text-lg`}>Pay ₹{total}</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={tw`text-gray-500 text-xs text-center`}>
                        By placing this order, you agree to our terms and conditions
                    </Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default CheckoutScreen;
