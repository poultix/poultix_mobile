import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    ScrollView,
    Alert,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import tw from 'twrnc';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useAuthActions } from '@/hooks/useAuthActions';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVeterinary, setIsVeterinary] = useState(false);
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { signUp } = useAuthActions();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Check if user is already signed in
        if (currentUser) {
            router.replace('/');
            return;
        }

        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        ]).start();
    }, [currentUser]);

    const handleSignUp = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await signUp(
                email.trim(),
                password.trim(),
                name.trim(),
                isVeterinary ? 'VETERINARY' : 'FARMER'
            );
            
            Alert.alert('Success', 'Account created successfully!');
            router.push('/auth/sign-in');
        } catch (error) {
            console.error('Sign up error:', error);
            Alert.alert('Error', 'Sign up failed. Please try again.');
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <ScrollView 
                style={tw`flex-1`}
                contentContainerStyle={tw`pb-10`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[tw`flex-1 px-7`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                >
                    {/* Header */}
                    <View style={tw`-mx-7 mb-8`}>
                        <LinearGradient colors={['#F97316', '#EA580C']} style={tw`rounded-b-3xl p-8 shadow-xl`}>
                            <View style={tw`items-center mt-4`}>
                                <View style={tw`w-20 h-20 bg-white bg-opacity-20 rounded-full items-center justify-center mb-4`}>
                                    <Ionicons name="person-add" size={32} color="white" />
                                </View>
                                <Text style={tw`text-white text-3xl font-bold mb-2`}>Join Poultix! 🚀</Text>
                                <Text style={tw`text-orange-100 text-base text-center`}>
                                    Create your account to start managing your poultry farm
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Form */}
                    <View style={tw`flex-1`}>
                        {/* Name Input */}
                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-semibold mb-2`}>Full Name</Text>
                            <View style={tw`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-200`}>
                                <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={tw`flex-1 ml-3 text-gray-900 text-base`}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* Email Input */}
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

                        {/* Password Input */}
                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-semibold mb-2`}>Password</Text>
                            <View style={tw`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-200`}>
                                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={tw`flex-1 ml-3 text-gray-900 text-base`}
                                    placeholder="Create a password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons 
                                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={20} 
                                        color="#9CA3AF" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Account Type Selection */}
                        <View style={tw`mb-8`}>
                            <Text style={tw`text-gray-700 font-semibold mb-4`}>Account Type</Text>
                            <View style={tw`flex-row gap-4`}>
                                <TouchableOpacity
                                    style={tw`flex-1 p-4 rounded-2xl border-2 ${!isVeterinary ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}
                                    onPress={() => setIsVeterinary(false)}
                                >
                                    <View style={tw`items-center`}>
                                        <Ionicons 
                                            name="home-outline" 
                                            size={24} 
                                            color={!isVeterinary ? "#F97316" : "#9CA3AF"} 
                                        />
                                        <Text style={tw`mt-2 font-semibold ${!isVeterinary ? 'text-orange-600' : 'text-gray-600'}`}>
                                            Farmer
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={tw`flex-1 p-4 rounded-2xl border-2 ${isVeterinary ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}
                                    onPress={() => setIsVeterinary(true)}
                                >
                                    <View style={tw`items-center`}>
                                        <Ionicons 
                                            name="medical-outline" 
                                            size={24} 
                                            color={isVeterinary ? "#F97316" : "#9CA3AF"} 
                                        />
                                        <Text style={tw`mt-2 font-semibold ${isVeterinary ? 'text-orange-600' : 'text-gray-600'}`}>
                                            Veterinary
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={tw`bg-orange-500 rounded-2xl py-4 px-6 shadow-lg`}
                            onPress={handleSignUp}
                        >
                            <Text style={tw`text-white font-bold text-lg text-center`}>
                                Create Account
                            </Text>
                        </TouchableOpacity>

                        {/* Sign In Link */}
                        <View style={tw`flex-row justify-center mt-8`}>
                            <Text style={tw`text-gray-500 text-base`}>Already have an account? </Text>
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
