import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, useChatActions, Message } from '@/contexts/ChatContext';
import { useUsers } from '@/contexts/UserContext';
import DrawerButton from '@/components/DrawerButton';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';

export default function ChatScreen() {
    const { chatId } = useLocalSearchParams();
    const { currentUser } = useAuth();
    const { users } = useUsers();
    const { chats, messages, typingStatuses, onlineUsers } = useChat();
    const { sendMessage, markMessagesAsRead, setTyping, addReaction, editMessage, deleteMessage, createIndividualChat } = useChatActions();
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [showReactions, setShowReactions] = useState<string | null>(null);
    
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    // Always get the latest chat state
    const currentChat = chats.find(chat => chat.id === chatId);
    const chatMessages = messages[chatId as string] || [];
    const chatTyping = typingStatuses.filter(t => t.chatId === chatId && t.userId !== currentUser?.id);

    // Create chat if it doesn't exist and we have the necessary info
    useEffect(() => {
        const createChatIfNeeded = () => {
            console.log('createChatIfNeeded called:', {
                currentChat: !!currentChat,
                chatId,
                currentUser: !!currentUser,
                usersLength: users.length
            });

            if (!currentChat && chatId && currentUser && users.length > 0) {
                if ((chatId as string).includes('_')) {
                    // Handle new individual chat format: chat_userId1_userId2
                    const parts = (chatId as string).split('_');
                    let userId1, userId2;
                    
                    if (parts.length === 3) {
                        [, userId1, userId2] = parts;
                    } else if (parts.length === 5) {
                        // Format: chat_user_timestamp_admin_001
                        userId1 = `${parts[1]}_${parts[2]}`; // "user_timestamp"
                        userId2 = `${parts[3]}_${parts[4]}`; // "admin_001"
                    } else {
                        // Fallback: assume last two parts are the user IDs
                        userId1 = parts.slice(1, -1).join('_');
                        userId2 = parts[parts.length - 1];
                    }
                    
                    const otherUserId = userId1 === currentUser.id ? userId2 : userId1;
                    const otherUser = users.find(u => u.id === otherUserId);
                    
                    console.log('Chat creation details:', {
                        userId1,
                        userId2,
                        otherUserId,
                        otherUser: !!otherUser,
                        currentUserId: currentUser.id
                    });
                    
                    if (otherUser) {
                        const participantNames = {
                            [currentUser.id]: currentUser.name,
                            [otherUser.id]: otherUser.name
                        };
                        
                        console.log('Creating chat with:', { chatId, participantNames });
                        
                        // Create chat immediately
                        createIndividualChat(chatId as string, [currentUser.id, otherUser.id], participantNames);
                    } else {
                        console.log('Other user not found!');
                    }
                } else {
                    console.log('ChatId does not include underscore');
                }
            } else {
                console.log('Conditions not met for chat creation');
            }
        };

        // Small delay to ensure all contexts are loaded
        const timer = setTimeout(createChatIfNeeded, 100);
        return () => clearTimeout(timer);
    }, [chatId, currentUser?.id, users.length]);

    // Check if we're still loading or if this is a valid chat scenario
    const isValidChatScenario = () => {
        // If chat exists, it's valid
        if (currentChat) return true;
        
        // If missing basic requirements, invalid
        if (!chatId || !currentUser) return false;
        
        // If users are still loading, assume valid (show loading)
        if (users.length === 0) return true;
        
        // For new chat format, check if other user exists
        if ((chatId as string).includes('_')) {
            const parts = (chatId as string).split('_');
            if (parts.length >= 3) {
                // Handle format: chat_user_timestamp_admin_001
                // Split into: ["chat", "user", "timestamp", "admin", "001"]
                // We need to reconstruct: userId1 = "user_timestamp", userId2 = "admin_001"
                let userId1, userId2;
                if (parts.length === 3) {
                    [, userId1, userId2] = parts;
                } else if (parts.length === 5) {
                    // Format: chat_user_timestamp_admin_001
                    userId1 = `${parts[1]}_${parts[2]}`; // "user_timestamp"
                    userId2 = `${parts[3]}_${parts[4]}`; // "admin_001"
                } else {
                    // Fallback: assume last two parts are the user IDs
                    userId1 = parts.slice(1, -1).join('_');
                    userId2 = parts[parts.length - 1];
                }
                
                const otherUserId = userId1 === currentUser.id ? userId2 : userId1;
                console.log('Validation check:', { userId1, userId2, currentUserId: currentUser.id, otherUserId });
                
                // Check if other user exists in users list
                const otherUserExists = users.some(u => u.id === otherUserId);
                console.log('Other user exists:', otherUserExists, 'Available users:', users.map(u => u.id));
                
                return otherUserExists;
            }
        }
        
        // Default to valid to show loading instead of error
        return true;
    };

    // Debug info - temporary to fix issue
    console.log('Chat Screen Debug:', {
        chatId,
        currentUserId: currentUser?.id,
        currentChat: !!currentChat,
        totalChats: chats.length,
        chatIds: chats.map(c => c.id),
        usersLength: users.length,
        isValidScenario: isValidChatScenario()
    });

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Mark messages as read when entering chat
        if (currentUser && chatId) {
            markMessagesAsRead(chatId as string, currentUser.id);
        }
    }, [chatId, currentUser]);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [chatMessages.length]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !chatId) return;

        await sendMessage(
            chatId as string,
            messageText.trim(),
            'text',
            replyToMessage?.id,
            currentUser
        );

        setMessageText('');
        setReplyToMessage(null);
        setIsTyping(false);
        
        if (currentUser) {
            setTyping(chatId as string, currentUser.id, currentUser.name, false);
        }
    };

    const handleTyping = (text: string) => {
        setMessageText(text);
        
        if (!isTyping && text.length > 0 && currentUser && chatId) {
            setIsTyping(true);
            setTyping(chatId as string, currentUser.id, currentUser.name, true);
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            if (currentUser && chatId) {
                setTyping(chatId as string, currentUser.id, currentUser.name, false);
            }
        }, 2000);
    };

    const handleMessageLongPress = (message: Message) => {
        setSelectedMessage(message.id);
        
        Alert.alert(
            'Message Options',
            '',
            [
                { text: 'Reply', onPress: () => setReplyToMessage(message) },
                { text: 'React', onPress: () => setShowReactions(message.id) },
                ...(message.senderId === currentUser?.id ? [
                    { text: 'Edit', onPress: () => handleEditMessage(message) },
                    { text: 'Delete', onPress: () => handleDeleteMessage(message), style: 'destructive' as const }
                ] : []),
                { text: 'Cancel', style: 'cancel' as const }
            ]
        );
    };

    const handleEditMessage = (message: Message) => {
        setMessageText(message.content);
        setSelectedMessage(message.id);
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
                    onPress: () => deleteMessage(chatId as string, message.id)
                }
            ]
        );
    };

    const handleReaction = (messageId: string, reaction: string) => {
        if (currentUser) {
            addReaction(messageId, currentUser.id, reaction);
        }
        setShowReactions(null);
    };

    const getMessageStatus = (message: Message) => {
        switch (message.status) {
            case 'sending': return '⏳';
            case 'sent': return '✓';
            case 'delivered': return '✓✓';
            case 'read': return '✓✓';
            default: return '';
        }
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    const isOnline = (userId: string) => onlineUsers.includes(userId);

    if (!isValidChatScenario()) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Chat not found</Text>
            </SafeAreaView>
        );
    }

    if (!currentChat) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading chat...</Text>
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
                {/* Header */}
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={tw`p-4 shadow-xl`}
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
                                    {currentChat.type === 'group' ? currentChat.name : 
                                     Object.values(currentChat.participantNames).find(name => name !== currentUser?.name)}
                                </Text>
                                <View style={tw`flex-row items-center`}>
                                    {currentChat.type === 'individual' && (
                                        <>
                                            <View style={tw`w-2 h-2 rounded-full mr-2 ${
                                                isOnline(currentChat.participants.find(p => p !== currentUser?.id) || '') 
                                                    ? 'bg-green-400' : 'bg-gray-400'
                                            }`} />
                                            <Text style={tw`text-blue-100 text-sm`}>
                                                {isOnline(currentChat.participants.find(p => p !== currentUser?.id) || '') 
                                                    ? 'Online' : 'Last seen recently'}
                                            </Text>
                                        </>
                                    )}
                                    {currentChat.type === 'group' && (
                                        <Text style={tw`text-blue-100 text-sm`}>
                                            {currentChat.participants.length} members
                                        </Text>
                                    )}
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
                                const isOwnMessage = message.senderId === currentUser?.id;
                                const showAvatar = !isOwnMessage && (
                                    index === 0 || 
                                    chatMessages[index - 1].senderId !== message.senderId
                                );

                                return (
                                    <View key={message.id} style={tw`mb-4`}>
                                        {/* Reply indicator */}
                                        {message.replyTo && (
                                            <View style={tw`${isOwnMessage ? 'items-end' : 'items-start'} mb-1`}>
                                                <View style={tw`bg-gray-200 rounded-lg p-2 max-w-xs`}>
                                                    <Text style={tw`text-gray-600 text-xs`}>
                                                        Replying to: {chatMessages.find(m => m.id === message.replyTo)?.content.substring(0, 30)}...
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        <View style={tw`flex-row ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                            {/* Avatar for group chats */}
                                            {showAvatar && currentChat.type === 'group' && (
                                                <View style={tw`w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-2`}>
                                                    <Text style={tw`text-white text-xs font-bold`}>
                                                        {message.senderName.charAt(0)}
                                                    </Text>
                                                </View>
                                            )}

                                            <TouchableOpacity
                                                onLongPress={() => handleMessageLongPress(message)}
                                                style={tw`max-w-xs`}
                                            >
                                                <View style={tw`${
                                                    isOwnMessage 
                                                        ? 'bg-blue-500 rounded-l-2xl rounded-tr-2xl' 
                                                        : 'bg-white rounded-r-2xl rounded-tl-2xl'
                                                } p-3 shadow-sm ${message.isDeleted ? 'opacity-50' : ''}`}>
                                                    
                                                    {/* Sender name for group chats */}
                                                    {!isOwnMessage && currentChat.type === 'group' && showAvatar && (
                                                        <Text style={tw`text-blue-600 text-xs font-semibold mb-1`}>
                                                            {message.senderName}
                                                        </Text>
                                                    )}

                                                    <Text style={tw`${
                                                        isOwnMessage ? 'text-white' : 'text-gray-800'
                                                    } text-base ${message.isDeleted ? 'italic' : ''}`}>
                                                        {message.content}
                                                    </Text>

                                                    {message.isEdited && (
                                                        <Text style={tw`${
                                                            isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                                                        } text-xs mt-1`}>
                                                            edited
                                                        </Text>
                                                    )}

                                                    {/* Reactions */}
                                                    {message.reactions && Object.keys(message.reactions).length > 0 && (
                                                        <View style={tw`flex-row flex-wrap mt-2`}>
                                                            {Object.entries(message.reactions).map(([userId, reaction]) => (
                                                                <View key={userId} style={tw`bg-gray-100 rounded-full px-2 py-1 mr-1 mb-1`}>
                                                                    <Text style={tw`text-sm`}>{reaction}</Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    )}

                                                    <View style={tw`flex-row items-center justify-between mt-1`}>
                                                        <Text style={tw`${
                                                            isOwnMessage ? 'text-blue-200' : 'text-gray-500'
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
                                    Replying to {replyToMessage.senderName}
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
        </SafeAreaView>
    );
}
