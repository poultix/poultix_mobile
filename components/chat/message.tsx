import { Message, MessageStatus } from "@/types";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import tw from 'twrnc';
import { useState } from "react";
import { useChatActions } from "@/hooks/useChatActions";
import { useChat } from "@/contexts/ChatContext";

interface ChatMProp {
    message: Message,
    chatMessages: Message[]
}

export default function ChatMessage({ message, chatMessages }: ChatMProp) {
    const { currentUser } = useAuth();
    const isOwnMessage = message.sender.id === currentUser?.id;
    const { setCurrentMessage, currentMessage, setEditMessage } = useChat()
    const { removeMessage } = useChatActions()
    const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [showReactions, setShowReactions] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    const handleMessageLongPress = (message: Message) => {
        setSelectedMessage(message.id.toString());
        setCurrentMessage(message)

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
        setEditMessage(message)
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
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
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
}