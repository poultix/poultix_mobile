import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
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
        route: '/chat',
        color: '#10B981'
    },
    {
        key: 'news',
        label: 'News',
        icon: 'newspaper-outline',
        activeIcon: 'newspaper',
        route: '/general/news',
        color: '#EF4444'
    },
    {
        key: 'profile',
        label: 'Profile',
        icon: 'person-outline',
        activeIcon: 'person',
        route: '/user/profile',
        color: '#8B5CF6'
    }
];

interface BottomTabsProps {
    style?: any;
}

export default function BottomTabs({ style }: BottomTabsProps) {
    const { currentUser } = useAuth();
    const pathname = usePathname();

    const handleTabPress = (tab: TabItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Handle different routing based on tab
        switch (tab.key) {
            case 'home':
                if (currentUser?.role === UserRole.ADMIN) {
                    router.push('/dashboard/admin-dashboard');
                } else if (currentUser?.role === UserRole.VETERINARY) {
                    router.push('/dashboard/veterinary-dashboard');
                } else {
                    router.push('/dashboard/farmer-dashboard');
                }
                break;
            case 'chat':
                router.push('/chat');
                break;
            case 'news':
                router.push('/general/news');
                break;
            case 'profile':
                router.push('/user/profile');
                break;
            default:
                break
        }
    };

    const isTabActive = (tabKey: string) => {
        // Determine active tab based on current pathname
        if (pathname.includes('/dashboard') || pathname === '/') return tabKey === 'home';
        if (pathname.includes('/communication/messages') || pathname.includes('/user/directory') || pathname === '/chat') return tabKey === 'chat';
        if (pathname.includes('/general/news') || pathname === '/news') return tabKey === 'news';
        if (pathname.includes('/user/profile') || pathname.includes('/settings/')) return tabKey === 'profile';
        return false; // No default active tab, rely on pathname detection
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

// Additional Expo Router hooks you can use for route detection:
// import { usePathname, useSegments, useRouter } from 'expo-router';
//
// const pathname = usePathname(); // Current path like '/farm/index' or '/chat'
// const segments = useSegments(); // Array of route segments like ['farm', 'index']
// const router = useRouter(); // Router object with methods like push(), back(), etc.
//
// Example usage:
// const currentTab = useMemo(() => {
//   if (pathname.startsWith('/farm')) return 'farms';
//   if (pathname.startsWith('/chat')) return 'chat';
//   if (pathname.startsWith('/dashboard') || pathname === '/') return 'home';
//   if (pathname.startsWith('/user') || pathname.startsWith('/settings')) return 'more';
//   return 'home';
// }, [pathname]);
