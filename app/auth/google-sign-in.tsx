import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

WebBrowser.maybeCompleteAuthSession();

interface GoogleUser {
    id: string;
    email: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
}

export default function SignInWithGoogleScreen() {
    const router = useRouter();
    const [user, setUser] = useState<GoogleUser | null>(null);
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        webClientId: 'YOUR_WEB_CLIENT_ID',
        scopes: ['profile', 'email'],
    });

    useEffect(() => {
        // Load saved user data on component mount
        loadUserData();
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                getUserInfo(authentication.accessToken);
            }
        } else if (response?.type === 'error') {
            Alert.alert('Authentication Error', 'Failed to sign in with Google');
        }
    }, [response]);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('googleUser');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const getUserInfo = async (token: string) => {
        try {
            setLoading(true);
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `bearer ${token}` },
            });

            if (response.ok) {
                const userInfo: GoogleUser = await response.json();
                setUser(userInfo);
                
                // Save user data to AsyncStorage
                await AsyncStorage.setItem('googleUser', JSON.stringify(userInfo));
                
                Alert.alert('Success', `Welcome, ${userInfo.name}!`);
            } else {
                throw new Error('Failed to fetch user info');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            Alert.alert('Error', 'Failed to get user information');
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async () => {
        try {
            setLoading(true);
            await promptAsync();
        } catch (error) {
            console.error('Sign in error:', error);
            Alert.alert('Error', 'Failed to initiate sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem('googleUser');
            setUser(null);
            Alert.alert('Success', 'Signed out successfully');
        } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Failed to sign out');
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`flex-1 px-6 pt-10`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`mb-6`}>
                    <Ionicons name="chevron-back" size={24} color="#6B7280" />
                </TouchableOpacity>

                <Text style={tw`text-2xl font-semibold text-red-700 mb-6 text-center`}>
                    Sign in with Google
                </Text>

                {!user ? (
                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={!request || loading}
                        style={tw`flex-row items-center justify-center h-14 bg-white rounded-lg border border-gray-300 shadow-md ${
                            (!request || loading) ? 'opacity-50' : ''
                        }`}
                    >
                        <Ionicons name="logo-google" size={24} color="#EA4335" style={tw`mr-3`} />
                        <Text style={tw`text-gray-700 font-semibold text-lg`}>
                            {loading ? 'Signing in...' : 'Sign in with Google'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={tw`mt-6 items-center`}>
                        <Image 
                            source={{ uri: user.picture }} 
                            style={tw`w-20 h-20 rounded-full mb-3`} 
                        />
                        <Text style={tw`text-gray-900 text-lg font-medium`}>{user.name}</Text>
                        <Text style={tw`text-gray-500 text-sm mb-4`}>{user.email}</Text>
                        <TouchableOpacity
                            onPress={handleSignOut}
                            style={tw`flex-row items-center justify-center h-12 bg-red-600 rounded-lg px-4`}
                        >
                            <Ionicons name="exit-outline" size={20} color="#fff" style={tw`mr-2`} />
                            <Text style={tw`text-white font-semibold text-base`}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Instructions */}
                <View style={tw`mt-8 p-4 bg-blue-50 rounded-lg`}>
                    <Text style={tw`text-blue-800 text-sm font-medium mb-2`}>Setup Instructions:</Text>
                    <Text style={tw`text-blue-700 text-xs leading-4`}>
                        1. Replace YOUR_ANDROID_CLIENT_ID, YOUR_IOS_CLIENT_ID, and YOUR_WEB_CLIENT_ID with your actual Google OAuth client IDs{'\n'}
                        2. Configure your Google Cloud Console project{'\n'}
                        3. Add your app's bundle ID to the OAuth configuration
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
