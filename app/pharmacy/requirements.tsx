import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleTheme } from '@/utils/theme';
import tw from 'twrnc';

const RequirementsChecklist = () => {
    const router = useRouter();
    const { currentUser } = useAuth();
    const theme = getRoleTheme(currentUser?.role);

    const requirements = [
        { name: "Valid Business License", required: true, completed: false },
        { name: "TIN Certificate", required: true, completed: false },
        { name: "Pharmacist License (RVC)", required: true, completed: false },
        { name: "Premises Inspection Certificate", required: true, completed: false },
        { name: "Tax Clearance Certificate", required: true, completed: false }
    ];

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
                <Text style={tw`text-xl font-bold mb-4`}>Verification Requirements</Text>
                
                {requirements.map((req, index) => (
                    <TouchableOpacity
                        key={index}
                        style={tw`bg-gray-50 p-4 mb-3 rounded-lg flex-row items-center`}
                        onPress={() => Alert.alert('Upload', `Upload ${req.name}`)}
                    >
                        <View style={tw`w-5 h-5 border-2 border-gray-300 rounded mr-3`} />
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-medium`}>{req.name}</Text>
                            <Text style={tw`text-sm text-gray-500`}>
                                {req.required ? 'Required' : 'Optional'}
                            </Text>
                        </View>
                        <Ionicons name="cloud-upload-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={[tw`py-3 rounded-lg items-center mt-6`, { backgroundColor: theme.primary }]}
                    onPress={() => router.push('/pharmacy/submit-verification')}
                >
                    <Text style={tw`text-white font-semibold`}>Continue to Submission</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default RequirementsChecklist;
