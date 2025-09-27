import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Animated,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useAuthActions } from '@/hooks/useAuthActions';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { forgotPassword } = useAuthActions();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Redirect if already signed in
        if (currentUser) {
            router.replace('/(drawer)/index');
            return;
        }

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [currentUser]);

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            const result = await forgotPassword(email.trim());
            
            if (result.success) {
                Alert.alert(
                    'Success',
                    'Password reset instructions have been sent to your email.',
                    [{ text: 'OK', onPress: () => router.push('/auth/sign-in') }]
                );
            } else {
                Alert.alert('Error', result.error || 'Failed to send reset email');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            Alert.alert('Error', 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <ScrollView contentContainerStyle={tw`flex-grow`} keyboardShouldPersistTaps="handled">
                <Animated.View style={[tw`flex-1 px-6`, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={tw`pt-16 pb-8`}>
                        <TouchableOpacity
                            style={tw`w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-8`}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#374151" />
                        </TouchableOpacity>
                        
                        <Text style={tw`text-4xl font-bold text-gray-900 mb-3`}>
                            Forgot Password?
                        </Text>
                        <Text style={tw`text-gray-600 text-lg leading-6`}>
                            Don't worry! Enter your email address and we'll send you instructions to reset your password.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={tw`flex-1`}>
                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-semibold mb-2`}>Email Address</Text>
                            <View style={tw`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-200`}>
                                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={tw`flex-1 ml-3 text-gray-900 text-base`}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={tw`bg-orange-500 rounded-2xl py-4 px-6 shadow-lg ${isLoading ? 'opacity-50' : ''}`}
                            onPress={handleForgotPassword}
                            disabled={isLoading}
                        >
                            <Text style={tw`text-white font-bold text-lg text-center`}>
                                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                            </Text>
                        </TouchableOpacity>

                        <View style={tw`flex-row justify-center mt-8`}>
                            <Text style={tw`text-gray-500 text-base`}>Remember your password? </Text>
                            <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                                <Text style={tw`text-orange-600 font-semibold text-base`}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
