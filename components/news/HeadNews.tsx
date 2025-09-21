import { Image, Text, View } from "react-native";
import tw from "twrnc";

export default function StatusNews() {
    return (
        <View style={tw`flex flex-row relative items-center justify-center`}>
            <Image style={tw`w-70 h-50 rounded-2xl `} source={require('../../assets/images/chicken-farmer.webp')}></Image>
            <Text style={tw`font-semibold absolute bottom-0 text-white text-lg`}>
                1000 Chickens dedad in Kigali
            </Text>
        </View>
    )
}