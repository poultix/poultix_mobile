import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// New context imports
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFarms } from '@/contexts/FarmContext';
import { useNews } from '@/contexts/NewsContext';
import { useUsers } from '@/contexts/UserContext';
 ;

export default function AdminDashboard() {
    const { currentUser } = useAuth();
    const { dashboardStats, systemHealth, loading } = useAdmin();
    const { farms } = useFarms();
    const { users } = useUsers();
    const { news } = useNews();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    if (loading || !currentUser) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={tw` pb-4`}>
                        <LinearGradient
                            colors={['#7C3AED', '#5B21B6']}
                            style={tw`p-8 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-4`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-white text-sm opacity-90`}>
                                        Admin Dashboard
                                    </Text>
                                    <Text style={tw`text-white text-2xl font-bold`}>Welcome, {currentUser.name}</Text>
                                    <Text style={tw`text-purple-100 text-base`}>System Administrator</Text>
                                </View>
                            </View>
                            
                            {/* System Stats */}
                            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
                                <Text style={tw`text-white font-bold text-lg mb-4`}>System Overview</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-white text-3xl font-bold`}>{users.length}</Text>
                                        <Text style={tw`text-purple-100 text-xs font-medium`}>Total Users</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-green-200 text-3xl font-bold`}>{farms.length}</Text>
                                        <Text style={tw`text-purple-100 text-xs font-medium`}>Active Farms</Text>
                                    </View>
                                    <View style={tw`items-center flex-1`}>
                                        <Text style={tw`text-blue-200 text-3xl font-bold`}>{news.length}</Text>
                                        <Text style={tw`text-purple-100 text-xs font-medium`}>News Articles</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={tw`px-5`}>
                        {/* Quick Actions */}
                        <View style={tw`flex-row flex-wrap justify-between mb-6`}>
                            <TouchableOpacity 
                                style={tw`bg-white rounded-2xl p-4 w-[48%] mb-4 shadow-md border border-purple-100`}
                                onPress={() => router.push('/admin/add-news')}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="newspaper-outline" size={24} color="#7C3AED" />
                                    <Text style={tw`text-purple-600 font-semibold text-sm mt-2 text-center`}>
                                        Add News
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={tw`bg-white rounded-2xl p-4 w-[48%] mb-4 shadow-md border border-purple-100`}
                                onPress={() => router.push('/admin/data-management')}
                            >
                                <View style={tw`items-center`}>
                                    <Ionicons name="server-outline" size={24} color="#10B981" />
                                    <Text style={tw`text-green-600 font-semibold text-sm mt-2 text-center`}>
                                        Data Management
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* System Health */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md border border-purple-100`}>
                            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
                                System Health
                            </Text>
                            <View style={tw`space-y-3`}>
                                <View style={tw`flex-row items-center justify-between`}>
                                    <Text style={tw`text-gray-600`}>Server Status</Text>
                                    <View style={tw`flex-row items-center`}>
                                        <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-2`} />
                                        <Text style={tw`text-green-600 font-medium`}>Online</Text>
                                    </View>
                                </View>
                                <View style={tw`flex-row items-center justify-between`}>
                                    <Text style={tw`text-gray-600`}>Database</Text>
                                    <View style={tw`flex-row items-center`}>
                                        <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-2`} />
                                        <Text style={tw`text-green-600 font-medium`}>Connected</Text>
                                    </View>
                                </View>
                                <View style={tw`flex-row items-center justify-between`}>
                                    <Text style={tw`text-gray-600`}>API Services</Text>
                                    <View style={tw`flex-row items-center`}>
                                        <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-2`} />
                                        <Text style={tw`text-green-600 font-medium`}>Operational</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Recent Activity */}
                        <View style={tw`bg-white rounded-2xl p-5 shadow-md border border-purple-100`}>
                            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
                                Recent Activity
                            </Text>
                            <View style={tw`space-y-3`}>
                                <View style={tw`flex-row items-center py-2`}>
                                    <Ionicons name="person-add-outline" size={20} color="#7C3AED" />
                                    <Text style={tw`text-gray-600 ml-3 flex-1`}>New farmer registered</Text>
                                    <Text style={tw`text-gray-400 text-xs`}>2h ago</Text>
                                </View>
                                <View style={tw`flex-row items-center py-2`}>
                                    <Ionicons name="newspaper-outline" size={20} color="#10B981" />
                                    <Text style={tw`text-gray-600 ml-3 flex-1`}>News article published</Text>
                                    <Text style={tw`text-gray-400 text-xs`}>4h ago</Text>
                                </View>
                                <View style={tw`flex-row items-center py-2`}>
                                    <Ionicons name="home-outline" size={20} color="#F59E0B" />
                                    <Text style={tw`text-gray-600 ml-3 flex-1`}>Farm data updated</Text>
                                    <Text style={tw`text-gray-400 text-xs`}>6h ago</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}
