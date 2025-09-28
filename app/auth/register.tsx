import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVeterinary, setIsVeterinary] = useState(false);
    const buttonScale = useRef(new Animated.Value(1)).current
    const inputRefs = {
        name: useRef<TextInput>(null),
        email: useRef<TextInput>(null),
        password: useRef<TextInput>(null),
    };

    // Focus and error states
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [nameError, setNameError] = useState('');
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const { currentUser, signUp ,loading} = useAuth();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
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
            router.push('/auth/login');
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
                        <LinearGradient colors={['#3B82F6', '#3B82F6']} style={tw`p-8 shadow-xl`}>
                            <View style={tw`items-center`}>
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
                            <View
                                className={`flex-row items-center bg-gray-50 rounded-xl overflow-hidden border shadow-sm ${isNameFocused ? 'border-blue-300' : 'border-gray-200'} ${nameError ? 'border-red-500' : ''}`}
                            >
                                <View className="pl-4 pr-2">
                                    <Ionicons
                                        name="person-outline"
                                        size={22}
                                        color={nameError ? '#EF4444' : isNameFocused ? '#3B82F6' : '#9CA3AF'}
                                    />
                                </View>
                                <TextInput
                                    ref={inputRefs.name}
                                    className="flex-1 h-14 text-base text-gray-800"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChangeText={t => { setName(t); if (nameError) setNameError('') }}
                                    placeholderTextColor="#9CA3AF"
                                    onFocus={() => setIsNameFocused(true)}
                                    onBlur={() => setIsNameFocused(false)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => inputRefs.email.current?.focus()}
                                />
                            </View>
                        </View>

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
                                    ref={inputRefs.email}
                                    className="flex-1 h-14 text-base text-gray-800"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={t => { setEmail(t); if (emailError) setEmailError('') }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#9CA3AF"
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={() => setIsEmailFocused(false)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => inputRefs.password.current?.focus()}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-semibold mb-2`}>Password</Text>
                            <View
                                className={`flex-row items-center bg-gray-50 rounded-xl overflow-hidden border shadow-sm ${isPasswordFocused ? 'border-blue-300' : 'border-gray-200'} ${passwordError ? 'border-red-500' : ''}`}
                            >
                                <View className="pl-4 pr-2">
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={22}
                                        color={passwordError ? '#EF4444' : isPasswordFocused ? '#3B82F6' : '#9CA3AF'}
                                    />
                                </View>
                                <TextInput
                                    ref={inputRefs.password}
                                    className="flex-1 h-14 text-base text-gray-800"
                                    placeholder="Create a password"
                                    value={password}
                                    onChangeText={t => { setPassword(t); if (passwordError) setPasswordError('') }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    placeholderTextColor="#9CA3AF"
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={tw`pr-4`}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                        color={passwordError ? '#EF4444' : '#9CA3AF'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Account Type Selection */}
                        <View style={tw`mb-8`}>
                            <Text style={tw`text-gray-700 font-semibold mb-4`}>Account Type</Text>
                            <View style={tw`flex-row gap-4 `}>
                                <TouchableOpacity
                                    style={tw`flex-1 px-4 py-2 items-center justify-center rounded-xl border ${!isVeterinary ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                                    onPress={() => setIsVeterinary(false)}
                                >
                                    <View style={tw`items-center flex-row gap-4`}>
                                        <Ionicons
                                            name="home-outline"
                                            size={22}
                                            color={!isVeterinary ? "#3B82F6" : "#9CA3AF"}
                                        />
                                        <Text style={tw` font-semibold ${!isVeterinary ? 'text-blue-500' : 'text-gray-600'}`}>
                                            Farmer
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={tw`flex-1 px-4 py-2 items-center justify-center rounded-xl border ${isVeterinary ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                                    onPress={() => setIsVeterinary(true)}
                                >
                                    <View style={tw`items-center flex-row gap-4`}>
                                        <Ionicons
                                            name="medical-outline"
                                            size={22}
                                            color={isVeterinary ? "#3B82F6" : "#9CA3AF"}
                                        />
                                        <Text style={tw` font-semibold ${isVeterinary ? 'text-blue-500' : 'text-gray-600'}`}>
                                            Veterinary
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Button */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                onPress={handleSignUp}
                                className="h-14 rounded-xl overflow-hidden shadow-md mb-2"
                                activeOpacity={0.9}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#3B82F6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-full h-full items-center justify-center"
                                >
                                    {loading ? (
                                        <View className="flex-row items-center">
                                            <ActivityIndicator size="small" color="white" />
                                            <Text className="text-white font-semibold text-lg ml-2">Signing In...</Text>
                                        </View>
                                    ) : (
                                        <Text className="text-white font-semibold text-lg">Sign In</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>


                        {/* Sign In Link */}
                        <View style={tw`flex-row justify-center mt-8`}>
                            <Text style={tw`text-gray-500 text-base`}>Already have an account? </Text>
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
