import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import tw from 'twrnc';

// Mock detailed medicine data (AI-generated for learning)
const getMedicineDetails = (id: string) => {
    const medicines: any = {
        '1': {
            id: '1',
            name: 'Amoxicillin Injectable',
            category: 'Antibiotics',
            description: 'AI-recommended broad-spectrum antibiotic for bacterial infections in livestock. Advanced formulation with enhanced bioavailability and reduced resistance development. Suitable for respiratory, urinary, and soft tissue infections.',
            dosage: '15mg/kg body weight',
            price: '₹2,500',
            availability: 'In Stock',
            prescriptionRequired: true,
            manufacturer: 'VetCare Pharmaceuticals',
            aiScore: 95,
            activeIngredient: 'Amoxicillin Trihydrate 150mg/ml',
            volume: '100ml vial',
            expiryDate: '2025-12-31',
            batchNumber: 'AMX240815',
            storageConditions: 'Store at 2-8°C, protect from light',
            contraindications: 'Not for use in animals allergic to penicillins',
            sideEffects: 'Rare: allergic reactions, diarrhea',
            withdrawalPeriod: 'Meat: 28 days, Milk: 96 hours',
            commonUses: ['Respiratory infections', 'Wound treatment', 'Post-surgery care', 'Mastitis', 'Pneumonia'],
            aiInsights: {
                effectiveness: 95,
                safety: 92,
                costEfficiency: 88,
                resistanceRisk: 15,
                recommendation: 'Highly recommended for first-line bacterial infection treatment'
            },
            relatedMedicines: ['Oxytetracycline', 'Penicillin G', 'Enrofloxacin'],
            reviews: [
                { user: 'Dr. Sarah M.', rating: 5, comment: 'Excellent results in respiratory infections' },
                { user: 'Farm Manager J.', rating: 4, comment: 'Fast-acting, good value for money' }
            ]
        }
    };

    return medicines[id] || medicines['1']; // Default fallback
};

const MedicineDetailScreen = () => {
    const params = useLocalSearchParams();
    const medicineId = params.id as string || '1';
    const medicine = getMedicineDetails(medicineId);
    
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

    const handleBuyNow = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            'Purchase Medicine',
            `Would you like to find nearby pharmacies selling ${medicine.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Find Pharmacies', 
                    onPress: () => router.push('/medicine/nearby-pharmacies')
                }
            ]
        );
    };

    const handleAddToPrescription = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Added to Prescription', `${medicine.name} has been added to your prescription list.`);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'information-circle-outline' },
        { id: 'usage', label: 'Usage', icon: 'medical-outline' },
        { id: 'ai-insights', label: 'AI Insights', icon: 'sparkles-outline' },
        { id: 'reviews', label: 'Reviews', icon: 'star-outline' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <View >
                        <View style={tw` bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Product Information</Text>
                            
                            <View style={tw`space-y-4`}>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Active Ingredient</Text>
                                    <Text style={tw`text-gray-900 font-medium flex-1 text-right ml-4`}>
                                        {medicine.activeIngredient}
                                    </Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Volume</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{medicine.volume}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Batch Number</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{medicine.batchNumber}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600`}>Expiry Date</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{medicine.expiryDate}</Text>
                                </View>
                                <View style={tw`flex-row justify-between py-2`}>
                                    <Text style={tw`text-gray-600`}>Manufacturer</Text>
                                    <Text style={tw`text-gray-900 font-medium`}>{medicine.manufacturer}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Storage & Handling</Text>
                            <View style={tw`bg-blue-50 rounded-xl p-4`}>
                                <View style={tw`flex-row items-start`}>
                                    <Ionicons name="snow-outline" size={20} color="#3B82F6" style={tw`mr-3 mt-1`} />
                                    <Text style={tw`text-blue-800 flex-1`}>{medicine.storageConditions}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Common Uses</Text>
                            <View style={tw`flex-row flex-wrap`}>
                                {medicine.commonUses.map((use: string, index: number) => (
                                    <View key={index} style={tw`bg-indigo-100 rounded-full px-3 py-2 mr-2 mb-2`}>
                                        <Text style={tw`text-indigo-700 text-sm font-medium`}>{use}</Text>
                                    </View>
                                ))}
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
                                <Text style={tw`text-green-700 text-lg font-medium`}>{medicine.dosage}</Text>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Withdrawal Periods</Text>
                            <View style={tw`bg-orange-50 rounded-xl p-4`}>
                                <Text style={tw`text-orange-800 font-medium`}>{medicine.withdrawalPeriod}</Text>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Contraindications</Text>
                            <View style={tw`bg-red-50 rounded-xl p-4`}>
                                <View style={tw`flex-row items-start`}>
                                    <Ionicons name="warning-outline" size={20} color="#DC2626" style={tw`mr-3 mt-1`} />
                                    <Text style={tw`text-red-800 flex-1`}>{medicine.contraindications}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Side Effects</Text>
                            <View style={tw`bg-yellow-50 rounded-xl p-4`}>
                                <Text style={tw`text-yellow-800`}>{medicine.sideEffects}</Text>
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
                                    <Text style={tw`text-purple-700 text-xs font-bold`}>Score: {medicine.aiScore}%</Text>
                                </View>
                            </View>
                            
                            <Text style={tw`text-gray-600 mb-6 leading-6`}>{medicine.aiInsights.recommendation}</Text>

                            <View style={tw`space-y-4`}>
                                <View>
                                    <View style={tw`flex-row justify-between items-center mb-2`}>
                                        <Text style={tw`text-gray-700 font-medium`}>Effectiveness</Text>
                                        <Text style={tw`text-green-600 font-bold`}>{medicine.aiInsights.effectiveness}%</Text>
                                    </View>
                                    <View style={tw`bg-gray-200 rounded-full h-2`}>
                                        <View 
                                            style={[tw`bg-green-500 h-2 rounded-full`, 
                                                   { width: `${medicine.aiInsights.effectiveness}%` }]} 
                                        />
                                    </View>
                                </View>

                                <View>
                                    <View style={tw`flex-row justify-between items-center mb-2`}>
                                        <Text style={tw`text-gray-700 font-medium`}>Safety Profile</Text>
                                        <Text style={tw`text-blue-600 font-bold`}>{medicine.aiInsights.safety}%</Text>
                                    </View>
                                    <View style={tw`bg-gray-200 rounded-full h-2`}>
                                        <View 
                                            style={[tw`bg-blue-500 h-2 rounded-full`, 
                                                   { width: `${medicine.aiInsights.safety}%` }]} 
                                        />
                                    </View>
                                </View>

                                <View>
                                    <View style={tw`flex-row justify-between items-center mb-2`}>
                                        <Text style={tw`text-gray-700 font-medium`}>Cost Efficiency</Text>
                                        <Text style={tw`text-orange-600 font-bold`}>{medicine.aiInsights.costEfficiency}%</Text>
                                    </View>
                                    <View style={tw`bg-gray-200 rounded-full h-2`}>
                                        <View 
                                            style={[tw`bg-orange-500 h-2 rounded-full`, 
                                                   { width: `${medicine.aiInsights.costEfficiency}%` }]} 
                                        />
                                    </View>
                                </View>

                                <View>
                                    <View style={tw`flex-row justify-between items-center mb-2`}>
                                        <Text style={tw`text-gray-700 font-medium`}>Resistance Risk</Text>
                                        <Text style={tw`text-red-600 font-bold`}>{medicine.aiInsights.resistanceRisk}%</Text>
                                    </View>
                                    <View style={tw`bg-gray-200 rounded-full h-2`}>
                                        <View 
                                            style={[tw`bg-red-500 h-2 rounded-full`, 
                                                   { width: `${medicine.aiInsights.resistanceRisk}%` }]} 
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={tw`bg-white rounded-2xl p-6 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Related Medicines</Text>
                            {medicine.relatedMedicines.map((related: string, index: number) => (
                                <TouchableOpacity key={index} style={tw`flex-row items-center py-3 border-b border-gray-100`}>
                                    <Ionicons name="medical-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                                    <Text style={tw`text-gray-700 flex-1`}>{related}</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );
                
            case 'reviews':
                return (
                    <View>
                        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
                            <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>User Reviews</Text>
                            
                            {medicine.reviews.map((review: any, index: number) => (
                                <View key={index} style={tw`py-4 ${index < medicine.reviews.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <View style={tw`flex-row items-center mb-2`}>
                                        <Text style={tw`text-gray-900 font-medium flex-1`}>{review.user}</Text>
                                        <View style={tw`flex-row`}>
                                            {[...Array(5)].map((_, i) => (
                                                <Ionicons
                                                    key={i}
                                                    name={i < review.rating ? 'star' : 'star-outline'}
                                                    size={16}
                                                    color={i < review.rating ? '#F59E0B' : '#D1D5DB'}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={tw`text-gray-600 leading-5`}>{review.comment}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={tw`bg-indigo-50 rounded-2xl p-6`}>
                            <Text style={tw`text-indigo-800 font-bold mb-2`}>Share Your Experience</Text>
                            <Text style={tw`text-indigo-600 mb-4`}>Help other farmers by sharing your experience with this medicine.</Text>
                            <TouchableOpacity style={tw`bg-indigo-500 py-3 px-6 rounded-xl`}>
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
                colors={['#4F46E5', '#7C3AED']}
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
                    <View style={tw`w-24 h-24 bg-white bg-opacity-20 rounded-2xl items-center justify-center mb-4`}>
                        <Ionicons name="medical" size={48} color="white" />
                    </View>
                    
                    <Text style={tw`text-white text-xl font-bold text-center mb-2`}>
                        {medicine.name}
                    </Text>
                    <Text style={tw`text-purple-100 text-center mb-4`}>
                        {medicine.category} • {medicine.manufacturer}
                    </Text>
                    
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-white text-2xl font-bold mr-4`}>{medicine.price}</Text>
                        <View style={tw`bg-green-500 bg-opacity-90 px-3 py-1 rounded-full`}>
                            <Text style={tw`text-white text-sm font-medium`}>{medicine.availability}</Text>
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
                        style={tw` mr-6 pb-2 ${activeTab === tab.id ? 'border-b-2 border-indigo-500' : ''} `}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <View style={tw`flex-row items-center `}>
                            <Ionicons
                                name={tab.icon as any}
                                size={20}
                                color={activeTab === tab.id ? '#4F46E5' : '#6B7280'}
                                style={tw`mr-2`}
                            />
                            <Text
                                style={tw`font-medium ${
                                    activeTab === tab.id ? 'text-indigo-600' : 'text-gray-600'
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
                <Animated.View
                    style={[
                        { opacity: fadeAnim },
                    ]}
                >
                    {renderTabContent()}
                </Animated.View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={tw`bg-white border-t border-gray-200 p-4 pb-8`}>
                <View style={tw`flex-row space-x-3`}>
                    <TouchableOpacity
                        style={tw`flex-1 bg-gray-100 py-4 rounded-2xl flex-row items-center justify-center`}
                        onPress={handleAddToPrescription}
                    >
                        <Ionicons name="add-circle-outline" size={20} color="#6B7280" style={tw`mr-2`} />
                        <Text style={tw`text-gray-700 font-bold`}>Add to Prescription</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`flex-1 bg-indigo-500 py-4 rounded-2xl flex-row items-center justify-center`}
                        onPress={handleBuyNow}
                    >
                        <Ionicons name="storefront-outline" size={20} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white font-bold`}>Find Pharmacies</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default MedicineDetailScreen;
