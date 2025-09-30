import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Animated,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useUsers } from '@/contexts/UserContext';
import { useChatActions } from '@/hooks/useChatActions';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { Message } from '@/types';
import ChatMessage from '@/components/chat/message';
import ChatSender from '@/components/chat/sender';
import ChatHeader from '@/components/chat/header';
import ChatReactions from '@/components/chat/reactions';

export default function ChatScreen() {
    const { currentUser } = useAuth();
    const { users } = useUsers();
    const { currentChat } = useChat();
    const { messages, typingStatuses } = useChat();
    const {  markMessagesAsRead} = useChatActions();
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();

    const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
    const [showReactions, setShowReactions] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const chatMessages = messages.filter(msg =>
        (msg.sender.id === currentUser?.id && msg.receiver.id === currentChat?.id) ||
        (msg.sender.id === currentChat?.id && msg.receiver.id === currentUser?.id)
    );
    const chatTyping = typingStatuses.filter(t => t.chatId === currentChat?.id && t.userId !== currentUser?.id);

    // Find the other user based on chatId
    const otherUser = users.find(u => u.id === currentChat?.id);

    useEffect(() => {

    }, [currentChat, otherUser]);


    const isValidChatScenario = () => {
        return !!(currentChat?.id && currentUser && otherUser);
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Mark messages as read when entering chat
        if (currentUser && chatMessages.length > 0) {
            chatMessages.forEach(msg => {
                if (msg.sender.id !== currentUser.id) {
                    markMessagesAsRead(msg.id);
                }
            });
        }
    }, [currentChat, currentUser]);

    useEffect(() => {

        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [chatMessages.length]);




    if (!isValidChatScenario()) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Chat not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50 pb-5`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />

            <KeyboardAvoidingView
                style={tw`flex-1`}
                behavior={'padding'}
            >
                {/* Header */}
                <ChatHeader />

                {/* Messages */}
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={tw`flex-1 px-4`}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        <View style={tw`py-4`}>
                            {chatMessages.map((message, index) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    chatMessages={chatMessages} />
                            ))}

                            {/* Typing indicators */}
                            {chatTyping.length > 0 && (
                                <View style={tw`flex-row items-center mb-4`}>
                                    <View style={tw`bg-gray-200 rounded-2xl p-3`}>
                                        <Text style={tw`text-gray-600 text-sm`}>
                                            {chatTyping.map(t => t.userName).join(', ')} {chatTyping.length === 1 ? 'is' : 'are'} typing...
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </Animated.View>

                {/* Reply indicator */}
                {replyToMessage && (
                    <View style={tw`bg-gray-100 p-3 border-l-4 border-blue-500 mx-4`}>
                        <View style={tw`flex-row justify-between items-center`}>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-blue-600 text-sm font-semibold`}>
                                    Replying to {replyToMessage.sender.name}
                                </Text>
                                <Text style={tw`text-gray-600 text-sm`} numberOfLines={1}>
                                    {replyToMessage.content}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setReplyToMessage(null)}>
                                <Ionicons name="close-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Message Input */}
                <ChatSender />

                {/* Reaction Picker */}
                {showReactions && (
                    <ChatReactions showReactions={showReactions} setShowReactions={setShowReactions} />
                )}
            </KeyboardAvoidingView>
        </View>
    );
}
