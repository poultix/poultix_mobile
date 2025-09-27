import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Animated, Dimensions } from "react-native"
import tw from 'twrnc'
import { router } from 'expo-router'
import CustomDrawer from '@/components/CustomDrawer'
import { useDrawer } from '@/contexts/DrawerContext'
import DrawerButton from '@/components/DrawerButton'
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useRef } from "react"
import { ScheduleStatus } from "@/types/schedule"
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { useSchedules } from '@/contexts/ScheduleContext';

const { width } = Dimensions.get('window');

export default function VeterinaryHome() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer()
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { farms } = useFarms();
    const { schedules, isLoading: schedulesLoading } = useSchedules();
    
    const fadeAnim = useRef(new Animated.Value(0)).current
    const headerAnim = useRef(new Animated.Value(-50)).current
    const contentAnim = useRef(new Animated.Value(0)).current

    // Start animations
    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(headerAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(contentAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        startAnimations();
    }, []);

    if (schedulesLoading || !currentUser) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Enhanced Profile Header */}
                    <View style={tw`px-4 pt-2 pb-4`}>
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            style={tw`rounded-3xl p-8 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-white text-sm opacity-90`}>
                                        Veterinary Dashboard
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>Dr. {currentUser?.name || 'Veterinary'}</Text>
                                    <Text style={tw`text-blue-100 text-base`}>{currentUser?.email || 'veterinary@poultix.com'}</Text>
                                </View>
                                <DrawerButton />
                            </View>
                            
                            {/* Schedule Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                                <Text style={tw`text-white font-bold text-lg mb-4`}>Schedule Overview</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-blue-200 text-3xl font-bold`}>{schedules?.length || 0}</Text>
                                        <Text style={tw`text-blue-100 text-xs font-medium`}>Total</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-3xl font-bold`}>{schedules?.filter(s => s.status === ScheduleStatus.IN_PROGRESS).length || 0}</Text>
                                        <Text style={tw`text-blue-100 text-xs font-medium`}>Pending</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-yellow-200 text-3xl font-bold`}>{schedules?.filter(s => s.status === ScheduleStatus.COMPLETED).length || 0}</Text>
                                        <Text style={tw`text-blue-100 text-xs font-medium`}>Confirmed</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-purple-200 text-3xl font-bold`}>{farms?.length || 0}</Text>
                                        <Text style={tw`text-blue-100 text-xs font-medium`}>Farms</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={tw`px-5`}>
                        {/* Quick Actions */}
                        <View style={tw`flex-row justify-between mb-6`}>
                            <TouchableOpacity 
                                style={tw`bg-white rounded-2xl p-4 flex-1 mr-3 shadow-md border border-blue-100`}
                                onPress={() => router.push('/communication/schedule-management')}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
                                    <Text style={tw`text-blue-600 font-semibold text-sm mt-2 text-center`}>
                                        Manage Schedules
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={tw`bg-white rounded-2xl p-4 flex-1 shadow-md border border-blue-100`}
                                onPress={() => router.push('/communication/messages')}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="chatbubble-outline" size={24} color="#10B981" />
                                    <Text style={tw`text-green-600 font-semibold text-sm mt-2 text-center`}>
                                        Messages
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Recent Schedules */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md border border-blue-100`}>
                            <View style={tw`flex-row justify-between items-center mb-4`}>
                                <Text style={tw`text-xl font-bold text-gray-800`}>
                                    Recent Appointments
                                </Text>
                                <TouchableOpacity onPress={() => router.push('/communication/schedule-management')}>
                                    <Text style={tw`text-blue-500 font-semibold`}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            {schedules && schedules.length > 0 ? (
                                schedules.slice(0, 3).map((schedule, index) => (
                                    <TouchableOpacity 
                                        key={schedule.id}
                                        style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                                        onPress={() => router.push('/communication/schedule-detail')}
                                    >
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`font-semibold text-gray-800`}>{schedule.title}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>{schedule.type}</Text>
                                        </View>
                                        <View style={tw`items-end`}>
                                            <Text style={tw`text-blue-500 font-medium`}>{schedule.status}</Text>
                                            <Text style={tw`text-gray-400 text-xs`}>{new Date(schedule.scheduledDate).toLocaleDateString()}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={tw`text-gray-500 text-center py-4`}>No appointments scheduled</Text>
                            )}
                        </View>

                        {/* Farm Overview */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md border border-blue-100`}>
                            <View style={tw`flex-row justify-between items-center mb-4`}>
                                <Text style={tw`text-xl font-bold text-gray-800`}>
                                    Farms Overview
                                </Text>
                                <TouchableOpacity onPress={() => router.push('/farm/nearby-farms')}>
                                    <Text style={tw`text-blue-500 font-semibold`}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            {farms && farms.length > 0 ? (
                                farms.slice(0, 3).map((farm, index) => (
                                    <TouchableOpacity 
                                        key={farm.id}
                                        style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                                        onPress={() => {
                                            
                                            router.push('/farm/farm-detail');
                                        }}
                                    >
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`font-semibold text-gray-800`}>{farm.name}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>{farm.location.address}</Text>
                                        </View>
                                        <View style={tw`items-end`}>
                                            <Text style={tw`text-green-500 font-medium`}>{farm.livestock.total} birds</Text>
                                            <Text style={tw`text-gray-400 text-xs`}>{farm.healthStatus}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={tw`text-gray-500 text-center py-4`}>No farms available</Text>
                            )}
                        </View>

                        {/* Veterinary Tools */}
                        <View style={tw`bg-white rounded-2xl p-5 shadow-md border border-blue-100`}>
                            <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>
                                Veterinary Tools
                            </Text>
                            <View style={tw`flex-row flex-wrap justify-between`}>
                                <TouchableOpacity 
                                    style={tw`bg-blue-50 rounded-xl p-4 w-[48%] mb-3`}
                                    onPress={() => router.push('/general/ai')}
                                >
                                    <Ionicons name="medical-outline" size={24} color="#3B82F6" />
                                    <Text style={tw`text-blue-800 font-semibold mt-2`}>AI Assistant</Text>
                                    <Text style={tw`text-blue-600 text-xs`}>Disease diagnosis</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={tw`bg-green-50 rounded-xl p-4 w-[48%] mb-3`}
                                    onPress={() => router.push('/pharmacy')}
                                >
                                    <Ionicons name="medkit-outline" size={24} color="#10B981" />
                                    <Text style={tw`text-green-800 font-semibold mt-2`}>Pharmacy</Text>
                                    <Text style={tw`text-green-600 text-xs`}>Find medicines</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={tw`bg-purple-50 rounded-xl p-4 w-[48%] mb-3`}
                                    onPress={() => router.push('/bluetooth/ph-reader')}
                                >
                                    <Ionicons name="analytics-outline" size={24} color="#8B5CF6" />
                                    <Text style={tw`text-purple-800 font-semibold mt-2`}>pH Reader</Text>
                                    <Text style={tw`text-purple-600 text-xs`}>Health analysis</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={tw`bg-orange-50 rounded-xl p-4 w-[48%] mb-3`}
                                    onPress={() => router.push('/general/news')}
                                >
                                    <Ionicons name="newspaper-outline" size={24} color="#F97316" />
                                    <Text style={tw`text-orange-800 font-semibold mt-2`}>News</Text>
                                    <Text style={tw`text-orange-600 text-xs`}>Latest updates</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    )
}
