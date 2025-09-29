import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface TabItem {
    key: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
    route: string;
    color: string;
}

const tabItems: TabItem[] = [
    {
        key: 'home',
        label: 'Home',
        icon: 'home-outline',
        activeIcon: 'home',
        route: '/',
        color: '#3B82F6'
    },
    {
        key: 'chat',
        label: 'Chat',
        icon: 'chatbubbles-outline',
        activeIcon: 'chatbubbles',
        route: '/user/directory',
        color: '#10B981'
    },
    {
        key: 'farms',
        label: 'Farms',
        icon: 'leaf-outline',
        activeIcon: 'leaf',
        route: '/farm',
        color: '#F59E0B'
    },
    {
        key: 'more',
        label: 'More',
        icon: 'menu-outline',
        activeIcon: 'menu',
        route: '/user/profile',
        color: '#8B5CF6'
    }
];

interface BottomTabsProps {
    currentRoute?: string;
    style?: any;
}

export default function BottomTabs({ currentRoute, style }: BottomTabsProps) {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('home');

    const handleTabPress = (tab: TabItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveTab(tab.key);

        // Handle different routing based on tab
        switch (tab.key) {
            case 'home':
                // Route to appropriate dashboard based on user role
                if (currentUser?.role === UserRole.ADMIN) {
                    router.push('/dashboard/admin-dashboard');
                } else if (currentUser?.role === UserRole.VETERINARY) {
                    router.push('/dashboard/veterinary-dashboard');
                } else {
                    router.push('/dashboard/farmer-dashboard');
                }
                break;
            case 'chat':
                router.push('/communication/messages');
                break;
            case 'farms':
                router.push('/farm');
                break;
            case 'more':
                router.push('/user/profile');
                break;
            default:
                break
        }
    };

    const isTabActive = (tabKey: string) => {
        if (currentRoute) {
            // Determine active tab based on current route
            if (currentRoute.includes('/dashboard') || currentRoute === '/') return tabKey === 'home';
            if (currentRoute.includes('/communication/messages') || currentRoute.includes('/user/directory')) return tabKey === 'chat';
            if (currentRoute.includes('/farm/')) return tabKey === 'farms';
            if (currentRoute.includes('/user/profile') || currentRoute.includes('/settings/')) return tabKey === 'more';
        }
        return activeTab === tabKey;
    };

    return (
        <View style={[tw`absolute bottom-0 bg-white left-0 right-0 shadow-xl`, style]}>
            <View style={tw`bg-white border-t border-gray-200 px-2 py-2 pb-10`}>
                <View style={tw`flex-row justify-around items-center`}>
                    {tabItems.map((tab) => {
                        const isActive = isTabActive(tab.key);

                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={tw`flex-1 items-center justify-center py-2 px-1`}
                                onPress={() => handleTabPress(tab)}
                                activeOpacity={0.7}
                            >
                                <View style={tw`items-center justify-center ${isActive ? 'bg-orange-50' : ''} rounded-xl px-4 py-2`}>
                                    <Ionicons
                                        name={isActive ? tab.activeIcon : tab.icon}
                                        size={24}
                                        color={isActive ? '#F59E0B' : '#F59E0B'}
                                    />
                                    <Text style={tw`text-xs font-semibold mt-1 ${isActive
                                            ? 'text-orange-600'
                                            : 'text-gray-500'
                                        }`}>
                                        {tab.label}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

// Hook to easily use BottomTabs in screens
export function useBottomTabs() {
    return {
        BottomTabs,
        tabHeight: 85, // Height to add padding to screen content
    };
}
