import { Schedule } from '@/types/schedule';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import tw from 'twrnc';

import CustomDrawer from '@/components/CustomDrawer';
import DrawerButton from '@/components/DrawerButton';
import VeterinaryComponent from '@/components/shared/veterinary/veterinary';
import { useDrawer } from '@/contexts/DrawerContext';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { useUserActions } from '@/hooks/useUserActions';

export default function FarmerScreen() {
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    // Use new contexts
    const { currentUser } = useAuth();
    const { farms, currentFarm, setCurrentFarm, loading: farmsLoading } = useFarms();
    const { schedules, loading: schedulesLoading } = useSchedules();
    const { getUsersByRole } = useUserActions();
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Set current farm for the farmer
    useEffect(() => {
        if (currentUser && farms.length > 0 && !currentFarm) {
            // Find farmer's farm
            const userFarm = farms.find(farm => farm.owner.id === currentUser.id);
            if (userFarm) {
                setCurrentFarm(userFarm);
            }
        }
        setIsLoading(farmsLoading || schedulesLoading);
    }, [currentUser, farms, currentFarm, farmsLoading, schedulesLoading]);

    // Navigation helpers
    const navigateToFarmDetails = () => {
        if (currentFarm) {
            router.push('/farm');
        }
    };
    
    const navigateToScheduleDetails = (schedule: Schedule) => {
        router.push('/communication/schedule-detail');
    };

    if (isLoading) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
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
                                        Welcome back,
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>{currentUser?.name || 'Loading...'}</Text>
                                    <Text style={tw`text-orange-100 text-base`}>{currentUser?.email || 'Loading...'}</Text>
                                </View>
                                <DrawerButton />
                            </View>
                            
                            {/* Farm Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                                <Text style={tw`text-white font-bold text-lg mb-4`}>Farm Overview</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-3xl font-bold`}>{currentFarm?.livestock?.total || 0}</Text>
                                        <Text style={tw`text-orange-100 text-xs font-medium`}>Total Birds</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-yellow-200 text-3xl font-bold`}>{currentFarm?.livestock?.healthy || 0}</Text>
                                        <Text style={tw`text-orange-100 text-xs font-medium`}>Healthy</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-red-200 text-3xl font-bold`}>{currentFarm?.livestock?.sick || 0}</Text>
                                        <Text style={tw`text-orange-100 text-xs font-medium`}>Sick</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={tw`px-5`}>
                        {/* Quick Actions */}
                        <View style={tw`flex-row justify-between mb-6`}>
                            <TouchableOpacity 
                                style={tw`bg-white rounded-2xl p-4 flex-1 mr-3 shadow-md border border-orange-100`}
                                onPress={navigateToFarmDetails}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="home-outline" size={24} color="#F97316" />
                                    <Text style={tw`text-orange-600 font-semibold text-sm mt-2 text-center`}>
                                        Farm Details
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={tw`bg-white rounded-2xl p-4 flex-1 shadow-md border border-orange-100`}
                                onPress={() => router.push('/chat')}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="chatbubble-outline" size={24} color="#10B981" />
                                    <Text style={tw`text-green-600 font-semibold text-sm mt-2 text-center`}>
                                        Messages
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Veterinaries */}
                        <VeterinaryComponent/>

                        {/* Recent Schedules */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md border border-orange-100`}>
                            <View style={tw`flex-row justify-between items-center mb-4`}>
                                <Text style={tw`text-xl font-bold text-gray-800`}>
                                    Recent Appointments
                                </Text>
                                <TouchableOpacity onPress={() => router.push('/communication/schedule-management')}>
                                    <Text style={tw`text-orange-500 font-semibold`}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            {schedules && schedules.length > 0 ? (
                                schedules.slice(0, 3).map((schedule, index) => (
                                    <TouchableOpacity 
                                        key={schedule.id}
                                        style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                                        onPress={() => navigateToScheduleDetails(schedule)}
                                    >
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`font-semibold text-gray-800`}>{schedule.title}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>{schedule.type}</Text>
                                        </View>
                                        <View style={tw`items-end`}>
                                            <Text style={tw`text-orange-500 font-medium`}>{schedule.status}</Text>
                                            <Text style={tw`text-gray-400 text-xs`}>{new Date(schedule.scheduledDate).toLocaleDateString()}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={tw`text-gray-500 text-center py-4`}>No appointments scheduled</Text>
                            )}
                        </View>

                        {/* Weekly Report Section */}
                        <View style={tw`bg-white rounded-2xl p-5 shadow-md border border-orange-100`}>
                            <Text style={tw`text-xl font-semibold text-gray-800 mb-5`}>
                                Farm Health Report
                            </Text>
                            <View style={tw`flex-row items-center justify-between`}>
                                <View style={tw`relative items-center justify-center`}>
                                    <View style={tw`w-28 h-28 rounded-full border-8 border-orange-100`} />
                                    <View style={tw`absolute top-0 left-0 w-28 h-28 rounded-full border-8 border-orange-500`} />
                                    <Text style={tw`absolute text-orange-600 text-2xl font-bold`}>
                                        {currentFarm?.livestock ? Math.round((currentFarm.livestock.healthy / currentFarm.livestock.total) * 100) : 0}%
                                    </Text>
                                </View>
                                <View style={tw`space-y-3`}>
                                    <View style={tw`flex-row items-center`}>
                                        <View style={tw`w-3 h-3 rounded-full bg-green-500 mr-2`}></View>
                                        <Text style={tw`text-gray-700 text-sm font-medium`}>Healthy: {currentFarm?.livestock?.healthy || 0}</Text>
                                    </View>
                                    <View style={tw`flex-row items-center`}>
                                        <View style={tw`w-3 h-3 rounded-full bg-red-500 mr-2`}></View>
                                        <Text style={tw`text-gray-700 text-sm font-medium`}>Sick: {currentFarm?.livestock?.sick || 0}</Text>
                                    </View>
                                    <View style={tw`flex-row items-center`}>
                                        <View style={tw`w-3 h-3 rounded-full bg-yellow-500 mr-2`}></View>
                                        <Text style={tw`text-gray-700 text-sm font-medium`}>At Risk: {currentFarm?.livestock?.atRisk || 0}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}
