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

export default function ServerUnreachableScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
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
                {/* Server Down Icon */}
                <View style={tw`bg-red-100 rounded-full p-6 mb-8`}>
                    <Ionicons 
                        name="server-outline" 
                        size={64} 
                        color="#EF4444" 
                    />
                </View>

                {/* Main Message */}
                <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-4`}>
                    Server Unreachable
                </Text>
                
                <Text style={tw`text-gray-600 text-center text-base leading-6 mb-8`}>
                    We can't connect to our servers right now. {"\n"}
                    Your internet is working, but our server {"\n"}
                    might be temporarily down.
                </Text>

                {/* Status Info */}
                <View style={tw`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 w-full`}>
                    <View style={tw`flex-row items-center mb-4`}>
                        <View style={tw`bg-green-100 rounded-full p-2 mr-3`}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-semibold text-gray-800`}>Your Connection</Text>
                            <Text style={tw`text-gray-600 text-sm`}>Internet is working fine</Text>
                        </View>
                    </View>
                    
                    <View style={tw`flex-row items-center mb-4`}>
                        <View style={tw`bg-red-100 rounded-full p-2 mr-3`}>
                            <Ionicons name="close-circle" size={20} color="#EF4444" />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-semibold text-gray-800`}>Poultix Server</Text>
                            <Text style={tw`text-gray-600 text-sm`}>Temporarily unreachable</Text>
                        </View>
                    </View>
                    
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`bg-blue-100 rounded-full p-2 mr-3`}>
                            <Ionicons name="construct" size={20} color="#3B82F6" />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-semibold text-gray-800`}>What We're Doing</Text>
                            <Text style={tw`text-gray-600 text-sm`}>Working to restore service quickly</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={tw`w-full space-y-4`}>
                    <TouchableOpacity
                        style={tw`bg-red-500 rounded-2xl py-4 px-6 shadow-lg`}
                        onPress={handleRetry}
                        activeOpacity={0.8}
                    >
                        <View style={tw`flex-row items-center justify-center`}>
                            <Ionicons name="refresh" size={20} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white font-bold text-lg`}>Try Again</Text>
                        </View>
                    </TouchableOpacity>

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

                {/* Footer */}
                <Text style={tw`text-gray-500 text-sm text-center mt-8 leading-5`}>
                    🔧 Our team is working to restore access {"\n"}
                    Expected resolution: Within 15 minutes
                </Text>
            </Animated.View>
        </SafeAreaView>
    );
}
