import { TouchableOpacity, View, TextInput, Image, ScrollView, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
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
        if (!messageText.trim() || !currentChat || !currentUser) return;

        await sendMessage(
            messageText.trim(),
            currentChat,
            currentUser,
            MessageType.TEXT
        );

        setMessageText('');
        setEditMessage(null);
    };
    const handleEditMessage = async () => {
        if (!messageText.trim() || !currentChat || !currentUser) return;

        const newMessage = { ...editMessage, content: messageText.trim() }

        // await editMessage(newMessage)

        setMessageText('');
        setEditMessage(null);
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
        <View style={tw`bg-white border-t border-gray-200`}>
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={tw`px-4 pt-3 pb-2`}
                >
                    {attachedFiles.map((file, index) => (
                        <View key={index} style={tw`mr-3 relative`}>
                            {file.type === 'image' ? (
                                <View style={tw`relative`}>
                                    <Image 
                                        source={{ uri: file.uri }} 
                                        style={tw`w-20 h-20 rounded-lg`}
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full p-1`}
                                        onPress={() => removeFile(index)}
                                    >
                                        <Ionicons name="close" size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={tw`w-20 h-20 bg-gray-100 rounded-lg justify-center items-center relative`}>
                                    <Ionicons name="document-outline" size={32} color="#3B82F6" />
                                    <Text style={tw`text-[10px] text-gray-600 mt-1 text-center px-1`} numberOfLines={1}>
                                        {file.name}
                                    </Text>
                                    <Text style={tw`text-[8px] text-gray-400`}>
                                        {formatFileSize(file.size)}
                                    </Text>
                                    <TouchableOpacity
                                        style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full p-1`}
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
                <View style={tw`px-4 pb-3`}>
                    <View style={tw`bg-gray-50 rounded-2xl p-3`}>
                        <TouchableOpacity 
                            style={tw`flex-row items-center py-3 border-b border-gray-200`}
                            onPress={handleTakePhoto}
                        >
                            <View style={tw`bg-blue-100 p-2 rounded-full mr-3`}>
                                <Ionicons name="camera-outline" size={20} color="#3B82F6" />
                            </View>
                            <Text style={tw`text-gray-800 font-medium`}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={tw`flex-row items-center py-3 border-b border-gray-200`}
                            onPress={handlePickImage}
                        >
                            <View style={tw`bg-purple-100 p-2 rounded-full mr-3`}>
                                <Ionicons name="image-outline" size={20} color="#9333EA" />
                            </View>
                            <Text style={tw`text-gray-800 font-medium`}>Photo Library</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={tw`flex-row items-center py-3`}
                            onPress={handlePickDocument}
                        >
                            <View style={tw`bg-green-100 p-2 rounded-full mr-3`}>
                                <Ionicons name="document-outline" size={20} color="#16A34A" />
                            </View>
                            <Text style={tw`text-gray-800 font-medium`}>Document</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Message Input */}
            <View style={tw`flex-row items-end p-4`}>
                <TouchableOpacity 
                    style={tw`bg-blue-100 p-3 rounded-full mr-3`}
                    onPress={() => setShowAttachMenu(!showAttachMenu)}
                >
                    <Ionicons 
                        name={showAttachMenu ? "close-outline" : "add-outline"} 
                        size={20} 
                        color="#3B82F6" 
                    />
                </TouchableOpacity>

                <View style={tw`flex-1 bg-gray-100 rounded-2xl px-4 py-2 mr-3`}>
                    <TextInput
                        style={tw`text-gray-800 text-base max-h-24`}
                        placeholder="Type a message..."
                        placeholderTextColor="#6B7280"
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                    />
                </View>

                <TouchableOpacity
                    style={tw`bg-blue-500 p-3 rounded-full ${(!messageText.trim() && attachedFiles.length === 0) ? 'opacity-50' : ''}`}
                    onPress={editMessage ? handleEditMessage : handleSendMessage}
                    disabled={!messageText.trim() && attachedFiles.length === 0}
                >
                    <Ionicons name="send-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Files Counter */}
            {attachedFiles.length > 0 && (
                <View style={tw`px-4 pb-2`}>
                    <Text style={tw`text-xs text-gray-500`}>
                        {attachedFiles.length} file{attachedFiles.length > 1 ? 's' : ''} attached
                    </Text>
                </View>
            )}
        </View>
    )
}