import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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

// Mock AI-generated vaccine data for learning
const mockVaccines = [
    {
        id: '1',
        name: 'Foot and Mouth Disease Vaccine',
        category: 'Viral Diseases',
        description: 'AI-recommended preventive vaccine for FMD, the most economically devastating disease affecting livestock worldwide.',
        targetDisease: 'Foot and Mouth Disease',
        dosage: '2ml subcutaneous',
        administration: 'Subcutaneous injection',
        storage: '2-8°C refrigerator',
        prescriptionRequired: true,
        manufacturer: 'VetBio Rwanda',
        price: '₹450 per dose',
        availability: 'In Stock',
        aiScore: 98,
        priority: 'High',
        herdImmunity: '80%',
        durationProtection: '6 months',
        commonFor: ['Cattle', 'Sheep', 'Goats'],
        schedule: 'Annual booster recommended'
    },
    {
        id: '2',
        name: 'Newcastle Disease Vaccine',
        category: 'Poultry Diseases',
        description: 'AI-optimized vaccine for Newcastle disease prevention in poultry. Essential for commercial and backyard flocks.',
        targetDisease: 'Newcastle Disease',
        dosage: '0.5ml per bird',
        administration: 'Subcutaneous or intramuscular',
        storage: '2-8°C refrigerator',
        prescriptionRequired: false,
        manufacturer: 'PoultryHealth Labs',
        price: '₹120 per 100 doses',
        availability: 'In Stock',
        aiScore: 95,
        priority: 'Critical',
        herdImmunity: '85%',
        durationProtection: '4-6 months',
        commonFor: ['Chickens', 'Turkeys', 'Ducks'],
        schedule: 'Every 4-6 months'
    },
    {
        id: '3',
        name: 'Black Quarter Vaccine',
        category: 'Bacterial Diseases',
        description: 'AI-formulated vaccine against anthrax and black quarter. Critical for cattle health in high-risk areas.',
        targetDisease: 'Black Quarter (Clostridial diseases)',
        dosage: '5ml subcutaneous',
        administration: 'Subcutaneous injection',
        storage: '2-8°C refrigerator',
        prescriptionRequired: true,
        manufacturer: 'AgriVet International',
        price: '₹280 per dose',
        availability: 'Low Stock',
        aiScore: 92,
        priority: 'High',
        herdImmunity: '75%',
        durationProtection: '1 year',
        commonFor: ['Cattle', 'Buffalo'],
        schedule: 'Annual vaccination'
    },
    {
        id: '4',
        name: 'Peste des Petits Ruminants Vaccine',
        category: 'Viral Diseases',
        description: 'AI-recommended vaccine for PPR in small ruminants. Key component of Rwanda\'s PPR eradication program.',
        targetDisease: 'Peste des Petits Ruminants',
        dosage: '1ml subcutaneous',
        administration: 'Subcutaneous injection',
        storage: 'Freeze-dried, reconstituted with diluent',
        prescriptionRequired: true,
        manufacturer: 'Global Vet Solutions',
        price: '₹180 per dose',
        availability: 'In Stock',
        aiScore: 97,
        priority: 'Critical',
        herdImmunity: '70%',
        durationProtection: '3 years',
        commonFor: ['Goats', 'Sheep'],
        schedule: 'Every 3 years'
    },
    {
        id: '5',
        name: 'Rabies Vaccine',
        category: 'Zoonotic Diseases',
        description: 'AI-optimized rabies vaccine for livestock. Essential for human health protection and livestock management.',
        targetDisease: 'Rabies',
        dosage: '2ml intramuscular',
        administration: 'Intramuscular injection',
        storage: '2-8°C refrigerator',
        prescriptionRequired: true,
        manufacturer: 'RabiesFree International',
        price: '₹350 per dose',
        availability: 'In Stock',
        aiScore: 99,
        priority: 'Critical',
        herdImmunity: 'Not applicable',
        durationProtection: '2 years',
        commonFor: ['Dogs', 'Cats', 'Cattle', 'Horses'],
        schedule: 'Annual booster'
    }
];

const categories = [
    { name: 'All', icon: 'grid-outline', count: mockVaccines.length },
    { name: 'Viral Diseases', icon: 'bug-outline', count: 2 },
    { name: 'Bacterial Diseases', icon: 'shield-checkmark-outline', count: 1 },
    { name: 'Poultry Diseases', icon: 'leaf-outline', count: 1 },
    { name: 'Zoonotic Diseases', icon: 'warning-outline', count: 1 }
];

const VaccinationScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredVaccines, setFilteredVaccines] = useState(mockVaccines);
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

    // Filter vaccines
    useEffect(() => {
        let filtered = mockVaccines;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(vaccine => vaccine.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(vaccine =>
                vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vaccine.targetDisease.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vaccine.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredVaccines(filtered);
    }, [searchQuery, selectedCategory]);

    const handleVaccinePress = (vaccine: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/vaccination/detail?id=${vaccine.id}&name=${encodeURIComponent(vaccine.name)}`);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-600 bg-red-100';
            case 'High': return 'text-orange-600 bg-orange-100';
            case 'Medium': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
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
                            colors={['#3B82F6', '#1D4ED8']}
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
                                    onPress={() => router.push('/vaccination/schedule')}
                                >
                                    <Ionicons name="calendar-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View style={tw`flex-1`}>
                                <Text style={tw`text-white text-sm opacity-90`}>
                                    AI-Powered Vaccine Discovery
                                </Text>
                                <Text style={tw`text-white text-2xl font-bold`}>
                                    Veterinary Vaccines
                                </Text>
                                <Text style={tw`text-blue-100 text-sm mt-1`}>
                                    Smart vaccination recommendations for animal health
                                </Text>
                            </View>

                            {/* AI Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mt-4`}>
                                <Text style={tw`text-white font-bold text-base mb-3`}>AI Insights</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-white text-xl font-bold`}>{mockVaccines.length}</Text>
                                        <Text style={tw`text-blue-100 text-xs`}>Vaccines</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-xl font-bold`}>AI</Text>
                                        <Text style={tw`text-blue-100 text-xs`}>Verified</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-orange-200 text-xl font-bold`}>
                                            {mockVaccines.filter(v => v.availability === 'In Stock').length}
                                        </Text>
                                        <Text style={tw`text-blue-100 text-xs`}>Available</Text>
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
                                    placeholder="Search vaccines, diseases..."
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
                                    style={tw`mr-3 px-4 py-3 rounded-xl flex-row items-center ${
                                        selectedCategory === category.name
                                            ? 'bg-blue-500 shadow-lg'
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
                                        style={tw`font-medium ${
                                            selectedCategory === category.name
                                                ? 'text-white'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {category.name} ({category.count})
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Vaccine List */}
                        {loading ? (
                            <View style={tw`items-center py-20`}>
                                <ActivityIndicator size="large" color="#3B82F6" />
                                <Text style={tw`text-gray-600 mt-4`}>Loading vaccines...</Text>
                            </View>
                        ) : filteredVaccines.length === 0 ? (
                            <View style={tw`items-center py-20`}>
                                <Ionicons name="medical-outline" size={64} color="#D1D5DB" />
                                <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No vaccines found</Text>
                                <Text style={tw`text-gray-400 text-center px-8`}>
                                    Try adjusting your search or category filter
                                </Text>
                            </View>
                        ) : (
                            filteredVaccines.map((vaccine, index) => (
                                <Animated.View
                                    key={vaccine.id}
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
                                        onPress={() => handleVaccinePress(vaccine)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={tw`flex-row items-start`}>
                                            <View style={tw`w-16 h-16 rounded-xl mr-4 items-center justify-center bg-blue-100`}>
                                                <Ionicons name="shield-checkmark" size={28} color="#3B82F6" />
                                            </View>
                                            
                                            <View style={tw`flex-1`}>
                                                <View style={tw`flex-row items-center justify-between mb-2`}>
                                                    <Text style={tw`text-gray-900 font-bold text-lg flex-1 mr-2`}>
                                                        {vaccine.name}
                                                    </Text>
                                                    <View style={tw`px-2 py-1 rounded-full ${getAvailabilityColor(vaccine.availability)}`}>
                                                        <Text style={tw`text-xs font-medium`}>
                                                            {vaccine.availability}
                                                        </Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center mb-2`}>
                                                    <View style={tw`px-2 py-1 rounded bg-blue-50 mr-3`}>
                                                        <Text style={tw`text-blue-700 text-xs font-medium`}>
                                                            {vaccine.category}
                                                        </Text>
                                                    </View>
                                                    <View style={tw`px-2 py-1 rounded-full ${getPriorityColor(vaccine.priority)} mr-3`}>
                                                        <Text style={tw`text-xs font-medium`}>
                                                            {vaccine.priority} Priority
                                                        </Text>
                                                    </View>
                                                    <View style={tw`flex-row items-center`}>
                                                        <Ionicons name="sparkles" size={14} color="#3B82F6" />
                                                        <Text style={tw`text-blue-600 text-xs font-medium ml-1`}>
                                                            AI Score: {vaccine.aiScore}%
                                                        </Text>
                                                    </View>
                                                </View>
                                                
                                                <Text style={tw`text-gray-600 text-sm mb-3 leading-5`} numberOfLines={2}>
                                                    {vaccine.description}
                                                </Text>
                                                
                                                <View style={tw`flex-row items-center justify-between mb-3`}>
                                                    <View style={tw`flex-row items-center`}>
                                                        <Ionicons name="medical" size={16} color="#6B7280" />
                                                        <Text style={tw`text-gray-600 text-sm ml-1`}>
                                                            {vaccine.targetDisease}
                                                        </Text>
                                                    </View>
                                                    <Text style={tw`text-blue-600 font-bold text-lg`}>
                                                        {vaccine.price}
                                                    </Text>
                                                </View>
                                                
                                                <View style={tw`flex-row items-center justify-between`}>
                                                    <View style={tw`flex-row items-center`}>
                                                        <Ionicons name="time" size={14} color="#6B7280" />
                                                        <Text style={tw`text-gray-500 text-sm ml-1 mr-3`}>
                                                            {vaccine.durationProtection}
                                                        </Text>
                                                        {vaccine.prescriptionRequired && (
                                                            <View style={tw`flex-row items-center`}>
                                                                <Ionicons name="document-text" size={14} color="#F59E0B" />
                                                                <Text style={tw`text-orange-600 text-sm ml-1`}>Rx Required</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    
                                                    <TouchableOpacity
                                                        style={tw`bg-blue-500 px-4 py-2 rounded-xl flex-row items-center`}
                                                        onPress={() => handleVaccinePress(vaccine)}
                                                    >
                                                        <Ionicons name="information-circle" size={16} color="white" />
                                                        <Text style={tw`text-white font-medium text-sm ml-1`}>Details</Text>
                                                    </TouchableOpacity>
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
        </View>
    );
};

export default VaccinationScreen;
