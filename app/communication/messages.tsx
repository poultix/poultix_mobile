import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
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

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/contexts/MessageContext';
import { useMessageActions } from '@/hooks/useMessageActions';

export default function MessagesScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { messages, isLoading } = useMessages();
    const { sendMessage, markAsRead } = useMessageActions();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Mark messages as read when component mounts
    useEffect(() => {
        if (messages && messages.length > 0 && currentUser) {
            messages.forEach(message => {
                if (!message.isRead && message.recipientId === currentUser.id) {
                    markAsRead(message.senderId, message.recipientId, message.id, true);
                }
            });
        }
    }, [messages, currentUser, markAsRead]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentUser) return;
        
        try {
            setIsSending(true);
            
            // Send message using context action
            await sendMessage(
                currentUser.id,
                currentUser.role === 'FARMER' ? 'vet-001' : 'farmer-001', // Default recipient for demo
                newMessage.trim(),
                currentUser.role === 'FARMER'
            );
            
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

    const renderMessage = (message: any, index: number) => {
        const isFromCurrentUser = message.senderId === currentUser?.id;
        
        return (
            <View
                key={message.id || index}
                style={tw`mb-4 ${isFromCurrentUser ? 'items-end' : 'items-start'}`}
            >
                {isFromCurrentUser ? (
                    // Sent message
                    <View style={tw`bg-blue-500 rounded-2xl rounded-br-md px-4 py-3 max-w-[80%] shadow-sm`}>
                        <Text style={tw`text-white font-medium`}>{message.content || message.message}</Text>
                        <Text style={tw`text-blue-100 text-xs mt-1`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                ) : (
                    // Received message
                    <View style={tw`bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%] shadow-sm`}>
                        <Text style={tw`text-gray-800 font-medium`}>{message.content || message.message}</Text>
                        <Text style={tw`text-gray-500 text-xs mt-1`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    if (isLoading || !currentUser) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading messages...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
            
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
                                <TouchableOpacity
                                    style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back" size={24} color="white" />
                                </TouchableOpacity>
                                <View style={tw`flex-1 ml-4`}>
                                    <Text style={tw`text-white font-medium`}>Communication</Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>Messages 💬</Text>
                                    <Text style={tw`text-green-100 text-sm`}>
                                        Chat with your {currentUser.role === 'FARMER' ? 'veterinary team' : 'farmers'}
                                    </Text>
                                </View>
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
                                    Start a conversation with your {currentUser.role === 'FARMER' ? 'veterinary team' : 'farmers'}
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
                                    style={tw`text-gray-800 text-base max-h-24`}
                                    placeholder="Type your message..."
                                    placeholderTextColor="#9CA3AF"
                                    value={newMessage}
                                    onChangeText={setNewMessage}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                            <TouchableOpacity
                                style={tw`bg-blue-500 rounded-full p-3 ${(!newMessage.trim() || isSending) ? 'opacity-50' : ''}`}
                                onPress={handleSendMessage}
                                disabled={!newMessage.trim() || isSending}
                            >
                                <Ionicons 
                                    name={isSending ? "hourglass-outline" : "send"} 
                                    size={20} 
                                    color="white" 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
