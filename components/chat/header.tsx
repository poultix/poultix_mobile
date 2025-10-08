import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { router } from "expo-router";
import { useChat } from "@/contexts/ChatContext";
import DrawerButton from "../DrawerButton";

export default function ChatHeader() {
    const { currentChat, onlineUsers } = useChat()

    const isOnline = (userId: string) => onlineUsers.has(userId);

    const formatTime=(time: string)=>{
        const date=new Date(time)
        return date.toLocaleTimeString()
    }

    return (
        <LinearGradient
            colors={['#F59E0B', '#D97706']}
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
                            {currentChat?.name || 'Chat'}
                        </Text>
                        <View style={tw`flex-row items-center`}>
                            <View style={tw`w-2 h-2 rounded-full mr-2 ${isOnline(currentChat?.id || '')
                                ? 'bg-green-400' : 'bg-gray-400'
                                }`} />
                            <Text style={tw`text-blue-100 text-sm`}>
                                {isOnline(currentChat?.id || '')
                                    ? 'Online' :'Last seen'+ formatTime(currentChat?.createdAt || '')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-2`}>
                        <Ionicons name="call-outline" size={20} color="white" />
                    </TouchableOpacity>
                    <DrawerButton />
                </View>
            </View>
        </LinearGradient>
    )
}