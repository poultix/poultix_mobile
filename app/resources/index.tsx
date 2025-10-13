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

// Mock educational resources data
const resourceCategories = [
    {
        id: 'guidelines',
        title: 'Official Guidelines',
        description: 'Government-approved veterinary protocols and procedures',
        icon: 'document-text-outline',
        color: 'bg-blue-500',
        count: 15,
        route: '/resources/guidelines'
    },
    {
        id: 'disease-info',
        title: 'Disease Information',
        description: 'Comprehensive guides on livestock diseases and prevention',
        icon: 'medical-outline',
        color: 'bg-red-500',
        count: 25,
        route: '/resources/disease-info'
    },
    {
        id: 'vaccination',
        title: 'Vaccination Programs',
        description: 'National and regional vaccination schedules',
        icon: 'shield-checkmark-outline',
        color: 'bg-green-500',
        count: 8,
        route: '/vaccination'
    },
    {
        id: 'nutrition',
        title: 'Animal Nutrition',
        description: 'Feeding guides and nutritional requirements',
        icon: 'nutrition-outline',
        color: 'bg-orange-500',
        count: 12,
        route: '/resources/guidelines'
    },
    {
        id: 'management',
        title: 'Farm Management',
        description: 'Best practices for livestock management',
        icon: 'home-outline',
        color: 'bg-purple-500',
        count: 18,
        route: '/resources/guidelines'
    },
    {
        id: 'regulatory',
        title: 'Regulatory Compliance',
        description: 'Legal requirements and compliance guides',
        icon: 'shield-outline',
        color: 'bg-indigo-500',
        count: 10,
        route: '/resources/guidelines'
    }
];

const featuredArticles = [
    {
        id: '1',
        title: 'Rwanda\'s National Animal Health Strategy 2024',
        category: 'Policy',
        readTime: '8 min read',
        description: 'Comprehensive overview of Rwanda\'s animal health policies and strategic initiatives.',
        image: '📋',
        author: 'Rwanda Agriculture Board',
        publishDate: '2024-01-15'
    },
    {
        id: '2',
        title: 'Foot and Mouth Disease: Prevention and Control',
        category: 'Disease Control',
        readTime: '12 min read',
        description: 'Complete guide to FMD prevention, early detection, and outbreak management.',
        image: '🦠',
        author: 'Dr. Marie Uwimana',
        publishDate: '2024-02-20'
    },
    {
        id: '3',
        title: 'Sustainable Livestock Farming Practices',
        category: 'Farm Management',
        readTime: '15 min read',
        description: 'Modern sustainable farming techniques for improved productivity and animal welfare.',
        image: '🌱',
        author: 'FAO Rwanda Office',
        publishDate: '2024-03-10'
    }
];

const quickGuides = [
    {
        id: '1',
        title: 'Emergency Response Checklist',
        description: 'Essential steps for handling animal health emergencies',
        icon: 'warning-outline',
        route: '/emergency'
    },
    {
        id: '2',
        title: 'Vaccine Storage Guidelines',
        description: 'Proper vaccine handling and storage procedures',
        icon: 'snow-outline',
        route: '/vaccination'
    },
    {
        id: '3',
        title: 'Antibiotic Use Guidelines',
        description: 'Responsible antibiotic use in livestock',
        icon: 'medical-outline',
        route: '/medicine'
    },
    {
        id: '4',
        title: 'Disease Reporting Protocol',
        description: 'How and when to report animal diseases',
        icon: 'megaphone-outline',
        route: '/resources/disease-info'
    }
];

const ResourcesScreen = () => {
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

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#7C3AED', '#A855F7']}
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
                        Educational Resources
                    </Text>
                    <Text style={tw`text-purple-100 text-sm`}>
                        Comprehensive veterinary knowledge base
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Quick Guides */}
                    <View style={tw`px-4 py-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Quick Guides</Text>
                        <View style={tw`flex-row flex-wrap`}>
                            {quickGuides.map((guide) => (
                                <TouchableOpacity
                                    key={guide.id}
                                    style={tw`w-1/2 p-2`}
                                    onPress={() => router.push(guide.route)}
                                >
                                    <View style={tw`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 items-center`}>
                                        <Ionicons name={guide.icon as any} size={32} color="#7C3AED" style={tw`mb-3`} />
                                        <Text style={tw`text-gray-900 font-bold text-center mb-1`}>
                                            {guide.title}
                                        </Text>
                                        <Text style={tw`text-gray-600 text-xs text-center leading-4`}>
                                            {guide.description}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Resource Categories */}
                    <View style={tw`px-4 mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Resource Categories</Text>
                        
                        {resourceCategories.map((category, index) => (
                            <Animated.View
                                key={category.id}
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
                                    onPress={() => router.push(category.route)}
                                    activeOpacity={0.7}
                                >
                                    <View style={tw`flex-row items-center`}>
                                        <View style={tw`w-14 h-14 rounded-xl items-center justify-center mr-4 ${category.color}`}>
                                            <Ionicons name={category.icon as any} size={28} color="white" />
                                        </View>
                                        
                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex-row items-center justify-between mb-1`}>
                                                <Text style={tw`text-gray-900 font-bold text-lg`}>
                                                    {category.title}
                                                </Text>
                                                <View style={tw`bg-gray-100 px-2 py-1 rounded-full`}>
                                                    <Text style={tw`text-gray-700 text-xs font-bold`}>
                                                        {category.count} items
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={tw`text-gray-600 text-sm leading-5`}>
                                                {category.description}
                                            </Text>
                                        </View>
                                        
                                        <Ionicons name="chevron-forward" size={24} color="#6B7280" />
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Featured Articles */}
                    <View style={tw`px-4 mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Featured Articles</Text>
                        
                        {featuredArticles.map((article, index) => (
                            <Animated.View
                                key={article.id}
                                style={[
                                    tw`mb-4`,
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
                                    onPress={() => router.push('/resources/guidelines')}
                                    activeOpacity={0.7}
                                >
                                    <View style={tw`flex-row items-start`}>
                                        <View style={tw`w-16 h-16 rounded-xl items-center justify-center mr-4 bg-purple-100`}>
                                            <Text style={tw`text-2xl`}>{article.image}</Text>
                                        </View>
                                        
                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex-row items-center mb-2`}>
                                                <View style={tw`bg-purple-100 px-2 py-1 rounded-full mr-2`}>
                                                    <Text style={tw`text-purple-700 text-xs font-medium`}>
                                                        {article.category}
                                                    </Text>
                                                </View>
                                                <Text style={tw`text-gray-500 text-sm`}>
                                                    {article.readTime}
                                                </Text>
                                            </View>
                                            
                                            <Text style={tw`text-gray-900 font-bold text-lg mb-2 leading-6`}>
                                                {article.title}
                                            </Text>
                                            
                                            <Text style={tw`text-gray-600 text-sm mb-3 leading-5`}>
                                                {article.description}
                                            </Text>
                                            
                                            <View style={tw`flex-row items-center justify-between`}>
                                                <Text style={tw`text-gray-500 text-sm`}>
                                                    By {article.author}
                                                </Text>
                                                <Text style={tw`text-gray-500 text-sm`}>
                                                    {article.publishDate}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Learning Progress */}
                    <View style={tw`px-4 mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Your Learning Progress</Text>
                        
                        <View style={tw`bg-white rounded-2xl p-6 shadow-sm border border-gray-100`}>
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <Text style={tw`text-gray-900 font-bold`}>Veterinary Knowledge</Text>
                                <Text style={tw`text-purple-600 font-bold`}>65% Complete</Text>
                            </View>
                            
                            <View style={tw`bg-gray-200 rounded-full h-3 mb-4`}>
                                <View style={tw`bg-purple-500 h-3 rounded-full w-3/5`} />
                            </View>
                            
                            <View style={tw`flex-row justify-between text-sm mb-4`}>
                                <Text style={tw`text-gray-600`}>Articles Read: 13/20</Text>
                                <Text style={tw`text-gray-600`}>Guides Completed: 8/12</Text>
                            </View>
                            
                            <TouchableOpacity style={tw`bg-purple-500 py-3 rounded-xl`}>
                                <Text style={tw`text-white font-bold text-center`}>Continue Learning</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Expert Q&A */}
                    <View style={tw`px-4 mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Expert Q&A</Text>
                        
                        <View style={tw`bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6`}>
                            <View style={tw`flex-row items-center mb-3`}>
                                <Ionicons name="chatbubble-ellipses" size={24} color="white" style={tw`mr-3`} />
                                <Text style={tw`text-white font-bold text-lg`}>Ask the Experts</Text>
                            </View>
                            <Text style={tw`text-blue-100 mb-4`}>
                                Get answers from certified veterinarians and agricultural experts
                            </Text>
                            <TouchableOpacity style={tw`bg-white bg-opacity-20 py-3 px-6 rounded-xl flex-row items-center justify-center`}>
                                <Ionicons name="help-circle-outline" size={20} color="white" style={tw`mr-2`} />
                                <Text style={tw`text-white font-bold`}>Ask a Question</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Recent Updates */}
                    <View style={tw`px-4 mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Recent Updates</Text>
                        
                        <View style={tw`space-y-3`}>
                            <View style={tw`bg-green-50 border border-green-200 rounded-xl p-4`}>
                                <View style={tw`flex-row items-center mb-2`}>
                                    <Ionicons name="leaf" size={20} color="#059669" style={tw`mr-3`} />
                                    <Text style={tw`text-green-800 font-bold`}>New Disease Prevention Guide</Text>
                                </View>
                                <Text style={tw`text-green-700 text-sm mb-2`}>
                                    Updated guidelines for Newcastle disease in poultry
                                </Text>
                                <Text style={tw`text-green-600 text-xs`}>Published 2 days ago</Text>
                            </View>
                            
                            <View style={tw`bg-blue-50 border border-blue-200 rounded-xl p-4`}>
                                <View style={tw`flex-row items-center mb-2`}>
                                    <Ionicons name="shield-checkmark" size={20} color="#2563EB" style={tw`mr-3`} />
                                    <Text style={tw`text-blue-800 font-bold`}>Vaccination Schedule Updated</Text>
                                </View>
                                <Text style={tw`text-blue-700 text-sm mb-2`}>
                                    New seasonal recommendations for cattle vaccination
                                </Text>
                                <Text style={tw`text-blue-600 text-xs`}>Published 1 week ago</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default ResourcesScreen;
