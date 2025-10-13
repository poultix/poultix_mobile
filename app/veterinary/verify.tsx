import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

const VeterinaryVerifyScreen = () => {
    const [rvcNumber, setRvcNumber] = useState('');
    const [veterinarianName, setVeterinarianName] = useState('');
    const [loading, setLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState<any>(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
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
    }, []);

    // Mock verification function
    const verifyVeterinarian = async () => {
        if (!rvcNumber.trim()) {
            Alert.alert('Error', 'Please enter an RVC number');
            return;
        }

        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Simulate API call
        setTimeout(() => {
            // Mock verification results based on RVC number
            const mockResults: any = {
                'RVC-12345': {
                    isValid: true,
                    name: 'Dr. John Uwimana',
                    licenseNumber: 'RVC-12345',
                    status: 'Active',
                    issueDate: '2018-03-15',
                    expiryDate: '2025-03-15',
                    specialization: 'Large Animal Medicine',
                    institution: 'University of Rwanda',
                    graduationYear: '2016',
                    lastRenewal: '2023-03-15',
                    aiVerificationScore: 98,
                    verificationDetails: {
                        credentialsVerified: true,
                        educationVerified: true,
                        experienceVerified: true,
                        ethicsRecordClean: true,
                        continuingEducationCurrent: true
                    }
                },
                'RVC-67890': {
                    isValid: true,
                    name: 'Dr. Alice Mukamana',
                    licenseNumber: 'RVC-67890',
                    status: 'Active',
                    issueDate: '2020-06-20',
                    expiryDate: '2026-06-20',
                    specialization: 'Small Ruminants & Poultry',
                    institution: 'University of Nairobi',
                    graduationYear: '2018',
                    lastRenewal: '2024-06-20',
                    aiVerificationScore: 95,
                    verificationDetails: {
                        credentialsVerified: true,
                        educationVerified: true,
                        experienceVerified: true,
                        ethicsRecordClean: true,
                        continuingEducationCurrent: true
                    }
                }
            };

            const result = mockResults[rvcNumber.toUpperCase()] || {
                isValid: false,
                message: 'RVC number not found in the database. Please verify the number and try again.'
            };

            setVerificationResult(result);
            setLoading(false);

            if (result.isValid) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }, 2000);
    };

    const clearResults = () => {
        setVerificationResult(null);
        setRvcNumber('');
        setVeterinarianName('');
    };

    const renderVerificationResult = () => {
        if (!verificationResult) return null;

        if (!verificationResult.isValid) {
            return (
                <Animated.View
                    style={[
                        tw`bg-white rounded-2xl p-6 mt-6 shadow-sm`,
                        { opacity: fadeAnim }
                    ]}
                >
                    <View style={tw`items-center`}>
                        <View style={tw`w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4`}>
                            <Ionicons name="close-circle" size={40} color="#EF4444" />
                        </View>
                        <Text style={tw`text-red-600 font-bold text-lg mb-2`}>Verification Failed</Text>
                        <Text style={tw`text-gray-600 text-center leading-6`}>
                            {verificationResult.message}
                        </Text>
                    </View>
                </Animated.View>
            );
        }

        return (
            <Animated.View
                style={[
                    tw`mt-6`,
                    { opacity: fadeAnim }
                ]}
            >
                {/* Verification Success Header */}
                <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                    <View style={tw`items-center mb-6`}>
                        <View style={tw`w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4`}>
                            <Ionicons name="checkmark-circle" size={40} color="#10B981" />
                        </View>
                        <Text style={tw`text-green-600 font-bold text-xl mb-2`}>Verified Successfully</Text>
                        <Text style={tw`text-gray-600 text-center`}>
                            This veterinarian is licensed and verified by RVC
                        </Text>
                    </View>

                    {/* AI Verification Score */}
                    <View style={tw`bg-green-50 rounded-xl p-4 mb-4`}>
                        <View style={tw`flex-row items-center justify-between mb-2`}>
                            <Text style={tw`text-green-800 font-bold`}>AI Verification Score</Text>
                            <Text style={tw`text-green-600 font-bold text-lg`}>
                                {verificationResult.aiVerificationScore}%
                            </Text>
                        </View>
                        <View style={tw`bg-green-200 rounded-full h-2`}>
                            <View 
                                style={[
                                    tw`bg-green-500 h-2 rounded-full`, 
                                    { width: `${verificationResult.aiVerificationScore}%` }
                                ]} 
                            />
                        </View>
                    </View>
                </View>

                {/* Basic Information */}
                <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                    <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>License Information</Text>
                    
                    <View style={tw`space-y-4`}>
                        <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                            <Text style={tw`text-gray-600`}>Full Name</Text>
                            <Text style={tw`text-gray-900 font-medium flex-1 text-right ml-4`}>
                                {verificationResult.name}
                            </Text>
                        </View>
                        <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                            <Text style={tw`text-gray-600`}>License Number</Text>
                            <Text style={tw`text-gray-900 font-medium`}>
                                {verificationResult.licenseNumber}
                            </Text>
                        </View>
                        <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                            <Text style={tw`text-gray-600`}>Status</Text>
                            <View style={tw`bg-green-100 px-2 py-1 rounded-full`}>
                                <Text style={tw`text-green-600 font-bold text-xs`}>
                                    {verificationResult.status}
                                </Text>
                            </View>
                        </View>
                        <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                            <Text style={tw`text-gray-600`}>Specialization</Text>
                            <Text style={tw`text-gray-900 font-medium flex-1 text-right ml-4`}>
                                {verificationResult.specialization}
                            </Text>
                        </View>
                        <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                            <Text style={tw`text-gray-600`}>Issue Date</Text>
                            <Text style={tw`text-gray-900 font-medium`}>
                                {verificationResult.issueDate}
                            </Text>
                        </View>
                        <View style={tw`flex-row justify-between py-2`}>
                            <Text style={tw`text-gray-600`}>Expiry Date</Text>
                            <Text style={tw`text-gray-900 font-medium`}>
                                {verificationResult.expiryDate}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Education Information */}
                <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                    <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Education & Training</Text>
                    
                    <View style={tw`space-y-4`}>
                        <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                            <Text style={tw`text-gray-600`}>Institution</Text>
                            <Text style={tw`text-gray-900 font-medium flex-1 text-right ml-4`}>
                                {verificationResult.institution}
                            </Text>
                        </View>
                        <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                            <Text style={tw`text-gray-600`}>Graduation Year</Text>
                            <Text style={tw`text-gray-900 font-medium`}>
                                {verificationResult.graduationYear}
                            </Text>
                        </View>
                        <View style={tw`flex-row justify-between py-2`}>
                            <Text style={tw`text-gray-600`}>Last Renewal</Text>
                            <Text style={tw`text-gray-900 font-medium`}>
                                {verificationResult.lastRenewal}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Verification Details */}
                <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                    <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Verification Checklist</Text>
                    
                    {Object.entries(verificationResult.verificationDetails).map(([key, value]) => {
                        const labels: any = {
                            credentialsVerified: 'Credentials Verified',
                            educationVerified: 'Education Verified',
                            experienceVerified: 'Experience Verified',
                            ethicsRecordClean: 'Ethics Record Clean',
                            continuingEducationCurrent: 'Continuing Education Current'
                        };

                        return (
                            <View key={key} style={tw`flex-row items-center py-3 border-b border-gray-100 last:border-b-0`}>
                                <Ionicons 
                                    name={value ? "checkmark-circle" : "close-circle"} 
                                    size={20} 
                                    color={value ? "#10B981" : "#EF4444"} 
                                    style={tw`mr-3`} 
                                />
                                <Text style={tw`text-gray-700 flex-1`}>{labels[key]}</Text>
                                <Text style={tw`${value ? 'text-green-600' : 'text-red-600'} font-medium text-sm`}>
                                    {value ? 'Verified' : 'Failed'}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Action Buttons */}
                <View style={tw`flex-row space-x-3 mb-6`}>
                    <TouchableOpacity
                        style={tw`flex-1 bg-gray-100 py-4 rounded-2xl flex-row items-center justify-center`}
                        onPress={clearResults}
                    >
                        <Ionicons name="refresh-outline" size={20} color="#6B7280" style={tw`mr-2`} />
                        <Text style={tw`text-gray-700 font-bold`}>Verify Another</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`flex-1 bg-green-500 py-4 rounded-2xl flex-row items-center justify-center`}
                        onPress={() => router.push('/veterinary')}
                    >
                        <Ionicons name="person-outline" size={20} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white font-bold`}>View Profile</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <View style={tw`flex-row items-center justify-between mb-4`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                        onPress={() => {
                            Alert.alert(
                                'Verification Info',
                                'This tool verifies veterinarian licenses with the Rwanda Veterinary Council database using AI-powered validation.',
                                [{ text: 'OK' }]
                            );
                        }}
                    >
                        <Ionicons name="information-circle-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <Animated.View
                    style={[
                        tw`items-center`,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={tw`w-20 h-20 bg-white bg-opacity-20 rounded-full items-center justify-center mb-4`}>
                        <Ionicons name="shield-checkmark" size={40} color="white" />
                    </View>
                    
                    <Text style={tw`text-white text-2xl font-bold text-center mb-2`}>
                        Verify Veterinarian
                    </Text>
                    <Text style={tw`text-blue-100 text-center`}>
                        AI-powered RVC license verification
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Instructions */}
                    <View style={tw`bg-blue-50 rounded-2xl p-6 mb-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="information-circle" size={20} color="#3B82F6" />
                            <Text style={tw`text-blue-800 font-bold ml-2`}>How it works</Text>
                        </View>
                        <Text style={tw`text-blue-700 leading-6`}>
                            Enter the veterinarian's RVC license number to verify their credentials with the Rwanda Veterinary Council database. Our AI system will validate their education, experience, and professional standing.
                        </Text>
                    </View>

                    {/* Input Form */}
                    <View style={tw`bg-white rounded-2xl p-6 shadow-sm`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-6`}>Verification Details</Text>
                        
                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-700 font-medium mb-2`}>RVC License Number *</Text>
                            <TextInput
                                style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                placeholder="e.g., RVC-12345"
                                placeholderTextColor="#6B7280"
                                value={rvcNumber}
                                onChangeText={setRvcNumber}
                                autoCapitalize="characters"
                                maxLength={20}
                            />
                            <Text style={tw`text-gray-500 text-sm mt-2`}>
                                Enter the official RVC license number
                            </Text>
                        </View>

                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-700 font-medium mb-2`}>Veterinarian Name (Optional)</Text>
                            <TextInput
                                style={tw`bg-gray-100 rounded-xl p-4 text-gray-800 text-base`}
                                placeholder="e.g., Dr. John Uwimana"
                                placeholderTextColor="#6B7280"
                                value={veterinarianName}
                                onChangeText={setVeterinarianName}
                                autoCapitalize="words"
                            />
                            <Text style={tw`text-gray-500 text-sm mt-2`}>
                                Help us verify the correct veterinarian
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={tw`bg-blue-500 py-4 rounded-2xl flex-row items-center justify-center ${
                                loading ? 'opacity-50' : ''
                            }`}
                            onPress={verifyVeterinarian}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator color="white" size="small" style={tw`mr-3`} />
                                    <Text style={tw`text-white font-bold text-lg`}>Verifying...</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="shield-checkmark-outline" size={20} color="white" style={tw`mr-3`} />
                                    <Text style={tw`text-white font-bold text-lg`}>Verify Credentials</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Verification Result */}
                    {renderVerificationResult()}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default VeterinaryVerifyScreen;
