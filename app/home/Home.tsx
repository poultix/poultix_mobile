import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';

interface Option {
    label: string;
    screen: string;
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
}

// Home components
const options: Option[] = [
    { label: 'Veterinary Help', screen: 'Veterinary', color: '#D1FAE5', icon: 'medkit-outline' },
    { label: 'Pharmacies', screen: 'Pharmacy', color: '#DBEAFE', icon: 'medkit' },
    { label: 'Health News', screen: 'News', color: '#FEF3C7', icon: 'newspaper-outline' },
    { label: 'Settings', screen: 'Settings', color: '#FCE7F3', icon: 'settings-outline' },
    { label: 'Farm', screen: 'Farm', color: '#EDE9FE', icon: 'paw-outline' },
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnims = options.map(() => useRef(new Animated.Value(0.8)).current);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            ...scaleAnims.map((anim, index) =>
                Animated.spring(anim, {
                    toValue: 1,
                    friction: 8,
                    tension: 60,
                    delay: index * 100,
                    useNativeDriver: true,
                })
            ),
        ]).start();
    }, []);

    const handleOptionPress = (screen: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate(screen as never);
    };

    return (
        <SafeAreaView style={tw`flex-1`}>
            <LinearGradient
                colors={['#fff', '#E5E7EB']}
                style={tw`flex-1`}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={tw`flex-1`}
                >
                    <Animated.View style={[tw`flex-1 px-6 pt-4`, { opacity: fadeAnim }]}>
                        <Text style={tw`text-4xl font-extrabold mt-12 mb-3 text-gray-900 tracking-tight`}>
                            Welcome 👋
                        </Text>
                        <Text style={tw`text-lg text-gray-500 mb-8 font-medium`}>
                            Explore our services
                        </Text>

                        <FlatList
                            data={options}
                            numColumns={2}
                            keyExtractor={(item) => item.label}
                            contentContainerStyle={tw`pb-24`}
                            columnWrapperStyle={tw`justify-between`}
                            renderItem={({ item, index }) => (
                                <Animated.View
                                    style={[
                                        tw`w-[48%] mb-5`,
                                        { transform: [{ scale: scaleAnims[index] }] },
                                    ]}
                                >
                                    <Pressable
                                        onPress={() => handleOptionPress(item.screen)}
                                        style={({ pressed }) => [
                                            tw`rounded-3xl p-6 items-center shadow-lg`,
                                            {
                                                backgroundColor: item.color,
                                                transform: [{ scale: pressed ? 0.95 : 1 }],
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 4 },
                                                shadowOpacity: 0.2,
                                                shadowRadius: 8,
                                                elevation: 5,
                                            },
                                        ]}
                                    >
                                        <View style={tw`bg-white p-4 rounded-full mb-5 shadow-sm`}>
                                            <Ionicons
                                                name={item.icon}
                                                size={30}
                                                color="#374151"
                                            />
                                        </View>
                                        <Text style={tw`text-base font-semibold text-gray-800 text-center tracking-wide`}>
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                </Animated.View>
                            )}
                        />
                    </Animated.View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default HomeScreen;