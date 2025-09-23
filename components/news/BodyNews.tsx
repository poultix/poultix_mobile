import { Image, Text, View } from "react-native";
import tw from "twrnc";

export default function NewsComponent() {
    return (
        <View style={tw`flex flex-col gap-y-2`}>
            <View style={tw`flex flex-col gap-y-1`}>
                <View style={tw`flex flex-row gap-x-2`}>
                    <Text style={tw`font-semibold text-blue-700`}>BTN Tv  </Text>
                    <Text style={tw`font-semibold`}>1d ago </Text>
                </View>
                <Text style={tw`font-semibold`}>New disease outbreak in Muhanga</Text>
            </View>
            <View style={tw`flex items-center justify-center rounded-lg`}>
               <Image style={tw`w-full h-50 rounded-2xl`} source={require('../../assets/images/chicken.webp')}></Image>
            </View>
        </View>
    )
}