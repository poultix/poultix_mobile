import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// Mock inventory data
const mockInventory = [
    {
        id: '1',
        name: 'Amoxicillin Injectable',
        category: 'Antibiotics',
        quantity: 45,
        minStock: 20,
        price: 2500,
        expiryDate: '2025-12-31',
        status: 'In Stock',
        lastUpdated: '2024-10-10'
    },
    {
        id: '2',
        name: 'Ivermectin Pour-On',
        category: 'Antiparasitic',
        quantity: 12,
        minStock: 15,
        price: 1800,
        expiryDate: '2025-08-15',
        status: 'Low Stock',
        lastUpdated: '2024-10-08'
    },
    {
        id: '3',
        name: 'Calcium Borogluconate',
        category: 'Minerals & Vitamins',
        quantity: 8,
        minStock: 10,
        price: 850,
        expiryDate: '2024-11-20',
        status: 'Low Stock',
        lastUpdated: '2024-10-05'
    },
    {
        id: '4',
        name: 'Newcastle Disease Vaccine',
        category: 'Vaccines',
        quantity: 25,
        minStock: 20,
        price: 1200,
        expiryDate: '2025-06-30',
        status: 'In Stock',
        lastUpdated: '2024-10-12'
    }
];

const PharmacyInventory = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [inventory, setInventory] = useState(mockInventory);

    const categories = ['All', 'Antibiotics', 'Antiparasitic', 'Vaccines', 'Minerals & Vitamins'];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getStatusColor = (status: string, quantity: number, minStock: number) => {
        if (status === 'Out of Stock') return 'text-red-600 bg-red-100';
        if (quantity <= minStock) return 'text-orange-600 bg-orange-100';
        return 'text-green-600 bg-green-100';
    };

    const getLowStockItems = () => inventory.filter(item => item.quantity <= item.minStock).length;

    const handleAddMedicine = () => {
        router.push('/pharmacy/add-medicine');
    };

    const handleUpdateStock = (id: string, newQuantity: number) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString().split('T')[0] } : item
        ));
        Alert.alert('Success', 'Stock updated successfully');
    };

    return (
        <View style={tw`px-4`}>
            <Animated.View style={[{ opacity: fadeAnim }]}>
                {/* Header with Stats */}
                <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-6`}>
                    <View style={tw`flex-row items-center justify-between mb-4`}>
                        <Text style={tw`text-lg font-bold text-gray-800`}>Inventory Management</Text>
                        <TouchableOpacity
                            style={tw`bg-blue-500 px-4 py-2 rounded-xl flex-row items-center`}
                            onPress={handleAddMedicine}
                        >
                            <Ionicons name="add" size={16} color="white" style={tw`mr-1`} />
                            <Text style={tw`text-white font-medium`}>Add Medicine</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row justify-between`}>
                        <View style={tw`items-center flex-1`}>
                            <Text style={tw`text-2xl font-bold text-gray-800`}>{inventory.length}</Text>
                            <Text style={tw`text-gray-500 text-sm`}>Total Items</Text>
                        </View>
                        <View style={tw`items-center flex-1`}>
                            <Text style={tw`text-2xl font-bold text-green-600`}>
                                {inventory.filter(i => i.quantity > i.minStock).length}
                            </Text>
                            <Text style={tw`text-gray-500 text-sm`}>In Stock</Text>
                        </View>
                        <View style={tw`items-center flex-1`}>
                            <Text style={tw`text-2xl font-bold text-orange-600`}>{getLowStockItems()}</Text>
                            <Text style={tw`text-gray-500 text-sm`}>Low Stock</Text>
                        </View>
                    </View>
                </View>

                {/* Search and Filter */}
                <View style={tw`mb-6`}>
                    <TextInput
                        style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm text-gray-800`}
                        placeholder="Search medicines..."
                        placeholderTextColor="#6B7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <View style={tw`flex-row flex-wrap`}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={tw`mr-2 mb-2 px-4 py-2 rounded-xl ${
                                    selectedCategory === category
                                        ? 'bg-blue-500'
                                        : 'bg-gray-100 border border-gray-200'
                                }`}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text style={tw`font-medium ${
                                    selectedCategory === category ? 'text-white' : 'text-gray-700'
                                }`}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Inventory List */}
                <View style={tw`space-y-3`}>
                    {filteredInventory.map((item) => (
                        <View key={item.id} style={tw`bg-white rounded-2xl p-5 shadow-sm`}>
                            <View style={tw`flex-row items-center justify-between mb-3`}>
                                <View style={tw`flex-1 mr-4`}>
                                    <Text style={tw`text-gray-800 font-semibold text-lg mb-1`}>
                                        {item.name}
                                    </Text>
                                    <Text style={tw`text-gray-500 text-sm`}>{item.category}</Text>
                                </View>

                                <View style={tw`px-3 py-1 rounded-full ${getStatusColor(item.status, item.quantity, item.minStock)}`}>
                                    <Text style={tw`text-xs font-bold`}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>

                            <View style={tw`flex-row items-center justify-between mb-3`}>
                                <View>
                                    <Text style={tw`text-gray-600 text-sm`}>Quantity</Text>
                                    <Text style={tw`text-gray-800 font-bold text-lg`}>{item.quantity}</Text>
                                    <Text style={tw`text-gray-500 text-xs`}>Min: {item.minStock}</Text>
                                </View>
                                <View style={tw`items-end`}>
                                    <Text style={tw`text-gray-600 text-sm`}>Price</Text>
                                    <Text style={tw`text-gray-800 font-bold text-lg`}>₹{item.price}</Text>
                                </View>
                            </View>

                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View>
                                    <Text style={tw`text-gray-600 text-sm`}>Expiry</Text>
                                    <Text style={tw`text-gray-800 font-medium`}>{item.expiryDate}</Text>
                                </View>
                                <View style={tw`items-end`}>
                                    <Text style={tw`text-gray-600 text-sm`}>Last Updated</Text>
                                    <Text style={tw`text-gray-800 font-medium`}>{item.lastUpdated}</Text>
                                </View>
                            </View>

                            <View style={tw`flex-row space-x-3`}>
                                <TouchableOpacity
                                    style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                    onPress={() => {
                                        Alert.prompt(
                                            'Update Stock',
                                            `Current quantity: ${item.quantity}`,
                                            (newQuantity) => {
                                                const qty = parseInt(newQuantity || '0');
                                                if (!isNaN(qty)) {
                                                    handleUpdateStock(item.id, qty);
                                                }
                                            }
                                        );
                                    }}
                                >
                                    <Ionicons name="create-outline" size={16} color="#6B7280" style={tw`mr-1`} />
                                    <Text style={tw`text-gray-700 font-medium`}>Update</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={tw`flex-1 bg-red-100 py-3 rounded-xl flex-row items-center justify-center`}
                                    onPress={() => {
                                        Alert.alert(
                                            'Delete Item',
                                            `Remove ${item.name} from inventory?`,
                                            [
                                                { text: 'Cancel', style: 'cancel' },
                                                {
                                                    text: 'Delete',
                                                    style: 'destructive',
                                                    onPress: () => {
                                                        setInventory(prev => prev.filter(i => i.id !== item.id));
                                                        Alert.alert('Success', 'Item removed from inventory');
                                                    }
                                                }
                                            ]
                                        );
                                    }}
                                >
                                    <Ionicons name="trash-outline" size={16} color="#DC2626" style={tw`mr-1`} />
                                    <Text style={tw`text-red-600 font-medium`}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {filteredInventory.length === 0 && (
                    <View style={tw`items-center py-20`}>
                        <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                        <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No medicines found</Text>
                        <Text style={tw`text-gray-400 text-center px-8`}>
                            Try adjusting your search or filter criteria
                        </Text>
                    </View>
                )}
            </Animated.View>
        </View>
    );
};

export default PharmacyInventory;
