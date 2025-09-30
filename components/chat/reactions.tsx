import { TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc";

export default function ChatReactions() {
    const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡']
    return (
        <View style={tw`absolute bottom-20 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg`}>
            <View style={tw`flex-row justify-around`}>
                {reactions.map(reaction => (
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
    )
}