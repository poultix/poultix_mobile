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
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// New context imports
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyCodeScreen() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    // Use new contexts
    const { currentUser,verifyCode, forgotPassword } = useAuth();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Redirect if already signed in
        if (currentUser) {
            switch (currentUser.role) {
                case 'ADMIN': router.replace('/dashboard/admin-dashboard'); break
                case 'FARMER': router.replace('/dashboard/farmer-dashboard'); break
                case 'VETERINARY': router.replace('/dashboard/veterinary-dashboard'); break
                default: router.replace('/')
            }
        }

        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        ]).start();

        // Start countdown timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentUser]);

    const handleVerifyCode = async () => {
        if (!code.trim() || code.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit code');
            return;
        }

        try {
            setIsLoading(true);
             await verifyCode('demo@example.com', code.trim());

        } catch (error) {
            console.error('Verify code error:', error);
            Alert.alert('Error', 'Failed to verify code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            const result = await forgotPassword('demo@example.com');
           
                setTimer(60);
                Alert.alert('Success', 'Verification code sent again!');
         
        } catch (error) {
            console.error('Resend code error:', error);
            Alert.alert('Error', 'Failed to resend code');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <Animated.View style={[{ flex: 1, paddingHorizontal: 24 }, { opacity: fadeAnim }]}>
                            {/* Header */}
                            <View style={{ paddingTop: 64, paddingBottom: 32 }}>
                                <TouchableOpacity
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: '#F3F4F6',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 32
                                    }}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back" size={24} color="#374151" />
                                </TouchableOpacity>

                                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 12 }}>
                                    Verify Code
                                </Text>
                                <Text style={{ color: '#6B7280', fontSize: 18, lineHeight: 24 }}>
                                    Enter the 6-digit verification code sent to your email address.
                                </Text>
                            </View>

                            {/* Code Input */}
                            <Animated.View style={[{ flex: 1 }, { transform: [{ translateY: slideAnim }] }]}>
                                <View style={{ marginBottom: 24 }}>
                                    <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8 }}>
                                        Verification Code
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: 16,
                                        paddingHorizontal: 16,
                                        paddingVertical: 16,
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB'
                                    }}>
                                        <Ionicons name="shield-checkmark-outline" size={20} color="#9CA3AF" />
                                        <TextInput
                                            style={{
                                                flex: 1,
                                                marginLeft: 12,
                                                color: '#111827',
                                                fontSize: 16,
                                                letterSpacing: 2,
                                                textAlign: 'center'
                                            }}
                                            placeholder="000000"
                                            placeholderTextColor="#9CA3AF"
                                            value={code}
                                            onChangeText={setCode}
                                            keyboardType="numeric"
                                            maxLength={6}
                                            autoFocus
                                        />
                                    </View>
                                </View>

                                {/* Timer */}
                                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                                    {timer > 0 ? (
                                        <Text style={{ color: '#6B7280', fontSize: 16 }}>
                                            Resend code in {formatTime(timer)}
                                        </Text>
                                    ) : (
                                        <TouchableOpacity onPress={handleResendCode}>
                                            <Text style={{ color: '#F59E0B', fontSize: 16, fontWeight: '600' }}>
                                                Resend Code
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Verify Button */}
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#F59E0B',
                                        borderRadius: 16,
                                        paddingVertical: 16,
                                        paddingHorizontal: 24,
                                        shadowColor: '#F59E0B',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 8,
                                        opacity: isLoading ? 0.5 : 1
                                    }}
                                    onPress={handleVerifyCode}
                                    disabled={isLoading}
                                >
                                    <Text style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        textAlign: 'center'
                                    }}>
                                        {isLoading ? 'Verifying...' : 'Verify Code'}
                                    </Text>
                                </TouchableOpacity>

                                {/* Back to Sign In */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginTop: 32,
                                    marginBottom: 24
                                }}>
                                    <Text style={{ color: '#6B7280', fontSize: 16 }}>
                                        Remember your password?
                                    </Text>
                                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                                        <Text style={{ color: '#F59E0B', fontWeight: '600', fontSize: 16 }}>
                                            {' '}Sign In
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </Animated.View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
