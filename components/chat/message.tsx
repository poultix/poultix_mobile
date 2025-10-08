import { Message, MessageStatus, MessageType } from "@/types";
import { View, Text, TouchableOpacity, Alert, Image, Dimensions, Linking } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useChatActions } from "@/hooks/useChatActions";
import { useChat } from "@/contexts/ChatContext";
import { Ionicons } from "@expo/vector-icons";

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
            case MessageStatus.SENDING: return <Ionicons name="time-outline" size={12} color={isOwnMessage ? "#FED7AA" : "#9CA3AF"} />;
            case MessageStatus.DELIVERED: return <Ionicons name="checkmark-done-outline" size={12} color={isOwnMessage ? "#FED7AA" : "#9CA3AF"} />;
            case MessageStatus.READ: return <Ionicons name="checkmark-done-outline" size={12} color="#10B981" />;
            case MessageStatus.FAILED: return <Ionicons name="close-circle-outline" size={12} color="#EF4444" />;
            default: return <Ionicons name="checkmark-outline" size={12} color={isOwnMessage ? "#FED7AA" : "#9CA3AF"} />;
        }
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf': return 'document-text-outline';
            case 'doc': case 'docx': return 'document-outline';
            case 'xls': case 'xlsx': return 'grid-outline';
            case 'ppt': case 'pptx': return 'easel-outline';
            case 'jpg': case 'jpeg': case 'png': case 'gif': return 'image-outline';
            case 'mp4': case 'mov': case 'avi': return 'videocam-outline';
            case 'mp3': case 'wav': case 'aac': return 'musical-notes-outline';
            default: return 'attach-outline';
        }
    };

    const getFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFilePress = async (fileUrl: string, fileName: string) => {
        try {
            const supported = await Linking.canOpenURL(fileUrl);
            if (supported) {
                await Linking.openURL(fileUrl);
            } else {
                Alert.alert('Error', 'Cannot open this file type');
            }
        } catch {
            Alert.alert('Error', 'Failed to open file');
        }
    };

    const isImageFile = (fileName: string) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extension = fileName.split('.').pop()?.toLowerCase();
        return imageExtensions.includes(extension || '');
    };

    const getFileNameFromUrl = (url: string) => {
        return url.split('/').pop() || 'Unknown file';
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    };

    const renderMessageContent = () => {
        switch (message.type) {
            case MessageType.TEXT:
                return (
                    <Text className={`${isOwnMessage ? 'text-white' : 'text-gray-800'} text-base leading-5`}>
                        {message.content}
                    </Text>
                );

            case MessageType.IMAGE:
                return (
                    <TouchableOpacity 
                        onPress={() => handleFilePress(message.content, getFileNameFromUrl(message.content))}
                        className="rounded-xl overflow-hidden mb-2"
                    >
                        <Image 
                            source={{ uri: message.content }}
                            style={{ 
                                width: imageMaxWidth - 24, 
                                height: 200,
                                borderRadius: 12
                            }}
                            resizeMode="cover"
                        />
                        <View className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                            <Ionicons name="expand-outline" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                );

            case MessageType.FILE:
            case MessageType.AUDIO:
            case MessageType.VIDEO:
                const fileName = message.fileName || getFileNameFromUrl(message.content);
                let fileIcon = 'attach-outline';
                
                if (message.type === MessageType.AUDIO) {
                    fileIcon = 'musical-notes-outline';
                } else if (message.type === MessageType.VIDEO) {
                    fileIcon = 'videocam-outline';
                } else {
                    fileIcon = getFileIcon(fileName);
                }

                return (
                    <TouchableOpacity 
                        onPress={() => handleFilePress(message.content, fileName)}
                        className={`${
                            isOwnMessage ? 'bg-orange-100' : 'bg-gray-100'
                        } rounded-xl p-3 flex-row items-center mb-2`}
                    >
                        <View 
                            className="w-12 h-12 rounded-full items-center justify-center mr-3"
                            style={{
                                backgroundColor: isOwnMessage ? '#FED7AA' : '#F3F4F6'
                            }}
                        >
                            <Ionicons 
                                name={fileIcon as any} 
                                size={22} 
                                color={isOwnMessage ? '#D97706' : '#6B7280'} 
                            />
                        </View>
                        <View className="flex-1">
                            <Text 
                                className={`${
                                    isOwnMessage ? 'text-orange-800' : 'text-gray-800'
                                } font-medium text-sm`}
                                numberOfLines={1}
                            >
                                {fileName}
                            </Text>
                            <Text 
                                className={`${
                                    isOwnMessage ? 'text-orange-600' : 'text-gray-500'
                                } text-xs mt-1`}
                            >
                                {message.type === MessageType.AUDIO ? 'Audio File' : 
                                 message.type === MessageType.VIDEO ? 'Video File' : 'Document'}
                            </Text>
                        </View>
                        <Ionicons 
                            name={message.type === MessageType.AUDIO ? "play-outline" : 
                                  message.type === MessageType.VIDEO ? "play-circle-outline" : "download-outline"} 
                            size={18} 
                            color={isOwnMessage ? '#D97706' : '#6B7280'} 
                        />
                    </TouchableOpacity>
                );

            default:
                // Fallback: treat as text but check if it's a URL
                if (isValidUrl(message.content)) {
                    return (
                        <TouchableOpacity onPress={() => handleFilePress(message.content, 'Link')}>
                            <Text className={`${isOwnMessage ? 'text-white' : 'text-blue-600'} text-base leading-5 underline`}>
                                {message.content}
                            </Text>
                        </TouchableOpacity>
                    );
                } else {
                    return (
                        <Text className={`${isOwnMessage ? 'text-white' : 'text-gray-800'} text-base leading-5`}>
                            {message.content}
                        </Text>
                    );
                }
        }
    };

    const screenWidth = Dimensions.get('window').width;
    const imageMaxWidth = screenWidth * 0.7;

    return (
        <View key={message.id} className="mb-4">
            {/* Reply indicator */}
            {message.replyTo && (
                <View className={`${isOwnMessage ? 'items-end' : 'items-start'} mb-1`}>
                    <View className="bg-gray-200 rounded-lg p-2 max-w-xs">
                        <View className="flex-row items-center mb-1">
                            <Ionicons name="return-down-forward-outline" size={12} color="#6B7280" />
                            <Text className="text-gray-600 text-xs ml-1 font-medium">
                                Replying to
                            </Text>
                        </View>
                        {message.replyTo && (
                            <Text className="text-gray-600 text-xs">
                                {chatMessages.find(m => m.id === message?.replyTo?.id)?.content.substring(0, 30)}...
                            </Text>
                        )}
                    </View>
                </View>
            )}

            <View className={`flex-row ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <TouchableOpacity
                    onLongPress={() => handleMessageLongPress(message)}
                    className="max-w-xs"
                    style={{ maxWidth: imageMaxWidth }}
                >
                    <View 
                        className={`${isOwnMessage
                            ? 'rounded-l-2xl rounded-tr-2xl'
                            : 'bg-white rounded-r-2xl rounded-tl-2xl'
                        } p-3 shadow-sm`}
                        style={{
                            backgroundColor: isOwnMessage ? '#F59E0B' : '#FFFFFF',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2
                        }}
                    >
                        {/* Message Content - Smart rendering based on type */}
                        {message.content && renderMessageContent()}

                        {message.edited && (
                            <View className="flex-row items-center mt-1">
                                <Ionicons 
                                    name="create-outline" 
                                    size={10} 
                                    color={isOwnMessage ? '#FED7AA' : '#9CA3AF'} 
                                />
                                <Text className={`${isOwnMessage ? 'text-orange-200' : 'text-gray-500'} text-xs ml-1`}>
                                    edited
                                </Text>
                            </View>
                        )}

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                                {message.reactions.map((reaction, idx) => (
                                    <View 
                                        key={idx} 
                                        className="rounded-full px-2 py-1 mr-1 mb-1"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                                    >
                                        <Text className="text-sm">{reaction.emoji}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View className="flex-row items-center justify-between mt-2">
                            <Text className={`${isOwnMessage ? 'text-orange-200' : 'text-gray-500'} text-xs`}>
                                {formatTime(message.timestamp)}
                            </Text>

                            {isOwnMessage && (
                                <View style={{ marginLeft: 8 }}>
                                    {getMessageStatus(message)}
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}