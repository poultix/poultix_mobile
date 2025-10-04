import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

export default function ServerErrorScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Animate entrance
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleRetry = () => {
        // Go back to previous screen or home
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleGoHome = () => {
        router.replace('/');
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            
            <Animated.View 
                style={[
                    tw`flex-1 justify-center items-center px-8`,
                    { 
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* Server Icon */}
                <View style={tw`bg-red-100 rounded-full p-6 mb-8`}>
                    <Ionicons 
                        name="server-outline" 
                        size={64} 
                        color="#EF4444" 
                    />
                </View>

                {/* Main Message */}
                <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-4`}>
                    Oops! Server Hiccup
                </Text>
                
                <Text style={tw`text-gray-600 text-center text-base leading-6 mb-8`}>
                    Our servers are taking a quick break. {"\n"}
                    Don&apos;t worry - this happens sometimes! {"\n"}
                    Please try again in a moment.
                </Text>

                {/* Status Info */}
                <View style={tw`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 w-full`}>
                    <View style={tw`flex-row items-center mb-4`}>
                        <View style={tw`bg-yellow-100 rounded-full p-2 mr-3`}>
                            <Ionicons name="warning" size={20} color="#F59E0B" />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-semibold text-gray-800`}>Temporary Issue</Text>
                            <Text style={tw`text-gray-600 text-sm`}>Server connectivity problem</Text>
                        </View>
                    </View>
                    
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`bg-blue-100 rounded-full p-2 mr-3`}>
                            <Ionicons name="time" size={20} color="#3B82F6" />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-semibold text-gray-800`}>Usually Quick</Text>
                            <Text style={tw`text-gray-600 text-sm`}>Most issues resolve within minutes</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={tw`w-full space-y-4`}>
                    {/* Retry Button */}
                    <TouchableOpacity
                        style={tw`bg-blue-500 rounded-2xl py-4 px-6 shadow-lg`}
                        onPress={handleRetry}
                        activeOpacity={0.8}
                    >
                        <View style={tw`flex-row items-center justify-center`}>
                            <Ionicons name="refresh" size={20} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white font-bold text-lg`}>Try Again</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Go Home Button */}
                    <TouchableOpacity
                        style={tw`bg-gray-100 rounded-2xl py-4 px-6 border border-gray-200`}
                        onPress={handleGoHome}
                        activeOpacity={0.8}
                    >
                        <View style={tw`flex-row items-center justify-center`}>
                            <Ionicons name="home-outline" size={20} color="#6B7280" style={tw`mr-2`} />
                            <Text style={tw`text-gray-700 font-semibold text-lg`}>Go to Home</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Reassuring Footer */}
                <Text style={tw`text-gray-500 text-sm text-center mt-8 leading-5`}>
                    🔧 Our team is working to keep Poultix running smoothly {"\n"}
                    Thank you for your patience!
                </Text>
            </Animated.View>
        </SafeAreaView>
    );
}
