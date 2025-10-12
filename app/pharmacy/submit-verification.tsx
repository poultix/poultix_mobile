import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';

import { usePharmacyVerificationContext } from '@/contexts/PharmacyVerificationContext';

export default function SubmitVerificationScreen() {
    const {
        currentPharmacy,
        missingDocuments,
        requiredDocuments,
        submitting,
        error,
        submitForVerification,
    } = usePharmacyVerificationContext();

    const [agreed, setAgreed] = useState(false);

    const getUploadedDocuments = () => {
        const allDocuments = [
            'businessLicense',
            'pharmacistLicense', 
            'premisesInspection',
            'taxClearance',
            'insuranceCertificate',
            'complianceCertificate'
        ];
        
        return allDocuments.filter(doc => !missingDocuments.includes(doc));
    };

    const handleSubmit = async () => {
        if (!agreed) {
            Alert.alert('Agreement Required', 'Please agree to the terms and conditions before submitting.');
            return;
        }

        if (missingDocuments.length > 0) {
            Alert.alert(
                'Missing Documents', 
                'Please upload all required documents before submitting for verification.'
            );
            return;
        }

        try {
            await submitForVerification();
            
            Alert.alert(
                'Submission Successful!',
                'Your pharmacy verification has been submitted for review. You will receive an email notification once the review is complete.',
                [
                    {
                        text: 'Continue',
                        onPress: () => router.replace('/pharmacy/verification-dashboard')
                    }
                ]
            );
        } catch (error) {
            // Error handling is done in the context
        }
    };

    const documentTitles: { [key: string]: string } = {
        businessLicense: 'Business License',
        pharmacistLicense: 'Pharmacist License',
        premisesInspection: 'Premises Inspection Report',
        taxClearance: 'Tax Clearance Certificate',
        insuranceCertificate: 'Insurance Certificate',
        complianceCertificate: 'Compliance Certificate',
    };

    return (
        <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            style={tw`flex-1`}
        >
            <ScrollView contentContainerStyle={tw`pb-6`}>
                {/* Header */}
                <View style={tw`px-6 pt-12 pb-6`}>
                    <TouchableOpacity
                        style={tw`mb-4`}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <Text style={tw`text-white text-2xl font-bold mb-2`}>
                        Submit for Verification
                    </Text>
                    <Text style={tw`text-blue-100`}>
                        Review and submit your application
                    </Text>
                </View>

                {/* Summary Card */}
                <View style={tw`mx-6 mb-6`}>
                    <View style={tw`bg-white rounded-2xl p-6 shadow-lg`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <View style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4`}>
                                <Ionicons name="storefront-outline" size={24} color="#3B82F6" />
                            </View>
                            <View>
                                <Text style={tw`text-lg font-bold text-gray-800`}>
                                    {currentPharmacy?.name}
                                </Text>
                                <Text style={tw`text-gray-600`}>
                                    {currentPharmacy?.licenseNumber}
                                </Text>
                            </View>
                        </View>

                        <View style={tw`border-t border-gray-200 pt-4`}>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>
                                Location: {currentPharmacy?.address}
                            </Text>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>
                                Province: {currentPharmacy?.province}, District: {currentPharmacy?.district}
                            </Text>
                            <Text style={tw`text-gray-600 text-sm`}>
                                Pharmacist: {currentPharmacy?.pharmacistResponsible.fullName}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Documents Review */}
                <View style={tw`mx-6 mb-6`}>
                    <View style={tw`bg-white rounded-2xl p-6 shadow-lg`}>
                        <Text style={tw`text-lg font-semibold text-gray-800 mb-4`}>
                            Uploaded Documents
                        </Text>

                        {getUploadedDocuments().length > 0 ? (
                            <View style={tw`gap-3`}>
                                {getUploadedDocuments().map((docType) => (
                                    <View key={docType} style={tw`flex-row items-center`}>
                                        <View style={tw`w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3`}>
                                            <Ionicons name="checkmark" size={16} color="#10B981" />
                                        </View>
                                        <Text style={tw`text-gray-700 flex-1`}>
                                            {documentTitles[docType]}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={tw`text-gray-600 text-center py-4`}>
                                No documents uploaded yet
                            </Text>
                        )}

                        {missingDocuments.length > 0 && (
                            <View style={tw`mt-4 pt-4 border-t border-gray-200`}>
                                <Text style={tw`text-red-600 font-medium mb-2`}>
                                    Missing Required Documents:
                                </Text>
                                {missingDocuments.map((docType) => (
                                    <View key={docType} style={tw`flex-row items-center mb-2`}>
                                        <View style={tw`w-6 h-6 bg-red-100 rounded-full items-center justify-center mr-3`}>
                                            <Ionicons name="close" size={16} color="#EF4444" />
                                        </View>
                                        <Text style={tw`text-red-600`}>
                                            {documentTitles[docType]}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Review Process Info */}
                <View style={tw`mx-6 mb-6`}>
                    <View style={tw`bg-amber-50 border border-amber-200 rounded-2xl p-6`}>
                        <View style={tw`flex-row items-start`}>
                            <Ionicons name="time-outline" size={24} color="#F59E0B" />
                            <View style={tw`ml-3 flex-1`}>
                                <Text style={tw`text-amber-800 font-semibold mb-2`}>
                                    Review Process
                                </Text>
                                <Text style={tw`text-amber-700 text-sm leading-5`}>
                                    • Your application will be reviewed by RFDA officials{'\n'}
                                    • Review process typically takes 5-10 business days{'\n'}
                                    • You will receive email notifications about status changes{'\n'}
                                    • Additional documents may be requested if needed{'\n'}
                                    • Once approved, you can start operating on the platform
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Terms and Conditions */}
                <View style={tw`mx-6 mb-6`}>
                    <View style={tw`bg-white rounded-2xl p-6 shadow-lg`}>
                        <Text style={tw`text-lg font-semibold text-gray-800 mb-4`}>
                            Terms and Conditions
                        </Text>
                        
                        <ScrollView style={tw`max-h-32 mb-4`}>
                            <Text style={tw`text-gray-700 text-sm leading-5`}>
                                By submitting this application, I acknowledge that:{'\n\n'}
                                • All information provided is accurate and complete{'\n'}
                                • All uploaded documents are genuine and current{'\n'}
                                • I understand that providing false information may result in application rejection{'\n'}
                                • I agree to comply with all Rwanda FDA regulations{'\n'}
                                • I will maintain all licenses and certifications in good standing{'\n'}
                                • I understand that the platform reserves the right to verify all information{'\n'}
                                • I will notify the platform of any changes to my pharmacy status{'\n\n'}
                                This application is subject to review and approval by authorized personnel.
                            </Text>
                        </ScrollView>

                        <TouchableOpacity
                            style={tw`flex-row items-center`}
                            onPress={() => setAgreed(!agreed)}
                        >
                            <View 
                                style={[
                                    tw`w-6 h-6 border-2 rounded mr-3 items-center justify-center`,
                                    agreed ? tw`bg-blue-600 border-blue-600` : tw`border-gray-300`
                                ]}
                            >
                                {agreed && (
                                    <Ionicons name="checkmark" size={16} color="white" />
                                )}
                            </View>
                            <Text style={tw`text-gray-700 flex-1`}>
                                I agree to the terms and conditions above
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Submit Button */}
                <View style={tw`mx-6`}>
                    <TouchableOpacity
                        style={[
                            tw`rounded-xl p-4 shadow-lg`,
                            missingDocuments.length === 0 && agreed 
                                ? tw`bg-green-600` 
                                : tw`bg-gray-400`
                        ]}
                        onPress={handleSubmit}
                        disabled={missingDocuments.length > 0 || !agreed || submitting}
                    >
                        <View style={tw`flex-row items-center justify-center`}>
                            {submitting ? (
                                <>
                                    <View style={tw`animate-spin mr-2`}>
                                        <Ionicons name="refresh-outline" size={24} color="white" />
                                    </View>
                                    <Text style={tw`text-white font-semibold text-lg`}>
                                        Submitting...
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="paper-plane-outline" size={24} color="white" />
                                    <Text style={tw`text-white font-semibold text-lg ml-2`}>
                                        Submit Application
                                    </Text>
                                </>
                            )}
                        </View>
                    </TouchableOpacity>

                    {(missingDocuments.length > 0 || !agreed) && (
                        <Text style={tw`text-center text-gray-300 text-sm mt-3`}>
                            {missingDocuments.length > 0 
                                ? 'Complete all required documents to submit'
                                : 'Please agree to terms and conditions'
                            }
                        </Text>
                    )}
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
