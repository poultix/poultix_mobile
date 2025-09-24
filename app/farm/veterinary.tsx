import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Animated, Dimensions } from "react-native"
import tw from 'twrnc'
import { router } from 'expo-router'
import CustomDrawer from '@/components/CustomDrawer'
import { useDrawer } from '@/contexts/DrawerContext'
import DrawerButton from '@/components/DrawerButton'
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState, useRef } from "react"
import { VeterinaryData } from "@/interfaces/Veterinary"
import { Schedule } from "@/interfaces/Schedule"
import { Ionicons } from '@expo/vector-icons'
import { MockDataService, mockVeterinaries } from "@/services/mockData"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Haptics from 'expo-haptics'

const { width } = Dimensions.get('window');


export default function VeterinaryHome() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer()
    const [schedules, setSchedules] = useState<Schedule[]>()
    const [veterinaryData, setVeterinaryData] = useState<VeterinaryData>({
        names: 'Loading...',
        email: 'Loading...',
        _id: 'loading...',
        farmManaged: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    
    const fadeAnim = useRef(new Animated.Value(0)).current
    const headerAnim = useRef(new Animated.Value(-50)).current
    const contentAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const fetchVeterinaryData = async () => {
            try {
                setIsLoading(true)
                const token = await AsyncStorage.getItem('token')
                if (token) {
                    const [vetData, schedulesData] = await Promise.all([
                        MockDataService.getVeterinaryData(token),
                        MockDataService.getSchedules(token)
                    ])
                    setVeterinaryData(vetData)
                    setSchedules(schedulesData)
                }
            } catch (error) {
                console.error('Error fetching veterinary data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVeterinaryData()
        
        // Enhanced animations
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.spring(headerAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(contentAnim, {
                    toValue: 1,
                    duration: 600,
                    delay: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start()
    }, [])

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            
            <ScrollView 
                showsVerticalScrollIndicator={false}
                style={tw`flex-1`}
                contentContainerStyle={tw`flexGrow pb-2`}
                bounces={true}
            >
                <Animated.View style={[tw`flex-1 min-h-full`, { opacity: fadeAnim }]}>
                    {/* Enhanced Header */}
                    <Animated.View 
                        style={[
                            tw`px-4 pt-2 pb-4`,
                            { transform: [{ translateY: headerAnim }] }
                        ]}
                    >
                        <LinearGradient
                            colors={['#EF4444', '#DC2626']}
                            style={tw`rounded-3xl p-8 shadow-xl min-h-48`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-white text-sm opacity-90`}>
                                        Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>
                                        Dr. {veterinaryData.names} 🩺
                                    </Text>
                                    <Text style={tw`text-red-100 text-sm mt-1`}>
                                        Veterinary Professional
                                    </Text>
                                </View>
                                <DrawerButton />
                            </View>
                            
                            {/* Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                                <Text style={tw`text-white font-bold text-lg mb-4`}>Your Practice</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-white text-3xl font-bold`}>{veterinaryData.farmManaged}</Text>
                                        <Text style={tw`text-red-100 text-sm font-medium`}>Farms Managed</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-3xl font-bold`}>{schedules?.length || 0}</Text>
                                        <Text style={tw`text-red-100 text-sm font-medium`}>Appointments</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-yellow-200 text-3xl font-bold`}>24</Text>
                                        <Text style={tw`text-red-100 text-sm font-medium`}>This Month</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* Upcoming Schedule Section */}
                    <Animated.View 
                        style={[
                            tw`px-4 mb-4`,
                            { opacity: contentAnim }
                        ]}
                    >
                        <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md border border-orange-100`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={tw`text-xl font-bold text-gray-800`}>
                                Upcoming Visit
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/communication/schedule-management' as any)}>
                                <Text style={tw`text-orange-600 text-sm font-semibold`}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        {schedules && schedules.length > 0 ? (
                            <View style={tw`flex-row items-center bg-orange-50 p-4 rounded-xl`}>
                                <Image
                                    source={require('@/assets/logo.png')}
                                    style={[tw`w-12 h-12 rounded-full mr-4 border border-orange-200`]}
                                />
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-800 text-base font-semibold`}>
                                        Dr. Patricia Uwimana
                                    </Text>
                                    <Text style={tw`text-gray-600 text-sm mt-1`}>
                                        Sunday, 27 June 2021
                                    </Text>
                                    <Text style={tw`text-gray-500 text-xs mt-0.5`}>08:00am - 10:00am</Text>
                                </View>
                                <TouchableOpacity style={tw`p-2 bg-orange-100 rounded-full`}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={22} color="#F97316" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={tw`flex-row items-center p-4 rounded-xl`}>
                                <Text style={tw`font-semibold`}>  There are no upcoming visits</Text>
                            </View>
                        )}
                    </View>

                    {/* Quick Actions for Veterinary */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md border border-red-100`}>
                        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
                            Veterinary Tools
                        </Text>
                        <View style={tw`flex-row flex-wrap gap-3`}>
                            <TouchableOpacity
                                style={tw`flex-1 bg-red-50 border border-red-200 rounded-xl p-4 min-w-[45%]`}
                                onPress={() => router.push('/communication/schedule-management' as any)}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="calendar-outline" size={24} color="#EF4444" />
                                    <Text style={tw`text-red-600 font-semibold text-sm mt-2 text-center`}>
                                        Manage Schedules
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={tw`flex-1 bg-green-50 border border-green-200 rounded-xl p-4 min-w-[45%]`}
                                onPress={() => router.push('/farm/nearby' as any)}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="leaf-outline" size={24} color="#10B981" />
                                    <Text style={tw`text-green-600 font-semibold text-sm mt-2 text-center`}>
                                        Nearby Farms
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={tw`flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[45%]`}
                                onPress={() => router.push('/communication/messages' as any)}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="chatbubble-outline" size={24} color="#3B82F6" />
                                    <Text style={tw`text-blue-600 font-semibold text-sm mt-2 text-center`}>
                                        Messages
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Choose Your Location Section */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-xl font-bold text-center text-gray-800 my-4`}>
                            Veterinary Network
                        </Text>
                        <Text style={tw`text-lg font-semibold text-center text-gray-800 mb-4`}>
                            Choose Location
                        </Text>
                        <View style={tw`flex-row gap-3 mb-5`}>
                            {['Byose', 'Kibuye', 'Muhanga'].map((location) => (
                                <TouchableOpacity
                                    key={location}
                                    style={[tw`flex-1 bg-white p-4 rounded-xl shadow-sm border border-orange-100 active:bg-orange-50`]}
                                    onPress={() => router.push('/farm/veterinary' as any)}
                                >
                                    <Text style={tw`text-gray-800 text-sm font-semibold text-center`}>
                                        {location}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {mockVeterinaries.map((doctor) => (
                            <View
                                key={doctor.name}
                                style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center border border-orange-100`}
                            >
                                <Image
                                    source={require('@/assets/logo.png')}
                                    style={[tw`w-12 h-12 rounded-full mr-3 border border-orange-200`]}
                                />
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-800 text-base font-semibold`}>
                                        {doctor.name}
                                    </Text>
                                    <Text style={tw`text-gray-600 text-sm`}>{doctor.location}</Text>
                                    <Text style={tw`text-gray-500 text-xs`}>{doctor.specialization} • {doctor.experience}</Text>
                                </View>
                                <TouchableOpacity style={tw`p-2 bg-orange-50 rounded-full`}>
                                    <Ionicons name="ellipsis-horizontal" size={20} color="#EA580C" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    {/* Weekly Report Section */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-md border border-orange-100`}>
                        <Text style={tw`text-xl font-semibold text-gray-800 mb-5`}>
                            Weekly Report
                        </Text>
                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={tw`relative items-center justify-center`}>
                                <View
                                    style={tw`w-28 h-28 rounded-full border-8 border-orange-100`}
                                />
                                <View
                                    style={tw`absolute top-0 left-0 w-28 h-28 rounded-full border-8 border-orange-500`}
                                />
                                <Text style={tw`absolute text-orange-600 text-2xl font-bold`}>
                                    87%
                                </Text>
                            </View>
                            <View style={tw`space-y-3`}>
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`w-3 h-3 rounded-full bg-orange-300 mr-2`}></View>
                                    <Text style={tw`text-gray-700 text-sm font-medium`}>Healthy</Text>
                                </View>
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`w-3 h-3 rounded-full bg-orange-500 mr-2`}></View>
                                    <Text style={tw`text-gray-700 text-sm font-medium`}>At Risk</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    </Animated.View>
                </Animated.View>
            </ScrollView>
            
            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </SafeAreaView>
    )
}