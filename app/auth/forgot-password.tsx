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
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    const { currentUser, forgotPassword } = useAuth();

    useEffect(() => {
        if (currentUser) {
            router.replace('/');
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
            setEmailError('Email is required');
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email.trim());
            Alert.alert('Success', 'Password reset instructions sent to your email.');
        } catch (error) {
            console.error('Forgot password error:', error);
            Alert.alert('Error', 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const animateButton = (toValue: number) => {
        Animated.spring(buttonScale, {
            toValue,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <ScrollView
                contentContainerStyle={tw`flex-grow`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={tw`bg-blue-500 pt-14 pb-10 px-6 `}>
                        <TouchableOpacity
                            style={tw`w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-6`}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={tw`text-3xl font-bold text-white mb-2`}>
                            Forgot Password?
                        </Text>
                        <Text style={tw`text-white/90 text-base leading-6`}>
                            Enter your email address and we'll send you instructions to reset your password.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={tw`flex-1 px-6 mt-8`}>
                        {/* Email Input */}
                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-semibold mb-2`}>Email Address</Text>
                            <View
                                className={`flex-row items-center bg-gray-50 rounded-xl overflow-hidden border shadow-sm ${isEmailFocused ? 'border-blue-300' : 'border-gray-200'} ${emailError ? 'border-red-500' : ''}`}
                            >
                                <View className="pl-4 pr-2">
                                    <Ionicons
                                        name="mail-outline"
                                        size={22}
                                        color={emailError ? '#EF4444' : isEmailFocused ? '#3B82F6' : '#9CA3AF'}
                                    />
                                </View>
                                <TextInput
                                    className="flex-1 h-14 text-base text-gray-800"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={t => { setEmail(t); if (emailError) setEmailError('') }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#9CA3AF"
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={() => setIsEmailFocused(false)}
                                    returnKeyType="done"
                                />
                            </View>
                            {emailError ? (
                                <Text style={tw`text-red-500 text-sm mt-1`}>{emailError}</Text>
                            ) : null}
                        </View>

                        {/* Submit Button */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                onPress={handleForgotPassword}
                                className="h-14 rounded-xl overflow-hidden shadow-md mb-2"
                                activeOpacity={0.9}
                                disabled={loading}
                                onPressIn={() => animateButton(0.97)}
                                onPressOut={() => animateButton(1)}
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#2563EB']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-full h-full items-center justify-center"
                                >
                                    {loading ? (
                                        <View className="flex-row items-center">
                                            <ActivityIndicator size="small" color="white" />
                                            <Text className="text-white font-semibold text-lg ml-2">Sending...</Text>
                                        </View>
                                    ) : (
                                        <Text className="text-white font-semibold text-lg">Send Reset Instructions</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Footer */}
                        <View style={tw`flex-row justify-center mt-8`}>
                            <Text style={tw`text-gray-500 text-base`}>Remember your password? </Text>
                            <TouchableOpacity onPress={() => router.push('/auth/login')}>
                                <Text style={tw`text-blue-500 font-semibold text-base`}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
