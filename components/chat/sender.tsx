import { TouchableOpacity, View, TextInput, Image, ScrollView, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useChat } from "@/contexts/ChatContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageType } from "@/types";
import { useChatActions } from "@/hooks/useChatActions";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface AttachedFile {
    uri: string;
    type: 'image' | 'document';
    name: string;
    size?: number;
    mimeType?: string;
}

export default function ChatSender() {
    const { currentUser } = useAuth()
    const { editMessage, currentChat, setEditMessage } = useChat()
    const { sendMessage } = useChatActions()
    const [messageText, setMessageText] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    
    useEffect(() => {
        if (editMessage) {
            setMessageText(editMessage.content)
        }
    }, [editMessage])
    
    const handleSendMessage = async () => {
        if ((!messageText.trim() && attachedFiles.length === 0) || !currentChat || !currentUser) return;

        try {
            // Send text message if there's text content
            if (messageText.trim()) {
                await sendMessage(
                    messageText.trim(),
                    currentChat,
                    currentUser,
                    MessageType.TEXT
                );
            }

            // Send each attached file as separate messages
            for (const file of attachedFiles) {
                const messageType = getMessageTypeFromFile(file);
                const fileName = file.name || `file_${Date.now()}`;
                
                // TODO: Upload file to your server/storage and get URL
                const fileUrl = await uploadFile(file); // You'll implement this
                
                await sendMessage(
                    fileUrl,
                    currentChat,
                    currentUser,
                    messageType,
                );
            }

            // Clear form
            setMessageText('');
            setAttachedFiles([]);
            setEditMessage(null);
            setShowAttachMenu(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    };

    const getMessageTypeFromFile = (file: AttachedFile): MessageType => {
        if (file.type === 'image') return MessageType.IMAGE;
        
        const mimeType = file.mimeType?.toLowerCase() || '';
        if (mimeType.startsWith('audio/')) return MessageType.AUDIO;
        if (mimeType.startsWith('video/')) return MessageType.VIDEO;
        
        return MessageType.FILE;
    };

    // TODO: Implement your file upload logic here
    const uploadFile = async (file: AttachedFile): Promise<string> => {
        // This is a placeholder - replace with your actual upload logic
        // Example:
        // const formData = new FormData();
        // formData.append('file', {
        //     uri: file.uri,
        //     name: file.name,
        //     type: file.mimeType
        // } as any);
        // const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
        //     method: 'POST',
        //     body: formData,
        //     headers: { 'Content-Type': 'multipart/form-data' }
        // });
        // const result = await response.json();
        // return result.url;
        
        // For now, return the local URI (replace this with actual upload)
        return file.uri;
    };
    const handleEditMessage = async () => {
        if (!messageText.trim() || !currentChat || !currentUser || !editMessage) return;

        try {
            // TODO: Implement edit message functionality
            // const updatedMessage = { ...editMessage, content: messageText.trim() };
            // await updateMessage(updatedMessage);
            
            Alert.alert('Info', 'Message editing will be implemented soon');
            
            setMessageText('');
            setEditMessage(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to edit message. Please try again.');
        }
    };

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Please allow access to your photo library');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets) {
            const newFiles: AttachedFile[] = result.assets.map((asset, index) => ({
                uri: asset.uri,
                type: 'image' as const,
                name: `image_${Date.now()}_${index}.jpg`,
                size: asset.fileSize,
                mimeType: 'image/jpeg'
            }));
            setAttachedFiles([...attachedFiles, ...newFiles]);
            setShowAttachMenu(false);
        }
    };

    const handlePickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            multiple: true,
        });

        if (!result.canceled && result.assets) {
            const newFiles: AttachedFile[] = result.assets.map(asset => ({
                uri: asset.uri,
                type: 'document' as const,
                name: asset.name,
                size: asset.size || 0,
                mimeType: asset.mimeType || 'application/octet-stream'
            }));
            setAttachedFiles([...attachedFiles, ...newFiles]);
            setShowAttachMenu(false);
        }
    };

    const handleTakePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Please allow access to your camera');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]) {
            const asset = result.assets[0];
            const newFile: AttachedFile = {
                uri: asset.uri,
                type: 'image',
                name: `photo_${Date.now()}.jpg`,
                size: asset.fileSize,
                mimeType: 'image/jpeg'
            };
            setAttachedFiles([...attachedFiles, newFile]);
            setShowAttachMenu(false);
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '0 KB';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    return (
        <View className="bg-white border-t border-gray-200">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="px-4 pt-3 pb-2"
                >
                    {attachedFiles.map((file, index) => (
                        <View key={index} className="mr-3 relative">
                            {file.type === 'image' ? (
                                <View className="relative">
                                    <Image 
                                        source={{ uri: file.uri }} 
                                        className="w-20 h-20 rounded-lg"
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                        onPress={() => removeFile(index)}
                                    >
                                        <Ionicons name="close" size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="w-20 h-20 bg-gray-100 rounded-lg justify-center items-center relative">
                                    <Ionicons name="document-outline" size={28} color="#D97706" />
                                    <Text 
                                        className="text-xs text-gray-600 mt-1 text-center px-1" 
                                        numberOfLines={1}
                                        style={{ fontSize: 10 }}
                                    >
                                        {file.name}
                                    </Text>
                                    <Text className="text-gray-400" style={{ fontSize: 8 }}>
                                        {formatFileSize(file.size)}
                                    </Text>
                                    <TouchableOpacity
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                        onPress={() => removeFile(index)}
                                    >
                                        <Ionicons name="close" size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Attach Menu */}
            {showAttachMenu && (
                <View className="px-4 pb-3">
                    <View className="bg-gray-50 rounded-2xl p-3">
                        <TouchableOpacity 
                            className="flex-row items-center py-3 border-b border-gray-200"
                            onPress={handleTakePhoto}
                        >
                            <View className="bg-orange-100 p-2 rounded-full mr-3">
                                <Ionicons name="camera-outline" size={20} color="#D97706" />
                            </View>
                            <Text className="text-gray-800 font-medium">Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className="flex-row items-center py-3 border-b border-gray-200"
                            onPress={handlePickImage}
                        >
                            <View className="bg-orange-100 p-2 rounded-full mr-3">
                                <Ionicons name="image-outline" size={20} color="#D97706" />
                            </View>
                            <Text className="text-gray-800 font-medium">Photo Library</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className="flex-row items-center py-3"
                            onPress={handlePickDocument}
                        >
                            <View className="bg-orange-100 p-2 rounded-full mr-3">
                                <Ionicons name="document-outline" size={20} color="#D97706" />
                            </View>
                            <Text className="text-gray-800 font-medium">Document</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Message Input */}
            <View className="flex-row items-end p-4">
                <TouchableOpacity 
                    className="bg-orange-100 p-3 rounded-full mr-3"
                    onPress={() => setShowAttachMenu(!showAttachMenu)}
                >
                    <Ionicons 
                        name={showAttachMenu ? "close-outline" : "add-outline"} 
                        size={20} 
                        color="#D97706" 
                    />
                </TouchableOpacity>

                <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 mr-3">
                    <TextInput
                        className="text-gray-800 text-base"
                        style={{ maxHeight: 96 }}
                        placeholder={editMessage ? "Edit message..." : "Type a message..."}
                        placeholderTextColor="#6B7280"
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                    />
                </View>

                <TouchableOpacity
                    className="p-3 rounded-full"
                    style={{
                        backgroundColor: '#D97706',
                        opacity: (!messageText.trim() && attachedFiles.length === 0) ? 0.5 : 1
                    }}
                    onPress={editMessage ? handleEditMessage : handleSendMessage}
                    disabled={!messageText.trim() && attachedFiles.length === 0}
                >
                    <Ionicons 
                        name={editMessage ? "checkmark-outline" : "send-outline"} 
                        size={20} 
                        color="white" 
                    />
                </TouchableOpacity>
            </View>

            {/* Files Counter */}
            {attachedFiles.length > 0 && (
                <View className="px-4 pb-2">
                    <Text className="text-xs text-gray-500">
                        {attachedFiles.length} file{attachedFiles.length > 1 ? 's' : ''} attached • Tap send to upload
                    </Text>
                </View>
            )}
        </View>
    )
}