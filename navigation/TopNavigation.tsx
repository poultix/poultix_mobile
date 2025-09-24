import { Alert, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { StatusBar } from "expo-status-bar";

const getScreenTitle = (pathname: string): string => {
    switch (pathname) {
        case '/':
            return 'Home';
        case '/farmer':
            return 'Farmer';
        case '/farm':
            return 'Farm';
        case '/ai':
            return 'AI Assistant';
        case '/pharmacies':
            return 'Pharmacies';
        case '/news':
            return 'News';
        case '/settings':
            return 'Settings';
        case '/veterinary':
            return 'Veterinary';
        case '/bluetooth-pairing':
            return 'Bluetooth';
        case '/ph-reader':
            return 'PH Reader';
        default:
            // Extract screen name from path
            const screenName = pathname.split('/').pop() || 'Screen';
            return screenName.charAt(0).toUpperCase() + screenName.slice(1);
    }
}

export default function TopNavigation() {
    const pathname = usePathname()
    
    const handleBack = () => {
        router.back()
    }

    const handleMenu = () => {
        // Menu functionality handled by parent component
        console.log('Menu pressed');
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
                    {getScreenTitle(pathname)}
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