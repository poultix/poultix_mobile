import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import {
    Animated,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// Mock detailed veterinarian data
const getVeterinarianDetails = (id: string) => {
    const veterinarians: any = {
        '1': {
            id: '1',
            name: 'Dr. John Uwimana',
            rvcNumber: 'RVC-12345',
            specialization: 'Large Animal Medicine',
            clinic: 'Kigali Veterinary Clinic',
            location: 'Nyarugenge, Kigali',
            phone: '+250 788 123 456',
            email: 'john.uwimana@kvc.rw',
            experience: '8 years',
            rating: 4.9,
            reviewCount: 127,
            isVerified: true,
            aiScore: 98,
            availability: 'Available Today',
            consultationFee: '₹15,000',
            languages: ['Kinyarwanda', 'English', 'French'],
            services: ['Emergency Care', 'Surgery', 'Vaccination', 'Health Checkups', 'Pregnancy Diagnosis', 'Disease Prevention'],
            workingHours: '8:00 AM - 6:00 PM',
            education: 'DVM University of Rwanda, MSc Animal Health',
            distance: 2.3,
            bio: 'Experienced large animal veterinarian with expertise in cattle, sheep, and goat health management. Specialized in emergency care and surgical procedures with AI-assisted diagnostic capabilities.',
            certifications: [
                'Rwanda Veterinary Council License',
                'Emergency Veterinary Care Certificate',
                'Large Animal Surgery Certification',
                'AI-Assisted Diagnostics Training'
            ],
            achievements: [
                'Best Veterinarian Award 2023 - Rwanda Veterinary Association',
                '500+ Successful Surgeries',
                'AI Innovation in Veterinary Care Recognition',
                'Community Service Excellence Award'
            ],
            reviews: [
                {
                    user: 'Jean Baptiste M.',
                    rating: 5,
                    date: '2024-10-10',
                    comment: 'Dr. Uwimana saved my cow\'s life during a difficult calving. His expertise and quick thinking were remarkable. Highly recommended!'
                },
                {
                    user: 'Mary Uwizeye',
                    rating: 5,
                    date: '2024-10-08',
                    comment: 'Professional, knowledgeable, and caring. The AI diagnostic tools he uses are impressive and helped identify the problem quickly.'
                },
                {
                    user: 'Paul Nkurunziza',
                    rating: 4,
                    date: '2024-10-05',
                    comment: 'Great service, though sometimes busy. The consultation was thorough and the treatment plan was effective.'
                }
            ]
        }
    };

    return veterinarians[id] || veterinarians['1'];
};

const VeterinaryDetailScreen = () => {
    const params = useLocalSearchParams();
    const vetId = params.id as string || '1';
    const vet = getVeterinarianDetails(vetId);
    
    const [activeTab, setActiveTab] = useState('overview');
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

    const handleCall = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Linking.openURL(`tel:${vet.phone}`);
    };

    const handleEmail = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL(`mailto:${vet.email}`);
    };

    const handleBookAppointment = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/schedule/schedule-request');
    };

    const handleVerifyCredentials = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            'Credential Verification',
            `RVC Number: ${vet.rvcNumber}\nStatus: ✅ Verified\nLast Updated: ${new Date().toLocaleDateString()}`,
            [{ text: 'OK' }]
        );
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'information-circle-outline' },
        { id: 'services', label: 'Services', icon: 'medical-outline' },
        { id: 'credentials', label: 'Credentials', icon: 'school-outline' },
        { id: 'reviews', label: 'Reviews', icon: 'star-outline' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <View>
                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>About</Text>
                            <Text style={tw`text-gray-600 leading-6 mb-4`}>{vet.bio}</Text>
                            
                            <View style={tw`space-y-4`}>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Experience</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{vet.experience}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Working Hours</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{vet.workingHours}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Consultation Fee</Text>
                                    <Text style={tw`text-green-600 font-bold text-lg`}>{vet.consultationFee}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2`}>
                                    <Text style={tw`text-gray-600`}>Languages</Text>
                                    <Text style={tw`text-gray-900 font-medium flex-1 text-right ml-4`}>
                                        {vet.languages.join(', ')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Contact Information</Text>
                            
                            <TouchableOpacity 
                                style={tw`flex-row items-center py-3 border-b border-gray-100`}
                                onPress={handleCall}
                            >
                                <Ionicons name="call" size={20} color="#059669" style={tw`mr-4`} />
                                <Text style={tw`text-gray-700 flex-1`}>{vet.phone}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={tw`flex-row items-center py-3 border-b border-gray-100`}
                                onPress={handleEmail}
                            >
                                <Ionicons name="mail" size={20} color="#059669" style={tw`mr-4`} />
                                <Text style={tw`text-gray-700 flex-1`}>{vet.email}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                            </TouchableOpacity>
                            
                            <View style={tw`flex-row items-center py-3`}>
                                <Ionicons name="location" size={20} color="#059669" style={tw`mr-4`} />
                                <Text style={tw`text-gray-700 flex-1`}>{vet.location}</Text>
                            </View>
                        </View>

                        <View style={tw`bg-green-50 rounded-2xl p-6`}>
                            <View style={tw`flex-row items-center mb-3`}>
                                <Ionicons name="sparkles" size={20} color="#059669" />
                                <Text style={tw`text-green-800 font-bold ml-2`}>AI Verification Status</Text>
                                <View style={tw`bg-green-100 px-2 py-1 rounded-full ml-auto`}>
                                    <Text style={tw`text-green-700 text-xs font-bold`}>Score: {vet.aiScore}%</Text>
                                </View>
                            </View>
                            <Text style={tw`text-green-700 mb-4`}>
                                This veterinarian has been AI-verified for credentials, experience, and professional standing.
                            </Text>
                            <TouchableOpacity 
                                style={tw`bg-green-500 py-3 px-6 rounded-xl`}
                                onPress={handleVerifyCredentials}
                            >
                                <Text style={tw`text-white font-bold text-center`}>View Verification Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            
            case 'services':
                return (
                    <View>
                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Services Offered</Text>
                            {vet.services.map((service: string, index: number) => (
                                <View key={index} style={tw`flex-row items-center py-3 border-b border-gray-100 last:border-b-0`}>
                                    <Ionicons name="checkmark-circle" size={20} color="#059669" style={tw`mr-3`} />
                                    <Text style={tw`text-gray-700 flex-1 font-medium`}>{service}</Text>
                                    <Text style={tw`text-gray-500 text-sm`}>Available</Text>
                                </View>
                            ))}
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Specialization</Text>
                            <View style={tw`bg-green-50 rounded-xl p-4`}>
                                <View style={tw`flex-row items-center`}>
                                    <Ionicons name="ribbon" size={20} color="#059669" style={tw`mr-3`} />
                                    <Text style={tw`text-green-800 font-bold flex-1`}>{vet.specialization}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-blue-50 rounded-2xl p-6`}>
                            <Text style={tw`text-blue-800 font-bold mb-2`}>Need a Service?</Text>
                            <Text style={tw`text-blue-600 mb-4`}>Book an appointment to discuss your animal's specific needs.</Text>
                            <TouchableOpacity 
                                style={tw`bg-blue-500 py-3 px-6 rounded-xl`}
                                onPress={handleBookAppointment}
                            >
                                <Text style={tw`text-white font-bold text-center`}>Schedule Consultation</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
                
            case 'credentials':
                return (
                    <View>
                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Education</Text>
                            <View style={tw`bg-gray-50 rounded-xl p-4`}>
                                <Text style={tw`text-gray-700 font-medium leading-6`}>{vet.education}</Text>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Certifications</Text>
                            {vet.certifications.map((cert: string, index: number) => (
                                <View key={index} style={tw`flex-row items-center py-3 border-b border-gray-100 last:border-b-0`}>
                                    <Ionicons name="ribbon" size={20} color="#059669" style={tw`mr-3`} />
                                    <Text style={tw`text-gray-700 flex-1`}>{cert}</Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                                </View>
                            ))}
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Achievements</Text>
                            {vet.achievements.map((achievement: string, index: number) => (
                                <View key={index} style={tw`flex-row items-start py-3 border-b border-gray-100 last:border-b-0`}>
                                    <Ionicons name="trophy" size={20} color="#F59E0B" style={tw`mr-3 mt-1`} />
                                    <Text style={tw`text-gray-700 flex-1 leading-5`}>{achievement}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={tw`bg-green-50 rounded-2xl p-6`}>
                            <View style={tw`flex-row items-center mb-3`}>
                                <Ionicons name="shield-checkmark" size={20} color="#059669" />
                                <Text style={tw`text-green-800 font-bold ml-2`}>RVC Verification</Text>
                            </View>
                            <Text style={tw`text-green-700 mb-4`}>
                                All credentials have been verified by the Rwanda Veterinary Council and our AI system.
                            </Text>
                            <TouchableOpacity 
                                style={tw`bg-green-500 py-3 px-6 rounded-xl`}
                                onPress={handleVerifyCredentials}
                            >
                                <Text style={tw`text-white font-bold text-center`}>Verify RVC License</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
                
            case 'reviews':
                return (
                    <View>
                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <Text style={tw`text-gray-900 font-bold text-lg`}>Patient Reviews</Text>
                                <View style={tw`flex-row items-center`}>
                                    <Ionicons name="star" size={20} color="#F59E0B" />
                                    <Text style={tw`text-gray-900 font-bold ml-2 mr-1`}>{vet.rating}</Text>
                                    <Text style={tw`text-gray-500`}>({vet.reviewCount})</Text>
                                </View>
                            </View>
                            
                            {vet.reviews.map((review: any, index: number) => (
                                <View key={index} style={tw`py-4 ${index < vet.reviews.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <View style={tw`flex-row items-center justify-between mb-2`}>
                                        <Text style={tw`text-gray-900 font-medium`}>{review.user}</Text>
                                        <Text style={tw`text-gray-500 text-sm`}>{review.date}</Text>
                                    </View>
                                    <View style={tw`flex-row items-center mb-2`}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons
                                                key={i}
                                                name={i < review.rating ? 'star' : 'star-outline'}
                                                size={16}
                                                color={i < review.rating ? '#F59E0B' : '#D1D5DB'}
                                            />
                                        ))}
                                    </View>
                                    <Text style={tw`text-gray-600 leading-5`}>{review.comment}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={tw`bg-blue-50 rounded-2xl p-6`}>
                            <Text style={tw`text-blue-800 font-bold mb-2`}>Share Your Experience</Text>
                            <Text style={tw`text-blue-600 mb-4`}>Help other animal owners by sharing your experience with Dr. {vet.name.split(' ')[1]}.</Text>
                            <TouchableOpacity style={tw`bg-blue-500 py-3 px-6 rounded-xl`}>
                                <Text style={tw`text-white font-bold text-center`}>Write a Review</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
                
            default:
                return null;
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#059669', '#10B981']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <View style={tw`flex-row items-center justify-between mb-4`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <View style={tw`flex-row`}>
                        <TouchableOpacity
                            style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-3`}
                            onPress={() => {}}
                        >
                            <Ionicons name="share-outline" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                            onPress={() => {}}
                        >
                            <Ionicons name="heart-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
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
                    <View style={tw`w-24 h-24 bg-white bg-opacity-20 rounded-full items-center justify-center mb-4`}>
                        <Ionicons name="person" size={48} color="white" />
                    </View>
                    
                    <Text style={tw`text-white text-xl font-bold text-center mb-1`}>
                        {vet.name}
                    </Text>
                    <Text style={tw`text-green-100 text-center mb-2`}>
                        {vet.specialization}
                    </Text>
                    <Text style={tw`text-green-100 text-center mb-4`}>
                        {vet.clinic} • RVC: {vet.rvcNumber}
                    </Text>
                    
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`bg-white bg-opacity-20 px-3 py-1 rounded-full mr-3`}>
                            <Text style={tw`text-white font-bold`}>⭐ {vet.rating}</Text>
                        </View>
                        <View style={tw`bg-green-500 bg-opacity-90 px-3 py-1 rounded-full`}>
                            <Text style={tw`text-white text-sm font-medium`}>{vet.availability}</Text>
                        </View>
                    </View>
                </Animated.View>
            </LinearGradient>

            {/* Tab Navigation */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`bg-white border-b border-gray-200`}
                contentContainerStyle={tw`px-4 py-4`}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={tw`mr-6 pb-2 ${activeTab === tab.id ? 'border-b-2 border-green-500' : ''}`}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <View style={tw`flex-row items-center`}>
                            <Ionicons
                                name={tab.icon as any}
                                size={20}
                                color={activeTab === tab.id ? '#059669' : '#6B7280'}
                                style={tw`mr-2`}
                            />
                            <Text
                                style={tw`font-medium ${
                                    activeTab === tab.id ? 'text-green-600' : 'text-gray-600'
                                }`}
                            >
                                {tab.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content */}
            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {renderTabContent()}
                </Animated.View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={tw`bg-white border-t border-gray-200 p-4 pb-8`}>
                <View style={tw`flex-row space-x-3`}>
                    <TouchableOpacity
                        style={tw`flex-1 bg-gray-100 py-4 rounded-2xl flex-row items-center justify-center`}
                        onPress={handleCall}
                    >
                        <Ionicons name="call-outline" size={20} color="#6B7280" style={tw`mr-2`} />
                        <Text style={tw`text-gray-700 font-bold`}>Call Now</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`flex-1 bg-green-500 py-4 rounded-2xl flex-row items-center justify-center`}
                        onPress={handleBookAppointment}
                    >
                        <Ionicons name="calendar-outline" size={20} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white font-bold`}>Book Appointment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default VeterinaryDetailScreen;
