import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

// Mock detailed vaccine data
const getVaccineDetails = (id: string) => {
    const vaccines: any = {
        '1': {
            id: '1',
            name: 'Foot and Mouth Disease Vaccine',
            category: 'Viral Diseases',
            description: 'AI-recommended preventive vaccine for FMD, the most economically devastating disease affecting livestock worldwide. Provides protection against multiple FMD virus strains.',
            targetDisease: 'Foot and Mouth Disease',
            dosage: '2ml subcutaneous',
            administration: 'Subcutaneous injection',
            storage: '2-8°C refrigerator',
            prescriptionRequired: true,
            manufacturer: 'VetBio Rwanda',
            price: '₹450 per dose',
            availability: 'In Stock',
            aiScore: 98,
            priority: 'High',
            herdImmunity: '80%',
            durationProtection: '6 months',
            commonFor: ['Cattle', 'Sheep', 'Goats'],
            schedule: 'Annual booster recommended',
            sideEffects: 'Mild swelling at injection site, resolves within 48 hours',
            contraindications: 'Do not vaccinate animals showing clinical signs of FMD',
            withdrawalPeriod: 'Meat: 21 days, Milk: 0 days',
            efficacyRate: '95% protection against homologous strains',
            researchBacking: 'WHO recommended, used in 120+ countries',
            aiInsights: {
                effectiveness: 98,
                safety: 94,
                costEfficiency: 89,
                diseasePrevalence: 'High in Rwanda',
                recommendation: 'Essential for all cattle operations'
            }
        }
    };

    return vaccines[id] || vaccines['1'];
};

const VaccineDetailScreen = () => {
    const params = useLocalSearchParams();
    const vaccineId = params.id as string || '1';
    const vaccine = getVaccineDetails(vaccineId);
    
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

    const handleScheduleVaccination = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/vaccination/schedule');
    };

    const handleFindVeterinarian = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/veterinary/nearby');
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'information-circle-outline' },
        { id: 'usage', label: 'Usage', icon: 'medical-outline' },
        { id: 'ai-insights', label: 'AI Insights', icon: 'sparkles-outline' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <View>
                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Vaccine Information</Text>
                            
                            <View style={tw`space-y-4`}>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Target Disease</Text>
                                    <Text style={tw`text-gray-900 font-medium flex-1 text-right ml-4`}>
                                        {vaccine.targetDisease}
                                    </Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Manufacturer</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{vaccine.manufacturer}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Herd Immunity</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{vaccine.herdImmunity}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Duration of Protection</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{vaccine.durationProtection}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2`}>
                                    <Text style={tw`text-gray-600`}>Research Backing</Text>
                                    <Text style={tw`text-gray-900 font-medium flex-1 text-right ml-4`}>
                                        {vaccine.researchBacking}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Suitable For</Text>
                            <View style={tw`flex-row flex-wrap`}>
                                {vaccine.commonFor.map((animal: string, index: number) => (
                                    <View key={index} style={tw`bg-blue-100 rounded-full px-3 py-2 mr-2 mb-2`}>
                                        <Text style={tw`text-blue-700 text-sm font-medium`}>{animal}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Storage Requirements</Text>
                            <View style={tw`bg-blue-50 rounded-xl p-4`}>
                                <View style={tw`flex-row items-start`}>
                                    <Ionicons name="snow-outline" size={20} color="#3B82F6" style={tw`mr-3 mt-1`} />
                                    <Text style={tw`text-blue-800 flex-1`}>{vaccine.storage}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            
            case 'usage':
                return (
                    <View>
                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Dosage & Administration</Text>
                            <View style={tw`bg-green-50 rounded-xl p-4 mb-4`}>
                                <View style={tw`flex-row items-center mb-2`}>
                                    <Ionicons name="medical" size={20} color="#059669" />
                                    <Text style={tw`text-green-800 font-bold ml-2`}>Recommended Dosage</Text>
                                </View>
                                <Text style={tw`text-green-700 text-lg font-medium`}>{vaccine.dosage}</Text>
                                <Text style={tw`text-green-600 text-sm mt-1`}>{vaccine.administration}</Text>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Vaccination Schedule</Text>
                            <View style={tw`bg-orange-50 rounded-xl p-4`}>
                                <Text style={tw`text-orange-800 font-medium`}>{vaccine.schedule}</Text>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Withdrawal Periods</Text>
                            <View style={tw`bg-purple-50 rounded-xl p-4`}>
                                <Text style={tw`text-purple-800 font-medium`}>{vaccine.withdrawalPeriod}</Text>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Side Effects</Text>
                            <View style={tw`bg-yellow-50 rounded-xl p-4`}>
                                <Text style={tw`text-yellow-800`}>{vaccine.sideEffects}</Text>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Contraindications</Text>
                            <View style={tw`bg-red-50 rounded-xl p-4`}>
                                <View style={tw`flex-row items-start`}>
                                    <Ionicons name="warning-outline" size={20} color="#DC2626" style={tw`mr-3 mt-1`} />
                                    <Text style={tw`text-red-800 flex-1`}>{vaccine.contraindications}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Efficacy</Text>
                            <View style={tw`bg-green-50 rounded-xl p-4`}>
                                <Text style={tw`text-green-800 font-medium`}>{vaccine.efficacyRate}</Text>
                            </View>
                        </View>
                    </View>
                );
                
            case 'ai-insights':
                return (
                    <View>
                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <View style={tw`flex-row items-center mb-4`}>
                                <Ionicons name="sparkles" size={24} color="#8B5CF6" />
                                <Text style={tw`text-gray-900 font-bold text-lg ml-2`}>AI Analysis</Text>
                                <View style={tw`bg-purple-100 px-2 py-1 rounded-full ml-auto`}>
                                    <Text style={tw`text-purple-700 text-xs font-bold`}>Score: {vaccine.aiScore}%</Text>
                                </View>
                            </View>
                            
                            <Text style={tw`text-gray-600 mb-6 leading-6`}>{vaccine.aiInsights.recommendation}</Text>

                            <View style={tw`space-y-4`}>
                                <View>
                                    <View style={tw`flex-row justify-between items-center mb-2`}>
                                        <Text style={tw`text-gray-700 font-medium`}>Effectiveness</Text>
                                        <Text style={tw`text-green-600 font-bold`}>{vaccine.aiInsights.effectiveness}%</Text>
                                    </View>
                                    <View style={tw`bg-gray-200 rounded-full h-2`}>
                                        <View 
                                            style={[tw`bg-green-500 h-2 rounded-full`, 
                                                   { width: `${vaccine.aiInsights.effectiveness}%` }]} 
                                        />
                                    </View>
                                </View>

                                <View>
                                    <View style={tw`flex-row justify-between items-center mb-2`}>
                                        <Text style={tw`text-gray-700 font-medium`}>Safety Profile</Text>
                                        <Text style={tw`text-blue-600 font-bold`}>{vaccine.aiInsights.safety}%</Text>
                                    </View>
                                    <View style={tw`bg-gray-200 rounded-full h-2`}>
                                        <View 
                                            style={[tw`bg-blue-500 h-2 rounded-full`, 
                                                   { width: `${vaccine.aiInsights.safety}%` }]} 
                                        />
                                    </View>
                                </View>

                                <View>
                                    <View style={tw`flex-row justify-between items-center mb-2`}>
                                        <Text style={tw`text-gray-700 font-medium`}>Cost Efficiency</Text>
                                        <Text style={tw`text-orange-600 font-bold`}>{vaccine.aiInsights.costEfficiency}%</Text>
                                    </View>
                                    <View style={tw`bg-gray-200 rounded-full h-2`}>
                                        <View 
                                            style={[tw`bg-orange-500 h-2 rounded-full`, 
                                                   { width: `${vaccine.aiInsights.costEfficiency}%` }]} 
                                        />
                                    </View>
                                </View>

                                <View>
                                    <View style={tw`flex-row justify-between items-center mb-2`}>
                                        <Text style={tw`text-gray-700 font-medium`}>Disease Prevalence in Rwanda</Text>
                                        <Text style={tw`text-red-600 font-bold`}>{vaccine.aiInsights.diseasePrevalence}</Text>
                                    </View>
                                    <View style={tw`bg-gray-200 rounded-full h-2`}>
                                        <View style={tw`bg-red-500 h-2 rounded-full w-full`} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-blue-50 rounded-2xl p-6`}>
                            <Text style={tw`text-blue-800 font-bold mb-2`}>AI Recommendation</Text>
                            <Text style={tw`text-blue-600 mb-4`}>Based on local disease patterns, animal population, and economic factors in Rwanda.</Text>
                            <TouchableOpacity style={tw`bg-blue-500 py-3 px-6 rounded-xl`}>
                                <Text style={tw`text-white font-bold text-center`}>View Regional Analysis</Text>
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
                    <View style={tw`w-20 h-20 bg-white bg-opacity-20 rounded-2xl items-center justify-center mb-4`}>
                        <Ionicons name="shield-checkmark" size={40} color="white" />
                    </View>
                    
                    <Text style={tw`text-white text-xl font-bold text-center mb-2`}>
                        {vaccine.name}
                    </Text>
                    <Text style={tw`text-blue-100 text-center mb-2`}>
                        {vaccine.category} • {vaccine.manufacturer}
                    </Text>
                    <Text style={tw`text-blue-100 text-center mb-4`}>
                        {vaccine.targetDisease}
                    </Text>
                    
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-white text-2xl font-bold mr-4`}>{vaccine.price}</Text>
                        <View style={tw`bg-green-500 bg-opacity-90 px-3 py-1 rounded-full`}>
                            <Text style={tw`text-white text-sm font-medium`}>{vaccine.availability}</Text>
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
                        style={tw`mr-6 pb-2 ${activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <View style={tw`flex-row items-center`}>
                            <Ionicons
                                name={tab.icon as any}
                                size={20}
                                color={activeTab === tab.id ? '#3B82F6' : '#6B7280'}
                                style={tw`mr-2`}
                            />
                            <Text
                                style={tw`font-medium ${
                                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'
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
                        onPress={handleFindVeterinarian}
                    >
                        <Ionicons name="person-outline" size={20} color="#6B7280" style={tw`mr-2`} />
                        <Text style={tw`text-gray-700 font-bold`}>Find Vet</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`flex-1 bg-blue-500 py-4 rounded-2xl flex-row items-center justify-center`}
                        onPress={handleScheduleVaccination}
                    >
                        <Ionicons name="calendar-outline" size={20} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white font-bold`}>Schedule Vaccine</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default VaccineDetailScreen;
