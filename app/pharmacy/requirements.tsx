import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleTheme } from '@/utils/theme';
import FileUpload from '@/components/ui/FileUpload';
import tw from 'twrnc';

const RequirementsChecklist = () => {
    const router = useRouter();
    const { currentUser } = useAuth();
    const theme = getRoleTheme(currentUser?.role);
    const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: any}>({});

    const requirements = [
        { 
            id: "business_license",
            name: "Valid Business License", 
            required: true, 
            description: "Upload your current business registration certificate",
            acceptedTypes: "documents" as const
        },
        { 
            id: "tin_certificate",
            name: "TIN Certificate", 
            required: true, 
            description: "Tax Identification Number certificate from RRA",
            acceptedTypes: "documents" as const
        },
        { 
            id: "pharmacist_license",
            name: "Pharmacist License (RVC)", 
            required: true, 
            description: "Valid license from Rwanda Veterinary Council",
            acceptedTypes: "documents" as const
        },
        { 
            id: "premises_inspection",
            name: "Premises Inspection Certificate", 
            required: true, 
            description: "Recent premises inspection report",
            acceptedTypes: "documents" as const
        },
        { 
            id: "tax_clearance",
            name: "Tax Clearance Certificate", 
            required: true, 
            description: "Current tax clearance from RRA",
            acceptedTypes: "documents" as const
        }
    ];

    const handleFileUpload = (requirementId: string, file: any) => {
        setUploadedFiles(prev => ({
            ...prev,
            [requirementId]: file
        }));
    };

    const getCompletionPercentage = () => {
        const uploaded = Object.keys(uploadedFiles).length;
        const total = requirements.length;
        return Math.round((uploaded / total) * 100);
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <View style={[tw`px-4 py-3 flex-row items-center`, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-white text-lg font-semibold flex-1 text-center`}>
                    Requirements
                </Text>
                <View style={tw`w-6`} />
            </View>

            <ScrollView style={tw`flex-1 p-4`}>
                {/* Progress Header */}
                <View style={[tw`p-4 rounded-xl mb-6`, { backgroundColor: theme.primary + '10' }]}>
                    <Text style={tw`text-xl font-bold mb-2`}>Verification Requirements</Text>
                    <Text style={tw`text-gray-600 mb-4`}>
                        Upload all required documents to complete your pharmacy verification
                    </Text>
                    
                    {/* Progress Bar */}
                    <View style={tw`mb-2`}>
                        <View style={tw`flex-row justify-between items-center mb-2`}>
                            <Text style={tw`text-sm font-medium text-gray-700`}>Progress</Text>
                            <Text style={[tw`text-sm font-bold`, { color: theme.primary }]}>
                                {getCompletionPercentage()}%
                            </Text>
                        </View>
                        <View style={tw`h-2 bg-gray-200 rounded-full`}>
                            <View 
                                style={[
                                    tw`h-2 rounded-full transition-all duration-300`,
                                    { 
                                        backgroundColor: theme.primary,
                                        width: `${getCompletionPercentage()}%`
                                    }
                                ]} 
                            />
                        </View>
                    </View>
                </View>
                
                {/* Upload Requirements */}
                {requirements.map((req) => (
                    <FileUpload
                        key={req.id}
                        title={req.name}
                        description={req.description}
                        acceptedTypes={req.acceptedTypes}
                        required={req.required}
                        uploaded={!!uploadedFiles[req.id]}
                        onUpload={(file) => handleFileUpload(req.id, file)}
                    />
                ))}

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        tw`py-4 rounded-xl items-center mt-6 mb-8`,
                        { 
                            backgroundColor: getCompletionPercentage() === 100 ? theme.primary : '#D1D5DB',
                            opacity: getCompletionPercentage() === 100 ? 1 : 0.6
                        }
                    ]}
                    onPress={() => {
                        if (getCompletionPercentage() === 100) {
                            router.push('/pharmacy/submit-verification');
                        } else {
                            Alert.alert('Incomplete', 'Please upload all required documents before submitting.');
                        }
                    }}
                    disabled={getCompletionPercentage() !== 100}
                >
                    <View style={tw`flex-row items-center`}>
                        <Ionicons 
                            name="checkmark-circle" 
                            size={20} 
                            color="white" 
                            style={tw`mr-2`}
                        />
                        <Text style={tw`text-white font-bold text-lg`}>
                            {getCompletionPercentage() === 100 ? 'Submit for Verification' : 'Complete All Requirements'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default RequirementsChecklist;
