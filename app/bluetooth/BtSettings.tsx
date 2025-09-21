import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/interfaces/Navigation';

export default function BluetoothSettingsScreen() {
    const router = useNavigation<NavigationProps>()
    const { deviceId } = useLocalSearchParams();

    // Animation states
    const [fadeAnim] = React.useState(new Animated.Value(0));
    const [scaleAnim] = React.useState(new Animated.Value(0.95));
    const [buttonScale] = React.useState(new Animated.Value(1));

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleAddDevice = () => {
        console.log('Add device');
    };

    const handleExit = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            friction: 4,
            useNativeDriver: true,
        }).start(() => {
            buttonScale.setValue(1);
            router.goBack();
        });
    };

    const handleRenameDevice = () => {
        console.log('Rename device');
    };

    const handleRemoveDevice = () => {
        console.log('Remove device');
    };

    const handleDisconnect = () => {
        console.log('Disconnect device');
        router.goBack();
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar style="dark" translucent />
            <Animated.View
                style={[
                    tw`flex-1 px-6 pt-8 pb-16 relative`,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                ]}
            >
                {/* Subtle Background Accent */}
                <View style={tw`absolute top-0 left-0 right-0 h-1/4 bg-gray-50 rounded-b-3xl opacity-20 shadow-sm`} />

                {/* Header */}
                <Text style={tw`text-3xl font-semibold text-gray-900 mb-6 tracking-wide`}>
                    Bluetooth
                </Text>

                {/* Device Info */}
                <View style={tw`flex-row items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-md border border-gray-100`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`w-7 h-7 bg-red-600 rounded-full mr-3 shadow-sm`} />
                        <Text style={tw`text-gray-900 text-base font-medium tracking-wide`}>
                            {deviceId || 'Device12'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleDisconnect}
                        style={tw`bg-yellow-600 rounded-lg px-3 py-1.5 shadow-sm`}
                    >
                        <Text style={tw`text-white text-sm font-semibold tracking-wide`}>Disconnect</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings Card */}
                <View style={tw`bg-white rounded-2xl p-4 mb-8 shadow-lg border border-gray-100`}>
                    <TouchableOpacity
                        onPress={handleAddDevice}
                        style={tw`flex-row items-center justify-between py-2.5 border-b border-gray-200/40`}
                    >
                        <Text style={tw`text-gray-900 text-base font-medium tracking-wide`}>
                            Add Device
                        </Text>
                        <Ionicons name="add-circle" size={24} color="#red-600" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleRenameDevice}
                        style={tw`flex-row items-center justify-between py-2.5 border-b border-gray-200/40`}
                    >
                        <Text style={tw`text-gray-900 text-base font-medium tracking-wide`}>
                            Rename
                        </Text>
                        <Ionicons name="create" size={24} color="#red-600" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleRemoveDevice}
                        style={tw`flex-row items-center justify-between py-2.5 border-b border-gray-200/40`}
                    >
                        <Text style={tw`text-gray-900 text-base font-medium tracking-wide`}>
                            Remove
                        </Text>
                        <Ionicons name="trash" size={24} color="#red-600" />
                    </TouchableOpacity>

                    <View style={tw`flex-row items-center justify-between py-2.5 border-b border-gray-200/40`}>
                        <Text style={tw`text-gray-900 text-base font-medium tracking-wide`}>
                            Signal
                        </Text>
                        <Ionicons name="wifi" size={24} color="#yellow-600" />
                    </View>

                    <View style={tw`flex-row items-center justify-between py-2.5`}>
                        <Text style={tw`text-gray-900 text-base font-medium tracking-wide`}>
                            Battery
                        </Text>
                        <Ionicons name="battery-half" size={24} color="#yellow-600" />
                    </View>
                </View>

                {/* Exit Button */}
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        onPress={handleExit}
                        style={tw`w-44 bg-red-600 rounded-full py-3 items-center shadow-xl self-center`}
                    >
                        <Text style={tw`text-white text-base font-semibold tracking-widest`}>
                            Exit
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

          
            </Animated.View>
        </SafeAreaView>
    );
}
