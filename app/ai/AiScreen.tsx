import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Animated,
    KeyboardAvoidingView,
    Platform,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import TopNavigation from '../navigation/TopNavigation';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Message {
    id: string;
    text: string;
    isUser: boolean;
}

export default function AIFrontScreen() {
    const router = useRouter();
    const [question, setQuestion] = useState('What is the latest news in poultry farming?');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I’m here to help with your farming queries. What’s on your mind? 😊',
            isUser: false,
        },
    ]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Animation for initial mount
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleStyleSelect = (style: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
            pathname: '/screens/ai-front',
            params: { style, question },
        });
    };

    const handleAskQuestion = () => {
        if (question.trim()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Configure LayoutAnimation for new message
            LayoutAnimation.configureNext(
                LayoutAnimation.Presets.spring,
                () => {
                    // Navigate after animation completes
                    router.push({
                        pathname: '/screens/ai-conversation',
                        params: { style: 'Balanced', question },
                    });
                },
                () => { } // Error callback
            );
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
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    text: 'I’m fetching the latest poultry news for you! Anything specific you want to know?',
                    isUser: false,
                },
            ]);
            setQuestion('');
        }
    };

    return (
        <SafeAreaView style={tw`flex-1`}>
            <TopNavigation />
            <LinearGradient colors={['#F9FAFB', '#E5E7EB']} style={tw`flex-1`}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={tw`flex-1`}
                >
                    <View style={tw`flex-1 px-4 pt-6 pb-4`}>

                      

                        {/* Message List */}
                        <Animated.ScrollView
                            contentContainerStyle={tw`flex flex-col gap-y-4`}
                            showsVerticalScrollIndicator={false}
                            style={[tw`flex-1`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                        >
                            {messages.map((message) => (
                                <Animated.View
                                    key={message.id}
                                    style={[
                                        tw`max-w-[75%] rounded-2xl p-4 mb-4 relative ${message.isUser ? 'ml-auto bg-blue-500' : 'mr-auto bg-gray-200'
                                            }`,
                                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                                    ]}
                                >
                                    {!message.isUser && (
                                        <View style={tw`flex-row items-center mb-2`}>
                                            <Ionicons
                                                name="chatbubble-outline"
                                                size={20}
                                                color="#4B5563"
                                            />
                                            <Text style={tw`text-gray-600 text-sm ml-2 font-medium`}>
                                                AI Assistant
                                            </Text>
                                        </View>
                                    )}
                                    <Text
                                        style={tw`${message.isUser ? 'text-white' : 'text-gray-900'
                                            } text-base leading-6`}
                                    >
                                        {message.text}
                                    </Text>
                                    {!message.isUser && (
                                        <Text style={tw`text-gray-500 text-xs mt-2`}>1 of 5 • 🌟</Text>
                                    )}
                                    {/* Bubble Tail */}
                                    <View
                                        style={tw`absolute bottom-0 ${message.isUser ? 'right-[-8px]' : 'left-[-8px]'
                                            } w-0 h-0 border-t-[8px] border-t-transparent ${message.isUser
                                                ? 'border-l-[12px] border-l-blue-500'
                                                : 'border-r-[12px] border-r-gray-200'
                                            } border-b-[8px] border-b-transparent`}
                                    />
                                </Animated.View>
                            ))}
                        </Animated.ScrollView>
                        {/* Conversation Style Selection */}
                        <Animated.View
                            style={[tw`mb-8`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                        >
                            <Text style={tw`text-gray-900 text-base font-semibold mb-3 tracking-tight`}>
                                Conversation Style
                            </Text>
                            <View style={tw`flex-row justify-between`}>
                                {[
                                    { style: 'Creative', color: '#F59E0B' },
                                    { style: 'Balanced', color: '#3B82F6' },
                                    { style: 'Precise', color: '#10B981' },
                                ].map(({ style, color }) => (
                                    <TouchableOpacity
                                        key={style}
                                        onPress={() => {
                                            LayoutAnimation.configureNext(
                                                LayoutAnimation.Presets.easeInEaseOut
                                            );
                                            handleStyleSelect(style);
                                        }}
                                        style={[
                                            tw`rounded-xl px-4 py-3 flex-1 mx-1 shadow-sm`,
                                            { backgroundColor: color },
                                        ]}
                                        activeOpacity={0.9}
                                    >
                                        <Text style={tw`text-white text-base font-medium text-center`}>
                                            {style}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Animated.View>
                    </View>

                    {/* Input Area */}
                    <Animated.View
                        style={[tw`px-4 pb-4`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                    >
                        <View
                            style={tw`flex-row items-center bg-white rounded-full p-3 shadow-lg border border-gray-200`}
                        >
                            <TextInput
                                style={tw`flex-1 text-gray-900 text-base px-3 py-2`}
                                value={question}
                                onChangeText={setQuestion}
                                placeholder="Ask me anything..."
                                placeholderTextColor="#6B7280"
                            />
                            <TouchableOpacity
                                onPress={handleAskQuestion}
                                style={tw`p-2`}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="send" size={24} color="#3B82F6" />
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`p-2`} activeOpacity={0.7}>
                                <Ionicons name="mic" size={24} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}