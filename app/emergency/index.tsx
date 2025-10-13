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

// Mock emergency services data
const emergencyContacts = [
    {
        id: '1',
        name: 'Rwanda Veterinary Authority Emergency',
        phone: '+250 788 123 456',
        type: 'Government',
        description: '24/7 emergency veterinary services',
        response: '< 30 mins'
    },
    {
        id: '2',
        name: 'Kigali Veterinary Emergency Clinic',
        phone: '+250 788 234 567',
        type: 'Clinic',
        description: 'Emergency surgery and critical care',
        response: '< 15 mins'
    },
    {
        id: '3',
        name: 'National Animal Disease Control',
        phone: '+250 788 345 678',
        type: 'Government',
        description: 'Disease outbreak response team',
        response: '< 60 mins'
    }
];

const emergencySituations = [
    {
        id: '1',
        title: 'Animal Collapse/Sudden Death',
        symptoms: ['Sudden weakness', 'Difficulty breathing', 'Unconsciousness'],
        immediate: 'Call emergency vet immediately',
        severity: 'Critical',
        icon: 'warning-outline'
    },
    {
        id: '2',
        title: 'Severe Bleeding',
        symptoms: ['Heavy bleeding', 'Bleeding won\'t stop', 'Pale gums'],
        immediate: 'Apply pressure, call emergency vet',
        severity: 'Critical',
        icon: 'water-outline'
    },
    {
        id: '3',
        title: 'Poisoning Suspected',
        symptoms: ['Vomiting', 'Diarrhea', 'Seizures', 'Excessive salivation'],
        immediate: 'Remove from source, contact vet immediately',
        severity: 'Critical',
        icon: 'flask-outline'
    },
    {
        id: '4',
        title: 'Difficulty Breathing',
        symptoms: ['Rapid breathing', 'Nose flaring', 'Blue tongue/gums'],
        immediate: 'Ensure airway is clear, call emergency vet',
        severity: 'High',
        icon: 'pulse-outline'
    },
    {
        id: '5',
        title: 'Severe Lameness',
        symptoms: ['Cannot bear weight', 'Swelling', 'Broken bones visible'],
        immediate: 'Immobilize animal, call emergency vet',
        severity: 'High',
        icon: 'medical-outline'
    },
    {
        id: '6',
        title: 'Seizures/Convulsions',
        symptoms: ['Muscle twitching', 'Paddling', 'Loss of consciousness'],
        immediate: 'Keep safe from injury, call emergency vet',
        severity: 'High',
        icon: 'flash-outline'
    }
];

const EmergencyScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleEmergencyCall = (contact: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert(
            'Emergency Call',
            `Call ${contact.name}? This is for real emergencies only.`,
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

    const handleEmergencySituation = (situation: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            situation.title,
            `${situation.immediate}\n\nSeverity: ${situation.severity}`,
            [
                { text: 'OK' },
                { 
                    text: 'Call Emergency', 
                    onPress: () => router.push('/emergency/contacts')
                },
                {
                    text: 'First Aid Guide',
                    onPress: () => router.push('/emergency/first-aid')
                }
            ]
        );
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-600 bg-red-100';
            case 'High': return 'text-orange-600 bg-orange-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
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
                        Emergency Services
                    </Text>
                    <Text style={tw`text-red-100 text-sm`}>
                        24/7 veterinary emergency support
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Emergency Alert */}
                    <View style={tw`bg-red-50 border border-red-200 rounded-2xl p-6 mb-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="warning" size={24} color="#DC2626" style={tw`mr-3`} />
                            <Text style={tw`text-red-800 font-bold text-lg`}>Emergency Hotline</Text>
                        </View>
                        <Text style={tw`text-red-700 mb-4`}>
                            For life-threatening situations, call emergency services immediately. Do not delay!
                        </Text>
                        <TouchableOpacity
                            style={tw`bg-red-500 py-3 px-6 rounded-xl flex-row items-center justify-center`}
                            onPress={() => router.push('/emergency/contacts')}
                        >
                            <Ionicons name="call" size={18} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white font-bold`}>Emergency Contacts</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Emergency Situations */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Common Emergency Situations</Text>
                        
                        {emergencySituations.map((situation, index) => (
                            <Animated.View
                                key={situation.id}
                                style={[
                                    tw`mb-3`,
                                    {
                                        opacity: cardAnim,
                                        transform: [{
                                            translateY: cardAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [10 * (index + 1), 0],
                                            }),
                                        }],
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-5`}
                                    onPress={() => handleEmergencySituation(situation)}
                                    activeOpacity={0.7}
                                >
                                    <View style={tw`flex-row items-start`}>
                                        <View style={tw`w-12 h-12 rounded-xl items-center justify-center mr-4 bg-red-50`}>
                                            <Ionicons 
                                                name={situation.icon as any} 
                                                size={24} 
                                                color="#DC2626" 
                                            />
                                        </View>
                                        
                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex-row items-center justify-between mb-2`}>
                                                <Text style={tw`text-gray-900 font-bold text-lg flex-1 mr-2`}>
                                                    {situation.title}
                                                </Text>
                                                <View style={tw`px-2 py-1 rounded-full ${getSeverityColor(situation.severity)}`}>
                                                    <Text style={tw`text-xs font-bold`}>
                                                        {situation.severity}
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            <Text style={tw`text-gray-600 text-sm mb-2 font-medium`}>
                                                {situation.immediate}
                                            </Text>
                                            
                                            <View style={tw`mb-3`}>
                                                <Text style={tw`text-gray-700 text-sm font-medium mb-1`}>Symptoms:</Text>
                                                <Text style={tw`text-gray-600 text-sm`}>
                                                    {situation.symptoms.join(' • ')}
                                                </Text>
                                            </View>
                                            
                                            <View style={tw`flex-row space-x-3`}>
                                                <TouchableOpacity
                                                    style={tw`flex-1 bg-red-100 py-2 rounded-xl flex-row items-center justify-center`}
                                                    onPress={() => handleEmergencySituation(situation)}
                                                >
                                                    <Ionicons name="information-circle" size={16} color="#DC2626" style={tw`mr-1`} />
                                                    <Text style={tw`text-red-600 font-bold text-sm`}>Details</Text>
                                                </TouchableOpacity>
                                                
                                                <TouchableOpacity
                                                    style={tw`flex-1 bg-red-500 py-2 rounded-xl flex-row items-center justify-center`}
                                                    onPress={() => router.push('/emergency/contacts')}
                                                >
                                                    <Ionicons name="call" size={16} color="white" style={tw`mr-1`} />
                                                    <Text style={tw`text-white font-bold text-sm`}>Call Help</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Emergency Contacts Preview */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Emergency Contacts</Text>
                        
                        {emergencyContacts.slice(0, 2).map((contact) => (
                            <TouchableOpacity
                                key={contact.id}
                                style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3 flex-row items-center`}
                                onPress={() => handleEmergencyCall(contact)}
                                activeOpacity={0.7}
                            >
                                <View style={tw`w-10 h-10 rounded-xl items-center justify-center mr-4 bg-red-100`}>
                                    <Ionicons name="call" size={20} color="#DC2626" />
                                </View>
                                
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-900 font-bold`}>{contact.name}</Text>
                                    <Text style={tw`text-gray-600 text-sm`}>{contact.description}</Text>
                                </View>
                                
                                <View style={tw`items-end`}>
                                    <Text style={tw`text-red-600 font-bold text-sm`}>{contact.response}</Text>
                                    <Text style={tw`text-gray-500 text-xs`}>response time</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        
                        <TouchableOpacity
                            style={tw`bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-center justify-center`}
                            onPress={() => router.push('/emergency/contacts')}
                        >
                            <Text style={tw`text-red-600 font-bold mr-2`}>View All Emergency Contacts</Text>
                            <Ionicons name="chevron-forward" size={20} color="#DC2626" />
                        </TouchableOpacity>
                    </View>

                    {/* First Aid Section */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>First Aid Resources</Text>
                        
                        <TouchableOpacity
                            style={tw`bg-blue-50 border border-blue-200 rounded-2xl p-6 flex-row items-center`}
                            onPress={() => router.push('/emergency/first-aid')}
                            activeOpacity={0.7}
                        >
                            <View style={tw`w-12 h-12 rounded-xl items-center justify-center mr-4 bg-blue-100`}>
                                <Ionicons name="medkit" size={24} color="#2563EB" />
                            </View>
                            
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-blue-800 font-bold text-lg mb-1`}>Animal First Aid Guide</Text>
                                <Text style={tw`text-blue-600 text-sm`}>
                                    Learn essential first aid techniques for common animal emergencies
                                </Text>
                            </View>
                            
                            <Ionicons name="chevron-forward" size={24} color="#2563EB" />
                        </TouchableOpacity>
                    </View>

                    {/* Emergency Preparedness */}
                    <View style={tw`bg-green-50 rounded-2xl p-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="shield-checkmark" size={20} color="#059669" />
                            <Text style={tw`text-green-800 font-bold ml-2`}>Emergency Preparedness</Text>
                        </View>
                        <Text style={tw`text-green-700 mb-4`}>
                            Prepare for emergencies with our comprehensive guides and checklists.
                        </Text>
                        <View style={tw`flex-row space-x-3`}>
                            <TouchableOpacity style={tw`flex-1 bg-green-500 py-3 px-4 rounded-xl`}>
                                <Text style={tw`text-white font-bold text-center text-sm`}>Emergency Kit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`flex-1 bg-green-100 py-3 px-4 rounded-xl`}>
                                <Text style={tw`text-green-600 font-bold text-center text-sm`}>Preparation Guide</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default EmergencyScreen;
