import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
    Alert,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import tw from 'twrnc'

import CustomDrawer from '@/components/CustomDrawer'
import DrawerButton from '@/components/DrawerButton'
import { useDrawer } from '@/contexts/DrawerContext'
// Context imports
import BottomTabs from '@/components/BottomTabs'
import PharmacyOverview from '@/components/dashboard/pharmacy/overview'
import PharmacyInventory from '@/components/dashboard/pharmacy/inventory'
import PharmacyOrders from '@/components/dashboard/pharmacy/orders'
import { useAuth } from '@/contexts/AuthContext'
import { getRoleTheme } from '@/utils/theme'
import { VerificationStatus } from '@/types/pharmacy'

export default function PharmacyDashboardScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer()
    const { currentUser } = useAuth()
    const theme = getRoleTheme(currentUser?.role)
    const [selectedTab, setSelectedTab] = useState<'overview' | 'inventory' | 'orders'>('overview')

    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'PHARMACY') {
            Alert.alert('Access Denied', 'Pharmacy access required', [
                { text: 'OK', onPress: () => router.back() }
            ])
            return
        }

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start()
    }, [currentUser, fadeAnim])

    if (!currentUser || currentUser.role !== 'PHARMACY') {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <View style={tw`bg-green-100 p-6 rounded-2xl items-center shadow-lg`}>
                    <Ionicons name="medkit-outline" size={56} color="#059669" />
                    <Text style={tw`text-green-600 text-base font-semibold mt-3`}>Access Denied</Text>
                    <Text style={tw`text-green-700 text-sm mt-2 text-center`}>Pharmacy credentials required</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Animated.View style={[tw`flex-1 `, { opacity: fadeAnim }]}>
                {/* Header */}
                <View style={tw`pb-4`}>
                    <LinearGradient
                        colors={[theme.primary, theme.primary + 'CC']}
                        style={tw`p-7 shadow-xl`}
                    >
                        <View style={tw`flex-row items-center justify-between mb-3`}>
                            <View style={tw`flex-1`}>
                                <View style={tw`flex-row items-center mb-2`}>
                                    <View style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-3`}>
                                        <Ionicons name="medkit-outline" size={20} color="white" />
                                    </View>
                                    <Text style={tw`text-white text-xs opacity-90 font-medium`}>
                                        Pharmacy Dashboard
                                    </Text>
                                </View>
                                <Text style={tw`text-white text-2xl font-bold mb-1`}>
                                    {currentUser.name}
                                </Text>
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`bg-white bg-opacity-15 px-3 py-1 rounded-full mr-2`}>
                                        <Text style={tw`text-white text-xs font-semibold`}>
                                            PHARMACY
                                        </Text>
                                    </View>
                                    {currentUser.isVerified ? (
                                        <View style={tw`flex-row items-center`}>
                                            <Ionicons name="checkmark-circle" size={16} color="white" />
                                            <Text style={tw`text-white text-xs opacity-80 ml-1`}>
                                                Verified
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={tw`flex-row items-center`}>
                                            <Ionicons name="time-outline" size={16} color="#FEF3C7" />
                                            <Text style={tw`text-yellow-100 text-xs ml-1`}>
                                                Pending Verification
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <DrawerButton />
                        </View>
                        
                        {/* Verification Status Banner for Unverified Pharmacies */}
                        {!currentUser.isVerified && (
                            <View style={tw`bg-yellow-100 border border-yellow-300 rounded-xl p-3 mt-4 mx-4`}>
                                <View style={tw`flex-row items-center`}>
                                    <Ionicons name="warning-outline" size={20} color="#D97706" />
                                    <Text style={tw`text-yellow-800 font-medium ml-2 flex-1`}>
                                        Complete verification to access all features
                                    </Text>
                                    <TouchableOpacity 
                                        style={[tw`px-3 py-1 rounded-lg`, { backgroundColor: theme.primary }]}
                                        onPress={() => router.push('/pharmacy/verification-dashboard')}
                                    >
                                        <Text style={tw`text-white text-xs font-semibold`}>Verify Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </LinearGradient>
                </View>

                {/* Navigation Tabs */}
                <View style={tw`px-4 mb-4 -mt-3 z-10`}>
                    <View style={tw`bg-white rounded-2xl p-2 flex-row shadow-lg`}>
                        {[
                            { key: 'overview', label: 'Overview', icon: 'analytics-outline' },
                            { key: 'inventory', label: 'Inventory', icon: 'medkit-outline' },
                            { key: 'orders', label: 'Orders', icon: 'clipboard-outline' },
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[
                                    tw`flex-1 py-3 px-2 rounded-xl flex-row items-center justify-center`,
                                    selectedTab === tab.key ? [tw`shadow-md`, { backgroundColor: theme.primary }] : tw`bg-transparent`
                                ]}
                                onPress={() => setSelectedTab(tab.key as any)}
                            >
                                <Ionicons
                                    name={tab.icon as any}
                                    size={16}
                                    color={selectedTab === tab.key ? 'white' : '#6B7280'}
                                />
                                <Text style={[
                                    tw`ml-2 font-medium text-sm`,
                                    selectedTab === tab.key ? tw`text-white` : tw`text-gray-600`
                                ]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Content */}
                <ScrollView
                    style={tw`flex-1`}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 160 }}
                >
                    {selectedTab === 'overview' && <PharmacyOverview />}
                    {selectedTab === 'inventory' && <PharmacyInventory />}
                    {selectedTab === 'orders' && <PharmacyOrders />}
                </ScrollView>
            </Animated.View>
            {/* Bottom Tabs */}
            <BottomTabs />

            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </View>
    )
}
