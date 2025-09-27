import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Alert,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MockAuthService } from '@/services/mockData';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

interface RouteParams {
    email: string;
}

export default function VerifyIdentityScreen() {
    const route = useRoute();
    const { email } = route.params as RouteParams;

    const [code, setCode] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 50,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleContinue = async () => {
        try {
            if (!code) {
                Alert.alert('Error', 'Please enter the security code');
                return;
            }
            const result = await MockAuthService.verifyCode(email, code);
            Alert.alert('Success', result.message);
            router.push('/auth/create-new-password' );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Invalid verification code';
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerClassName="flex-grow justify-center px-6"
                        keyboardShouldPersistTaps="handled"
                    >
                        <Animated.View
                            className="items-center"
                            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                        >
                            {/* Icon */}
                            <View className="mb-8">
                                <LinearGradient
                                    colors={['#FF4C00', '#FF6500']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="w-20 h-20 rounded-2xl items-center justify-center shadow-lg"
                                >
                                    <Ionicons name="shield-checkmark" size={36} color="white" />
                                </LinearGradient>
                            </View>

                            {/* Header */}
                            <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
                                Enter Security Code
                            </Text>
                            <Text className="text-gray-500 text-base text-center mb-10">
                                We sent a code to your email. Enter it to continue.
                            </Text>

                            {/* Input */}
                            <View
                                className={`flex-row items-center px-4 h-14 mb-6 rounded-xl border ${
                                    isInputFocused ? 'border-amber-500' : 'border-gray-200'
                                } bg-gray-50 shadow-sm`}
                            >
                                <Ionicons name="key-outline" size={22} color="#64748B" />
                                <TextInput
                                    className="flex-1 ml-3 text-lg text-gray-800"
                                    placeholder="0000"
                                    value={code}
                                    onChangeText={setCode}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    keyboardType="numeric"
                                    placeholderTextColor="#94A3AF"
                                />
                            </View>

                            {/* Continue Button */}
                            <TouchableOpacity
                                onPress={handleContinue}
                                activeOpacity={0.9}
                                className="w-full rounded-xl overflow-hidden shadow-lg"
                            >
                                <LinearGradient
                                    colors={['#FF6500', '#FF4C00']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="h-14 items-center justify-center rounded-xl"
                                >
                                    <Text className="text-white font-bold text-lg">Check Code</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Security Note */}
                            <View className="flex-row items-center mt-8 justify-center">
                                <Ionicons name="lock-closed" size={14} color="#9CA3AF" className="mr-2" />
                                <Text className="text-gray-400 text-xs">
                                    Your information is encrypted and secure
                                </Text>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
