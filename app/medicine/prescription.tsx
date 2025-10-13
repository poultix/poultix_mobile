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

// Mock AI-generated prescription data for learning
const mockPrescriptions = [
    {
        id: '1',
        prescriptionNumber: 'PRX-2024-001',
        date: '2024-10-13',
        veterinarian: 'Dr. John Uwimana',
        veterinarianId: 'RVC-12345',
        clinic: 'Kigali Veterinary Clinic',
        animalType: 'Dairy Cow',
        animalId: 'COW-456',
        diagnosis: 'Respiratory infection, suspected pneumonia',
        status: 'Active',
        expiryDate: '2024-11-13',
        medicines: [
            {
                id: 'med1',
                name: 'Amoxicillin Injectable',
                dosage: '15mg/kg body weight',
                frequency: 'Once daily',
                duration: '5 days',
                quantity: '2 vials (100ml each)',
                instructions: 'Intramuscular injection, alternate injection sites',
                completed: false
            },
            {
                id: 'med2',
                name: 'Meloxicam Anti-inflammatory',
                dosage: '0.5mg/kg subcutaneous',
                frequency: 'Once daily',
                duration: '3 days',
                quantity: '1 vial (50ml)',
                instructions: 'Subcutaneous injection, monitor for side effects',
                completed: true
            }
        ],
        aiRecommendations: [
            'Monitor temperature daily during treatment',
            'Ensure adequate water intake',
            'Consider probiotic supplementation after antibiotic course',
            'Schedule follow-up appointment in 1 week'
        ]
    },
    {
        id: '2',
        prescriptionNumber: 'PRX-2024-002',
        date: '2024-10-10',
        veterinarian: 'Dr. Alice Mukamana',
        veterinarianId: 'RVC-67890',
        clinic: 'Gasabo Animal Health Center',
        animalType: 'Goat',
        animalId: 'GOAT-789',
        diagnosis: 'Parasitic infestation (internal worms)',
        status: 'Completed',
        expiryDate: '2024-11-10',
        medicines: [
            {
                id: 'med3',
                name: 'Ivermectin Pour-On',
                dosage: '1ml per 10kg body weight',
                frequency: 'Single dose',
                duration: '1 day',
                quantity: '1 bottle (250ml)',
                instructions: 'Apply along the back from shoulders to tail',
                completed: true
            }
        ],
        aiRecommendations: [
            'Repeat treatment in 2 weeks if necessary',
            'Maintain good hygiene in animal housing',
            'Monitor fecal consistency for improvement'
        ]
    }
];

const PrescriptionScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('active');
    const [filteredPrescriptions, setFilteredPrescriptions] = useState(mockPrescriptions);
    const [loading, setLoading] = useState(false);

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

    // Filter prescriptions
    useEffect(() => {
        let filtered = mockPrescriptions;

        // Filter by status
        if (selectedTab === 'active') {
            filtered = filtered.filter(p => p.status === 'Active');
        } else if (selectedTab === 'completed') {
            filtered = filtered.filter(p => p.status === 'Completed');
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(prescription =>
                prescription.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prescription.veterinarian.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prescription.animalType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredPrescriptions(filtered);
    }, [searchQuery, selectedTab]);

    const handlePrescriptionPress = (prescription: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            'Prescription Details',
            `View detailed information for ${prescription.prescriptionNumber}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'View Details', onPress: () => {} },
                { 
                    text: 'Find Medicines', 
                    onPress: () => router.push('/medicine/nearby-pharmacies')
                }
            ]
        );
    };

    const markMedicineCompleted = (prescriptionId: string, medicineId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            'Mark as Completed',
            'Mark this medicine as completed in the treatment plan?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Complete', onPress: () => {
                    // Update medicine status (mock implementation)
                    Alert.alert('Success', 'Medicine marked as completed!');
                }}
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-green-600 bg-green-100';
            case 'Completed': return 'text-blue-600 bg-blue-100';
            case 'Expired': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const tabs = [
        { id: 'active', label: 'Active', count: mockPrescriptions.filter(p => p.status === 'Active').length },
        { id: 'completed', label: 'Completed', count: mockPrescriptions.filter(p => p.status === 'Completed').length },
        { id: 'all', label: 'All', count: mockPrescriptions.length }
    ];

    useEffect(() => {
        startAnimations();
    }, []);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#7C3AED', '#A855F7']}
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
                        onPress={() => {
                            Alert.alert(
                                'New Prescription',
                                'Contact your veterinarian to create a new prescription.',
                                [{ text: 'OK' }]
                            );
                        }}
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-white text-sm opacity-90`}>
                            AI-Powered Medicine Management
                        </Text>
                        <Text style={tw`text-white text-2xl font-bold`}>
                            My Prescriptions
                        </Text>
                        <Text style={tw`text-purple-100 text-sm mt-1`}>
                            Track and manage veterinary prescriptions
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mt-4`}>
                        <View style={tw`flex-row justify-between`}>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {mockPrescriptions.filter(p => p.status === 'Active').length}
                                </Text>
                                <Text style={tw`text-purple-100 text-xs`}>Active</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {mockPrescriptions.reduce((acc, p) => acc + p.medicines.length, 0)}
                                </Text>
                                <Text style={tw`text-purple-100 text-xs`}>Medicines</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-white text-xl font-bold`}>AI</Text>
                                <Text style={tw`text-purple-100 text-xs`}>Insights</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </LinearGradient>

            {/* Search Bar */}
            <View style={tw`px-4 py-4 bg-white border-b border-gray-200`}>
                <View style={tw`flex-row items-center bg-gray-100 rounded-2xl p-3`}>
                    <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                    <TextInput
                        style={tw`flex-1 text-gray-800 text-base`}
                        placeholder="Search prescriptions..."
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
            </View>

            {/* Tabs */}
            <View style={tw`bg-white border-b border-gray-200`}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-4 py-3`}
                >
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={tw`mr-6 pb-2 ${selectedTab === tab.id ? 'border-b-2 border-purple-500' : ''}`}
                            onPress={() => setSelectedTab(tab.id)}
                        >
                            <View style={tw`flex-row items-center`}>
                                <Text
                                    style={tw`font-medium ${
                                        selectedTab === tab.id ? 'text-purple-600' : 'text-gray-600'
                                    }`}
                                >
                                    {tab.label}
                                </Text>
                                <View style={tw`ml-2 bg-gray-200 rounded-full px-2 py-1`}>
                                    <Text style={tw`text-gray-700 text-xs font-bold`}>{tab.count}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {loading ? (
                        <View style={tw`items-center py-20`}>
                            <ActivityIndicator size="large" color="#7C3AED" />
                            <Text style={tw`text-gray-600 mt-4`}>Loading prescriptions...</Text>
                        </View>
                    ) : filteredPrescriptions.length === 0 ? (
                        <View style={tw`items-center py-20`}>
                            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                            <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No prescriptions found</Text>
                            <Text style={tw`text-gray-400 text-center px-8`}>
                                {selectedTab === 'active' 
                                    ? 'You have no active prescriptions'
                                    : 'Try adjusting your search or filter'
                                }
                            </Text>
                        </View>
                    ) : (
                        filteredPrescriptions.map((prescription, index) => (
                            <Animated.View
                                key={prescription.id}
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
                                <TouchableOpacity
                                    style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-5`}
                                    onPress={() => handlePrescriptionPress(prescription)}
                                    activeOpacity={0.7}
                                >
                                    {/* Header */}
                                    <View style={tw`flex-row items-start justify-between mb-4`}>
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>
                                                {prescription.prescriptionNumber}
                                            </Text>
                                            <Text style={tw`text-gray-600 text-sm`}>
                                                {prescription.date} • {prescription.animalType}
                                            </Text>
                                        </View>
                                        
                                        <View style={tw`px-3 py-1 rounded-full ${getStatusColor(prescription.status)}`}>
                                            <Text style={tw`text-xs font-bold`}>
                                                {prescription.status}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Veterinarian Info */}
                                    <View style={tw`bg-purple-50 rounded-xl p-4 mb-4`}>
                                        <View style={tw`flex-row items-center`}>
                                            <Ionicons name="person-circle" size={24} color="#7C3AED" />
                                            <View style={tw`ml-3 flex-1`}>
                                                <Text style={tw`text-purple-800 font-bold`}>
                                                    {prescription.veterinarian}
                                                </Text>
                                                <Text style={tw`text-purple-600 text-sm`}>
                                                    {prescription.clinic}
                                                </Text>
                                            </View>
                                            <Text style={tw`text-purple-600 text-xs`}>
                                                ID: {prescription.veterinarianId}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Diagnosis */}
                                    <View style={tw`mb-4`}>
                                        <Text style={tw`text-gray-700 font-medium mb-2`}>Diagnosis:</Text>
                                        <Text style={tw`text-gray-600 leading-5`}>
                                            {prescription.diagnosis}
                                        </Text>
                                    </View>

                                    {/* Medicines */}
                                    <View style={tw`mb-4`}>
                                        <Text style={tw`text-gray-700 font-medium mb-3`}>
                                            Prescribed Medicines ({prescription.medicines.length}):
                                        </Text>
                                        {prescription.medicines.map((medicine, idx) => (
                                            <View key={medicine.id} style={tw`mb-3 p-3 bg-gray-50 rounded-xl`}>
                                                <View style={tw`flex-row items-start justify-between mb-2`}>
                                                    <Text style={tw`text-gray-900 font-bold flex-1 mr-2`}>
                                                        {medicine.name}
                                                    </Text>
                                                    
                                                    {medicine.completed ? (
                                                        <View style={tw`bg-green-100 px-2 py-1 rounded-full`}>
                                                            <Text style={tw`text-green-600 text-xs font-bold`}>Completed</Text>
                                                        </View>
                                                    ) : (
                                                        <TouchableOpacity
                                                            style={tw`bg-blue-100 px-2 py-1 rounded-full`}
                                                            onPress={() => markMedicineCompleted(prescription.id, medicine.id)}
                                                        >
                                                            <Text style={tw`text-blue-600 text-xs font-bold`}>Mark Done</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                                
                                                <Text style={tw`text-gray-600 text-sm mb-1`}>
                                                    <Text style={tw`font-medium`}>Dosage:</Text> {medicine.dosage}
                                                </Text>
                                                <Text style={tw`text-gray-600 text-sm mb-1`}>
                                                    <Text style={tw`font-medium`}>Frequency:</Text> {medicine.frequency} for {medicine.duration}
                                                </Text>
                                                <Text style={tw`text-gray-600 text-sm mb-1`}>
                                                    <Text style={tw`font-medium`}>Quantity:</Text> {medicine.quantity}
                                                </Text>
                                                <Text style={tw`text-gray-500 text-xs italic`}>
                                                    {medicine.instructions}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* AI Recommendations */}
                                    {prescription.aiRecommendations.length > 0 && (
                                        <View style={tw`bg-blue-50 rounded-xl p-4 mb-4`}>
                                            <View style={tw`flex-row items-center mb-3`}>
                                                <Ionicons name="sparkles" size={20} color="#3B82F6" />
                                                <Text style={tw`text-blue-800 font-bold ml-2`}>AI Recommendations</Text>
                                            </View>
                                            {prescription.aiRecommendations.map((rec, idx) => (
                                                <View key={idx} style={tw`flex-row items-start mb-2 last:mb-0`}>
                                                    <View style={tw`w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3`} />
                                                    <Text style={tw`text-blue-700 text-sm flex-1`}>{rec}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    {/* Action Buttons */}
                                    <View style={tw`flex-row space-x-3`}>
                                        <TouchableOpacity
                                            style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                            onPress={() => handlePrescriptionPress(prescription)}
                                        >
                                            <Ionicons name="document-text-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                            <Text style={tw`text-gray-700 font-bold`}>View Details</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={tw`flex-1 bg-purple-100 py-3 rounded-xl flex-row items-center justify-center`}
                                            onPress={() => router.push('/medicine/nearby-pharmacies')}
                                        >
                                            <Ionicons name="storefront-outline" size={18} color="#7C3AED" style={tw`mr-2`} />
                                            <Text style={tw`text-purple-600 font-bold`}>Find Medicines</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default PrescriptionScreen;
