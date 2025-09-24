import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Animated,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
}

export default function AIFrontScreen() {
    const router = useRouter();
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m your AI farming assistant. I can help with poultry health, nutrition, breeding, and farm management. What would you like to know? 🐔',
            isUser: false,
        },
    ]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;
    const headerAnim = useRef(new Animated.Value(-50)).current;

    // Animation for initial mount
    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.spring(headerAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const handleStyleSelect = (style: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Style selection logic can be implemented here
    };

    const handleAskQuestion = () => {
        if (question.trim()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Add user message to history
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: question,
                    isUser: true,
                },
            ]);
            // Simulate AI response (for demo purposes)
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        text: 'Great question! Let me help you with that. Based on current best practices in poultry farming...',
                        isUser: false,
                    },
                ]);
            }, 1000);
            setQuestion('');
        }
    };

    const quickQuestions = [
        { text: 'What are common poultry diseases?', icon: 'medical-outline' },
        { text: 'Best feeding practices for chickens?', icon: 'nutrition-outline' },
        { text: 'How to improve egg production?', icon: 'trending-up-outline' },
        { text: 'Optimal housing conditions?', icon: 'home-outline' },
    ];

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={tw`flex-1`}
                contentContainerStyle={tw`pb-4`}
            >
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Enhanced Header */}
                    <Animated.View 
                        style={[
                            tw`px-4 pt-2 pb-4`,
                            { transform: [{ translateY: headerAnim }] }
                        ]}
                    >
                        <LinearGradient
                            colors={['#06B6D4', '#0891B2']}
                            style={tw`rounded-3xl p-8 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-white text-sm opacity-90`}>
                                        AI-Powered Assistant
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>
                                        Ask Me Anything 🤖
                                    </Text>
                                    <Text style={tw`text-cyan-100 text-sm mt-1`}>
                                        Get expert poultry advice instantly
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                >
                                    <Ionicons name="sparkles-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            
                            {/* AI Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                                <Text style={tw`text-white font-bold text-lg mb-4`}>AI Capabilities</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-white text-2xl font-bold`}>24/7</Text>
                                        <Text style={tw`text-cyan-100 text-xs font-medium`}>Available</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-2xl font-bold`}>1000+</Text>
                                        <Text style={tw`text-cyan-100 text-xs font-medium`}>Topics</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-blue-200 text-2xl font-bold`}>95%</Text>
                                        <Text style={tw`text-cyan-100 text-xs font-medium`}>Accuracy</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* Chat Messages */}
                    <Animated.View 
                        style={[
                            tw`px-4 mb-4`,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                            <Text style={tw`text-gray-800 font-bold text-lg mb-4`}>Conversation</Text>
                            {messages.map((message) => (
                                <View
                                    key={message.id}
                                    style={[
                                        tw`max-w-[85%] rounded-2xl p-4 mb-3`,
                                        message.isUser 
                                            ? tw`ml-auto bg-cyan-500` 
                                            : tw`mr-auto bg-gray-100`
                                    ]}
                                >
                                    {!message.isUser && (
                                        <View style={tw`flex-row items-center mb-2`}>
                                            <View style={tw`bg-cyan-100 p-1 rounded-full mr-2`}>
                                                <Ionicons
                                                    name="sparkles"
                                                    size={14}
                                                    color="#06B6D4"
                                                />
                                            </View>
                                            <Text style={tw`text-gray-600 text-sm font-medium`}>
                                                AI Assistant
                                            </Text>
                                        </View>
                                    )}
                                    <Text
                                        style={[
                                            tw`text-base leading-6`,
                                            message.isUser ? tw`text-white` : tw`text-gray-900`
                                        ]}
                                    >
                                        {message.text}
                                    </Text>
                                    {!message.isUser && (
                                        <Text style={tw`text-gray-500 text-xs mt-2`}>AI Response • ⚡</Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Conversation Style Selection */}
                        <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                            <Text style={tw`text-gray-800 font-bold text-lg mb-4`}>
                                Conversation Style
                            </Text>
                            <View style={tw`flex-row justify-between`}>
                                {[
                                    { style: 'Creative', color: '#F59E0B', icon: 'bulb-outline' },
                                    { style: 'Balanced', color: '#3B82F6', icon: 'scale-outline' },
                                    { style: 'Precise', color: '#10B981', icon: 'checkmark-circle-outline' },
                                ].map(({ style, color, icon }) => (
                                    <TouchableOpacity
                                        key={style}
                                        onPress={() => handleStyleSelect(style)}
                                        style={[
                                            tw`rounded-2xl p-4 flex-1 mx-1 shadow-sm items-center`,
                                            { backgroundColor: color }
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color="white" />
                                        <Text style={tw`text-white text-sm font-semibold mt-2`}>
                                            {style}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Quick Questions */}
                        <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
                            <Text style={tw`text-gray-800 font-bold text-lg mb-4`}>
                                Quick Questions
                            </Text>
                            <View style={tw`flex-row flex-wrap`}>
                                {quickQuestions.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={tw`bg-gray-100 rounded-xl p-3 mr-2 mb-2 flex-row items-center`}
                                        onPress={() => setQuestion(item.text)}
                                    >
                                        <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={16} color="#6B7280" />
                                        <Text style={tw`text-gray-700 text-sm ml-2 font-medium`}>
                                            {item.text.split('?')[0]}?
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Animated.View>

                    {/* Input Area */}
                    <Animated.View
                        style={[
                            tw`px-4 pb-4`,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        <View style={tw`bg-white rounded-2xl p-4 shadow-sm border border-gray-100`}>
                            <Text style={tw`text-gray-800 font-bold text-base mb-3`}>Ask AI Assistant</Text>
                            <View style={tw`flex-row items-center bg-gray-50 rounded-xl p-3`}>
                                <TextInput
                                    style={tw`flex-1 text-gray-900 text-base`}
                                    value={question}
                                    onChangeText={setQuestion}
                                    placeholder="Ask me anything about poultry farming..."
                                    placeholderTextColor="#6B7280"
                                    multiline
                                />
                                <TouchableOpacity
                                    onPress={handleAskQuestion}
                                    style={tw`bg-cyan-500 p-3 rounded-xl ml-3`}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="send" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </Animated.View>
            </ScrollView>
            
            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </SafeAreaView>
    );
}
