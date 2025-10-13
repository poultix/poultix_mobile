import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// Mock emergency contacts data
const emergencyContacts = [
    {
        id: '1',
        name: 'Rwanda Veterinary Authority Emergency',
        phone: '+250 788 123 456',
        type: 'Government',
        description: '24/7 emergency veterinary services for disease outbreaks and critical cases',
        response: '< 30 mins',
        coverage: 'Nationwide',
        services: ['Emergency response', 'Disease control', '24/7 hotline']
    },
    {
        id: '2',
        name: 'Kigali Veterinary Emergency Clinic',
        phone: '+250 788 234 567',
        type: 'Private Clinic',
        description: 'Emergency surgery, critical care, and trauma treatment',
        response: '< 15 mins',
        coverage: 'Kigali City',
        services: ['Emergency surgery', 'Critical care', 'Trauma treatment', 'Mobile service']
    },
    {
        id: '3',
        name: 'National Animal Disease Control Center',
        phone: '+250 788 345 678',
        type: 'Government',
        description: 'National disease surveillance and outbreak response team',
        response: '< 60 mins',
        coverage: 'Nationwide',
        services: ['Disease surveillance', 'Outbreak response', 'Vaccination campaigns']
    },
    {
        id: '4',
        name: 'Musanze District Veterinary Office',
        phone: '+250 788 456 789',
        type: 'Government',
        description: 'District-level veterinary emergency services',
        response: '< 45 mins',
        coverage: 'Musanze District',
        services: ['Emergency care', 'Disease reporting', 'Farm visits']
    },
    {
        id: '5',
        name: 'Huye Veterinary Emergency Unit',
        phone: '+250 788 567 890',
        type: 'Government',
        description: 'Southern province emergency veterinary services',
        response: '< 40 mins',
        coverage: 'Huye District',
        services: ['Emergency care', 'Mobile clinic', 'Disease monitoring']
    },
    {
        id: '6',
        name: 'Poison Control Center',
        phone: '+250 788 678 901',
        type: 'Specialized',
        description: 'Toxicology and poisoning emergency response',
        response: '< 20 mins',
        coverage: 'Nationwide (telephone)',
        services: ['Poison advice', 'Antidote information', 'Emergency treatment guidance']
    }
];

const EmergencyContactsScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleEmergencyCall = (contact: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert(
            'Emergency Call',
            `Call ${contact.name}?\n\n${contact.description}\n\nResponse time: ${contact.response}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Call Now', 
                    style: 'destructive',
                    onPress: () => Linking.openURL(`tel:${contact.phone}`)
                }
            ]
        );
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Government': return 'text-blue-600 bg-blue-100';
            case 'Private Clinic': return 'text-green-600 bg-green-100';
            case 'Specialized': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#DC2626', '#B91C1C']}
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
                        Emergency Contacts
                    </Text>
                    <Text style={tw`text-red-100 text-sm`}>
                        24/7 veterinary emergency services
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Emergency Warning */}
                    <View style={tw`bg-red-50 border border-red-200 rounded-2xl p-6 mb-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="warning" size={24} color="#DC2626" style={tw`mr-3`} />
                            <Text style={tw`text-red-800 font-bold text-lg`}>Important Notice</Text>
                        </View>
                        <Text style={tw`text-red-700 leading-6`}>
                            These contacts are for genuine veterinary emergencies only. Misuse of emergency services may result in penalties. For non-emergency situations, use regular veterinary services.
                        </Text>
                    </View>

                    {/* Emergency Contacts List */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Emergency Contacts</Text>
                        
                        {emergencyContacts.map((contact, index) => (
                            <Animated.View
                                key={contact.id}
                                style={[
                                    tw`mb-4`,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{
                                            translateY: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [10 * (index + 1), 0],
                                            }),
                                        }],
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-5`}
                                    onPress={() => handleEmergencyCall(contact)}
                                    activeOpacity={0.7}
                                >
                                    <View style={tw`flex-row items-start`}>
                                        <View style={tw`w-14 h-14 rounded-xl items-center justify-center mr-4 bg-red-100`}>
                                            <Ionicons name="call" size={28} color="#DC2626" />
                                        </View>
                                        
                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex-row items-center justify-between mb-2`}>
                                                <Text style={tw`text-gray-900 font-bold text-lg flex-1 mr-2`}>
                                                    {contact.name}
                                                </Text>
                                                <View style={tw`px-3 py-1 rounded-full ${getTypeColor(contact.type)}`}>
                                                    <Text style={tw`text-xs font-bold`}>
                                                        {contact.type}
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            <Text style={tw`text-gray-600 text-sm mb-3 leading-5`}>
                                                {contact.description}
                                            </Text>
                                            
                                            <View style={tw`flex-row items-center justify-between mb-3`}>
                                                <View style={tw`flex-row items-center`}>
                                                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                                                    <Text style={tw`text-gray-600 text-sm ml-1`}>
                                                        {contact.response} response
                                                    </Text>
                                                </View>
                                                <View style={tw`flex-row items-center`}>
                                                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                                                    <Text style={tw`text-gray-600 text-sm ml-1`}>
                                                        {contact.coverage}
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            {/* Services */}
                                            <View style={tw`mb-4`}>
                                                <Text style={tw`text-gray-700 font-medium mb-2 text-sm`}>Services:</Text>
                                                <View style={tw`flex-row flex-wrap`}>
                                                    {contact.services.map((service, idx) => (
                                                        <View key={idx} style={tw`bg-red-50 rounded-full px-2 py-1 mr-2 mb-1`}>
                                                            <Text style={tw`text-red-700 text-xs`}>
                                                                {service}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                            
                                            <View style={tw`flex-row items-center justify-between`}>
                                                <Text style={tw`text-red-600 font-bold text-lg`}>
                                                    {contact.phone}
                                                </Text>
                                                
                                                <TouchableOpacity
                                                    style={tw`bg-red-500 px-6 py-3 rounded-xl flex-row items-center`}
                                                    onPress={() => handleEmergencyCall(contact)}
                                                >
                                                    <Ionicons name="call" size={18} color="white" style={tw`mr-2`} />
                                                    <Text style={tw`text-white font-bold`}>Call Emergency</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Additional Resources */}
                    <View style={tw`bg-blue-50 rounded-2xl p-6 mb-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="information-circle" size={20} color="#2563EB" />
                            <Text style={tw`text-blue-800 font-bold ml-2`}>Additional Resources</Text>
                        </View>
                        <Text style={tw`text-blue-700 mb-4`}>
                            For non-emergency situations or additional support:
                        </Text>
                        <View style={tw`space-y-3`}>
                            <TouchableOpacity 
                                style={tw`flex-row items-center py-3 border-b border-blue-200`}
                                onPress={() => router.push('/veterinary')}
                            >
                                <Ionicons name="person-outline" size={20} color="#2563EB" style={tw`mr-3`} />
                                <Text style={tw`text-blue-700 flex-1`}>Find Regular Veterinarians</Text>
                                <Ionicons name="chevron-forward" size={20} color="#2563EB" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={tw`flex-row items-center py-3 border-b border-blue-200`}
                                onPress={() => router.push('/medicine/nearby-pharmacies')}
                            >
                                <Ionicons name="storefront-outline" size={20} color="#2563EB" style={tw`mr-3`} />
                                <Text style={tw`text-blue-700 flex-1`}>Find Nearby Pharmacies</Text>
                                <Ionicons name="chevron-forward" size={20} color="#2563EB" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={tw`flex-row items-center py-3`}
                                onPress={() => router.push('/emergency/first-aid')}
                            >
                                <Ionicons name="medkit-outline" size={20} color="#2563EB" style={tw`mr-3`} />
                                <Text style={tw`text-blue-700 flex-1`}>First Aid Guide</Text>
                                <Ionicons name="chevron-forward" size={20} color="#2563EB" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default EmergencyContactsScreen;
