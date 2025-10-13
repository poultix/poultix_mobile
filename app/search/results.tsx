import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// Mock search results data
const mockSearchResults = {
    'Amoxicillin': {
        medicines: [
            {
                id: '1',
                name: 'Amoxicillin Injectable',
                type: 'medicine',
                category: 'Antibiotics',
                description: 'Broad-spectrum antibiotic for bacterial infections',
                price: '₹2,500',
                route: '/medicine/detail?id=1'
            }
        ],
        vets: [],
        pharmacies: [],
        articles: [
            {
                id: '1',
                title: 'Amoxicillin Usage Guide for Livestock',
                type: 'article',
                excerpt: 'Complete guide on proper administration and dosage',
                route: '/resources/guidelines'
            }
        ]
    },
    'Foot and Mouth Disease': {
        medicines: [
            {
                id: '1',
                name: 'Foot and Mouth Disease Vaccine',
                type: 'vaccine',
                category: 'Viral Diseases',
                description: 'Essential vaccine for FMD prevention',
                price: '₹450',
                route: '/vaccination/detail?id=1'
            }
        ],
        vets: [
            {
                id: '1',
                name: 'Dr. John Uwimana',
                type: 'veterinarian',
                specialization: 'Large Animal Medicine',
                clinic: 'Kigali Veterinary Clinic',
                route: '/veterinary/detail?id=1'
            }
        ],
        articles: [
            {
                id: '1',
                title: 'Foot and Mouth Disease: Prevention and Control',
                type: 'article',
                excerpt: 'Comprehensive guide on FMD management in Rwanda',
                route: '/resources/disease-info'
            },
            {
                id: '2',
                title: 'FMD Vaccination Protocols',
                type: 'article',
                excerpt: 'Official vaccination guidelines for livestock',
                route: '/resources/guidelines'
            }
        ]
    }
};

const SearchResultsScreen = () => {
    const params = useLocalSearchParams();
    const query = params.query as string || '';
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<any>({});
    const [activeTab, setActiveTab] = useState('all');
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
        
        // Simulate search API call
        setTimeout(() => {
            const searchResults = mockSearchResults[query as keyof typeof mockSearchResults] || {
                medicines: [],
                vets: [],
                pharmacies: [],
                articles: []
            };
            setResults(searchResults);
            setLoading(false);
        }, 1000);
    }, [query]);

    const tabs = [
        { id: 'all', label: 'All Results', count: (results.medicines?.length || 0) + (results.vets?.length || 0) + (results.pharmacies?.length || 0) + (results.articles?.length || 0) },
        { id: 'medicines', label: 'Medicines', count: results.medicines?.length || 0 },
        { id: 'vets', label: 'Veterinarians', count: results.vets?.length || 0 },
        { id: 'pharmacies', label: 'Pharmacies', count: results.pharmacies?.length || 0 },
        { id: 'articles', label: 'Articles', count: results.articles?.length || 0 }
    ];

    const getFilteredResults = () => {
        switch (activeTab) {
            case 'medicines': return results.medicines || [];
            case 'vets': return results.vets || [];
            case 'pharmacies': return results.pharmacies || [];
            case 'articles': return results.articles || [];
            default: return [
                ...(results.medicines || []),
                ...(results.vets || []),
                ...(results.pharmacies || []),
                ...(results.articles || [])
            ];
        }
    };

    const handleResultPress = (result: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(result.route);
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'medicine': return 'medical-outline';
            case 'veterinarian': return 'person-outline';
            case 'pharmacy': return 'storefront-outline';
            case 'article': return 'document-text-outline';
            case 'vaccine': return 'shield-checkmark-outline';
            default: return 'search-outline';
        }
    };

    const getResultColor = (type: string) => {
        switch (type) {
            case 'medicine': return 'text-blue-600 bg-blue-50';
            case 'veterinarian': return 'text-green-600 bg-green-50';
            case 'pharmacy': return 'text-orange-600 bg-orange-50';
            case 'article': return 'text-purple-600 bg-purple-50';
            case 'vaccine': return 'text-indigo-600 bg-indigo-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const filteredResults = getFilteredResults();

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
                    <Text style={tw`text-white text-xl font-bold mb-2`}>
                        Search Results
                    </Text>
                    <Text style={tw`text-purple-100 text-sm`}>
                        "{query}"
                    </Text>
                </Animated.View>
            </LinearGradient>

            {/* Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`bg-white border-b border-gray-200`}
                contentContainerStyle={tw`px-4 py-3`}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={tw`mr-6 pb-2 ${activeTab === tab.id ? 'border-b-2 border-indigo-500' : ''}`}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <View style={tw`flex-row items-center`}>
                            <Text
                                style={tw`font-medium ${
                                    activeTab === tab.id ? 'text-indigo-600' : 'text-gray-600'
                                }`}
                            >
                                {tab.label}
                            </Text>
                            <View style={tw`ml-2 bg-gray-200 rounded-full px-2 py-1`}>
                                <Text style={tw`text-gray-700 text-xs font-bold`}>{tab.count}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Results */}
            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {loading ? (
                        <View style={tw`items-center py-20`}>
                            <ActivityIndicator size="large" color="#6366F1" />
                            <Text style={tw`text-gray-600 mt-4`}>Searching...</Text>
                        </View>
                    ) : filteredResults.length === 0 ? (
                        <View style={tw`items-center py-20`}>
                            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                            <Text style={tw`text-gray-500 text-lg mt-4 mb-2`}>No results found</Text>
                            <Text style={tw`text-gray-400 text-center px-8 mb-6`}>
                                Try different keywords or check your spelling
                            </Text>
                            
                            <View style={tw`bg-indigo-50 rounded-2xl p-6 w-full`}>
                                <Text style={tw`text-indigo-800 font-bold mb-3`}>Search Suggestions:</Text>
                                <View style={tw`space-y-2`}>
                                    <Text style={tw`text-indigo-700`}>• Check spelling and try synonyms</Text>
                                    <Text style={tw`text-indigo-700`}>• Use more specific terms</Text>
                                    <Text style={tw`text-indigo-700`}>• Search for medicine names, disease names, or vet names</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={tw`text-gray-600 mb-4`}>
                                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
                            </Text>
                            
                            {filteredResults.map((result: any, index: number) => (
                                <Animated.View
                                    key={result.id}
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
                                        onPress={() => handleResultPress(result)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={tw`flex-row items-start`}>
                                            <View style={tw`w-12 h-12 rounded-xl items-center justify-center mr-4 ${getResultColor(result.type)}`}>
                                                <Ionicons 
                                                    name={getResultIcon(result.type) as any} 
                                                    size={24} 
                                                    color={
                                                        result.type === 'medicine' ? '#2563EB' :
                                                        result.type === 'veterinarian' ? '#059669' :
                                                        result.type === 'pharmacy' ? '#D97706' :
                                                        result.type === 'article' ? '#7C3AED' :
                                                        result.type === 'vaccine' ? '#4F46E5' : '#6B7280'
                                                    } 
                                                />
                                            </View>
                                            
                                            <View style={tw`flex-1`}>
                                                <View style={tw`flex-row items-center justify-between mb-2`}>
                                                    <Text style={tw`text-gray-900 font-bold text-lg flex-1 mr-2`}>
                                                        {result.name || result.title}
                                                    </Text>
                                                    <View style={tw`px-2 py-1 rounded-full ${getResultColor(result.type)}`}>
                                                        <Text style={tw`text-xs font-bold capitalize`}>
                                                            {result.type}
                                                        </Text>
                                                    </View>
                                                </View>
                                                
                                                {result.category && (
                                                    <Text style={tw`text-gray-600 text-sm mb-1`}>
                                                        Category: {result.category}
                                                    </Text>
                                                )}
                                                
                                                {result.specialization && (
                                                    <Text style={tw`text-gray-600 text-sm mb-1`}>
                                                        {result.specialization}
                                                    </Text>
                                                )}
                                                
                                                {result.clinic && (
                                                    <Text style={tw`text-gray-600 text-sm mb-1`}>
                                                        {result.clinic}
                                                    </Text>
                                                )}
                                                
                                                {result.description && (
                                                    <Text style={tw`text-gray-600 text-sm mb-3 leading-5`}>
                                                        {result.description}
                                                    </Text>
                                                )}
                                                
                                                {result.excerpt && (
                                                    <Text style={tw`text-gray-600 text-sm mb-3 leading-5`}>
                                                        {result.excerpt}
                                                    </Text>
                                                )}
                                                
                                                <View style={tw`flex-row items-center justify-between`}>
                                                    {result.price && (
                                                        <Text style={tw`text-green-600 font-bold text-lg`}>
                                                            {result.price}
                                                        </Text>
                                                    )}
                                                    
                                                    <TouchableOpacity
                                                        style={tw`bg-indigo-500 px-4 py-2 rounded-xl flex-row items-center`}
                                                        onPress={() => handleResultPress(result)}
                                                    >
                                                        <Text style={tw`text-white font-medium text-sm mr-1`}>
                                                            View
                                                        </Text>
                                                        <Ionicons name="chevron-forward" size={16} color="white" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default SearchResultsScreen;
