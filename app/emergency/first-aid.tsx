import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';
import { i18n } from '../../services/i18n/i18n';
import { useOfflineSupport } from '../../hooks/useOfflineSupport';
import { offlineEmergencyData } from '../../services/storage/offlineData';

// Mock first aid guide data
const firstAidGuides = [
    {
        id: '1',
        title: 'Basic Wound Care',
        category: 'Wounds & Injuries',
        description: 'How to clean and treat minor wounds on livestock',
        steps: [
            'Stop any bleeding by applying direct pressure with a clean cloth',
            'Clean the wound with mild soap and water',
            'Apply antiseptic solution (iodine or hydrogen peroxide)',
            'Cover with sterile bandage or gauze',
            'Monitor for signs of infection',
            'Seek veterinary attention for deep wounds'
        ],
        materials: ['Clean water', 'Mild soap', 'Antiseptic', 'Sterile gauze', 'Bandage'],
        emergencySigns: ['Heavy bleeding', 'Deep puncture', 'Signs of shock', 'Infection symptoms']
    },
    {
        id: '2',
        title: 'Heat Stroke Treatment',
        category: 'Environmental',
        description: 'Emergency treatment for animals suffering from heat stroke',
        steps: [
            'Move animal to shaded, cool area immediately',
            'Spray with cool (not cold) water',
            'Offer small amounts of cool water to drink',
            'Monitor rectal temperature if possible',
            'Call veterinarian immediately',
            'Do not give ice water or ice packs directly on skin'
        ],
        materials: ['Water spray bottle', 'Cool water', 'Shade structure'],
        emergencySigns: ['Heavy panting', 'Excessive drooling', 'Unsteady gait', 'Collapse']
    },
    {
        id: '3',
        title: 'Choking Relief',
        category: 'Respiratory',
        description: 'How to help an animal that is choking',
        steps: [
            'Stay calm and assess the situation',
            'Do not reach into mouth blindly',
            'For small animals: perform Heimlich maneuver',
            'For large animals: call veterinarian immediately',
            'Monitor breathing and consciousness',
            'Clear airway if foreign object is visible and accessible'
        ],
        materials: ['Clean hands', 'Flashlight (optional)'],
        emergencySigns: ['Difficulty breathing', 'Coughing', 'Pawing at mouth', 'Blue gums']
    },
    {
        id: '4',
        title: 'Poisoning Response',
        category: 'Toxicology',
        description: 'Immediate response to suspected poisoning',
        steps: [
            'Remove animal from source of poison immediately',
            'Do not induce vomiting unless directed by vet',
            'Collect sample of suspected poison',
            'Contact veterinarian or poison control immediately',
            'Bring animal to clinic with poison sample',
            'Monitor vital signs continuously'
        ],
        materials: ['Container for poison sample', 'Clean cloth', 'Water'],
        emergencySigns: ['Vomiting', 'Diarrhea', 'Seizures', 'Excessive salivation', 'Difficulty breathing']
    },
    {
        id: '5',
        title: 'Bloat Treatment',
        category: 'Digestive',
        description: 'Emergency treatment for bloat in ruminants',
        steps: [
            'Walk the animal slowly to encourage belching',
            'Do not allow eating or drinking',
            'Insert stomach tube if trained (veterinarian only)',
            'Massage abdomen gently',
            'Contact veterinarian immediately',
            'Monitor for worsening symptoms'
        ],
        materials: ['Stomach tube (if available)', 'Clean water'],
        emergencySigns: ['Distended abdomen', 'Difficulty breathing', 'Pawing at ground', 'Unproductive belching']
    }
];

const FirstAidScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { isOnline, getDataWithOfflineSupport } = useOfflineSupport();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredGuides, setFilteredGuides] = useState(firstAidGuides);

    const categories = [
        { name: 'All', count: firstAidGuides.length },
        { name: 'Wounds & Injuries', count: firstAidGuides.filter(g => g.category === 'Wounds & Injuries').length },
        { name: 'Environmental', count: firstAidGuides.filter(g => g.category === 'Environmental').length },
        { name: 'Respiratory', count: firstAidGuides.filter(g => g.category === 'Respiratory').length },
        { name: 'Toxicology', count: firstAidGuides.filter(g => g.category === 'Toxicology').length },
        { name: 'Digestive', count: firstAidGuides.filter(g => g.category === 'Digestive').length }
    ];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
        
        let filtered = firstAidGuides;
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(guide => guide.category === selectedCategory);
        }
        setFilteredGuides(filtered);
    }, [selectedCategory]);

    const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

    const toggleGuide = (guideId: string) => {
        setExpandedGuide(expandedGuide === guideId ? null : guideId);
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#059669', '#047857']}
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
                        First Aid Guide
                    </Text>
                    <Text style={tw`text-green-100 text-sm`}>
                        Essential animal first aid knowledge
                    </Text>
                </Animated.View>
            </LinearGradient>

            {/* Category Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`bg-white border-b border-gray-200`}
                contentContainerStyle={tw`px-4 py-3`}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.name}
                        style={tw`mr-3 px-4 py-2 rounded-xl ${
                            selectedCategory === category.name
                                ? 'bg-green-500'
                                : 'bg-gray-100 border border-gray-200'
                        }`}
                        onPress={() => setSelectedCategory(category.name)}
                    >
                        <Text
                            style={tw`font-medium ${
                                selectedCategory === category.name ? 'text-white' : 'text-gray-700'
                            }`}
                        >
                            {category.name} ({category.count})
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Important Notice */}
                    <View style={tw`bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="warning" size={20} color="#D97706" style={tw`mr-3`} />
                            <Text style={tw`text-yellow-800 font-bold`}>Important Disclaimer</Text>
                        </View>
                        <Text style={tw`text-yellow-700 leading-6`}>
                            These first aid guides are for informational purposes only. Always consult a qualified veterinarian for proper diagnosis and treatment. First aid is not a substitute for professional veterinary care.
                        </Text>
                    </View>

                    {/* First Aid Guides */}
                    {filteredGuides.map((guide, index) => (
                        <Animated.View
                            key={guide.id}
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
                                onPress={() => toggleGuide(guide.id)}
                                activeOpacity={0.7}
                            >
                                <View style={tw`flex-row items-start justify-between mb-3`}>
                                    <View style={tw`flex-1 mr-4`}>
                                        <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>
                                            {guide.title}
                                        </Text>
                                        <Text style={tw`text-gray-600 text-sm mb-2`}>
                                            {guide.category}
                                        </Text>
                                        <Text style={tw`text-gray-600 text-sm leading-5`}>
                                            {guide.description}
                                        </Text>
                                    </View>
                                    
                                    <TouchableOpacity
                                        style={tw`bg-green-100 p-2 rounded-xl`}
                                        onPress={() => toggleGuide(guide.id)}
                                    >
                                        <Ionicons 
                                            name={expandedGuide === guide.id ? "chevron-up" : "chevron-down"} 
                                            size={20} 
                                            color="#059669" 
                                        />
                                    </TouchableOpacity>
                                </View>

                                {expandedGuide === guide.id && (
                                    <Animated.View
                                        style={[
                                            tw`border-t border-gray-100 pt-4`,
                                            { opacity: fadeAnim }
                                        ]}
                                    >
                                        {/* Steps */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-3`}>Steps to Follow:</Text>
                                            {guide.steps.map((step, idx) => (
                                                <View key={idx} style={tw`flex-row items-start mb-2`}>
                                                    <Text style={tw`text-green-600 font-bold mr-3`}>{idx + 1}.</Text>
                                                    <Text style={tw`text-gray-700 flex-1 leading-5`}>{step}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* Materials Needed */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-3`}>Materials Needed:</Text>
                                            <View style={tw`flex-row flex-wrap`}>
                                                {guide.materials.map((material, idx) => (
                                                    <View key={idx} style={tw`bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2`}>
                                                        <Text style={tw`text-blue-700 text-sm`}>{material}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Emergency Signs */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-3`}>When to Seek Emergency Help:</Text>
                                            <View style={tw`bg-red-50 rounded-xl p-3`}>
                                                {guide.emergencySigns.map((sign, idx) => (
                                                    <View key={idx} style={tw`flex-row items-center mb-1`}>
                                                        <Ionicons name="ellipse" size={6} color="#DC2626" style={tw`mr-2`} />
                                                        <Text style={tw`text-red-700 text-sm`}>{sign}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Action Buttons */}
                                        <View style={tw`flex-row space-x-3`}>
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-red-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => router.push('/emergency/contacts')}
                                            >
                                                <Ionicons name="call" size={18} color="#DC2626" style={tw`mr-2`} />
                                                <Text style={tw`text-red-600 font-bold`}>Emergency Call</Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-green-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => router.push('/veterinary/nearby')}
                                            >
                                                <Ionicons name="person" size={18} color="#059669" style={tw`mr-2`} />
                                                <Text style={tw`text-green-600 font-bold`}>Find Vet</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Animated.View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    ))}

                    {/* Additional Resources */}
                    <View style={tw`bg-blue-50 rounded-2xl p-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="book-outline" size={20} color="#2563EB" />
                            <Text style={tw`text-blue-800 font-bold ml-2`}>Learn More</Text>
                        </View>
                        <Text style={tw`text-blue-700 mb-4`}>
                            Expand your first aid knowledge with these resources:
                        </Text>
                        <View style={tw`space-y-3`}>
                            <TouchableOpacity 
                                style={tw`flex-row items-center py-3 border-b border-blue-200`}
                                onPress={() => router.push('/resources/guidelines')}
                            >
                                <Ionicons name="document-text-outline" size={20} color="#2563EB" style={tw`mr-3`} />
                                <Text style={tw`text-blue-700 flex-1`}>Complete First Aid Manual</Text>
                                <Ionicons name="chevron-forward" size={20} color="#2563EB" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={tw`flex-row items-center py-3`}
                                onPress={() => router.push('/resources/disease-info')}
                            >
                                <Ionicons name="medical-outline" size={20} color="#2563EB" style={tw`mr-3`} />
                                <Text style={tw`text-blue-700 flex-1`}>Disease Prevention Guide</Text>
                                <Ionicons name="chevron-forward" size={20} color="#2563EB" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default FirstAidScreen;
