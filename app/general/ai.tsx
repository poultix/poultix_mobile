import { IOSDesign } from '@/constants/iosDesign';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

import CustomDrawer from '@/components/CustomDrawer';
import DrawerButton from '@/components/DrawerButton';
import { useDrawer } from '@/contexts/DrawerContext';
import { AIMessage, AIService, QUICK_SUGGESTIONS } from '@/services/aiService';
import { LocalAIService } from '@/services/localAIService';

export default function AIScreen() {
    const router = useRouter();
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<AIMessage[]>([AIService.getWelcomeMessage()]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    // Animation for initial mount
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleAskQuestion = async () => {
        if (question.trim() && !isLoading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            
            const userMessage = AIService.createMessage(question.trim(), true);
            const currentQuestion = question.trim();
            
            // Add user message
            setMessages(prev => [...prev, userMessage]);
            setQuestion('');
            setIsLoading(true);
            
            // Add typing indicator
            const typingMessage = AIService.createMessage('', false, true);
            setMessages(prev => [...prev, typingMessage]);
            
            try {
                let response: string;
                
                // Check if question is pH-related for specialized response
                const phMatch = currentQuestion.match(/\b(ph|pH|Ph)\s*(\d+\.?\d*)/);
                
                if (phMatch) {
                    // Use local AI for pH analysis
                    response = await LocalAIService.generateResponse(currentQuestion);
                } else if (currentQuestion.toLowerCase().includes('acid') || 
                           currentQuestion.toLowerCase().includes('alkalo') ||
                           currentQuestion.toLowerCase().includes('disease')) {
                    // Use local AI for disease-related questions
                    response = await LocalAIService.generateResponse(currentQuestion);
                } else {
                    // Use general AI service for other questions
                    response = await AIService.generateResponse(currentQuestion);
                }
                
                // Remove typing indicator and add response
                setMessages(prev => {
                    const withoutTyping = prev.filter(msg => !msg.isTyping);
                    const aiResponse = AIService.createMessage(response, false);
                    return [...withoutTyping, aiResponse];
                });
            } catch (error) {
                // Remove typing indicator and add error message
                setMessages(prev => {
                    const withoutTyping = prev.filter(msg => !msg.isTyping);
                    const errorResponse = AIService.createMessage(
                        'Sorry, I encountered an error. Please try again.', 
                        false
                    );
                    return [...withoutTyping, errorResponse];
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleQuickQuestion = (questionText: string) => {
        setQuestion(questionText);
        setTimeout(() => handleAskQuestion(), 100);
    };

    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = (message: AIMessage, index: number) => {
        if (message.isTyping) {
            return (
                <View key={message.id} style={tw`flex-row mb-4`}>
                    <View style={[
                        tw`bg-gray-100 rounded-2xl px-4 py-3 max-w-xs`,
                        { borderBottomLeftRadius: 8 }
                    ]}>
                        <View style={tw`flex-row items-center`}>
                            <ActivityIndicator size="small" color={IOSDesign.colors.systemBlue} />
                            <Text style={[
                                tw`ml-2`,
                                {
                                    fontSize: IOSDesign.typography.subheadline.fontSize,
                                    color: IOSDesign.colors.text.secondary,
                                }
                            ]}>AI is thinking...</Text>
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View key={message.id} style={[
                tw`flex-row mb-4`,
                message.isUser ? tw`justify-end` : tw`justify-start`
            ]}>
                <View style={[
                    tw`rounded-2xl px-4 py-3 max-w-xs`,
                    message.isUser 
                        ? {
                            backgroundColor: IOSDesign.colors.systemBlue,
                            borderBottomRightRadius: 8,
                        }
                        : {
                            backgroundColor: IOSDesign.colors.background.secondary,
                            borderBottomLeftRadius: 8,
                        }
                ]}>
                    <Text style={[
                        {
                            fontSize: IOSDesign.typography.body.fontSize,
                            lineHeight: IOSDesign.typography.body.lineHeight,
                            color: message.isUser 
                                ? IOSDesign.colors.text.inverse 
                                : IOSDesign.colors.text.primary,
                        }
                    ]}>
                        {message.text}
                    </Text>
                    <Text style={[
                        tw`mt-1`,
                        {
                            fontSize: IOSDesign.typography.caption2.fontSize,
                            color: message.isUser 
                                ? 'rgba(255,255,255,0.7)' 
                                : IOSDesign.colors.text.tertiary,
                        }
                    ]}>
                        {formatTimestamp(message.timestamp)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: IOSDesign.colors.background.primary }]}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1 pb-10`}
            >
                <Animated.View style={[
                    tw`flex-1`,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}>
                    {/* iOS-style Header */}
                    <View style={[tw` pb-6`]}>
                        <View style={[
                            tw` p-6`,
                            {
                                backgroundColor: IOSDesign.colors.systemBlue,
                                minHeight: 140,
                            },
                            IOSDesign.shadows.medium,
                        ]}>
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={[
                                        tw`mb-1`,
                                        {
                                            fontSize: IOSDesign.typography.subheadline.fontSize,
                                            color: 'rgba(255,255,255,0.8)',
                                        }
                                    ]}>
                                        AI-Powered Assistant
                                    </Text>
                                    <Text style={[
                                        tw`mb-1`,
                                        {
                                            fontSize: IOSDesign.typography.title2.fontSize,
                                            fontWeight: IOSDesign.typography.title2.fontWeight,
                                            color: IOSDesign.colors.text.inverse,
                                        }
                                    ]}>
                                        Ask Me Anything 🤖
                                    </Text>
                                    <Text style={[
                                        {
                                            fontSize: IOSDesign.typography.caption1.fontSize,
                                            color: 'rgba(255,255,255,0.8)',
                                        }
                                    ]}>
                                        Expert poultry advice instantly
                                    </Text>
                                </View>
                                <View style={tw`flex-row items-center`}>
                                    <TouchableOpacity
                                        onPress={() => router.push('/settings/ai-settings')}
                                        style={tw`mr-3 p-2 bg-white bg-opacity-20 rounded-full`}
                                    >
                                        <Ionicons name="settings-outline" size={20} color="white" />
                                    </TouchableOpacity>
                                    <DrawerButton />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={tw`flex-1 px-4`}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={tw`pb-4`}
                    >
                        {messages.map((message, index) => renderMessage(message, index))}
                    </ScrollView>

                    {/* Quick Suggestions */}
                    {messages.length <= 1 && (
                        <View style={tw`px-4 py-2`}>
                            <Text style={[
                                tw`mb-3`,
                                {
                                    fontSize: IOSDesign.typography.subheadlineEmphasized.fontSize,
                                    fontWeight: IOSDesign.typography.subheadlineEmphasized.fontWeight,
                                    color: IOSDesign.colors.text.primary,
                                }
                            ]}>
                                Quick Questions
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={tw`flex-row gap-3`}>
                                    {QUICK_SUGGESTIONS.map((suggestion, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                tw`bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center`,
                                                { minWidth: 200 }
                                            ]}
                                            onPress={() => handleQuickQuestion(suggestion.text)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons 
                                                name={suggestion.icon as any} 
                                                size={16} 
                                                color={IOSDesign.colors.systemTeal} 
                                                style={tw`mr-2`}
                                            />
                                            <Text style={[
                                                tw`flex-1`,
                                                {
                                                    fontSize: IOSDesign.typography.subheadline.fontSize,
                                                    color: IOSDesign.colors.text.primary,
                                                }
                                            ]}>
                                                {suggestion.text}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Input Section */}
                    <View style={[
                        tw`px-4 py-4 border-t`,
                        { 
                            backgroundColor: IOSDesign.colors.background.primary,
                            borderTopColor: IOSDesign.colors.gray[200],
                        }
                    ]}>
                        <View style={tw`flex-row items-end`}>
                            <View style={tw`flex-1 mr-3`}>
                                <TextInput
                                    style={[
                                        tw`rounded-2xl px-4 py-3 max-h-24`,
                                        {
                                            backgroundColor: IOSDesign.colors.background.secondary,
                                            fontSize: IOSDesign.typography.body.fontSize,
                                            color: IOSDesign.colors.text.primary,
                                        }
                                    ]}
                                    placeholder="Ask about poultry farming..."
                                    placeholderTextColor={IOSDesign.colors.text.tertiary}
                                    value={question}
                                    onChangeText={setQuestion}
                                    multiline
                                    maxLength={500}
                                    onSubmitEditing={handleAskQuestion}
                                    blurOnSubmit={false}
                                />
                            </View>
                            <TouchableOpacity
                                style={[
                                    tw`w-12 h-12 rounded-full items-center justify-center`,
                                    {
                                        backgroundColor: question.trim() && !isLoading 
                                            ? IOSDesign.colors.systemBlue 
                                            : IOSDesign.colors.gray[500],
                                    }
                                ]}
                                onPress={handleAskQuestion}
                                disabled={!question.trim() || isLoading}
                                activeOpacity={0.7}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Ionicons 
                                        name="send" 
                                        size={20} 
                                        color="white" 
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
