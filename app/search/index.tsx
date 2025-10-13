import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState([
        'Amoxicillin',
        'Foot and Mouth Disease',
        'Dr. John Uwimana',
        'VetCare Pharmacy',
        'Vaccination schedule'
    ]);
    const [popularSearches, setPopularSearches] = useState([
        'Emergency vet near me',
        'Foot and Mouth Disease symptoms',
        'Best antibiotics for cattle',
        'Veterinary clinics in Kigali',
        'Poultry vaccination guide'
    ]);
    const [quickActions] = useState([
        { id: 'medicines', label: 'Find Medicines', icon: 'medical-outline', route: '/medicine', color: 'bg-blue-500' },
        { id: 'veterinarians', label: 'Find Vets', icon: 'person-outline', route: '/veterinary', color: 'bg-green-500' },
        { id: 'vaccines', label: 'Vaccines', icon: 'shield-checkmark-outline', route: '/vaccination', color: 'bg-purple-500' },
        { id: 'pharmacies', label: 'Pharmacies', icon: 'storefront-outline', route: '/medicine/nearby-pharmacies', color: 'bg-orange-500' },
        { id: 'emergency', label: 'Emergency', icon: 'warning-outline', route: '/emergency', color: 'bg-red-500' },
        { id: 'resources', label: 'Resources', icon: 'book-outline', route: '/resources', color: 'bg-indigo-500' }
    ]);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(searchAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/search/results?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleQuickSearch = (query: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSearchQuery(query);
        setTimeout(() => {
            router.push(`/search/results?query=${encodeURIComponent(query)}`);
        }, 300);
    };

    const clearSearchHistory = () => {
        setSearchHistory([]);
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
                        Search Everything
                    </Text>
                    <Text style={tw`text-purple-100 text-sm`}>
                        Find medicines, vets, pharmacies, and resources
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Search Bar */}
                    <View style={tw`px-4 py-6`}>
                        <Animated.View
                            style={[
                                tw`flex-row items-center bg-white rounded-2xl p-4 border border-gray-200 shadow-sm`,
                                {
                                    transform: [{
                                        translateY: searchAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    }],
                                },
                            ]}
                        >
                            <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                            <TextInput
                                style={tw`flex-1 text-gray-800 text-base`}
                                placeholder="Search for medicines, vets, diseases..."
                                placeholderTextColor="#6B7280"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                autoCapitalize="none"
                                returnKeyType="search"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            )}
                        </Animated.View>

                        <TouchableOpacity
                            style={tw`bg-indigo-500 py-3 rounded-xl mt-4`}
                            onPress={handleSearch}
                        >
                            <Text style={tw`text-white font-bold text-center`}>Search</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Actions */}
                    <View style={tw`px-4 mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Quick Actions</Text>
                        <View style={tw`flex-row flex-wrap`}>
                            {quickActions.map((action) => (
                                <TouchableOpacity
                                    key={action.id}
                                    style={tw`w-1/2 p-2`}
                                    onPress={() => router.push(action.route)}
                                >
                                    <View style={tw`${action.color} rounded-2xl p-4 items-center shadow-sm`}>
                                        <Ionicons name={action.icon as any} size={28} color="white" style={tw`mb-2`} />
                                        <Text style={tw`text-white font-bold text-center text-sm`}>
                                            {action.label}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Recent Searches */}
                    {searchHistory.length > 0 && (
                        <View style={tw`px-4 mb-6`}>
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <Text style={tw`text-gray-900 font-bold text-lg`}>Recent Searches</Text>
                                <TouchableOpacity onPress={clearSearchHistory}>
                                    <Text style={tw`text-indigo-600 font-medium`}>Clear All</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {searchHistory.map((search, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={tw`flex-row items-center py-3 border-b border-gray-100`}
                                    onPress={() => handleQuickSearch(search)}
                                >
                                    <Ionicons name="time-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                                    <Text style={tw`text-gray-700 flex-1`}>{search}</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Popular Searches */}
                    <View style={tw`px-4 mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Popular Searches</Text>
                        
                        {popularSearches.map((search, index) => (
                            <TouchableOpacity
                                key={index}
                                style={tw`flex-row items-center py-3 border-b border-gray-100`}
                                onPress={() => handleQuickSearch(search)}
                            >
                                <Ionicons name="trending-up-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                                <Text style={tw`text-gray-700 flex-1`}>{search}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Search Tips */}
                    <View style={tw`px-4 mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Search Tips</Text>
                        
                        <View style={tw`bg-blue-50 rounded-2xl p-6`}>
                            <View style={tw`flex-row items-start mb-3`}>
                                <Ionicons name="bulb-outline" size={20} color="#3B82F6" style={tw`mr-3 mt-1`} />
                                <Text style={tw`text-blue-800 font-medium`}>Try these search examples:</Text>
                            </View>
                            
                            <View style={tw`space-y-2`}>
                                <Text style={tw`text-blue-700`}>• "Foot and Mouth Disease symptoms"</Text>
                                <Text style={tw`text-blue-700`}>• "Emergency vet near Kigali"</Text>
                                <Text style={tw`text-blue-700`}>• "Amoxicillin for cattle"</Text>
                                <Text style={tw`text-blue-700`}>• "Dr. John veterinary clinic"</Text>
                                <Text style={tw`text-blue-700`}>• "Poultry vaccination schedule"</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default SearchScreen;
