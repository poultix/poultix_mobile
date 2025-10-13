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

const AddMedicineScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        activeIngredient: '',
        dosage: '',
        administration: '',
        storage: '',
        price: '',
        quantity: '',
        manufacturer: '',
        expiryDate: '',
        batchNumber: '',
        prescriptionRequired: false,
    });

    const categories = [
        'Antibiotics',
        'Antiparasitic',
        'Anti-inflammatory',
        'Minerals & Vitamins',
        'Vaccines',
        'Hormones',
        'Steroids',
        'Others'
    ];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name.trim() || !formData.category || !formData.price) {
            Alert.alert('Error', 'Please fill in all required fields (Name, Category, Price)');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Success',
                'Medicine added to inventory successfully!',
                [
                    { text: 'Add Another', onPress: () => resetForm() },
                    { text: 'View Inventory', onPress: () => router.push('/dashboard/pharmacy-dashboard?tab=inventory') }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to add medicine. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            description: '',
            activeIngredient: '',
            dosage: '',
            administration: '',
            storage: '',
            price: '',
            quantity: '',
            manufacturer: '',
            expiryDate: '',
            batchNumber: '',
            prescriptionRequired: false,
        });
    };

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
                        Add New Medicine
                    </Text>
                    <Text style={tw`text-blue-100 text-sm`}>
                        Add medicine to your pharmacy inventory
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Form */}
                    <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-6`}>Medicine Details</Text>

                        {/* Basic Information */}
                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-medium mb-3`}>Basic Information</Text>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Medicine Name *</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="e.g., Amoxicillin Injectable"
                                    placeholderTextColor="#6B7280"
                                    value={formData.name}
                                    onChangeText={(value) => handleInputChange('name', value)}
                                />
                            </View>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Category *</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-2`}>
                                    {categories.map((category) => (
                                        <TouchableOpacity
                                            key={category}
                                            style={tw`mr-2 px-4 py-2 rounded-xl border ${
                                                formData.category === category
                                                    ? 'bg-blue-500 border-blue-500'
                                                    : 'bg-gray-100 border-gray-200'
                                            }`}
                                            onPress={() => handleInputChange('category', category)}
                                        >
                                            <Text style={tw`${
                                                formData.category === category ? 'text-white' : 'text-gray-700'
                                            } text-sm font-medium`}>
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Description</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="Brief description of the medicine"
                                    placeholderTextColor="#6B7280"
                                    multiline
                                    numberOfLines={3}
                                    value={formData.description}
                                    onChangeText={(value) => handleInputChange('description', value)}
                                />
                            </View>
                        </View>

                        {/* Medical Details */}
                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-medium mb-3`}>Medical Details</Text>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Active Ingredient</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="e.g., Amoxicillin Trihydrate 150mg/ml"
                                    placeholderTextColor="#6B7280"
                                    value={formData.activeIngredient}
                                    onChangeText={(value) => handleInputChange('activeIngredient', value)}
                                />
                            </View>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Dosage Instructions</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="e.g., 15mg/kg body weight"
                                    placeholderTextColor="#6B7280"
                                    value={formData.dosage}
                                    onChangeText={(value) => handleInputChange('dosage', value)}
                                />
                            </View>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Administration</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="e.g., Subcutaneous injection"
                                    placeholderTextColor="#6B7280"
                                    value={formData.administration}
                                    onChangeText={(value) => handleInputChange('administration', value)}
                                />
                            </View>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Storage Conditions</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="e.g., Store at 2-8°C, protect from light"
                                    placeholderTextColor="#6B7280"
                                    value={formData.storage}
                                    onChangeText={(value) => handleInputChange('storage', value)}
                                />
                            </View>
                        </View>

                        {/* Business Details */}
                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-medium mb-3`}>Business Details</Text>

                            <View style={tw`flex-row space-x-3 mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-600 text-sm mb-2`}>Price (₹) *</Text>
                                    <TextInput
                                        style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                        placeholder="2500"
                                        placeholderTextColor="#6B7280"
                                        keyboardType="numeric"
                                        value={formData.price}
                                        onChangeText={(value) => handleInputChange('price', value)}
                                    />
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-600 text-sm mb-2`}>Quantity</Text>
                                    <TextInput
                                        style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                        placeholder="50"
                                        placeholderTextColor="#6B7280"
                                        keyboardType="numeric"
                                        value={formData.quantity}
                                        onChangeText={(value) => handleInputChange('quantity', value)}
                                    />
                                </View>
                            </View>

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Manufacturer</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="e.g., VetCare Pharmaceuticals"
                                    placeholderTextColor="#6B7280"
                                    value={formData.manufacturer}
                                    onChangeText={(value) => handleInputChange('manufacturer', value)}
                                />
                            </View>

                            <View style={tw`flex-row space-x-3 mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-600 text-sm mb-2`}>Expiry Date</Text>
                                    <TextInput
                                        style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor="#6B7280"
                                        value={formData.expiryDate}
                                        onChangeText={(value) => handleInputChange('expiryDate', value)}
                                    />
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-600 text-sm mb-2`}>Batch Number</Text>
                                    <TextInput
                                        style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                        placeholder="ABC123"
                                        placeholderTextColor="#6B7280"
                                        value={formData.batchNumber}
                                        onChangeText={(value) => handleInputChange('batchNumber', value)}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={tw`flex-row items-center py-3 px-4 rounded-xl border ${
                                    formData.prescriptionRequired ? 'bg-orange-50 border-orange-200' : 'bg-gray-100 border-gray-200'
                                }`}
                                onPress={() => handleInputChange('prescriptionRequired', !formData.prescriptionRequired)}
                            >
                                <View style={tw`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                                    formData.prescriptionRequired ? 'bg-orange-500 border-orange-500' : 'border-gray-400'
                                }`}>
                                    {formData.prescriptionRequired && (
                                        <Ionicons name="checkmark" size={12} color="white" />
                                    )}
                                </View>
                                <Text style={tw`text-gray-700 font-medium`}>Requires Prescription</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={tw`bg-blue-500 py-4 rounded-2xl flex-row items-center justify-center ${
                                loading ? 'opacity-50' : ''
                            }`}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator color="white" size="small" style={tw`mr-3`} />
                                    <Text style={tw`text-white font-bold text-lg`}>Adding Medicine...</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="add-circle-outline" size={20} color="white" style={tw`mr-3`} />
                                    <Text style={tw`text-white font-bold text-lg`}>Add to Inventory</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default AddMedicineScreen;
