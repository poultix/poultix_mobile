import { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Animated,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FarmerData } from '@/interfaces/Farmer';
import { FarmData } from '@/interfaces/Farm';
import { Schedule } from '@/interfaces/Schedule';

import CustomDrawer from '@/components/CustomDrawer'
import { useDrawer } from '@/contexts/DrawerContext'
import DrawerButton from '@/components/DrawerButton';
import VeterinaryComponent from '@/components/shared/veterinary/veterinary';
import { MockDataService } from '@/services/mockData';

export default function FarmerScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [farmerData, setFarmerData] = useState<FarmerData>({
        _id: '0',
        email: 'loading',
        names: 'loading'
    })
    const [farmData, setFarmData] = useState<FarmData>({
        _id: '0',
        farmName: 'loading',
        chickens: {
            healthyChickens: 0,
            sickChickens: 0,
            riskChickens: 0
        },
        locations: 'loading'
    })

    const [schedules, setSchedules] = useState<Schedule[]>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);


    // Fetch farm and farmer data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true)
                const token = await AsyncStorage.getItem('token')
                if (token) {
                    const [farmerData, farmData, schedulesData] = await Promise.all([
                        MockDataService.getFarmerData(token),
                        MockDataService.getFarmData(token),
                        MockDataService.getSchedules(token)
                    ])
                    setFarmerData(farmerData)
                    setFarmData(farmData)
                    setSchedules(schedulesData)
                    
                    // Save farmer data to AsyncStorage for offline access
                    const tobeSaved = JSON.stringify(farmerData)
                    await AsyncStorage.setItem('farmerData', tobeSaved)
                }
            } catch (error) {
                console.error('Error fetching farmer data:', error)
                Alert.alert('Error', 'Failed to load data. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchAllData()
    }, [])

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Enhanced Profile Header */}
                    <View style={tw`px-4 pt-2 pb-4`}>
                        <LinearGradient
                            colors={['#F97316', '#EA580C']}
                            style={tw`rounded-3xl p-8 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-white text-sm opacity-90`}>
                                        Farmer Profile
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>
                                        {farmerData.names} 👨‍🌾
                                    </Text>
                                    <Text style={tw`text-orange-100 text-sm mt-1`}>
                                        {farmerData.email}
                                    </Text>
                                </View>
                                <DrawerButton />
                            </View>
                            
                            {/* Profile Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                                <Text style={tw`text-white font-bold text-lg mb-4`}>Profile Overview</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-white text-2xl font-bold`}>{farmData.chickens.healthyChickens + farmData.chickens.sickChickens + farmData.chickens.riskChickens}</Text>
                                        <Text style={tw`text-orange-100 text-xs font-medium`}>Total Birds</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-2xl font-bold`}>{schedules?.length || 0}</Text>
                                        <Text style={tw`text-orange-100 text-xs font-medium`}>Appointments</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-blue-200 text-2xl font-bold`}>5</Text>
                                        <Text style={tw`text-orange-100 text-xs font-medium`}>Years Exp</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={tw`px-5`}>

                    {/* Upcoming Schedule Section */}
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

                    {/* Quick Actions */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md border border-orange-100`}>
                        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
                            Quick Actions
                        </Text>
                        <View style={tw`flex-row flex-wrap gap-3`}>
                            <TouchableOpacity
                                style={tw`flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[45%]`}
                                onPress={() => router.push('/communication/schedule-request' as any)}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
                                    <Text style={tw`text-blue-600 font-semibold text-sm mt-2 text-center`}>
                                        Request Visit
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={tw`flex-1 bg-green-50 border border-green-200 rounded-xl p-4 min-w-[45%]`}
                                onPress={() => router.push('/communication/messages' as any)}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="chatbubble-outline" size={24} color="#10B981" />
                                    <Text style={tw`text-green-600 font-semibold text-sm mt-2 text-center`}>
                                        Messages
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Veterinaries */}
                    <VeterinaryComponent/>

                    {/* Weekly Report Section */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-md border border-orange-100`}>
                        <Text style={tw`text-xl font-semibold text-gray-800 mb-5`}>
                            Weekly Report
                        </Text>
                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={tw`relative items-center justify-center`}>
                                <Animated.View
                                    style={tw`w-28 h-28 rounded-full border-8 border-orange-100`}
                                />
                                <Animated.View
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
                    </View>
                </Animated.View>
            </ScrollView>
            
            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            />
        </SafeAreaView>
    );
}
