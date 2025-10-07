import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
    Vibration,
    ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/contexts/AuthContext'
import { StatusBar } from 'expo-status-bar'

export default function SignInScreen() {
    const { currentUser, loading: authLoading, login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isEmailFocused, setIsEmailFocused] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(30)).current
    const buttonScale = useRef(new Animated.Value(1)).current
    const shakeAnim = useRef(new Animated.Value(0)).current

    const inputRefs = {
        email: useRef<TextInput>(null),
        password: useRef<TextInput>(null),
    }

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

    useEffect(() => {
        if (currentUser) {
            switch (currentUser.role) {
                case 'ADMIN': router.replace('/dashboard/admin-dashboard'); break
                case 'FARMER': router.replace('/dashboard/farmer-dashboard'); break
                case 'VETERINARY': router.replace('/dashboard/veterinary-dashboard'); break
                default: router.replace('/')
            }
            return
        }

        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]).start()
    }, [currentUser])

    const handleSignIn = async () => {
        setEmailError('')
        setPasswordError('')
        let isValid = true

        if (!email.trim()) { setEmailError('Email is required'); isValid = false }
        else if (!validateEmail(email)) { setEmailError('Please enter a valid email'); isValid = false }

        if (!password.trim()) { setPasswordError('Password is required'); isValid = false }
        else if (password.trim().length < 4) { setPasswordError('Password must be at least 4 characters'); isValid = false }

        if (!isValid) {
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start()
            return
        }

        try {
            Vibration.vibrate(20)
            if (authLoading) return
            await login(email.trim(), password.trim())
           
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
            Alert.alert('Login Error', errorMessage)
            setPassword('')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />
            <ScrollView
                contentContainerClassName="flex-grow pb-10"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View
                    className="flex-1 px-7"
                    style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                >
                    {/* Header */}
                    <View className="mb-8 -mx-7">
                        <LinearGradient
                            colors={['#F59E0B', '#D97706']}
                            className="rounded-b-1xl p-8 shadow-xl"
                        >
                            <View className="items-center mt-4">
                                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                                    <Ionicons name="leaf" size={32} color="white" />
                                </View>
                                <Text className="text-white text-3xl font-bold mb-2">Welcome Back! </Text>
                                <Text className="text-orange-100 text-base text-center">
                                    Sign in to continue managing your poultry farm
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Email */}
                    <Animated.View className="space-y-6" style={{ transform: [{ translateX: shakeAnim }] }}>
                        <View className="mb-6">
                            <Text className="text-gray-700 font-medium mb-2 ml-1">Email</Text>
                            <View
                                className={`flex-row items-center bg-gray-50 rounded-xl overflow-hidden border shadow-sm ${isEmailFocused ? 'border-amber-400' : 'border-gray-200'} ${emailError ? 'border-red-500' : ''}`}
                            >
                                <View className="pl-4 pr-2">
                                    <Ionicons
                                        name="mail-outline"
                                        size={22}
                                        color={emailError ? '#EF4444' : isEmailFocused ? '#F59E0B' : '#9CA3AF'}
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
                            {emailError && <Text className="text-orange-600 ml-1 mt-1 text-xs">{emailError}</Text>}
                        </View>

                        {/* Password */}
                        <View className="mb-4">
                            <Text className="text-gray-700 font-medium mb-2 ml-1">Password</Text>
                            <View
                                className={`flex-row items-center bg-gray-50 rounded-xl overflow-hidden border shadow-sm ${isPasswordFocused ? 'border-amber-400' : 'border-gray-200'} ${passwordError ? 'border-red-500' : ''}`}
                            >
                                <View className="pl-4 pr-2">
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={22}
                                        color={passwordError ? '#EF4444' : isPasswordFocused ? '#F59E0B' : '#9CA3AF'}
                                    />
                                </View>
                                <TextInput
                                    ref={inputRefs.password}
                                    className="flex-1 h-14 text-base text-gray-800"
                                    placeholder="Enter your password"
                                    autoCapitalize="none"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={t => { setPassword(t); if (passwordError) setPasswordError('') }}
                                    placeholderTextColor="#9CA3AF"
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    returnKeyType="done"
                                    onSubmitEditing={handleSignIn}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="px-4"
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={isPasswordFocused ? '#F59E0B' : '#9CA3AF'} />
                                </TouchableOpacity>
                            </View>
                            {passwordError && <Text className="text-orange-600 ml-1 mt-1 text-xs">{passwordError}</Text>}
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity onPress={() => router.push('/auth/forgot-password')} className="items-end mb-7 mt-1" activeOpacity={0.7}>
                            <Text className="text-amber-500 font-medium">Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Sign In */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                onPress={handleSignIn}
                                className="h-14 rounded-xl overflow-hidden shadow-md mb-2"
                                activeOpacity={0.9}
                                disabled={isLoading}
                            >
                                <LinearGradient
                                    colors={['#F59E0B', '#D97706']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-full h-full items-center justify-center"
                                >
                                    {authLoading ? (
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

                        {/* Divider */}
                        <View className="flex-row items-center my-8">
                            <View className="flex-1 h-[1px] bg-gray-200" />
                            <Text className="mx-4 text-gray-400 font-medium">OR CONTINUE WITH</Text>
                            <View className="flex-1 h-[1px] bg-gray-200" />
                        </View>

                        {/* Social */}
                        <View className="flex-row justify-between mb-2">
                            <TouchableOpacity
                                onPress={() => router.push('/auth/google-sign-in')}
                                className="h-14 border border-gray-200 rounded-xl items-center justify-center shadow-sm bg-white w-[47%]"
                                activeOpacity={0.8}
                            >
                                <View className="flex-row items-center">
                                    <FontAwesome name="google" size={20} color="#D97706" />
                                    <Text className="ml-2 font-medium text-gray-700">Google</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="h-14 border border-gray-200 rounded-xl items-center justify-center shadow-sm bg-white w-[47%]"
                                activeOpacity={0.8}
                            >
                                <View className="flex-row items-center">
                                    <FontAwesome name="apple" size={22} color="#000" />
                                    <Text className="ml-2 font-medium text-gray-700">Apple</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>


                    {/* Sign Up */}
                    <View className="flex-row justify-center mt-auto mb-6 pt-8">
                        <Text className="text-gray-500 text-base">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/register')} activeOpacity={0.7}>
                            <Text className="text-amber-500 font-semibold text-base">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    )
}
