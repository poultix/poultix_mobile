import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';

export default function SignInWithGoogleScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: 'YOUR_WEB_CLIENT_ID',
            offlineAccess: true,
        });
    }, []);

    const handleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUser(userInfo?.data?.user);
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signin in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available');
            } else {
                console.log(error);
            }
        }
    };

    const handleSignOut = async () => {
        await GoogleSignin.signOut();
        setUser(null);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-6 pt-10">
                <TouchableOpacity onPress={() => router.back()} className="mb-6">
                    <Ionicons name="chevron-back" size={24} color="#6B7280" />
                </TouchableOpacity>

                <Text className="text-2xl font-semibold text-red-700 mb-6 text-center">Sign in with Google</Text>

                {!user ? (
                    <TouchableOpacity
                        onPress={handleSignIn}
                        className="flex-row items-center justify-center h-14 bg-white rounded-lg border border-gray-300 shadow-md"
                    >
                        <Ionicons name="logo-google" size={24} color="#EA4335" className="mr-3" />
                        <Text className="text-gray-700 font-semibold text-lg">Sign in with Google</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="mt-6 items-center">
                        <Image source={{ uri: user.photo }} className="w-20 h-20 rounded-full mb-3" />
                        <Text className="text-gray-900 text-lg font-medium">{user.name}</Text>
                        <Text className="text-gray-500 text-sm mb-4">{user.email}</Text>
                        <TouchableOpacity
                            onPress={handleSignOut}
                            className="flex-row items-center justify-center h-12 bg-red-600 rounded-lg px-4"
                        >
                            <Ionicons name="exit-outline" size={20} color="#fff" className="mr-2" />
                            <Text className="text-white font-semibold text-base">Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
