import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    ImageBackground,
    ScrollView,
    Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MockAuthService } from '@/services/mockData'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import tw from 'twrnc'
import { router } from 'expo-router'

export default function SignUpScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isVeterinary, setIsVeterinary] = useState(false) // New state for terms and conditions

    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(20)).current

    useEffect(() => {
        const checkUserSignIn = async () => {
            try {
                const token = await AsyncStorage.getItem('token')
                if (token && token !== null) {
                    router.push('/farm' as any)

                }

                console.log('Token:', token)
            } catch (error) {
                console.error('Error checking token:', error)
            }
        }

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 80,
                friction: 10,
                useNativeDriver: true,
            }),
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
                    { text: 'OK', onPress: () => router.push('/(auth)/sign-in' as any) }
                ])
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign up'
            Alert.alert('Sign up error', errorMessage)
        }
    }
    return (
        <View
            style={tw`flex-1 bg-white`}
        >
            
            <ScrollView style={tw`flex-1 mt-15`}>
                <Animated.View
                    style={[
                        tw`flex-1 p-6`,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >

                    {/* Enhanced Header */}
                    <View style={tw`mb-8 -mx-6`}>
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            style={tw`rounded-b-3xl p-8 shadow-xl`}
                        >
                            <View style={tw`items-center mt-4`}>
                                <View style={tw`w-20 h-20 bg-white bg-opacity-20 rounded-full items-center justify-center mb-4`}>
                                    <Ionicons name="person-add" size={32} color="white" />
                                </View>
                                <Text style={tw`text-white text-3xl font-bold mb-2`}>
                                    Join Poultix! 🚀
                                </Text>
                                <Text style={tw`text-green-100 text-base text-center`}>
                                    Create your account to start managing your poultry farm
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Form */}
                    <View style={tw`flex-1`} >
                        {/* Full Name Input with Icon */}
                        <View style={tw`bg-white/70 rounded-xl p-1 mb-5 shadow-md border  bg-gray-50 border-gray-100 flex-row items-center`}>
                            <View style={tw`pl-4 pr-2`}>
                                <Ionicons
                                    name="person-outline"
                                    size={22}
                                    color="#64748B" />
                            </View>
                            <TextInput
                                style={tw`flex-1 text-lg text-gray-900 `}
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                        {/* Email Input with Icon */}
                        <View style={tw`bg-white/70 rounded-xl mb-6 shadow-md border p-1 bg-gray-50 border-gray-100 flex-row items-center`}>
                            <View style={tw`pl-4 pr-2`}>
                                <Ionicons
                                    name="mail-outline"
                                    size={22}
                                    color="#64748B" />
                            </View>
                            <TextInput
                                style={tw`flex-1 text-lg text-gray-900 `}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        {/* Password Input with Icon */}
                        <View style={tw`bg-white/70 rounded-xl mb-6 shadow-md border  bg-gray-50 border-gray-100 flex-row items-center`}>

                            <View style={tw`pl-4 pr-2`}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={22}
                                    color={'#9CA3AF'}
                                />
                            </View>
                            <TextInput
                                style={tw`flex-1 p-4 text-lg text-gray-900`}
                                placeholder="Enter your password"
                                value={password}
                                autoCapitalize={'none'}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholderTextColor="#94A3B8"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={tw`p-4`}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Terms and Conditions Toggle */}
                        <View style={tw`flex-row items-center justify-center mb-6`}>
                            <TouchableOpacity
                                style={tw`flex-row items-center justify-center `}
                                onPress={() => setIsVeterinary(!isVeterinary)}
                            >
                                <View
                                    style={[
                                        tw`w-6 h-6 rounded-full border-2 border-gray-400 items-center justify-center`,
                                        isVeterinary && tw`bg-amber-600`
                                    ]}
                                >
                                    {isVeterinary && (
                                        <View style={tw`w-3 h-3 rounded-full bg-white`} />
                                    )}
                                </View>
                                <Text style={tw`ml-2 text-gray-600 text-sm`}>
                                    Are you a veterinarian?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={tw`rounded-xl overflow-hidden shadow-lg`}
                            onPress={handleSignUp}
                        >
                            <LinearGradient
                                colors={['#FF6500', '#FF4C00']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={tw`p-4`}
                            >
                                <BlurView
                                    intensity={20}
                                    tint="light"
                                    style={tw`absolute inset-0`}
                                />
                                <Text style={tw`text-white text-lg text-center font-bold relative z-10`}>
                                    Sign Up
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={tw`flex-row items-center my-6`}>
                            <View style={tw`flex-1 h-px bg-gray-300`} />
                            <Text style={tw`text-gray-500 mx-4 text-sm font-medium`}>OR</Text>
                            <View style={tw`flex-1 h-px bg-gray-300`} />
                        </View>

                        {/* Social Sign Up Buttons */}
                        <View style={tw`flex-row justify-between mb-6`}>
                            <TouchableOpacity
                                style={tw`flex-1 bg-white mr-2 rounded-xl p-3 items-center shadow-md border border-gray-100 flex-row justify-center`}
                                onPress={() => console.log('Sign up with Google')}
                            >
                                <Ionicons name="logo-google" size={26} color="#DB4437" style={tw`mr-2`} />
                                <Text style={tw`text-gray-900 text-lg font-medium`}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={tw`flex-1 bg-white ml-2 rounded-xl p-3 items-center shadow-md border border-gray-100 flex-row justify-center`}
                                onPress={() => console.log('Sign up with Apple')}
                            >
                                <Ionicons name="logo-apple" size={26} color="#000000" style={tw`mr-2`} />
                                <Text style={tw`text-gray-900 text-lg font-medium`}>Apple</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Link */}
                        <View style={tw`flex-row justify-center py-4`}>
                            <Text style={tw`text-gray-600 text-sm font-medium`}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/sign-in' as any)}
                            >
                                <Text style={tw`text-red-500 text-sm font-semibold`}>
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    )
}
