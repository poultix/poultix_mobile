import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleTheme } from '@/utils/theme';
import tw from 'twrnc';

export default function ProfilePage() {
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
                    Pharmacy Profile
                </Text>
                <View style={tw`w-6`} />
            </View>

            <View style={tw`flex-1 p-4`}>
                <Text style={tw`text-xl font-bold mb-4`}>Pharmacy Profile</Text>
                
                <View style={tw`bg-green-50 p-4 rounded-lg mb-4 flex-row items-center`}>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    <Text style={tw`text-green-700 font-medium ml-2`}>
                        ✅ Verified Pharmacy
                    </Text>
                </View>
                
                <Text style={tw`text-gray-600`}>
                    Your pharmacy profile and verification status.
                </Text>
            </View>
        </View>
    );
}
