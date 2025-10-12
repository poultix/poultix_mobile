import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';

import { usePharmacyVerificationContext } from '@/contexts/PharmacyVerificationContext';
import { 
    PharmacyRegistrationRequest, 
    PharmacyType, 
    OwnershipType, 
    OwnershipStatus 
} from '@/types';

export default function PharmacyRegistrationScreen() {
    const {
        provinces,
        districts,
        loading,
        submitting,
        error,
        registerPharmacy,
        loadDistrictsByProvince,
        saveFormProgress,
        getFormProgress,
    } = usePharmacyVerificationContext();

    const [formData, setFormData] = useState<Partial<PharmacyRegistrationRequest>>({
        pharmacyType: PharmacyType.RETAIL,
        ownershipType: OwnershipType.PRIVATE,
        ownershipStatus: OwnershipStatus.OWNED,
    });

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    useEffect(() => {
        // Load saved form progress
        loadSavedProgress();
    }, []);

    const loadSavedProgress = async () => {
        const saved = await getFormProgress();
        if (saved) {
            setFormData(saved);
        }
    };

    const handleInputChange = (field: keyof PharmacyRegistrationRequest, value: any) => {
        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);
        
        // Auto-save progress
        saveFormProgress(updatedData);

        // Load districts when province changes
        if (field === 'province' && value) {
            loadDistrictsByProvince(value);
        }
    };

    const handlePharmacistChange = (field: string, value: any) => {
        const updatedPharmacist = { 
            ...formData.pharmacistResponsible, 
            [field]: value 
        };
        handleInputChange('pharmacistResponsible', updatedPharmacist);
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(formData.name && formData.licenseNumber && formData.tinNumber);
            case 2:
                return !!(formData.province && formData.district && formData.sector && 
                         formData.cell && formData.village && formData.address);
            case 3:
                return !!(formData.pharmacistResponsible?.fullName && 
                         formData.pharmacistResponsible?.nationalId && 
                         formData.pharmacistResponsible?.phoneNumber && 
                         formData.pharmacistResponsible?.email);
            case 4:
                return !!(formData.phone && formData.registrationDate);
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
            } else {
                handleSubmit();
            }
        } else {
            Alert.alert('Incomplete', 'Please fill in all required fields');
        }
    };

    const handleSubmit = async () => {
        try {
            if (!formData.latitude || !formData.longitude) {
                Alert.alert('Location Required', 'Please set your pharmacy location');
                return;
            }

            await registerPharmacy(formData as PharmacyRegistrationRequest);
            Alert.alert(
                'Registration Successful', 
                'Your pharmacy has been registered. You can now complete the verification process.',
                [{ text: 'Continue', onPress: () => router.replace('/pharmacy/verification-dashboard') }]
            );
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    const renderStepIndicator = () => (
        <View style={tw`flex-row justify-center items-center mb-6`}>
            {Array.from({ length: totalSteps }, (_, index) => (
                <View key={index} style={tw`flex-row items-center`}>
                    <View 
                        style={[
                            tw`w-8 h-8 rounded-full items-center justify-center`,
                            index + 1 <= currentStep 
                                ? tw`bg-white` 
                                : tw`bg-blue-300`
                        ]}
                    >
                        <Text 
                            style={[
                                tw`font-semibold`,
                                index + 1 <= currentStep 
                                    ? tw`text-blue-600` 
                                    : tw`text-white`
                            ]}
                        >
                            {index + 1}
                        </Text>
                    </View>
                    {index < totalSteps - 1 && (
                        <View 
                            style={[
                                tw`w-8 h-0.5 mx-2`,
                                index + 1 < currentStep 
                                    ? tw`bg-white` 
                                    : tw`bg-blue-300`
                            ]} 
                        />
                    )}
                </View>
            ))}
        </View>
    );

    const renderBusinessInfo = () => (
        <View>
            <Text style={tw`text-white text-xl font-bold mb-6 text-center`}>
                Business Information
            </Text>
            
            <View style={tw`bg-white rounded-2xl p-6 mx-6 mb-6`}>
                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Pharmacy Name *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Enter pharmacy name"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>License Number *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.licenseNumber}
                        onChangeText={(value) => handleInputChange('licenseNumber', value)}
                        placeholder="Enter license number"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>TIN Number *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.tinNumber}
                        onChangeText={(value) => handleInputChange('tinNumber', value)}
                        placeholder="Enter TIN number"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Pharmacy Type</Text>
                    <View style={tw`border border-gray-300 rounded-lg`}>
                        <Picker
                            selectedValue={formData.pharmacyType}
                            onValueChange={(value: string) => handleInputChange('pharmacyType', value)}
                        >
                            <Picker.Item label="Retail Pharmacy" value={PharmacyType.RETAIL} />
                            <Picker.Item label="Wholesale Pharmacy" value={PharmacyType.WHOLESALE} />
                            <Picker.Item label="Veterinary Clinic" value={PharmacyType.VETERINARY_CLINIC} />
                        </Picker>
                    </View>
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Ownership Type</Text>
                    <View style={tw`border border-gray-300 rounded-lg`}>
                        <Picker
                            selectedValue={formData.ownershipType}
                            onValueChange={(value: string) => handleInputChange('ownershipType', value)}
                        >
                            <Picker.Item label="Private" value={OwnershipType.PRIVATE} />
                            <Picker.Item label="Government" value={OwnershipType.GOVERNMENT} />
                            <Picker.Item label="NGO" value={OwnershipType.NGO} />
                            <Picker.Item label="Cooperative" value={OwnershipType.COOPERATIVE} />
                        </Picker>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderLocationInfo = () => (
        <View>
            <Text style={tw`text-white text-xl font-bold mb-6 text-center`}>
                Location Information
            </Text>
            
            <View style={tw`bg-white rounded-2xl p-6 mx-6 mb-6`}>
                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Province *</Text>
                    <View style={tw`border border-gray-300 rounded-lg`}>
                        <Picker
                            selectedValue={formData.province}
                            onValueChange={(value: string) => handleInputChange('province', value)}
                        >
                            <Picker.Item label="Select Province" value="" />
                            {provinces.map((province) => (
                                <Picker.Item key={province} label={province} value={province} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>District *</Text>
                    <View style={tw`border border-gray-300 rounded-lg`}>
                        <Picker
                            selectedValue={formData.district}
                            onValueChange={(value: string) => handleInputChange('district', value)}
                            enabled={!!formData.province}
                        >
                            <Picker.Item label="Select District" value="" />
                            {districts.map((district) => (
                                <Picker.Item key={district} label={district} value={district} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Sector *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.sector}
                        onChangeText={(value) => handleInputChange('sector', value)}
                        placeholder="Enter sector"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Cell *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.cell}
                        onChangeText={(value) => handleInputChange('cell', value)}
                        placeholder="Enter cell"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Village *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.village}
                        onChangeText={(value) => handleInputChange('village', value)}
                        placeholder="Enter village"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Address *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800 h-20`}
                        value={formData.address}
                        onChangeText={(value) => handleInputChange('address', value)}
                        placeholder="Enter detailed address"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    style={tw`bg-blue-100 rounded-lg p-4 flex-row items-center`}
                    onPress={() => {
                        // TODO: Implement GPS location picker
                        Alert.alert('GPS Location', 'GPS location picker will be implemented');
                    }}
                >
                    <Ionicons name="location-outline" size={24} color="#3B82F6" />
                    <Text style={tw`ml-3 text-blue-600 font-medium`}>
                        Set GPS Location
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPharmacistInfo = () => (
        <View>
            <Text style={tw`text-white text-xl font-bold mb-6 text-center`}>
                Responsible Pharmacist
            </Text>
            
            <View style={tw`bg-white rounded-2xl p-6 mx-6 mb-6`}>
                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Full Name *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.pharmacistResponsible?.fullName}
                        onChangeText={(value) => handlePharmacistChange('fullName', value)}
                        placeholder="Enter full name"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>National ID *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.pharmacistResponsible?.nationalId}
                        onChangeText={(value) => handlePharmacistChange('nationalId', value)}
                        placeholder="Enter national ID"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Phone Number *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.pharmacistResponsible?.phoneNumber}
                        onChangeText={(value) => handlePharmacistChange('phoneNumber', value)}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Email *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.pharmacistResponsible?.email}
                        onChangeText={(value) => handlePharmacistChange('email', value)}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Qualification *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.pharmacistResponsible?.qualification}
                        onChangeText={(value) => handlePharmacistChange('qualification', value)}
                        placeholder="e.g., BSc in Pharmacy"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Registration Number *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.pharmacistResponsible?.registrationNumber}
                        onChangeText={(value) => handlePharmacistChange('registrationNumber', value)}
                        placeholder="Enter registration number"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Experience (Years)</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.pharmacistResponsible?.experienceYears?.toString()}
                        onChangeText={(value) => handlePharmacistChange('experienceYears', parseInt(value) || 0)}
                        placeholder="Enter years of experience"
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );

    const renderFinalDetails = () => (
        <View>
            <Text style={tw`text-white text-xl font-bold mb-6 text-center`}>
                Final Details
            </Text>
            
            <View style={tw`bg-white rounded-2xl p-6 mx-6 mb-6`}>
                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Phone Number *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        placeholder="Enter pharmacy phone number"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Registration Date *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.registrationDate}
                        onChangeText={(value) => handleInputChange('registrationDate', value)}
                        placeholder="YYYY-MM-DD"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Ownership Status</Text>
                    <View style={tw`border border-gray-300 rounded-lg`}>
                        <Picker
                            selectedValue={formData.ownershipStatus}
                            onValueChange={(value: string) => handleInputChange('ownershipStatus', value)}
                        >
                            <Picker.Item label="Owned" value={OwnershipStatus.OWNED} />
                            <Picker.Item label="Rented" value={OwnershipStatus.RENTED} />
                        </Picker>
                    </View>
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Premises Size</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
                        value={formData.premisesSize}
                        onChangeText={(value) => handleInputChange('premisesSize', value)}
                        placeholder="e.g., 50 sqm"
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Storage Facilities</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800 h-20`}
                        value={formData.storageFacilities}
                        onChangeText={(value) => handleInputChange('storageFacilities', value)}
                        placeholder="Describe storage facilities (refrigeration, shelving, etc.)"
                        multiline
                        textAlignVertical="top"
                    />
                </View>
            </View>
        </View>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return renderBusinessInfo();
            case 2:
                return renderLocationInfo();
            case 3:
                return renderPharmacistInfo();
            case 4:
                return renderFinalDetails();
            default:
                return null;
        }
    };

    return (
        <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            style={tw`flex-1`}
        >
            <ScrollView contentContainerStyle={tw`pb-6`}>
                <View style={tw`pt-12 pb-6`}>
                    <TouchableOpacity
                        style={tw`absolute left-6 top-12 z-10`}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    {renderStepIndicator()}
                </View>

                {renderCurrentStep()}

                {/* Navigation Buttons */}
                <View style={tw`mx-6 flex-row gap-4`}>
                    {currentStep > 1 && (
                        <TouchableOpacity
                            style={tw`flex-1 bg-white/20 rounded-xl py-4`}
                            onPress={() => setCurrentStep(currentStep - 1)}
                        >
                            <Text style={tw`text-white font-semibold text-center`}>
                                Previous
                            </Text>
                        </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                        style={tw`flex-1 bg-white rounded-xl py-4 ${submitting ? 'opacity-50' : ''}`}
                        onPress={handleNext}
                        disabled={submitting}
                    >
                        <Text style={tw`text-blue-600 font-semibold text-center`}>
                            {currentStep === totalSteps ? 'Register' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {error && (
                    <View style={tw`mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-4`}>
                        <Text style={tw`text-red-700`}>{error}</Text>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}
