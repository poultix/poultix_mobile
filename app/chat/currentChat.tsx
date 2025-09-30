import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Alert,
    Animated,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useUsers } from '@/contexts/UserContext';
import { useChatActions } from '@/hooks/useChatActions';
import DrawerButton from '@/components/DrawerButton';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { Message, MessageType, MessageStatus } from '@/types';
import ChatMessage from '@/components/chat/message';
import ChatSender from '@/components/chat/sender';
import ChatHeader from '@/components/chat/header';
import ChatReactions from '@/components/chat/reactions';

export default function ChatScreen() {
    const { currentUser } = useAuth();
    const { users } = useUsers();
    const { currentChat } = useChat();
    const { messages, typingStatuses, onlineUsers } = useChat();
    const { sendMessage, markMessagesAsRead, setTyping, addReaction, editMessage, removeMessage } = useChatActions();
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();

    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [showReactions, setShowReactions] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(0);

    // Get current chat info from context

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

    const handleSendMessage = async () => {
        if (!messageText.trim() || !otherUser || !currentUser) return;

        await sendMessage(
            messageText.trim(),
            otherUser,
            currentUser,
            MessageType.TEXT
        );

        setMessageText('');
        setReplyToMessage(null);
        setIsTyping(false);

        if (currentUser) {
            setTyping(currentChat?.id as string, currentUser.id, currentUser.name, false);
        }
    };

    const handleTyping = (text: string) => {
        setMessageText(text);

        if (!isTyping && text.length > 0 && currentUser && currentChat?.id) {
            setIsTyping(true);
            setTyping(currentChat?.id as string, currentUser.id, currentUser.name, true);
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            if (currentUser && currentChat?.id) {
                setTyping(currentChat?.id as string, currentUser.id, currentUser.name, false);
            }
        }, 2000);
    };

    const handleMessageLongPress = (message: Message) => {
        setSelectedMessage(message.id.toString());

        Alert.alert(
            'Message Options',
            '',
            [
                { text: 'Reply', onPress: () => setReplyToMessage(message) },
                { text: 'React', onPress: () => setShowReactions(message.id.toString()) },
                ...(message.sender.id === currentUser?.id ? [
                    { text: 'Edit', onPress: () => handleEditMessage(message) },
                    { text: 'Delete', onPress: () => handleDeleteMessage(message), style: 'destructive' as const }
                ] : []),
                { text: 'Cancel', style: 'cancel' as const }
            ]
        );
    };

    const handleEditMessage = (message: Message) => {
        setMessageText(message.content);
        setSelectedMessage(message.id.toString());
    };

    const handleDeleteMessage = (message: Message) => {
        Alert.alert(
            'Delete Message',
            'Are you sure you want to delete this message?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => removeMessage(message.id)
                }
            ]
        );
    };

    const handleReaction = (messageId: string, reaction: string) => {
        if (currentUser) {
            addReaction(Number(messageId), Number(currentUser.id), reaction);
        }
        setShowReactions(null);
    };

    const getMessageStatus = (message: Message) => {
        switch (message.status) {
            case MessageStatus.SENDING: return '⏳';
            case MessageStatus.DELIVERED: return '✓✓';
            case MessageStatus.READ: return '✓✓';
            case MessageStatus.FAILED: return '❌';
            default: return '✓';
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    const isOnline = (userId: string) => onlineUsers.has(userId);

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
                    <ChatReactions />
                )}
            </KeyboardAvoidingView>
        </View>
    );
}
