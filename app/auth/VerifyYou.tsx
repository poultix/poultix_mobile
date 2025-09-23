import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
    Vibration,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyItsYouScreen() {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '']);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [keyPressed, setKeyPressed] = useState<string | null>(null);

    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const { width } = Dimensions.get('window');
    const boxSize = width * 0.15;

    // Animation for initial load
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // Countdown timer for resend code
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleBack = () => {
        router.back();
    };

    const handleResendCode = () => {
        if (countdown > 0) return;

        // Provide feedback
        Vibration.vibrate(50);
        setIsResending(true);

        // Simulate API call
        setTimeout(() => {
            setIsResending(false);
            setCountdown(30); // 30 second countdown
            setCode(['', '', '', '']);
            setActiveIndex(0);

            // Show success animation
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }, 1500);
    };

    const handleConfirm = () => {
        const enteredCode = code.join('');
        if (enteredCode.length === 4) {
            // Provide feedback
            Vibration.vibrate(50);

            // Simulate verification
            if (enteredCode === '1234') { // Example correct code
                // Success animation
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.05,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    // Navigate after animation completes
                    router.push('/screens/verifyitsyou');
                });
            } else {
                // Error animation - shake
                Animated.sequence([
                    Animated.timing(shakeAnimation, {
                        toValue: 10,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnimation, {
                        toValue: -10,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnimation, {
                        toValue: 10,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnimation, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    })
                ]).start();

                // Reset code after shake
                setTimeout(() => {
                    setCode(['', '', '', '']);
                    setActiveIndex(0);
                }, 500);
            }
        } else {
            // Provide feedback for incomplete code
            Animated.sequence([
                Animated.timing(shakeAnimation, {
                    toValue: 10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const handleKeyPress = (value:string) => {
        // Provide haptic feedback
        Vibration.vibrate(20);

        // Visual feedback for pressed key
        setKeyPressed(value);
        setTimeout(() => setKeyPressed(null), 200);

        if (activeIndex < 4) {
            let newCode = [...code];
            newCode[activeIndex] = value;
            setCode(newCode);
            setActiveIndex(activeIndex + 1);

            // Auto-submit when all digits are entered
            if (activeIndex === 3) {
                setTimeout(() => {
                    handleConfirm();
                }, 300);
            }
        }
    };

    const handleDelete = () => {
        // Provide haptic feedback
        Vibration.vibrate(20);

        // Visual feedback for pressed key
        setKeyPressed('delete');
        setTimeout(() => setKeyPressed(null), 200);

        if (activeIndex > 0) {
            let newCode = [...code];
            newCode[activeIndex - 1] = '';
            setCode(newCode);
            setActiveIndex(activeIndex - 1);
        }
    };

    // Determine if confirm button should be enabled
    const isConfirmEnabled = code.every(digit => digit !== '');

    // Animations for the main container
    const containerAnimations = {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
    };

    // Animations for the code input boxes
    const codeBoxAnimations = {
        transform: [{ translateX: shakeAnimation }]
    };

    // Keypad data with letters like a phone
    const keypadData = [
        { number: '1', },
        { number: '2', },
        { number: '3', },
        { number: '4', },
        { number: '5', },
        { number: '6', },
        { number: '7', },
        { number: '8', },
        { number: '9', },
        { number: '*', },
        { number: '0', },
        { number: '#', },
    ];

    // Render a single digit box
    const renderDigitBox = (digit: string, index: number) => {
        const isActive = index === activeIndex && digit === '';
        const isFilled = digit !== '';

        return (
            <View
                key={index}
                style={[
                    tw`border rounded-2xl mx-2 items-center justify-center shadow-sm`,
                    isFilled ? tw`border-yellow-500 bg-yellow-50` : isActive ? tw`border-yellow-400` : tw`border-gray-300`,
                    { width: boxSize, height: boxSize }
                ]}
            >
                {isFilled ? (
                    <Text style={tw`text-2xl font-bold text-yellow-700`}>{digit}</Text>
                ) : isActive ? (
                    <View style={tw`w-3 h-3 bg-yellow-400 rounded-full`} />
                ) : null}
            </View>
        );
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                <Animated.View style={[tw`flex-1 px-6 pt-10 pb-6`, containerAnimations]}>
                    {/* Header */}
                    <View style={tw`flex-row items-center mb-8`}>
                        <TouchableOpacity
                            onPress={handleBack}
                            style={tw`w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center`}
                        >
                            <Ionicons name="chevron-back" size={24} color="#D97706" />
                        </TouchableOpacity>
                        <View style={tw`flex-1 items-center`}>
                            <Text style={tw`text-lg font-medium text-gray-700`}>Verification</Text>
                        </View>
                        <View style={tw`w-10`}></View> {/* Empty view for centering */}
                    </View>

                    {/* Title and Description */}
                    <View style={tw`items-center mb-8`}>
                        <View style={tw`w-20 h-20 rounded-full bg-amber-100 items-center justify-center mb-6 shadow-sm`}>
                            <MaterialCommunityIcons name="shield-check" size={40} color="#D97706" />
                        </View>
                        <Text style={tw`text-2xl font-bold text-amber-700 mb-3 text-center`}>
                            Verify it's you
                        </Text>
                        <Text style={tw`text-gray-500 text-base text-center px-6`}>
                            We sent a code to <Text style={tw`font-medium text-gray-700`}>T****@gmail.com</Text>. Enter it below to verify your identity.
                        </Text>
                    </View>

                    {/* Code Input Boxes */}
                    <Animated.View style={[tw`flex-row justify-center mb-8`, codeBoxAnimations]}>
                        {code.map((digit, index) => renderDigitBox(digit, index))}
                    </Animated.View>

                    {/* Resend Code */}
                    <TouchableOpacity
                        onPress={handleResendCode}
                        disabled={countdown > 0 || isResending}
                        style={tw`mb-8 items-center`}
                    >
                        {isResending ? (
                            <Text style={tw`text-amber-400 font-medium`}>Sending code...</Text>
                        ) : countdown > 0 ? (
                            <Text style={tw`text-gray-500`}>Resend code in <Text style={tw`font-medium`}>{countdown}s</Text></Text>
                        ) : (
                            <Text style={tw`text-amber-600 font-medium`}>Resend Code</Text>
                        )}
                    </TouchableOpacity>

                    {/* Confirm Button */}
                    <TouchableOpacity
                        onPress={handleConfirm}
                        disabled={!isConfirmEnabled}
                        style={[
                            tw`h-14 rounded-xl items-center justify-center mb-8 shadow-sm overflow-hidden`,
                            isConfirmEnabled ? tw`` : tw`opacity-70`
                        ]}
                    >
                        <LinearGradient
                            colors={isConfirmEnabled ? ['#F59E0B', '#D97706'] : ['#FCD34D', '#F59E0B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={tw`w-full h-full rounded-xl items-center justify-center`}
                        >
                            <Text style={tw`text-white text-lg font-semibold`}>Confirm</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Phone-style Keypad */}
                    <View style={tw`bg-gray-100 rounded-3xl p-4 shadow-inner mx-auto`}>
                        <View style={tw`flex-row flex-wrap justify-center`}>
                            {keypadData.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleKeyPress(item.number)}
                                    style={[
                                        tw`items-center justify-center m-2 rounded-full`,
                                        keyPressed === item.number ? tw`bg-amber-200` : tw`bg-white`,
                                        { width: width * 0.22, height: width * 0.22 },
                                        item.number === 'delete' ? tw`bg-red-100` : null,
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <View style={tw`items-center`}>
                                        <Text style={[
                                            tw`text-2xl font-semibold mb-1`,
                                            keyPressed === item.number ? tw`text-amber-700` : tw`text-gray-700`
                                        ]}>
                                            {item.number}
                                        </Text>
                                        {item.letters ? (
                                            <Text style={tw`text-xs text-gray-500`}>{item.letters}</Text>
                                        ) : null}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Delete button at the bottom */}
                        <View style={tw`items-center mt-2`}>
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={[
                                    tw`items-center justify-center rounded-full py-3 px-8`,
                                    keyPressed === 'delete' ? tw`bg-amber-200` : tw`bg-white`,
                                ]}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="backspace-outline"
                                    size={28}
                                    color={keyPressed === 'delete' ? "#D97706" : "#F59E0B"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
