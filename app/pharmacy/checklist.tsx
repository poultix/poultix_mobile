import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import tw from 'twrnc';

import { usePharmacyVerificationContext } from '@/contexts/PharmacyVerificationContext';

interface DocumentItem {
    type: string;
    title: string;
    description: string;
    required: boolean;
    uploaded: boolean;
    fileName?: string;
}

export default function PharmacyChecklistScreen() {
    const {
        currentPharmacy,
        missingDocuments,
        requiredDocuments,
        uploading,
        error,
        uploadDocument,
        loadPharmacyData,
    } = usePharmacyVerificationContext();

    const [documents, setDocuments] = useState<DocumentItem[]>([]);

    useEffect(() => {
        initializeDocuments();
    }, [requiredDocuments, missingDocuments]);

    const initializeDocuments = () => {
        const documentTypes = [
            {
                type: 'businessLicense',
                title: 'Business License',
                description: 'Official RFDA pharmacy license',
                required: true,
            },
            {
                type: 'pharmacistLicense',
                title: 'Pharmacist License',
                description: 'Personal professional license of responsible pharmacist',
                required: true,
            },
            {
                type: 'premisesInspection',
                title: 'Premises Inspection Report',
                description: 'RFDA or local authority inspection report',
                required: true,
            },
            {
                type: 'taxClearance',
                title: 'Tax Clearance Certificate',
                description: 'Current tax clearance from RRA',
                required: true,
            },
            {
                type: 'insuranceCertificate',
                title: 'Insurance Certificate',
                description: 'Professional indemnity or general insurance',
                required: false,
            },
            {
                type: 'complianceCertificate',
                title: 'Compliance Certificate',
                description: 'GMP or other quality compliance certificates',
                required: false,
            },
        ];

        const documentList = documentTypes.map(doc => ({
            ...doc,
            uploaded: !missingDocuments.includes(doc.type),
            fileName: currentPharmacy?.[`${doc.type}Path` as keyof typeof currentPharmacy] as string,
        }));

        setDocuments(documentList);
    };

    const handleDocumentUpload = async (documentType: string) => {
        try {
            // Show options for document source
            Alert.alert(
                'Select Document Source',
                'Choose how you want to add the document',
                [
                    {
                        text: 'Camera',
                        onPress: () => uploadFromCamera(documentType),
                    },
                    {
                        text: 'Gallery',
                        onPress: () => uploadFromGallery(documentType),
                    },
                    {
                        text: 'Files',
                        onPress: () => uploadFromFiles(documentType),
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ]
            );
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    const uploadFromCamera = async (documentType: string) => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Camera permission is needed to take photos');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                // Convert to File-like object for upload
                const file = {
                    uri: asset.uri,
                    name: `${documentType}_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                } as any;

                await uploadDocument(documentType, file);
                initializeDocuments(); // Refresh the list
            }
        } catch (error) {
            console.error('Camera upload error:', error);
            Alert.alert('Error', 'Failed to capture document from camera');
        }
    };

    const uploadFromGallery = async (documentType: string) => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Gallery permission is needed to select photos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const file = {
                    uri: asset.uri,
                    name: `${documentType}_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                } as any;

                await uploadDocument(documentType, file);
                initializeDocuments();
            }
        } catch (error) {
            console.error('Gallery upload error:', error);
            Alert.alert('Error', 'Failed to select document from gallery');
        }
    };

    const uploadFromFiles = async (documentType: string) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const file = {
                    uri: asset.uri,
                    name: asset.name,
                    type: asset.mimeType || 'application/pdf',
                } as any;

                await uploadDocument(documentType, file);
                initializeDocuments();
            }
        } catch (error) {
            console.error('File upload error:', error);
            Alert.alert('Error', 'Failed to select document file');
        }
    };

    const getCompletionPercentage = () => {
        const requiredDocs = documents.filter(doc => doc.required);
        const uploadedRequired = requiredDocs.filter(doc => doc.uploaded);
        return requiredDocs.length > 0 ? Math.round((uploadedRequired.length / requiredDocs.length) * 100) : 0;
    };

    const canSubmitForVerification = () => {
        const requiredDocs = documents.filter(doc => doc.required);
        return requiredDocs.every(doc => doc.uploaded);
    };

    const handleSubmitForVerification = () => {
        if (canSubmitForVerification()) {
            router.push('/pharmacy/submit-verification');
        } else {
            Alert.alert(
                'Incomplete Documentation',
                'Please upload all required documents before submitting for verification.'
            );
        }
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
                        Document Checklist
                    </Text>
                    <Text style={tw`text-blue-100`}>
                        Upload required documents for verification
                    </Text>
                </View>

                {/* Progress Card */}
                <View style={tw`mx-6 mb-6`}>
                    <View style={tw`bg-white rounded-2xl p-6 shadow-lg`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={tw`text-lg font-semibold text-gray-800`}>
                                Completion Progress
                            </Text>
                            <Text style={tw`text-blue-600 font-bold text-xl`}>
                                {getCompletionPercentage()}%
                            </Text>
                        </View>
                        
                        <View style={tw`bg-gray-200 rounded-full h-3 mb-2`}>
                            <View 
                                style={[
                                    tw`bg-blue-600 h-3 rounded-full`,
                                    { width: `${getCompletionPercentage()}%` }
                                ]}
                            />
                        </View>
                        
                        <Text style={tw`text-gray-600 text-sm`}>
                            {documents.filter(d => d.required && d.uploaded).length} of{' '}
                            {documents.filter(d => d.required).length} required documents uploaded
                        </Text>
                    </View>
                </View>

                {/* Documents List */}
                <View style={tw`mx-6 gap-4`}>
                    {documents.map((document, index) => (
                        <View 
                            key={document.type}
                            style={tw`bg-white rounded-2xl p-6 shadow-lg`}
                        >
                            <View style={tw`flex-row items-start justify-between mb-3`}>
                                <View style={tw`flex-1 mr-4`}>
                                    <View style={tw`flex-row items-center mb-2`}>
                                        <Text style={tw`text-lg font-semibold text-gray-800`}>
                                            {document.title}
                                        </Text>
                                        {document.required && (
                                            <Text style={tw`text-red-500 ml-1`}>*</Text>
                                        )}
                                    </View>
                                    <Text style={tw`text-gray-600 text-sm leading-5`}>
                                        {document.description}
                                    </Text>
                                    {document.fileName && (
                                        <Text style={tw`text-green-600 text-xs mt-1`}>
                                            Uploaded: {document.fileName}
                                        </Text>
                                    )}
                                </View>
                                
                                <View style={tw`items-center`}>
                                    {document.uploaded ? (
                                        <View style={tw`w-8 h-8 bg-green-100 rounded-full items-center justify-center`}>
                                            <Ionicons name="checkmark" size={20} color="#10B981" />
                                        </View>
                                    ) : (
                                        <View style={tw`w-8 h-8 bg-gray-100 rounded-full items-center justify-center`}>
                                            <Ionicons name="document-outline" size={20} color="#6B7280" />
                                        </View>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[
                                    tw`py-3 px-4 rounded-lg flex-row items-center justify-center`,
                                    document.uploaded 
                                        ? tw`bg-green-50 border border-green-200`
                                        : tw`bg-blue-50 border border-blue-200`
                                ]}
                                onPress={() => handleDocumentUpload(document.type)}
                                disabled={uploading}
                            >
                                <Ionicons 
                                    name={document.uploaded ? "refresh-outline" : "cloud-upload-outline"} 
                                    size={20} 
                                    color={document.uploaded ? "#10B981" : "#3B82F6"} 
                                />
                                <Text 
                                    style={[
                                        tw`ml-2 font-medium`,
                                        document.uploaded 
                                            ? tw`text-green-600`
                                            : tw`text-blue-600`
                                    ]}
                                >
                                    {uploading ? 'Uploading...' : document.uploaded ? 'Replace Document' : 'Upload Document'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Submit Button */}
                {canSubmitForVerification() && (
                    <View style={tw`mx-6 mt-6`}>
                        <TouchableOpacity
                            style={tw`bg-green-600 rounded-xl p-4 shadow-lg`}
                            onPress={handleSubmitForVerification}
                        >
                            <View style={tw`flex-row items-center justify-center`}>
                                <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                                <Text style={tw`text-white font-semibold text-lg ml-2`}>
                                    Submit for Verification
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Information Card */}
                <View style={tw`mx-6 mt-6`}>
                    <View style={tw`bg-blue-50 border border-blue-200 rounded-2xl p-6`}>
                        <View style={tw`flex-row items-start`}>
                            <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
                            <View style={tw`ml-3 flex-1`}>
                                <Text style={tw`text-blue-800 font-semibold mb-2`}>
                                    Document Guidelines
                                </Text>
                                <Text style={tw`text-blue-700 text-sm leading-5`}>
                                    • Documents should be clear and readable{'\n'}
                                    • Accepted formats: PDF, JPG, PNG{'\n'}
                                    • Maximum file size: 10MB{'\n'}
                                    • Ensure all information is visible{'\n'}
                                    • Documents must be current and valid
                                </Text>
                            </View>
                        </View>
                    </View>
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
