import { TouchableOpacity, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useChat } from "@/contexts/ChatContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageType } from "@/types";
import { useChatActions } from "@/hooks/useChatActions";

export default function ChatSender() {
    const { currentUser } = useAuth()
    const { editMessage, currentChat, setEditMessage } = useChat()
    const { sendMessage } = useChatActions()
    const [messageText, setMessageText] = useState('');
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
    return (
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
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                    />
                </View>

                <TouchableOpacity
                    style={tw`bg-blue-500 p-3 rounded-full ${!messageText.trim() ? 'opacity-50' : ''}`}
                    onPress={editMessage ? handleEditMessage : handleSendMessage}
                    disabled={!messageText.trim()}
                >
                    <Ionicons name="send-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}