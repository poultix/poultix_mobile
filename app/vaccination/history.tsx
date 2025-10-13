import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// Mock vaccination history data
const mockHistory = [
    {
        id: '1',
        animalType: 'Dairy Cow',
        animalId: 'COW-001',
        farmName: 'Kigali Dairy Farm',
        vaccinations: [
            {
                date: '2024-04-15',
                vaccine: 'Foot and Mouth Disease',
                veterinarian: 'Dr. John Uwimana',
                dosage: '2ml subcutaneous',
                batchNumber: 'FMD-2024-001',
                nextDue: '2024-10-15',
                status: 'Completed'
            },
            {
                date: '2024-03-20',
                vaccine: 'Black Quarter',
                veterinarian: 'Dr. Alice Mukamana',
                dosage: '5ml subcutaneous',
                batchNumber: 'BQ-2024-045',
                nextDue: '2025-03-20',
                status: 'Completed'
            },
            {
                date: '2023-11-01',
                vaccine: 'Anthrax',
                veterinarian: 'Dr. Samuel Nkurunziza',
                dosage: '1ml subcutaneous',
                batchNumber: 'ANT-2023-112',
                nextDue: '2024-11-01',
                status: 'Completed'
            }
        ]
    },
    {
        id: '2',
        animalType: 'Goat',
        animalId: 'GOAT-045',
        farmName: 'Musanze Goat Cooperative',
        vaccinations: [
            {
                date: '2021-10-20',
                vaccine: 'Peste des Petits Ruminants',
                veterinarian: 'Dr. Grace Uwase',
                dosage: '1ml subcutaneous',
                batchNumber: 'PPR-2021-078',
                nextDue: '2024-10-20',
                status: 'Overdue'
            },
            {
                date: '2024-08-15',
                vaccine: 'Clostridial Diseases',
                veterinarian: 'Dr. John Uwimana',
                dosage: '2ml subcutaneous',
                batchNumber: 'CD-2024-023',
                nextDue: '2025-08-15',
                status: 'Completed'
            }
        ]
    }
];

const VaccinationHistoryScreen = () => {
    const [selectedAnimal, setSelectedAnimal] = useState('all');
    const [filteredHistory, setFilteredHistory] = useState(mockHistory);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;

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
        ]).start();
    };

    // Filter history
    useEffect(() => {
        let filtered = mockHistory;

        if (selectedAnimal !== 'all') {
            filtered = filtered.filter(history => history.animalId === selectedAnimal);
        }

        setFilteredHistory(filtered);
    }, [selectedAnimal]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-green-600 bg-green-100';
            case 'Overdue': return 'text-red-600 bg-red-100';
            case 'Upcoming': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const animalOptions = [
        { id: 'all', label: 'All Animals', count: mockHistory.length },
        ...mockHistory.map(h => ({ id: h.animalId, label: `${h.animalType} ${h.animalId}`, count: 1 }))
    ];

    useEffect(() => {
        startAnimations();
    }, []);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#10B981', '#059669']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <View style={tw`flex-row items-center justify-between mb-4`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                        onPress={() => router.push('/vaccination/schedule')}
                    >
                        <Ionicons name="calendar-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-white text-sm opacity-90`}>
                            Complete Vaccination Records
                        </Text>
                        <Text style={tw`text-white text-2xl font-bold`}>
                            Vaccination History
                        </Text>
                        <Text style={tw`text-green-100 text-sm mt-1`}>
                            Track all vaccination records for your animals
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mt-4`}>
                        <View style={tw`flex-row justify-between`}>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {mockHistory.reduce((acc, h) => acc + h.vaccinations.length, 0)}
                                </Text>
                                <Text style={tw`text-green-100 text-xs`}>Total Vaccines</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {mockHistory.reduce((acc, h) => acc + h.vaccinations.filter(v => v.status === 'Completed').length, 0)}
                                </Text>
                                <Text style={tw`text-green-100 text-xs`}>Completed</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-red-200 text-xl font-bold`}>
                                    {mockHistory.reduce((acc, h) => acc + h.vaccinations.filter(v => v.status === 'Overdue').length, 0)}
                                </Text>
                                <Text style={tw`text-green-100 text-xs`}>Overdue</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </LinearGradient>

            {/* Animal Filter */}
            <View style={tw`bg-white border-b border-gray-200`}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-4 py-3`}
                >
                    {animalOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={tw`mr-4 px-4 py-2 rounded-xl ${
                                selectedAnimal === option.id
                                    ? 'bg-green-500'
                                    : 'bg-gray-100 border border-gray-200'
                            }`}
                            onPress={() => setSelectedAnimal(option.id)}
                        >
                            <Text
                                style={tw`font-medium ${
                                    selectedAnimal === option.id ? 'text-white' : 'text-gray-700'
                                }`}
                            >
                                {option.label} ({option.count})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {filteredHistory.map((history, index) => (
                        <Animated.View
                            key={history.id}
                            style={[
                                tw`mb-6`,
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
                            <View style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-5`}>
                                {/* Animal Header */}
                                <View style={tw`flex-row items-center mb-4 pb-3 border-b border-gray-100`}>
                                    <View style={tw`w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-3`}>
                                        <Ionicons name="paw" size={24} color="#059669" />
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-gray-900 font-bold text-lg`}>
                                            {history.animalType} • {history.animalId}
                                        </Text>
                                        <Text style={tw`text-gray-600 text-sm`}>
                                            {history.farmName}
                                        </Text>
                                    </View>
                                    <View style={tw`bg-green-100 px-3 py-1 rounded-full`}>
                                        <Text style={tw`text-green-700 text-xs font-bold`}>
                                            {history.vaccinations.length} vaccines
                                        </Text>
                                    </View>
                                </View>

                                {/* Vaccination Records */}
                                {history.vaccinations.map((vaccination, idx) => (
                                    <View key={idx} style={tw`mb-4 last:mb-0`}>
                                        <View style={tw`bg-gray-50 rounded-xl p-4`}>
                                            <View style={tw`flex-row items-center justify-between mb-3`}>
                                                <Text style={tw`text-gray-900 font-bold`}>
                                                    {vaccination.vaccine}
                                                </Text>
                                                <View style={tw`px-2 py-1 rounded-full ${getStatusColor(vaccination.status)}`}>
                                                    <Text style={tw`text-xs font-bold`}>
                                                        {vaccination.status}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={tw`space-y-2`}>
                                                <View style={tw`flex-row justify-between`}>
                                                    <Text style={tw`text-gray-600 text-sm`}>Date Given:</Text>
                                                    <Text style={tw`text-gray-900 font-medium text-sm`}>{vaccination.date}</Text>
                                                </View>
                                                <View style={tw`flex-row justify-between`}>
                                                    <Text style={tw`text-gray-600 text-sm`}>Veterinarian:</Text>
                                                    <Text style={tw`text-gray-900 font-medium text-sm flex-1 text-right ml-4`}>
                                                        {vaccination.veterinarian}
                                                    </Text>
                                                </View>
                                                <View style={tw`flex-row justify-between`}>
                                                    <Text style={tw`text-gray-600 text-sm`}>Dosage:</Text>
                                                    <Text style={tw`text-gray-900 font-medium text-sm`}>{vaccination.dosage}</Text>
                                                </View>
                                                <View style={tw`flex-row justify-between`}>
                                                    <Text style={tw`text-gray-600 text-sm`}>Batch:</Text>
                                                    <Text style={tw`text-gray-900 font-medium text-sm`}>{vaccination.batchNumber}</Text>
                                                </View>
                                                <View style={tw`flex-row justify-between`}>
                                                    <Text style={tw`text-gray-600 text-sm`}>Next Due:</Text>
                                                    <Text style={tw`text-gray-900 font-medium text-sm ${
                                                        vaccination.status === 'Overdue' ? 'text-red-600' : ''
                                                    }`}>
                                                        {vaccination.nextDue}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>
                    ))}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default VaccinationHistoryScreen;
