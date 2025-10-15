import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, usePathname } from 'expo-router';
import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';
import { getRoleTheme } from '@/utils/theme';
import { i18n } from '../services/i18n/i18n';

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
        label: i18n.navigation('dashboard') || 'Dashboard',
        icon: 'home-outline',
        activeIcon: 'home',
        route: '/',
        color: '#3B82F6'
    },
    {
        key: 'explore',
        label: i18n.navigation('exploreApp') || 'Explore',
        icon: 'compass-outline',
        activeIcon: 'compass',
        route: '/search',
        color: '#10B981'
    },
    {
        key: 'ai',
        label: i18n.navigation('aiAssistant') || 'AI Assistant',
        icon: 'bulb-outline',
        activeIcon: 'bulb',
        route: '/ai/ai',
        color: '#8B5CF6'
    },
    {
        key: 'settings',
        label: i18n.common('settings') || 'Settings',
        icon: 'settings-outline',
        activeIcon: 'settings',
        route: '/settings',
        color: '#8B5CF6'
    },
    {
        key:'profile',
        label:i18n.common('profile')||'Profile',
        icon:'person-outline',
        activeIcon:'person',
        route:'/user/profile',
        color:'#8B5CF6'
    }
];

interface BottomTabsProps {
    style?: any;
}

export default function BottomTabs({ style }: BottomTabsProps) {
    const { currentUser } = useAuth();
    const pathname = usePathname();
    const theme = getRoleTheme(currentUser?.role);

    const handleTabPress = (tab: TabItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Handle different routing based on tab
        switch (tab.key) {
            case 'home':
                if (currentUser?.role === UserRole.ADMIN) {
                    router.push('/dashboard/admin-dashboard');
                } else if (currentUser?.role === UserRole.VETERINARY) {
                    router.push('/dashboard/veterinary-dashboard');
                } else if(currentUser?.role==='PHARMACY') {
                    router.push('/dashboard/pharmacy-dashboard');
                }else {
                    router.push('/dashboard/farmer-dashboard');
                }
                break;
            case 'explore':
                router.push('/search');
                break;
            case 'ai':
                router.push('/ai/ai');
                break;
            case 'settings':
                router.push('/settings');
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
        if (pathname.includes('/search') || pathname.includes('/explore')) return tabKey === 'explore';
        if (pathname.includes('/ai')) return tabKey === 'ai';
        if (pathname.includes('/settings')) return tabKey === 'settings';
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
                                <View style={[
                                    tw`items-center justify-center rounded-xl px-4 py-2`,
                                    isActive && { backgroundColor: theme.primary + '15' }
                                ]}>
                                    <Ionicons
                                        name={isActive ? tab.activeIcon : tab.icon}
                                        size={24}
                                        color={isActive ? theme.primary : '#9CA3AF'}
                                    />
                                   
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
