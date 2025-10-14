import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';
import { i18n } from '../../services/i18n/i18n';

const NavigationHub = () => {
    const quickActions = [
        { id: 'medicines', label: i18n.navigation('findMedicines'), icon: 'medical-outline', route: '/medicine', color: 'bg-blue-500' },
        { id: 'veterinarians', label: i18n.navigation('findVets'), icon: 'person-outline', route: '/veterinary', color: 'bg-green-500' },
        { id: 'vaccines', label: i18n.navigation('vaccines'), icon: 'shield-checkmark-outline', route: '/vaccination', color: 'bg-purple-500' },
        { id: 'pharmacies', label: i18n.navigation('pharmacies'), icon: 'storefront-outline', route: '/medicine/nearby-pharmacies', color: 'bg-orange-500' },
        { id: 'emergency', label: i18n.navigation('emergency'), icon: 'warning-outline', route: '/emergency', color: 'bg-red-500' },
        { id: 'environment', label: i18n.navigation('environmentMonitoring'), icon: 'leaf-outline', route: '/environmental-scanner', color: 'bg-teal-500' },
        { id: 'ai', label: i18n.navigation('aiAssistant'), icon: 'chatbubble-ellipses-outline', route: '/ai', color: 'bg-purple-600' },
        { id: 'dashboard', label: i18n.navigation('dashboard'), icon: 'grid-outline', route: '/dashboard', color: 'bg-gray-600' }
    ];
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleActionPress = (route: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(route as any);
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`bg-white bg-opacity-20 p-2 rounded-xl mb-4 self-start`}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <Text style={tw`text-white text-2xl font-bold mb-2`}>
                        {i18n.navigation('exploreApp')}
                    </Text>
                    <Text style={tw`text-purple-100 text-sm`}>
                        Access all features and services for your poultry farm
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Quick Actions Grid */}
                    <View style={tw`px-4 py-6`}>
                        <Text style={tw`text-gray-800 text-lg font-semibold mb-4`}>
                            Quick Access
                        </Text>
                        
                        <View style={tw`flex-row flex-wrap justify-between`}>
                            {quickActions.map((action, index) => (
                                <TouchableOpacity
                                    key={action.id}
                                    onPress={() => handleActionPress(action.route)}
                                    style={tw`w-[48%] mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100`}
                                >
                                    <View style={tw`${action.color} p-3 rounded-xl mb-3 self-start`}>
                                        <Ionicons 
                                            name={action.icon as any} 
                                            size={24} 
                                            color="white" 
                                        />
                                    </View>
                                    <Text style={tw`text-gray-800 font-medium text-sm`}>
                                        {action.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Featured Section */}
                    <View style={tw`px-4 py-2`}>
                        <Text style={tw`text-gray-800 text-lg font-semibold mb-4`}>
                            Featured Tools
                        </Text>
                        
                        <TouchableOpacity
                            onPress={() => handleActionPress('/environmental-scanner')}
                            style={tw`bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 mb-4`}
                        >
                            <LinearGradient
                                colors={['#0D9488', '#0F766E']}
                                style={tw`rounded-2xl p-6 -m-6`}
                            >
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`bg-white bg-opacity-20 p-3 rounded-xl mr-4`}>
                                        <Ionicons name="leaf-outline" size={28} color="white" />
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-white font-bold text-lg mb-1`}>
                                            Environment Monitor
                                        </Text>
                                        <Text style={tw`text-teal-100 text-sm`}>
                                            Real-time temperature & humidity tracking
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleActionPress('/ai')}
                            style={tw`bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6`}
                        >
                            <LinearGradient
                                colors={['#7C3AED', '#6D28D9']}
                                style={tw`rounded-2xl p-6 -m-6`}
                            >
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`bg-white bg-opacity-20 p-3 rounded-xl mr-4`}>
                                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" />
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-white font-bold text-lg mb-1`}>
                                            AI Assistant
                                        </Text>
                                        <Text style={tw`text-purple-100 text-sm`}>
                                            Get expert advice and recommendations
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default NavigationHub;
