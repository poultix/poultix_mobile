import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

// Mock analytics data
const analyticsData = {
    overview: {
        totalAnimals: 145,
        vaccinatedAnimals: 132,
        healthScore: 87,
        activeAlerts: 3,
        monthlyGrowth: 12.5
    },
    animalBreakdown: [
        { type: 'Dairy Cattle', count: 45, vaccinated: 42, healthScore: 92 },
        { type: 'Goats', count: 38, vaccinated: 35, healthScore: 85 },
        { type: 'Sheep', count: 32, vaccinated: 31, healthScore: 88 },
        { type: 'Poultry', count: 30, vaccinated: 24, healthScore: 78 }
    ],
    healthMetrics: {
        vaccinationRate: 91,
        diseaseIncidence: 2.3,
        mortalityRate: 1.8,
        productivityIndex: 94
    },
    alerts: [
        {
            id: '1',
            type: 'Vaccination Due',
            message: '5 dairy cattle due for FMD vaccination',
            severity: 'Medium',
            date: '2024-10-18'
        },
        {
            id: '2',
            type: 'Health Check',
            message: 'Quarterly health check overdue for goats',
            severity: 'Low',
            date: '2024-10-20'
        },
        {
            id: '3',
            type: 'Disease Alert',
            message: 'FMD outbreak reported in nearby district',
            severity: 'High',
            date: '2024-10-15'
        }
    ],
    trends: {
        vaccinationTrend: [85, 87, 89, 91, 90, 91],
        healthTrend: [82, 85, 87, 89, 86, 87],
        diseaseTrend: [3.2, 2.8, 2.5, 2.1, 2.3, 2.3]
    }
};

const AnalyticsScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'text-red-600 bg-red-100';
            case 'Medium': return 'text-orange-600 bg-orange-100';
            case 'Low': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const periods = [
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'quarter', label: 'This Quarter' },
        { id: 'year', label: 'This Year' }
    ];

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`bg-white bg-opacity-20 p-2 rounded-xl mb-4 self-start`}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <Text style={tw`text-white text-2xl font-bold mb-2`}>
                        Farm Analytics
                    </Text>
                    <Text style={tw`text-purple-100 text-sm`}>
                        AI-powered insights for your farm
                    </Text>
                </Animated.View>
            </LinearGradient>

            {/* Period Selector */}
            <View style={tw`bg-white border-b border-gray-200`}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-4 py-3`}
                >
                    {periods.map((period) => (
                        <TouchableOpacity
                            key={period.id}
                            style={tw`mr-3 px-4 py-2 rounded-xl ${
                                selectedPeriod === period.id
                                    ? 'bg-indigo-500'
                                    : 'bg-gray-100 border border-gray-200'
                            }`}
                            onPress={() => setSelectedPeriod(period.id)}
                        >
                            <Text
                                style={tw`font-medium ${
                                    selectedPeriod === period.id ? 'text-white' : 'text-gray-700'
                                }`}
                            >
                                {period.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Overview Cards */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Farm Overview</Text>
                        <View style={tw`flex-row flex-wrap`}>
                            <View style={tw`w-1/2 p-2`}>
                                <View style={tw`bg-white rounded-2xl p-4 shadow-sm border border-gray-100`}>
                                    <View style={tw`flex-row items-center mb-2`}>
                                        <Ionicons name="paw" size={24} color="#10B981" />
                                        <Text style={tw`text-gray-600 text-sm ml-2`}>Total Animals</Text>
                                    </View>
                                    <Text style={tw`text-2xl font-bold text-gray-900`}>{analyticsData.overview.totalAnimals}</Text>
                                    <Text style={tw`text-green-600 text-sm`}>+{analyticsData.overview.monthlyGrowth}% this month</Text>
                                </View>
                            </View>

                            <View style={tw`w-1/2 p-2`}>
                                <View style={tw`bg-white rounded-2xl p-4 shadow-sm border border-gray-100`}>
                                    <View style={tw`flex-row items-center mb-2`}>
                                        <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
                                        <Text style={tw`text-gray-600 text-sm ml-2`}>Vaccinated</Text>
                                    </View>
                                    <Text style={tw`text-2xl font-bold text-gray-900`}>{analyticsData.overview.vaccinatedAnimals}</Text>
                                    <Text style={tw`text-blue-600 text-sm`}>{Math.round((analyticsData.overview.vaccinatedAnimals/analyticsData.overview.totalAnimals)*100)}% coverage</Text>
                                </View>
                            </View>

                            <View style={tw`w-1/2 p-2`}>
                                <View style={tw`bg-white rounded-2xl p-4 shadow-sm border border-gray-100`}>
                                    <View style={tw`flex-row items-center mb-2`}>
                                        <Ionicons name="heart" size={24} color="#F59E0B" />
                                        <Text style={tw`text-gray-600 text-sm ml-2`}>Health Score</Text>
                                    </View>
                                    <Text style={tw`text-2xl font-bold text-gray-900`}>{analyticsData.overview.healthScore}%</Text>
                                    <Text style={tw`text-orange-600 text-sm`}>Excellent condition</Text>
                                </View>
                            </View>

                            <View style={tw`w-1/2 p-2`}>
                                <View style={tw`bg-white rounded-2xl p-4 shadow-sm border border-gray-100`}>
                                    <View style={tw`flex-row items-center mb-2`}>
                                        <Ionicons name="warning" size={24} color="#EF4444" />
                                        <Text style={tw`text-gray-600 text-sm ml-2`}>Active Alerts</Text>
                                    </View>
                                    <Text style={tw`text-2xl font-bold text-gray-900`}>{analyticsData.overview.activeAlerts}</Text>
                                    <Text style={tw`text-red-600 text-sm`}>Requires attention</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Health Metrics */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Health Metrics</Text>
                        <View style={tw`bg-white rounded-2xl p-6 shadow-sm border border-gray-100`}>
                            <View style={tw`flex-row justify-between items-center mb-4`}>
                                <Text style={tw`text-gray-900 font-bold`}>Vaccination Rate</Text>
                                <Text style={tw`text-green-600 font-bold text-xl`}>{analyticsData.healthMetrics.vaccinationRate}%</Text>
                            </View>
                            <View style={tw`bg-green-200 rounded-full h-3 mb-4`}>
                                <View style={[tw`bg-green-500 h-3 rounded-full`, { width: `${analyticsData.healthMetrics.vaccinationRate}%` }]} />
                            </View>

                            <View style={tw`grid grid-cols-2 gap-4`}>
                                <View>
                                    <Text style={tw`text-gray-600 text-sm mb-1`}>Disease Incidence</Text>
                                    <Text style={tw`text-red-600 font-bold`}>{analyticsData.healthMetrics.diseaseIncidence}%</Text>
                                </View>
                                <View>
                                    <Text style={tw`text-gray-600 text-sm mb-1`}>Mortality Rate</Text>
                                    <Text style={tw`text-orange-600 font-bold`}>{analyticsData.healthMetrics.mortalityRate}%</Text>
                                </View>
                                <View>
                                    <Text style={tw`text-gray-600 text-sm mb-1`}>Productivity Index</Text>
                                    <Text style={tw`text-blue-600 font-bold`}>{analyticsData.healthMetrics.productivityIndex}%</Text>
                                </View>
                                <View>
                                    <Text style={tw`text-gray-600 text-sm mb-1`}>Overall Score</Text>
                                    <Text style={tw`text-green-600 font-bold`}>{analyticsData.overview.healthScore}%</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Animal Breakdown */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Animal Health Breakdown</Text>
                        {analyticsData.animalBreakdown.map((animal, index) => (
                            <View key={index} style={tw`bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-100`}>
                                <View style={tw`flex-row justify-between items-center mb-3`}>
                                    <Text style={tw`text-gray-900 font-bold text-lg`}>{animal.type}</Text>
                                    <View style={tw`bg-green-100 px-3 py-1 rounded-full`}>
                                        <Text style={tw`text-green-700 text-sm font-bold`}>Health: {animal.healthScore}%</Text>
                                    </View>
                                </View>

                                <View style={tw`flex-row justify-between mb-3`}>
                                    <View>
                                        <Text style={tw`text-gray-600 text-sm`}>Total</Text>
                                        <Text style={tw`text-gray-900 font-bold text-lg`}>{animal.count}</Text>
                                    </View>
                                    <View>
                                        <Text style={tw`text-gray-600 text-sm`}>Vaccinated</Text>
                                        <Text style={tw`text-green-600 font-bold text-lg`}>{animal.vaccinated}</Text>
                                    </View>
                                    <View>
                                        <Text style={tw`text-gray-600 text-sm`}>Coverage</Text>
                                        <Text style={tw`text-blue-600 font-bold text-lg`}>{Math.round((animal.vaccinated/animal.count)*100)}%</Text>
                                    </View>
                                </View>

                                <View style={tw`bg-gray-200 rounded-full h-2`}>
                                    <View
                                        style={[tw`bg-green-500 h-2 rounded-full`, { width: `${(animal.vaccinated/animal.count)*100}%` }]}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Active Alerts */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Active Alerts</Text>
                        {analyticsData.alerts.map((alert, index) => (
                            <View key={index} style={tw`bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-100`}>
                                <View style={tw`flex-row items-start justify-between mb-3`}>
                                    <View style={tw`flex-1 mr-4`}>
                                        <View style={tw`flex-row items-center mb-2`}>
                                            <Ionicons
                                                name={
                                                    alert.type === 'Vaccination Due' ? 'shield-checkmark-outline' :
                                                    alert.type === 'Health Check' ? 'heart-outline' :
                                                    'warning-outline'
                                                }
                                                size={20}
                                                color={
                                                    alert.severity === 'High' ? '#EF4444' :
                                                    alert.severity === 'Medium' ? '#F59E0B' :
                                                    '#3B82F6'
                                                }
                                                style={tw`mr-2`}
                                            />
                                            <Text style={tw`text-gray-900 font-bold`}>{alert.type}</Text>
                                        </View>
                                        <Text style={tw`text-gray-700 leading-5 mb-2`}>{alert.message}</Text>
                                        <Text style={tw`text-gray-500 text-sm`}>Due: {alert.date}</Text>
                                    </View>

                                    <View style={tw`px-3 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                                        <Text style={tw`text-xs font-bold`}>
                                            {alert.severity}
                                        </Text>
                                    </View>
                                </View>

                                <View style={tw`flex-row space-x-3`}>
                                    <TouchableOpacity
                                        style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                        onPress={() => router.push('/vaccination/schedule')}
                                    >
                                        <Ionicons name="calendar-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                                        <Text style={tw`text-gray-700 font-bold`}>Schedule</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={tw`flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center`}
                                        onPress={() => router.push('/emergency/contacts')}
                                    >
                                        <Ionicons name="call-outline" size={18} color="white" style={tw`mr-2`} />
                                        <Text style={tw`text-white font-bold`}>Contact Vet</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* AI Insights */}
                    <View style={tw`bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="sparkles" size={24} color="white" />
                            <Text style={tw`text-white font-bold ml-2`}>AI Health Insights</Text>
                        </View>
                        <Text style={tw`text-purple-100 mb-4`}>
                            Your farm's health score is excellent! Continue with regular vaccination schedules and health monitoring.
                        </Text>
                        <View style={tw`flex-row space-x-3`}>
                            <TouchableOpacity style={tw`flex-1 bg-white bg-opacity-20 py-3 rounded-xl`}>
                                <Text style={tw`text-white font-bold text-center`}>View Full Report</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`flex-1 bg-white bg-opacity-20 py-3 rounded-xl`}>
                                <Text style={tw`text-white font-bold text-center`}>Health Predictions</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default AnalyticsScreen;
