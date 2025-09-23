import React, { useState, useEffect } from 'react';
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
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import hostConfig from '@/config/hostConfig';
import { NavigationProps } from '@/interfaces/Navigation';

interface RouteParams {
    email: string;
}

export default function VerifyIdentityScreen() {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const { email } = route.params as RouteParams;

    const [code, setCode] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    // Animations
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(50);

    useEffect(() => {
        console.log(email);
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, [email]);

    const handleContinue = async () => {
        try {
            if (!code) {
                Alert.alert('Error', 'Please enter the security code');
                return;
            }

            const response = await axios.post(hostConfig.host + '/checkResetCode', {
                resetCode:code,
                email,
            });
            console.log(response.data);

            // Navigate to the next screen
            navigation.navigate('CreateNewPassword');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    Alert.alert('Error', error.response.data.message);
                }
            }
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <SafeAreaView
                        style={tw`flex-1 justify-center items-center px-8 pt-10 pb-6`}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#f7f7f9']}
                            style={tw`flex-1 w-full`}
                        >
                            <Animated.View
                                style={[
                                    tw`w-full justify-center items-center`,
                                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                                ]}
                            >
                                <View style={tw`mb-10`}>
                                    <LinearGradient
                                        colors={['#ff4b2b', '#ff416c']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={tw`w-20 h-20 rounded-2xl shadow-lg items-center justify-center`}
                                    >
                                        <Ionicons name="shield-checkmark" size={36} color="white" />
                                    </LinearGradient>
                                </View>

                                <Text style={tw`text-3xl font-bold text-gray-800 mb-3 text-center tracking-tight`}>
                                    Enter Security Code
                                </Text>
                                <Text style={tw`text-gray-500 text-base text-center mb-10 max-w-xs`}>
                                    We have sent a security code to your email address. Please enter the code to continue.
                                </Text>

                                <View
                                    style={tw`w-full mb-8 relative`}
                                    accessibilityLabel="Security code input option"
                                > 
                                    <View
                                        style={[
                                            tw`w-full bg-white rounded-xl p-4 flex-row items-center shadow-sm border`,
                                            isInputFocused ? tw`border-blue-400` : tw`border-gray-200`,
                                        ]}
                                    >
                                        <View style={tw`w-9 h-9 bg-emerald-500 rounded-full mr-3 items-center justify-center shadow-sm`}>
                                            <Ionicons name="checkmark" size={20} color="white" />
                                        </View>

                                        <TextInput
                                            style={tw`flex-1 text-gray-700 text-base font-medium`}
                                            placeholder="0000"
                                            value={code}
                                            onChangeText={setCode}
                                            keyboardType="numeric"
                                            autoCapitalize="none"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={handleContinue}
                                    style={tw`w-full shadow-md`}
                                    accessibilityLabel="Continue button"
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#f59e0b', '#d97706']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={tw`w-full h-14 rounded-xl items-center justify-center`}
                                    >
                                        <Text style={tw`text-white text-lg font-bold tracking-wide`}>Check Code</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View style={tw`flex-row items-center mt-8`}>
                                    <Ionicons name="lock-closed" size={14} color="#9CA3AF" style={tw`mr-2`} />
                                    <Text style={tw`text-gray-400 text-xs`}>
                                        Your information is encrypted and secure
                                    </Text>
                                </View>
                            </Animated.View>
                        </LinearGradient>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
