import { Alert, Text, TouchableOpacity, View, Animated, Dimensions } from "react-native";
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRef, useEffect } from 'react';
import { useDrawer } from '@/contexts/DrawerContext';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

const getScreenTitle = (pathname: string): string => {
    switch (pathname) {
        case '/':
            return 'Dashboard';
        case '/farm/farmer':
            return 'Farmer Profile';
        case '/farm':
            return 'Farm Management';
        case '/general/ai':
            return 'AI Assistant';
        case '/pharmacy':
            return 'Pharmacies';
        case '/general/news':
            return 'Health News';
        case '/settings':
            return 'Settings';
        case '/farm/veterinary':
            return 'Veterinary Care';
        case '/bluetooth/bluetooth-pairing':
            return 'Device Pairing';
        case '/bluetooth/ph-reader':
            return 'pH Analyzer';
        case '/admin':
            return 'Admin Panel';
        case '/admin/add-news':
            return 'Add News';
        case '/admin/data-management':
            return 'Data Management';
        default:
            // Extract screen name from path
            const screenName = pathname.split('/').pop() || 'Screen';
            return screenName.charAt(0).toUpperCase() + screenName.slice(1).replace('-', ' ');
    }
}

const getScreenIcon = (pathname: string): keyof typeof Ionicons.glyphMap => {
    switch (pathname) {
        case '/':
            return 'home-outline';
        case '/farm/farmer':
            return 'person-outline';
        case '/farm':
            return 'leaf-outline';
        case '/general/ai':
            return 'chatbubble-ellipses-outline';
        case '/pharmacy':
            return 'storefront-outline';
        case '/general/news':
            return 'newspaper-outline';
        case '/settings':
            return 'settings-outline';
        case '/farm/veterinary':
            return 'medical-outline';
        case '/bluetooth/bluetooth-pairing':
            return 'bluetooth-outline';
        case '/bluetooth/ph-reader':
            return 'flask-outline';
        case '/admin':
            return 'shield-outline';
        case '/admin/add-news':
            return 'create-outline';
        case '/admin/data-management':
            return 'server-outline';
        default:
            return 'document-outline';
    }
}

export default function TopNavigation() {
    const pathname = usePathname()
    const { toggleDrawer } = useDrawer()
    const { logout, state } = useApp()
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(-20)).current
    
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start()
    }, [pathname])

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.back()
    }

    const handleMenu = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        toggleDrawer()
    }

    const handleLogout = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: async () => {
                        await logout()
                        router.replace('/auth/sign-in')
                    }
                }
            ]
        )
    }

    const isHomePage = pathname === '/'
    const isAdminPage = pathname.includes('admin') || pathname.includes('add-news') || pathname.includes('data-management')

    return (
        <View style={tw`bg-transparent`}>
            <BlurView intensity={95} tint="light" style={tw`absolute inset-0`} />
            
            <Animated.View 
                style={[
                    tw`px-4 py-3 border-b border-gray-100`,
                    { 
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <View style={tw`flex-row justify-between items-center`}>
                    {/* Back Button */}
                    {!isHomePage && (
                        <TouchableOpacity
                            onPress={handleBack}
                            style={tw`bg-white rounded-full p-3 shadow-lg border border-gray-100`}
                            accessibilityLabel="Go back"
                            accessibilityRole="button"
                        >
                            <Ionicons name="arrow-back" size={20} color="#374151" />
                        </TouchableOpacity>
                    )}
                    
                    {/* Title Section */}
                    <View style={tw`flex-1 ${!isHomePage ? 'mx-4' : 'mr-4'} items-center`}>
                        <View style={tw`flex-row items-center`}>
                            <View style={[
                                tw`p-2 rounded-full mr-3`,
                                isAdminPage 
                                    ? tw`bg-purple-100` 
                                    : tw`bg-orange-100`
                            ]}>
                                <Ionicons 
                                    name={getScreenIcon(pathname)} 
                                    size={20} 
                                    color={isAdminPage ? "#7C3AED" : "#F97316"} 
                                />
                            </View>
                            <View>
                                <Text style={tw`font-bold text-lg text-gray-800`}>
                                    {getScreenTitle(pathname)}
                                </Text>
                                {isAdminPage && (
                                    <Text style={tw`text-xs text-purple-600 font-medium`}>
                                        Admin Access
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={tw`flex-row gap-2`}>
                        {/* Logout Button - only show if user is logged in */}
                        {state.currentUser && (
                            <TouchableOpacity
                                onPress={handleLogout}
                                style={tw`bg-red-50 border border-red-200 rounded-full p-3 shadow-lg`}
                                accessibilityLabel="Logout"
                                accessibilityRole="button"
                            >
                                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        )}
                        
                        {/* Menu Button */}
                        <TouchableOpacity
                            onPress={handleMenu}
                            style={tw`bg-white rounded-full p-3 shadow-lg border border-gray-100`}
                            accessibilityLabel="Open menu"
                            accessibilityRole="button"
                        >
                            <Ionicons name="menu" size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Enhanced breadcrumb for nested pages */}
                {pathname.includes('/') && pathname !== '/' && (
                    <Animated.View 
                        style={[
                            tw`mt-2 flex-row items-center`,
                            { opacity: fadeAnim }
                        ]}
                    >
                        <Ionicons name="chevron-forward" size={12} color="#9CA3AF" />
                        <Text style={tw`text-xs text-gray-500 ml-1`}>
                            {pathname.split('/').filter(Boolean).join(' / ')}
                        </Text>
                    </Animated.View>
                )}
            </Animated.View>
        </View>
    )
}