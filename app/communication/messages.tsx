import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    FlatList,
    Animated,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { MockDataService } from '@/services/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
    id: string;
    farmerId: string;
    veterinaryId: string;
    farmerName: string;
    veterinaryName: string;
    message: string;
    timestamp: Date;
    isFromFarmer: boolean;
    isRead: boolean;
}

export default function MessagesScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadUserData();
        
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadUserData = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            const token = await AsyncStorage.getItem('token');
            
            setUserRole(role || 'farmer');
            setUserId(token === 'mock_farmer_token' ? 'farmer_001' : 'vet_001');
            
            await loadMessages(token === 'mock_farmer_token' ? 'farmer_001' : 'vet_001', role || 'farmer');
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMessages = async (id: string, role: string) => {
        try {
            const messagesData = await MockDataService.getMessages(id, role);
            setMessages(messagesData.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            })));
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);
        
        try {
            const isFromFarmer = userRole === 'farmer';
            const toId = isFromFarmer ? 'vet_001' : 'farmer_001';
            
            await MockDataService.sendMessage(userId, toId, newMessage.trim(), isFromFarmer);
            
            // Add message to local state immediately for better UX
            const tempMessage: Message = {
                id: `temp_${Date.now()}`,
                farmerId: isFromFarmer ? userId : toId,
                veterinaryId: isFromFarmer ? toId : userId,
                farmerName: isFromFarmer ? 'You' : 'John Uwimana',
                veterinaryName: isFromFarmer ? 'Dr. Patricia Uwimana' : 'You',
                message: newMessage.trim(),
                timestamp: new Date(),
                isFromFarmer,
                isRead: true
            };
            
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');
            
            // Scroll to bottom
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const messageDate = new Date(date);
        
        if (messageDate.toDateString() === today.toDateString()) {
            return 'Today';
        }
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        
        return messageDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const renderMessage = (message: Message, index: number) => {
        const isCurrentUser = (userRole === 'farmer' && message.isFromFarmer) || 
                             (userRole === 'veterinary' && !message.isFromFarmer);
        
        const showDateHeader = index === 0 || 
            formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp);

        return (
            <View key={message.id}>
                {showDateHeader && (
                    <View style={tw`items-center my-4`}>
                        <View style={tw`bg-gray-200 px-3 py-1 rounded-full`}>
                            <Text style={tw`text-gray-600 text-xs font-medium`}>
                                {formatDate(message.timestamp)}
                            </Text>
                        </View>
                    </View>
                )}
                
                <View style={[
                    tw`flex-row mb-4`,
                    isCurrentUser ? tw`justify-end` : tw`justify-start`
                ]}>
                    <View style={[
                        tw`max-w-[80%] rounded-2xl p-4`,
                        isCurrentUser 
                            ? tw`bg-blue-500 rounded-br-md`
                            : tw`bg-white border border-gray-200 rounded-bl-md`
                    ]}>
                        {!isCurrentUser && (
                            <Text style={tw`text-gray-600 text-xs font-medium mb-1`}>
                                {userRole === 'farmer' ? message.veterinaryName : message.farmerName}
                            </Text>
                        )}
                        
                        <Text style={[
                            tw`text-base leading-5`,
                            isCurrentUser ? tw`text-white` : tw`text-gray-800`
                        ]}>
                            {message.message}
                        </Text>
                        
                        <Text style={[
                            tw`text-xs mt-2`,
                            isCurrentUser ? tw`text-blue-100` : tw`text-gray-500`
                        ]}>
                            {formatTime(message.timestamp)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600`}>Loading messages...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            
            
            <KeyboardAvoidingView 
                style={tw`flex-1`}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={tw`px-4 pt-2 pb-4`}>
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            style={tw`rounded-3xl p-6 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-white text-sm opacity-90`}>
                                        Communication
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>
                                        Messages 💬
                                    </Text>
                                    <Text style={tw`text-green-100 text-sm mt-1`}>
                                        {userRole === 'farmer' 
                                            ? 'Chat with veterinary professionals'
                                            : 'Chat with farmers'
                                        }
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={tw`flex-1 px-4`}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.length === 0 ? (
                            <View style={tw`flex-1 justify-center items-center py-20`}>
                                <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
                                <Text style={tw`text-gray-500 text-lg font-medium mt-4`}>
                                    No messages yet
                                </Text>
                                <Text style={tw`text-gray-400 text-center mt-2`}>
                                    Start a conversation with your {userRole === 'farmer' ? 'veterinary' : 'farmers'}
                                </Text>
                            </View>
                        ) : (
                            messages.map((message, index) => renderMessage(message, index))
                        )}
                    </ScrollView>

                    {/* Message Input */}
                    <View style={tw`px-4 py-4 bg-white border-t border-gray-200`}>
                        <View style={tw`flex-row items-end gap-3`}>
                            <View style={tw`flex-1 bg-gray-100 rounded-2xl px-4 py-3`}>
                                <TextInput
                                    style={tw`text-gray-800 text-base max-h-20`}
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChangeText={setNewMessage}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                            
                            <TouchableOpacity
                                style={[
                                    tw`bg-blue-500 p-3 rounded-2xl`,
                                    (!newMessage.trim() || isSending) && tw`opacity-50`
                                ]}
                                onPress={sendMessage}
                                disabled={!newMessage.trim() || isSending}
                            >
                                <Ionicons 
                                    name={isSending ? "hourglass-outline" : "send-outline"} 
                                    size={20} 
                                    color="white" 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>

            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </SafeAreaView>
    );
}
