import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleTheme } from '@/utils/theme';
import tw from 'twrnc';

export default function ResubmitPage() {
    const router = useRouter();
    const { currentUser } = useAuth();
    const theme = getRoleTheme(currentUser?.role);

    return (
        <View style={tw`flex-1 bg-white`}>
            <View style={[tw`px-4 py-3 flex-row items-center`, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-white text-lg font-semibold flex-1 text-center`}>
                    Resubmit Verification
                </Text>
                <View style={tw`w-6`} />
            </View>

            <View style={tw`flex-1 p-4`}>
                <Text style={tw`text-xl font-bold mb-4`}>Resubmit Your Application</Text>
                <Text style={tw`text-gray-600 mb-6`}>
                    Your application was rejected. Please review the feedback and resubmit with corrections.
                </Text>
                
                <TouchableOpacity
                    style={[tw`py-3 px-6 rounded-lg`, { backgroundColor: theme.primary }]}
                    onPress={() => Alert.alert('Success', 'Application resubmitted!')}
                >
                    <Text style={tw`text-white font-semibold text-center`}>Resubmit Application</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
