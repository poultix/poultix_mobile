import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    ScrollView,
    Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MockAuthService } from '@/services/mockData'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

export default function SignUpScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isVeterinary, setIsVeterinary] = useState(false)

    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(20)).current

    useEffect(() => {
        const checkUserSignIn = async () => {
            try {
                const token = await AsyncStorage.getItem('token')
                if (token && token !== null) {
                    router.push('/farm' as any)
                }
            } catch (error) {
                console.error('Error checking token:', error)
            }
        }

        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        ]).start()

        checkUserSignIn()
    }, [])

    const handleSignUp = async () => {
        try {
            const result = await MockAuthService.signUp(
                email,
                password,
                name,
                isVeterinary ? 'veterinary' : 'farmer'
            )
            if (result.success) {
                Alert.alert('Success', result.message, [
                    { text: 'OK', onPress: () => router.push('/(auth)/sign-in' as any) },
                ])
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign up'
            Alert.alert('Sign up error', errorMessage)
        }
    }

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                contentContainerClassName="pb-10"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    className="flex-1 px-7"
                    style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                >
                    {/* Header */}
                    <View className="-mx-7 mb-8">
                        <LinearGradient colors={['#F97316', '#EA580C']} className="rounded-b-3xl p-8 shadow-xl">
                            <View className="items-center mt-4">
                                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                                    <Ionicons name="person-add" size={32} color="white" />
                                </View>
                                <Text className="text-white text-3xl font-bold mb-2">Join Poultix! 🚀</Text>
                                <Text className="text-orange-100 text-base text-center">
                                    Create your account to start managing your poultry farm
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Full Name */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2 ml-1">Full Name</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            <View className="pl-4 pr-2">
                                <Ionicons name="person-outline" size={22} color="#9CA3AF" />
                            </View>
                            <TextInput
                                className="flex-1 h-14 text-base text-gray-800"
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2 ml-1">Email</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            <View className="pl-4 pr-2">
                                <Ionicons name="mail-outline" size={22} color="#9CA3AF" />
                            </View>
                            <TextInput
                                className="flex-1 h-14 text-base text-gray-800"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2 ml-1">Password</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            <View className="pl-4 pr-2">
                                <Ionicons name="lock-closed-outline" size={22} color="#9CA3AF" />
                            </View>
                            <TextInput
                                className="flex-1 h-14 text-base text-gray-800"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                                secureTextEntry={!showPassword}
                                placeholderTextColor="#9CA3AF"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="px-4">
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={22}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Vet Toggle */}
                    <View className="flex-row items-center justify-center mb-6">
                        <TouchableOpacity
                            className="flex-row items-center justify-center"
                            onPress={() => setIsVeterinary(!isVeterinary)}
                        >
                            <View
                                className={`w-6 h-6 rounded-full border-2 border-gray-400 items-center justify-center ${isVeterinary ? 'bg-orange-600' : ''
                                    }`}
                            >
                                {isVeterinary && <View className="w-3 h-3 rounded-full bg-white" />}
                            </View>
                            <Text className="ml-2 text-gray-600 text-sm">Are you a veterinarian?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity className="h-14 rounded-xl overflow-hidden shadow-md mb-2" onPress={handleSignUp} activeOpacity={0.9}>
                        <LinearGradient colors={['#FF6500', '#FF4C00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="w-full h-full items-center justify-center">
                            <Text className="text-white font-semibold text-lg">Sign Up</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[1px] bg-gray-200" />
                        <Text className="mx-4 text-gray-400 font-medium">OR CONTINUE WITH</Text>
                        <View className="flex-1 h-[1px] bg-gray-200" />
                    </View>

                    {/* Social */}
                    <View className="flex-row justify-between mb-2">
                        <TouchableOpacity
                            className="h-14 border border-gray-200 rounded-xl items-center justify-center shadow-sm bg-white w-[47%]"
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="logo-google" size={22} color="#DB4437" />
                                <Text className="ml-2 font-medium text-gray-700">Google</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="h-14 border border-gray-200 rounded-xl items-center justify-center shadow-sm bg-white w-[47%]"
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="logo-apple" size={22} color="#000" />
                                <Text className="ml-2 font-medium text-gray-700">Apple</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Link */}
                    <View className="flex-row justify-center mt-auto mb-6 pt-8">
                        <Text className="text-gray-500 text-base">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in' as any)} activeOpacity={0.7}>
                            <Text className="text-orange-600 font-semibold text-base">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    )
}
