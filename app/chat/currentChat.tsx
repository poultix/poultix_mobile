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
import { router} from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useUsers } from '@/contexts/UserContext';
import { useChatActions } from '@/hooks/useChatActions';
import DrawerButton from '@/components/DrawerButton';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { Message, MessageType, MessageStatus } from '@/types';

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
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={tw`px-4 shadow-xl py-10`}
                >
                    <View style={tw`flex-row items-center justify-between`}>
                        <View style={tw`flex-row items-center flex-1`}>
                            <TouchableOpacity
                                style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-3`}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back-outline" size={24} color="white" />
                            </TouchableOpacity>

                            <View style={tw`flex-1`}>
                                <Text style={tw`text-white text-lg font-bold`}>
                                    {otherUser?.name || 'Chat'}
                                </Text>
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`w-2 h-2 rounded-full mr-2 ${isOnline(otherUser?.id || '')
                                        ? 'bg-green-400' : 'bg-gray-400'
                                        }`} />
                                    <Text style={tw`text-blue-100 text-sm`}>
                                        {isOnline(otherUser?.id || '')
                                            ? 'Online' : 'Last seen recently'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`flex-row items-center`}>
                            <TouchableOpacity style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-2`}>
                                <Ionicons name="call-outline" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-2`}>
                                <Ionicons name="videocam-outline" size={20} color="white" />
                            </TouchableOpacity>
                            <DrawerButton />
                        </View>
                    </View>
                </LinearGradient>

                {/* Messages */}
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={tw`flex-1 px-4`}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        <View style={tw`py-4`}>
                            {chatMessages.map((message, index) => {
                                const isOwnMessage = message.sender.id === currentUser?.id;
                                const showAvatar = !isOwnMessage && (
                                    index === 0 ||
                                    chatMessages[index - 1].sender.id !== message.sender.id
                                );

                                return (
                                    <View key={message.id} style={tw`mb-4`}>
                                        {/* Reply indicator */}
                                        {message.replyTo && (
                                            <View style={tw`${isOwnMessage ? 'items-end' : 'items-start'} mb-1`}>
                                                <View style={tw`bg-gray-200 rounded-lg p-2 max-w-xs`}>
                                                    {message.replyTo &&
                                                        <Text style={tw`text-gray-600 text-xs`}>
                                                            Replying to: {chatMessages.find(m => m.id === message?.replyTo?.id)?.content.substring(0, 30)}...
                                                        </Text>}
                                                </View>
                                            </View>
                                        )}

                                        <View style={tw`flex-row ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>

                                            <TouchableOpacity
                                                onLongPress={() => handleMessageLongPress(message)}
                                                style={tw`max-w-xs`}
                                            >
                                                <View style={tw`${isOwnMessage
                                                    ? 'bg-blue-500 rounded-l-2xl rounded-tr-2xl'
                                                    : 'bg-white rounded-r-2xl rounded-tl-2xl'
                                                    } p-3 shadow-sm`}>

                                                    <Text style={tw`${isOwnMessage ? 'text-white' : 'text-gray-800'
                                                        } text-base`}>
                                                        {message.content}
                                                    </Text>

                                                    {message.edited && (
                                                        <Text style={tw`${isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                                                            } text-xs mt-1`}>
                                                            edited
                                                        </Text>
                                                    )}

                                                    {/* Reactions */}
                                                    {message.reactions && message.reactions.length > 0 && (
                                                        <View style={tw`flex-row flex-wrap mt-2`}>
                                                            {message.reactions.map((reaction, idx) => (
                                                                <View key={idx} style={tw`bg-gray-100 rounded-full px-2 py-1 mr-1 mb-1`}>
                                                                    <Text style={tw`text-sm`}>{reaction.emoji}</Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    )}

                                                    <View style={tw`flex-row items-center justify-between mt-1`}>
                                                        <Text style={tw`${isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                                                            } text-xs`}>
                                                            {formatTime(message.timestamp)}
                                                        </Text>

                                                        {isOwnMessage && (
                                                            <Text style={tw`text-blue-200 text-xs ml-2`}>
                                                                {getMessageStatus(message)}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}

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
                <View style={tw`bg-white p-4 border-t border-gray-200`}>
                    <View style={tw`flex-row items-end`}>
                        <TouchableOpacity style={tw`bg-blue-100 p-3 rounded-full mr-3`}>
                            <Ionicons name="add-outline" size={20} color="#3B82F6" />
                        </TouchableOpacity>

                        <View style={tw`flex-1 bg-gray-100 rounded-2xl px-4 py-2 mr-3`}>
                            <TextInput
                                style={tw`text-gray-800 text-base max-h-24`}
                                placeholder="Type a message..."
                                placeholderTextColor="#6B7280"
                                value={messageText}
                                onChangeText={handleTyping}
                                multiline
                                maxLength={1000}
                            />
                        </View>

                        <TouchableOpacity
                            style={tw`bg-blue-500 p-3 rounded-full ${!messageText.trim() ? 'opacity-50' : ''}`}
                            onPress={handleSendMessage}
                            disabled={!messageText.trim()}
                        >
                            <Ionicons name="send-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Reaction Picker */}
                {showReactions && (
                    <View style={tw`absolute bottom-20 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg`}>
                        <View style={tw`flex-row justify-around`}>
                            {['👍', '❤️', '😂', '😮', '😢', '😡'].map(reaction => (
                                <TouchableOpacity
                                    key={reaction}
                                    style={tw`p-2`}
                                    onPress={() => handleReaction(showReactions, reaction)}
                                >
                                    <Text style={tw`text-2xl`}>{reaction}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={tw`mt-3 p-2 bg-gray-100 rounded-xl`}
                            onPress={() => setShowReactions(null)}
                        >
                            <Text style={tw`text-center text-gray-600`}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
}
