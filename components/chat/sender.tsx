import { TouchableOpacity, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

export default function ChatSender() {
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
    )
}