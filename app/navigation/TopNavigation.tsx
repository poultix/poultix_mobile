import { Alert, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/interfaces/Navigation";
import { StatusBar } from "expo-status-bar";

export default function TopNavigation() {
    const router = useNavigation<NavigationProps>()
    const route = useRoute()
    const handleBack = () => {
        router.goBack()
    }

    const handleMenu = () => {
        try {
            router.toggleDrawer();
        } catch (error) {
            console.error('Error toggling drawer:', error);
            Alert.alert('Navigation Error', 'Unable to open menu.');
        }
    }

    return (
        <View style={tw`fixed top-0 left-0 bg-white/95 p-5 pt-0`}>
            <StatusBar style="dark" translucent={false} />
            <View style={tw`flex-row justify-between items-center `}>

                {/* Back Button (Top-Left, Small) */}
                <TouchableOpacity
                    onPress={handleBack}
                    style={tw`items-center bg-orange-600  rounded-full p-2 shadow-xl`}
                >
                    <Ionicons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>
                <Text style={tw`font-bold text-2xl`}>
                    {route.name}
                </Text>
                <TouchableOpacity
                    onPress={handleMenu}
                    style={tw`items-center   rounded-full `}
                >
                    <Ionicons name="menu" size={25} color="black" />
                </TouchableOpacity>

            </View>
        </View>
    )
}