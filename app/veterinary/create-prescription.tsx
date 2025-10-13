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

interface Patient {
    id: string;
    name: string;
    type: 'cattle' | 'goat' | 'sheep' | 'pig' | 'chicken' | 'other';
    age: string;
    weight: string;
    ownerName: string;
    ownerPhone: string;
}

interface Medicine {
    id: string;
    name: string;
    dosage: string;
    duration: string;
    frequency: string;
    route: string;
    notes?: string;
}

const CreatePrescriptionScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState<Patient>({
        id: '',
        name: '',
        type: 'cattle',
        age: '',
        weight: '',
        ownerName: '',
        ownerPhone: ''
    });

    const [medicines, setMedicines] = useState<Medicine[]>([
        {
            id: '1',
            name: '',
            dosage: '',
            duration: '',
            frequency: '',
            route: 'Oral',
            notes: ''
        }
    ]);

    const [diagnosis, setDiagnosis] = useState('');
    const [clinicalSigns, setClinicalSigns] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');

    const animalTypes = ['cattle', 'goat', 'sheep', 'pig', 'chicken', 'other'];
    const administrationRoutes = ['Oral', 'Injectable (IM)', 'Injectable (IV)', 'Injectable (SC)', 'Topical', 'Inhalation'];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const addMedicine = () => {
        setMedicines([...medicines, {
            id: Date.now().toString(),
            name: '',
            dosage: '',
            duration: '',
            frequency: '',
            route: 'Oral',
            notes: ''
        }]);
    };

    const removeMedicine = (id: string) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter(med => med.id !== id));
        }
    };

    const updateMedicine = (id: string, field: string, value: string) => {
        setMedicines(medicines.map(med =>
            med.id === id ? { ...med, [field]: value } : med
        ));
    };

    const handleSubmit = async () => {
        // Validation
        if (!patient.name.trim() || !patient.ownerName.trim() || !diagnosis.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const hasEmptyMedicines = medicines.some(med => !med.name.trim() || !med.dosage.trim());
        if (hasEmptyMedicines) {
            Alert.alert('Error', 'Please complete all medicine details');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Prescription Created',
                'Prescription has been created successfully and sent to the farmer.',
                [
                    {
                        text: 'Create Another',
                        onPress: () => resetForm()
                    },
                    {
                        text: 'View History',
                        onPress: () => router.push('/veterinary/history'),
                        style: 'cancel'
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to create prescription. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setPatient({
            id: '',
            name: '',
            type: 'cattle',
            age: '',
            weight: '',
            ownerName: '',
            ownerPhone: ''
        });
        setMedicines([{
            id: '1',
            name: '',
            dosage: '',
            duration: '',
            frequency: '',
            route: 'Oral',
            notes: ''
        }]);
        setDiagnosis('');
        setClinicalSigns('');
        setAdditionalNotes('');
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
                        Create Prescription
                    </Text>
                    <Text style={tw`text-purple-100 text-sm`}>
                        Write prescription for animal treatment
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Patient Information */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Patient Information</Text>

                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>Animal Name *</Text>
                            <TextInput
                                style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                placeholder="e.g., Bella"
                                placeholderTextColor="#6B7280"
                                value={patient.name}
                                onChangeText={(value) => setPatient({...patient, name: value})}
                            />
                        </View>

                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>Animal Type *</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-2`}>
                                {animalTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={tw`mr-2 px-4 py-2 rounded-xl ${
                                            patient.type === type
                                                ? 'bg-purple-500'
                                                : 'bg-gray-100 border border-gray-200'
                                        }`}
                                        onPress={() => setPatient({...patient, type: type as any})}
                                    >
                                        <Text style={tw`font-medium capitalize ${
                                            patient.type === type ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={tw`flex-row space-x-3 mb-4`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Age</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="e.g., 2 years"
                                    placeholderTextColor="#6B7280"
                                    value={patient.age}
                                    onChangeText={(value) => setPatient({...patient, age: value})}
                                />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-600 text-sm mb-2`}>Weight</Text>
                                <TextInput
                                    style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                    placeholder="e.g., 450 kg"
                                    placeholderTextColor="#6B7280"
                                    value={patient.weight}
                                    onChangeText={(value) => setPatient({...patient, weight: value})}
                                />
                            </View>
                        </View>

                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>Owner Name *</Text>
                            <TextInput
                                style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                placeholder="Farmer's name"
                                placeholderTextColor="#6B7280"
                                value={patient.ownerName}
                                onChangeText={(value) => setPatient({...patient, ownerName: value})}
                            />
                        </View>

                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>Owner Phone</Text>
                            <TextInput
                                style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                placeholder="+250 XXX XXX XXX"
                                placeholderTextColor="#6B7280"
                                keyboardType="phone-pad"
                                value={patient.ownerPhone}
                                onChangeText={(value) => setPatient({...patient, ownerPhone: value})}
                            />
                        </View>
                    </View>

                    {/* Clinical Information */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Clinical Information</Text>

                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>Diagnosis *</Text>
                            <TextInput
                                style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                placeholder="Primary diagnosis"
                                placeholderTextColor="#6B7280"
                                value={diagnosis}
                                onChangeText={setDiagnosis}
                            />
                        </View>

                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>Clinical Signs</Text>
                            <TextInput
                                style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base min-h-[80px]`}
                                placeholder="Observed symptoms and signs"
                                placeholderTextColor="#6B7280"
                                multiline
                                numberOfLines={3}
                                value={clinicalSigns}
                                onChangeText={setClinicalSigns}
                            />
                        </View>
                    </View>

                    {/* Medicines */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <Text style={tw`text-gray-900 font-bold text-lg`}>Prescribed Medicines</Text>
                            <TouchableOpacity
                                style={tw`bg-purple-500 px-3 py-2 rounded-xl flex-row items-center`}
                                onPress={addMedicine}
                            >
                                <Ionicons name="add" size={16} color="white" style={tw`mr-1`} />
                                <Text style={tw`text-white font-medium`}>Add</Text>
                            </TouchableOpacity>
                        </View>

                        {medicines.map((medicine, index) => (
                            <View key={medicine.id} style={tw`mb-4 p-4 bg-gray-50 rounded-xl`}>
                                <View style={tw`flex-row items-center justify-between mb-3`}>
                                    <Text style={tw`text-gray-800 font-medium`}>Medicine {index + 1}</Text>
                                    {medicines.length > 1 && (
                                        <TouchableOpacity
                                            style={tw`bg-red-100 p-2 rounded-lg`}
                                            onPress={() => removeMedicine(medicine.id)}
                                        >
                                            <Ionicons name="trash-outline" size={16} color="#DC2626" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <View style={tw`mb-3`}>
                                    <Text style={tw`text-gray-600 text-sm mb-2`}>Medicine Name *</Text>
                                    <TextInput
                                        style={tw`bg-white rounded-lg p-3 text-gray-800 text-base`}
                                        placeholder="e.g., Amoxicillin 150mg/ml"
                                        placeholderTextColor="#6B7280"
                                        value={medicine.name}
                                        onChangeText={(value) => updateMedicine(medicine.id, 'name', value)}
                                    />
                                </View>

                                <View style={tw`mb-3`}>
                                    <Text style={tw`text-gray-600 text-sm mb-2`}>Dosage *</Text>
                                    <TextInput
                                        style={tw`bg-white rounded-lg p-3 text-gray-800 text-base`}
                                        placeholder="e.g., 15mg/kg body weight"
                                        placeholderTextColor="#6B7280"
                                        value={medicine.dosage}
                                        onChangeText={(value) => updateMedicine(medicine.id, 'dosage', value)}
                                    />
                                </View>

                                <View style={tw`flex-row space-x-3 mb-3`}>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-gray-600 text-sm mb-2`}>Duration</Text>
                                        <TextInput
                                            style={tw`bg-white rounded-lg p-3 text-gray-800 text-base`}
                                            placeholder="e.g., 5 days"
                                            placeholderTextColor="#6B7280"
                                            value={medicine.duration}
                                            onChangeText={(value) => updateMedicine(medicine.id, 'duration', value)}
                                        />
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-gray-600 text-sm mb-2`}>Frequency</Text>
                                        <TextInput
                                            style={tw`bg-white rounded-lg p-3 text-gray-800 text-base`}
                                            placeholder="e.g., Twice daily"
                                            placeholderTextColor="#6B7280"
                                            value={medicine.frequency}
                                            onChangeText={(value) => updateMedicine(medicine.id, 'frequency', value)}
                                        />
                                    </View>
                                </View>

                                <View style={tw`mb-3`}>
                                    <Text style={tw`text-gray-600 text-sm mb-2`}>Route of Administration</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-2`}>
                                        {administrationRoutes.map((route) => (
                                            <TouchableOpacity
                                                key={route}
                                                style={tw`mr-2 px-3 py-2 rounded-lg ${
                                                    medicine.route === route
                                                        ? 'bg-purple-500'
                                                        : 'bg-gray-200'
                                                }`}
                                                onPress={() => updateMedicine(medicine.id, 'route', route)}
                                            >
                                                <Text style={tw`font-medium text-sm ${
                                                    medicine.route === route ? 'text-white' : 'text-gray-700'
                                                }`}>
                                                    {route}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                <View style={tw`mb-3`}>
                                    <Text style={tw`text-gray-600 text-sm mb-2`}>Special Instructions</Text>
                                    <TextInput
                                        style={tw`bg-white rounded-lg p-3 text-gray-800 text-base`}
                                        placeholder="Additional notes for this medicine"
                                        placeholderTextColor="#6B7280"
                                        value={medicine.notes}
                                        onChangeText={(value) => updateMedicine(medicine.id, 'notes', value)}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Additional Notes */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Additional Notes</Text>

                        <TextInput
                            style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base min-h-[80px]`}
                            placeholder="Any additional instructions for the farmer..."
                            placeholderTextColor="#6B7280"
                            multiline
                            numberOfLines={3}
                            value={additionalNotes}
                            onChangeText={setAdditionalNotes}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={tw`bg-purple-500 py-4 rounded-2xl flex-row items-center justify-center mb-4 ${
                            loading ? 'opacity-50' : ''
                        }`}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator color="white" size="small" style={tw`mr-3`} />
                                <Text style={tw`text-white font-bold text-lg`}>Creating Prescription...</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="document-text-outline" size={20} color="white" style={tw`mr-3`} />
                                <Text style={tw`text-white font-bold text-lg`}>Create Prescription</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default CreatePrescriptionScreen;
