import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import tw from 'twrnc';
import { i18n } from '../../services/i18n/i18n';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';

// Mock AI-generated medicine data for learning
const mockMedicines = [
    {
        id: '1',
        name: 'Amoxicillin Injectable',
        category: 'Antibiotics',
        description: 'AI-recommended broad-spectrum antibiotic for bacterial infections in livestock. Effective against respiratory and urinary tract infections.',
        dosage: '15mg/kg body weight',
        price: '2500RWF',
        availability: 'In Stock',
        prescriptionRequired: true,
        manufacturer: 'VetCare Pharmaceuticals',
        image: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=AMX',
        aiScore: 95,
        commonUses: ['Respiratory infections', 'Wound treatment', 'Post-surgery care']
    },
    {
        id: '2',
        name: 'Ivermectin Pour-On',
        category: 'Antiparasitic',
        description: 'AI-analyzed effective treatment for internal and external parasites. Smart dosing system reduces resistance development.',
        dosage: '1ml per 10kg body weight',
        price: '1,800RWF',
        availability: 'In Stock',
        prescriptionRequired: false,
        manufacturer: 'AgriVet Solutions',
        image: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=IVM',
        aiScore: 92,
        commonUses: ['Worm treatment', 'Tick control', 'Mite prevention']
    },
    {
        id: '3',
        name: 'Calcium Borogluconate',
        category: 'Minerals & Vitamins',
        description: 'AI-formulated calcium supplement for milk fever prevention. Enhanced bioavailability through smart delivery system.',
        dosage: '450ml IV for 500kg cattle',
        price: '850RWF',
        availability: 'Low Stock',
        prescriptionRequired: true,
        manufacturer: 'NutriVet Labs',
        image: 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=CAL',
        aiScore: 88,
        commonUses: ['Milk fever', 'Calcium deficiency', 'Post-calving care']
    },
    {
        id: '4',
        name: 'Meloxicam Injection',
        category: 'Anti-inflammatory',
        description: 'AI-optimized NSAID for pain and inflammation management. Precise targeting reduces side effects.',
        dosage: '0.5mg/kg subcutaneous',
        price: '1,200RWF',
        availability: 'In Stock',
        prescriptionRequired: true,
        manufacturer: 'PainFree Veterinary',
        image: 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=MEL',
        aiScore: 90,
        commonUses: ['Post-surgical pain', 'Arthritis', 'Lameness treatment']
    },
    {
        id: '5',
        name: 'Vitamin B Complex',
        category: 'Minerals & Vitamins',
        description: 'AI-balanced vitamin complex for metabolic support. Smart-release formula ensures optimal absorption.',
        dosage: '10ml IM daily for 5 days',
        price: '650RWF',
        availability: 'In Stock',
        prescriptionRequired: false,
        manufacturer: 'VitalVet Nutrition',
        image: 'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=VIT',
        aiScore: 85,
        commonUses: ['Stress recovery', 'Appetite improvement', 'Growth support']
    },
];

const categories = [
    { name: 'All', icon: 'grid-outline', color: 'bg-blue-500' },
    { name: 'Antibiotics', icon: 'shield-checkmark-outline', color: 'bg-green-500' },
    { name: 'Antiparasitic', icon: 'bug-outline', color: 'bg-red-500' },
    { name: 'Anti-inflammatory', icon: 'fitness-outline', color: 'bg-orange-500' },
    { name: 'Minerals & Vitamins', icon: 'nutrition-outline', color: 'bg-purple-500' }
];

const MedicineScreen = () => {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredMedicines, setFilteredMedicines] = useState(mockMedicines);
    const [loading, setLoading] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    // Start animations
    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(searchAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Filter medicines
    useEffect(() => {
        let filtered = mockMedicines;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(medicine => medicine.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(medicine =>
                medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                medicine.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredMedicines(filtered);
    }, [searchQuery, selectedCategory]);

    const handleMedicinePress = (medicine: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/medicine/detail?id=${medicine.id}&name=${encodeURIComponent(medicine.name)}`);
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'In Stock': return 'text-green-600 bg-green-100';
            case 'Low Stock': return 'text-orange-600 bg-orange-100';
            case 'Out of Stock': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    useEffect(() => {
        startAnimations();
    }, []);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <ScrollView
                style={tw`flex-1`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`flexGrow pb-2`}
            >
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={tw`pb-4`}>
                        <LinearGradient
                            colors={['#4F46E5', '#7C3AED']}
                            style={tw`p-8 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                                >
                                    <Ionicons name="arrow-back" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                    onPress={() => router.push('/medicine/nearby-pharmacies')}
                                >
                                    <Ionicons name="location-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View style={tw`flex-1`}>
                                <Text style={tw`text-white text-sm opacity-90`}>
                                    AI-Powered Medicine Discovery
                                </Text>
                                <Text style={tw`text-white text-2xl font-bold`}>
                                    {i18n.pharmacy('medicines')}
                                </Text>
                                <Text style={tw`text-purple-100 text-sm mt-1`}>
                                    Smart recommendations for animal health
                                </Text>
                            </View>

                            {/* AI Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mt-4`}>
                                <Text style={tw`text-white font-bold text-base mb-3`}>AI Insights</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-white text-xl font-bold`}>{mockMedicines.length}</Text>
                                        <Text style={tw`text-purple-100 text-xs`}>Medicines</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-xl font-bold`}>AI</Text>
                                        <Text style={tw`text-purple-100 text-xs`}>Verified</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-blue-200 text-xl font-bold`}>24/7</Text>
                                        <Text style={tw`text-purple-100 text-xs`}>Available</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={tw`px-4`}>
                        {/* Search Bar */}
                        <Animated.View
                            style={[
                                tw`mb-6`,
                                {
                                    opacity: searchAnim,
                                    transform: [{
                                        translateY: searchAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    }],
                                },
                            ]}
                        >
                            <View style={tw`flex-row items-center bg-white rounded-2xl p-4 border border-gray-200 shadow-sm`}>
                                <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                                <TextInput
                                    style={tw`flex-1 text-gray-800 text-base`}
                                    placeholder={i18n.pharmacy('searchMedicines') || 'Search medicines...'}
                                    placeholderTextColor="#6B7280"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoCapitalize="none"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>

                        {/* Category Filters */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={tw`mb-6`}
                            contentContainerStyle={tw`px-1`}
                        >
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.name}
                                    style={tw`mr-3 px-4 py-3 rounded-xl flex-row items-center ${selectedCategory === category.name
                                            ? 'bg-indigo-500 shadow-lg'
                                            : 'bg-white border border-gray-200'
                                        }`}
                                    onPress={() => setSelectedCategory(category.name)}
                                >
                                    <Ionicons
                                        name={category.icon as any}
                                        size={18}
                                        color={selectedCategory === category.name ? 'white' : '#6B7280'}
                                        style={tw`mr-2`}
                                    />
                                    <Text
                                        style={tw`font-medium ${selectedCategory === category.name
                                                ? 'text-white'
                                                : 'text-gray-700'
                                            }`}
                                    >
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Medicine List */}
                        {loading ? (
                            <View style={tw`items-center py-20`}>
                                <ActivityIndicator size="large" color="#4F46E5" />
                                <Text style={tw`text-gray-600 mt-4`}>{i18n.pharmacy('loading')}</Text>
                            </View>
                        ) : filteredMedicines.length === 0 ? (
                            <View style={tw`items-center py-20`}>
                                <Ionicons name="medical-outline" size={64} color="#D1D5DB" />
                                <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No medicines found</Text>
                                <Text style={tw`text-gray-400 text-center px-8`}>
                                    Try adjusting your search or category filter
                                </Text>
                            </View>
                        ) : (
                            filteredMedicines.map((medicine, index) => (
                                <Animated.View
                                    key={medicine.id}
                                    style={[
                                        tw`mb-4`,
                                        {
                                            opacity: cardAnim,
                                            transform: [{
                                                translateY: cardAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [10 * (index + 1), 0],
                                                }),
                                            }],
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-4`}
                                        onPress={() => handleMedicinePress(medicine)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={tw`flex-col items-start`}>
                                            <View style={tw`flex-1`}>
                                                <View style={tw`flex-row items-center justify-between mb-2`}>
                                                    <Text style={tw`text-gray-900 font-bold text-lg flex-1 mr-2`}>
                                                        {medicine.name}
                                                    </Text>
                                                    <View style={tw`px-2 py-1 rounded-full ${getAvailabilityColor(medicine.availability)}`}>
                                                        <Text style={tw`text-xs font-medium`}>
                                                            {medicine.availability}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <View style={tw`px-2 py-1 rounded bg-indigo-100 mr-3`}>
                                                        <Text style={tw`text-indigo-600 text-xs font-medium`}>
                                                            {medicine.category}
                                                        </Text>
                                                    </View>
                                                    <View style={tw`flex-row items-center`}>
                                                        <Ionicons name="sparkles" size={14} color="#10B981" />
                                                        <Text style={tw`text-green-600 text-xs font-medium ml-1`}>
                                                            AI Score: {medicine.aiScore}%
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Text style={tw`text-gray-600 text-sm mb-3 leading-5`} numberOfLines={2}>
                                                    {medicine.description}
                                                </Text>

                                                <View style={tw`flex-row items-center justify-between`}>
                                                    <View style={tw`flex-row items-center`}>
                                                        <Ionicons name="pricetag" size={16} color="#6B7280" />
                                                        <Text style={tw`text-indigo-600 font-bold text-lg ml-1`}>
                                                            {medicine.price}
                                                        </Text>
                                                    </View>

                                                    <View style={tw`flex-row items-center`}>
                                                        {medicine.prescriptionRequired && (
                                                            <View style={tw`flex-row items-center mr-3`}>
                                                                <Ionicons name="document-text" size={16} color="#F59E0B" />
                                                                <Text style={tw`text-orange-600 text-xs ml-1`}>Rx Required</Text>
                                                            </View>
                                                        )}
                                                        <TouchableOpacity
                                                            style={tw`bg-indigo-500 px-4 py-2 rounded-xl flex-row items-center`}
                                                            onPress={() => handleMedicinePress(medicine)}
                                                        >
                                                            <Ionicons name="information-circle" size={16} color="white" />
                                                            <Text style={tw`text-white font-medium text-sm ml-1`}>Details</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))
                        )}
                    </View>
                </Animated.View>
            </ScrollView>

            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </View>
    );
};

export default MedicineScreen;
