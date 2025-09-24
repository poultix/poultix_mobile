import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { useAuthRequest } from 'expo-auth-session';

export default function SignInWithGoogleScreen() {
    const router = useRouter();
    const [request, response, promptAsync] = useAuthRequest({
        clientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Web client ID
        redirectUri: 'https://auth.expo.io/@your-username/your-app-slug', // Use the correct redirect URL
    });

    const handleBack = () => {
        router.back();
    };

    const handleSignIn = async () => {
        try {
            const result = await promptAsync();
            if (result?.type === 'success') {
                const { id_token, access_token } = result.params;
                console.log('User Info:', { id_token, access_token });

                // You can now use these tokens to fetch user data from Google
                // or authenticate the user in your backend
            } else {
                console.log('Sign-in failed', result);
            }
        } catch (error) {
            console.log('Sign-in error', error);
        }
    };

    const handleChooseAnotherAccount = () => {
        // You can trigger the sign-in flow again if needed
        console.log('Choosing another account');
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                <View style={tw`flex-1 px-6 pt-10 pb-6`}>
                    {/* Back Button */}
                    <TouchableOpacity onPress={handleBack} style={tw`mb-6`}>
                        <Ionicons name="chevron-back" size={24} color="#6B7280" />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={tw`text-2xl font-semibold text-red-700 mb-6 text-center`}>
                        Sign in with Google
                    </Text>

                    {/* Account Selection */}
                    <View style={tw`w-full mb-6`}>
                        {/* Selected Account */}
                        <TouchableOpacity
                            style={tw`w-full bg-gray-100 rounded-lg p-4 flex-row items-center mb-2 border border-gray-300`}
                        >
                            <Ionicons name="person-circle-outline" size={40} color="#6B7280" style={tw`mr-4`} />
                            <Text style={tw`text-gray-700 text-lg`}>Liana Teata</Text>
                        </TouchableOpacity>

                        {/* Choose Another Account */}
                        <TouchableOpacity
                            onPress={handleChooseAnotherAccount}
                            style={tw`w-full bg-gray-100 rounded-lg p-4 flex-row items-center border border-gray-300`}
                        >
                            <Ionicons name="person-add-outline" size={40} color="#6B7280" style={tw`mr-4`} />
                            <Text style={tw`text-red-700 text-lg`}>Choose another account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        onPress={handleSignIn}
                        style={tw`w-full h-12 bg-yellow-600 rounded-lg items-center justify-center mt-auto mb-6`}
                    >
                        <Text style={tw`text-white text-lg font-semibold`}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
