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

// Mock guidelines data
const guidelines = [
    {
        id: '1',
        title: 'Antibiotic Use Guidelines for Livestock',
        category: 'Medication',
        description: 'Official guidelines for responsible antibiotic use in animal health',
        lastUpdated: '2024-01-15',
        authority: 'Rwanda FDA',
        downloadUrl: 'https://example.com/antibiotic-guidelines.pdf',
        keyPoints: [
            'Use antibiotics only when necessary',
            'Follow veterinary prescriptions',
            'Complete full treatment course',
            'Maintain treatment records',
            'Observe withdrawal periods'
        ]
    },
    {
        id: '2',
        title: 'Vaccination Protocols 2024',
        category: 'Vaccination',
        description: 'National vaccination schedules and protocols for livestock',
        lastUpdated: '2024-02-01',
        authority: 'Rwanda Agriculture Board',
        downloadUrl: 'https://example.com/vaccination-protocols.pdf',
        keyPoints: [
            'Annual FMD vaccination campaigns',
            'Seasonal Newcastle disease vaccination',
            'Black quarter vaccination for cattle',
            'PPR vaccination programs',
            'Record keeping requirements'
        ]
    },
    {
        id: '3',
        title: 'Biosecurity Standards for Farms',
        category: 'Farm Management',
        description: 'Comprehensive biosecurity measures for livestock farms',
        lastUpdated: '2024-01-30',
        authority: 'Ministry of Agriculture',
        downloadUrl: 'https://example.com/biosecurity-standards.pdf',
        keyPoints: [
            'Perimeter fencing requirements',
            'Visitor access controls',
            'Vehicle disinfection protocols',
            'Animal movement restrictions',
            'Waste management procedures'
        ]
    },
    {
        id: '4',
        title: 'Disease Reporting Procedures',
        category: 'Regulatory',
        description: 'Mandatory reporting requirements for animal diseases',
        lastUpdated: '2024-03-01',
        authority: 'Rwanda Veterinary Authority',
        downloadUrl: 'https://example.com/disease-reporting.pdf',
        keyPoints: [
            'Report suspected diseases within 24 hours',
            'Contact nearest veterinary office',
            'Isolate affected animals immediately',
            'Provide detailed clinical information',
            'Cooperate with investigation teams'
        ]
    },
    {
        id: '5',
        title: 'Animal Welfare Standards',
        category: 'Welfare',
        description: 'Guidelines for maintaining animal welfare in farming',
        lastUpdated: '2024-02-15',
        authority: 'Animal Welfare Board',
        downloadUrl: 'https://example.com/animal-welfare.pdf',
        keyPoints: [
            'Provide adequate space and shelter',
            'Ensure access to clean water',
            'Regular health monitoring',
            'Proper handling techniques',
            'Humane euthanasia procedures'
        ]
    }
];

const GuidelinesScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredGuidelines, setFilteredGuidelines] = useState(guidelines);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const categories = [
        { name: 'All', count: guidelines.length },
        { name: 'Medication', count: guidelines.filter(g => g.category === 'Medication').length },
        { name: 'Vaccination', count: guidelines.filter(g => g.category === 'Vaccination').length },
        { name: 'Farm Management', count: guidelines.filter(g => g.category === 'Farm Management').length },
        { name: 'Regulatory', count: guidelines.filter(g => g.category === 'Regulatory').length },
        { name: 'Welfare', count: guidelines.filter(g => g.category === 'Welfare').length }
    ];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
        
        let filtered = guidelines;
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(guideline => guideline.category === selectedCategory);
        }
        setFilteredGuidelines(filtered);
    }, [selectedCategory]);

    const [expandedGuideline, setExpandedGuideline] = useState<string | null>(null);

    const toggleGuideline = (guidelineId: string) => {
        setExpandedGuideline(expandedGuideline === guidelineId ? null : guidelineId);
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#2563EB', '#1D4ED8']}
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
                        Official Guidelines
                    </Text>
                    <Text style={tw`text-blue-100 text-sm`}>
                        Government-approved veterinary protocols
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
                                ? 'bg-blue-500'
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
                    {/* Guidelines List */}
                    {filteredGuidelines.map((guideline, index) => (
                        <Animated.View
                            key={guideline.id}
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
                                onPress={() => toggleGuideline(guideline.id)}
                                activeOpacity={0.7}
                            >
                                <View style={tw`flex-row items-start justify-between mb-3`}>
                                    <View style={tw`flex-1 mr-4`}>
                                        <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>
                                            {guideline.title}
                                        </Text>
                                        <View style={tw`flex-row items-center mb-2`}>
                                            <View style={tw`bg-blue-100 px-2 py-1 rounded-full mr-2`}>
                                                <Text style={tw`text-blue-700 text-xs font-medium`}>
                                                    {guideline.category}
                                                </Text>
                                            </View>
                                            <Text style={tw`text-gray-500 text-sm`}>
                                                Updated: {guideline.lastUpdated}
                                            </Text>
                                        </View>
                                        <Text style={tw`text-gray-600 text-sm leading-5 mb-2`}>
                                            {guideline.description}
                                        </Text>
                                        <Text style={tw`text-gray-500 text-sm`}>
                                            Issued by: {guideline.authority}
                                        </Text>
                                    </View>
                                    
                                    <TouchableOpacity
                                        style={tw`bg-blue-100 p-2 rounded-xl`}
                                        onPress={() => toggleGuideline(guideline.id)}
                                    >
                                        <Ionicons 
                                            name={expandedGuideline === guideline.id ? "chevron-up" : "chevron-down"} 
                                            size={20} 
                                            color="#2563EB" 
                                        />
                                    </TouchableOpacity>
                                </View>

                                {expandedGuideline === guideline.id && (
                                    <Animated.View
                                        style={[
                                            tw`border-t border-gray-100 pt-4`,
                                            { opacity: fadeAnim }
                                        ]}
                                    >
                                        {/* Key Points */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-3`}>Key Guidelines:</Text>
                                            {guideline.keyPoints.map((point, idx) => (
                                                <View key={idx} style={tw`flex-row items-start mb-2`}>
                                                    <Ionicons name="checkmark-circle" size={16} color="#10B981" style={tw`mr-3 mt-1`} />
                                                    <Text style={tw`text-gray-700 flex-1 leading-5`}>{point}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* Action Buttons */}
                                        <View style={tw`flex-row space-x-3`}>
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                            >
                                                <Ionicons name="download-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                                <Text style={tw`text-gray-700 font-bold`}>Download PDF</Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center`}
                                            >
                                                <Ionicons name="eye-outline" size={18} color="white" style={tw`mr-2`} />
                                                <Text style={tw`text-white font-bold`}>View Online</Text>
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
                            <Ionicons name="information-circle" size={20} color="#2563EB" />
                            <Text style={tw`text-blue-800 font-bold ml-2`}>Need Help?</Text>
                        </View>
                        <Text style={tw`text-blue-700 mb-4`}>
                            Can't find what you're looking for? Contact your local veterinary office for specific guidance.
                        </Text>
                        <TouchableOpacity 
                            style={tw`bg-blue-500 py-3 px-6 rounded-xl flex-row items-center justify-center`}
                            onPress={() => router.push('/veterinary')}
                        >
                            <Ionicons name="call" size={18} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white font-bold`}>Contact Local Vet Office</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default GuidelinesScreen;
