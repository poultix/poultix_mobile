import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

interface Prescription {
    id: string;
    patientName: string;
    animalType: string;
    ownerName: string;
    diagnosis: string;
    medicines: {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }[];
    createdDate: string;
    status: 'Active' | 'Completed' | 'Cancelled';
}

const PrescriptionHistoryScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [prescriptions] = useState<Prescription[]>([
        {
            id: 'PRE-001',
            patientName: 'Bella',
            animalType: 'Cattle',
            ownerName: 'John Farmer',
            diagnosis: 'Bacterial Pneumonia',
            medicines: [
                {
                    name: 'Amoxicillin Injectable',
                    dosage: '15mg/kg',
                    duration: '5 days',
                    frequency: 'Twice daily'
                },
                {
                    name: 'Vitamin B Complex',
                    dosage: '5ml',
                    duration: '7 days',
                    frequency: 'Once daily'
                }
            ],
            createdDate: '2024-10-15',
            status: 'Active'
        },
        {
            id: 'PRE-002',
            patientName: 'Max',
            animalType: 'Goat',
            ownerName: 'Mary Farmer',
            diagnosis: 'Parasitic Infection',
            medicines: [
                {
                    name: 'Ivermectin Injection',
                    dosage: '0.2mg/kg',
                    duration: '1 day',
                    frequency: 'Single dose'
                }
            ],
            createdDate: '2024-10-12',
            status: 'Completed'
        },
        {
            id: 'PRE-003',
            patientName: 'Luna',
            animalType: 'Sheep',
            ownerName: 'Peter Farmer',
            diagnosis: 'Nutritional Deficiency',
            medicines: [
                {
                    name: 'Calcium Gluconate',
                    dosage: '10ml',
                    duration: '3 days',
                    frequency: 'Twice daily'
                },
                {
                    name: 'Vitamin AD3E Injection',
                    dosage: '5ml',
                    duration: '5 days',
                    frequency: 'Once daily'
                }
            ],
            createdDate: '2024-10-10',
            status: 'Active'
        }
    ]);

    const statusFilters = ['All', 'Active', 'Completed', 'Cancelled'];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const filteredPrescriptions = prescriptions.filter(prescription => {
        const matchesSearch = prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             prescription.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || prescription.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
            case 'Completed': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
            case 'Cancelled': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#7C3AED', '#5B21B6']}
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
                        Prescription History
                    </Text>
                    <Text style={tw`text-purple-100 text-sm`}>
                        View and manage your prescriptions
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Search and Filter */}
                    <View style={tw`mb-6`}>
                        <TextInput
                            style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm text-gray-800`}
                            placeholder="Search by patient, owner, or diagnosis..."
                            placeholderTextColor="#6B7280"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {statusFilters.map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    style={tw`mr-3 px-4 py-2 rounded-xl ${
                                        selectedStatus === status
                                            ? 'bg-purple-500'
                                            : 'bg-white border border-gray-200'
                                    }`}
                                    onPress={() => setSelectedStatus(status)}
                                >
                                    <Text style={tw`font-medium ${
                                        selectedStatus === status ? 'text-white' : 'text-gray-700'
                                    }`}>
                                        {status}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Statistics */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Statistics</Text>
                        <View style={tw`flex-row justify-between`}>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-2xl font-bold text-gray-800`}>{prescriptions.length}</Text>
                                <Text style={tw`text-gray-500 text-sm`}>Total</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-2xl font-bold text-green-600`}>
                                    {prescriptions.filter(p => p.status === 'Active').length}
                                </Text>
                                <Text style={tw`text-gray-500 text-sm`}>Active</Text>
                            </View>
                            <View style={tw`items-center flex-1`}>
                                <Text style={tw`text-2xl font-bold text-blue-600`}>
                                    {prescriptions.filter(p => p.status === 'Completed').length}
                                </Text>
                                <Text style={tw`text-gray-500 text-sm`}>Completed</Text>
                            </View>
                        </View>
                    </View>

                    {/* Create New Prescription Button */}
                    <TouchableOpacity
                        style={tw`bg-purple-500 py-4 rounded-2xl flex-row items-center justify-center mb-6`}
                        onPress={() => router.push('/veterinary/create-prescription')}
                    >
                        <Ionicons name="add-circle-outline" size={20} color="white" style={tw`mr-3`} />
                        <Text style={tw`text-white font-bold text-lg`}>Create New Prescription</Text>
                    </TouchableOpacity>

                    {/* Prescriptions List */}
                    <View style={tw`space-y-3`}>
                        {filteredPrescriptions.map((prescription) => {
                            const statusColors = getStatusColor(prescription.status);

                            return (
                                <TouchableOpacity
                                    key={prescription.id}
                                    style={tw`bg-white rounded-2xl p-5 shadow-sm`}
                                    onPress={() => router.push(`/veterinary/prescription-detail?id=${prescription.id}`)}
                                >
                                    <View style={tw`flex-row items-center justify-between mb-3`}>
                                        <View style={tw`flex-1 mr-4`}>
                                            <Text style={tw`text-gray-900 font-semibold text-lg mb-1`}>
                                                {prescription.patientName}
                                            </Text>
                                            <Text style={tw`text-gray-500 text-sm`}>
                                                {prescription.animalType} • {prescription.ownerName}
                                            </Text>
                                        </View>

                                        <View style={tw`px-3 py-1 rounded-full ${statusColors.bg} border ${statusColors.border}`}>
                                            <Text style={tw`text-xs font-bold ${statusColors.text}`}>
                                                {prescription.status}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={tw`mb-3`}>
                                        <Text style={tw`text-gray-600 text-sm mb-1`}>Diagnosis:</Text>
                                        <Text style={tw`text-gray-800 font-medium`}>{prescription.diagnosis}</Text>
                                    </View>

                                    <View style={tw`mb-4`}>
                                        <Text style={tw`text-gray-600 text-sm mb-2`}>Medicines:</Text>
                                        <View style={tw`space-y-1`}>
                                            {prescription.medicines.slice(0, 2).map((medicine, index) => (
                                                <Text key={index} style={tw`text-gray-700 text-sm`}>
                                                    • {medicine.name} ({medicine.dosage})
                                                </Text>
                                            ))}
                                            {prescription.medicines.length > 2 && (
                                                <Text style={tw`text-gray-500 text-sm`}>
                                                    +{prescription.medicines.length - 2} more medicines
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    <View style={tw`flex-row items-center justify-between`}>
                                        <Text style={tw`text-gray-500 text-sm`}>
                                            Created: {prescription.createdDate}
                                        </Text>

                                        <View style={tw`flex-row space-x-2`}>
                                            <TouchableOpacity
                                                style={tw`bg-gray-100 px-3 py-2 rounded-lg`}
                                                onPress={() => router.push(`/veterinary/prescription-detail?id=${prescription.id}`)}
                                            >
                                                <Text style={tw`text-gray-700 text-sm font-medium`}>View</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={tw`bg-purple-100 px-3 py-2 rounded-lg`}
                                                onPress={() => router.push(`/veterinary/create-prescription`)}
                                            >
                                                <Text style={tw`text-purple-700 text-sm font-medium`}>Create Similar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {filteredPrescriptions.length === 0 && (
                        <View style={tw`items-center py-20`}>
                            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                            <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No prescriptions found</Text>
                            <Text style={tw`text-gray-400 text-center px-8 mb-4`}>
                                Try adjusting your search or filter criteria
                            </Text>
                            <TouchableOpacity
                                style={tw`bg-purple-500 px-6 py-3 rounded-xl`}
                                onPress={() => router.push('/veterinary/create-prescription')}
                            >
                                <Text style={tw`text-white font-medium`}>Create First Prescription</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default PrescriptionHistoryScreen;
