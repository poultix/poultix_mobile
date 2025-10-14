import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import tw from 'twrnc';
const { width } = Dimensions.get('window');
// ========================================================================================
// INTERFACES & TYPES
// ========================================================================================
interface EnvironmentalFeedback {
    status: string;
    description: string;
    suitability: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
    color: string;
    bgColor: string;
    recommendations: string[];
    diseases?: any[];
    quickMeasures?: string[];
    healthScore: number;
}
interface EnvironmentalReading {
    id: string;
    temperature: number;
    humidity: number;
    timestamp: Date;
    feedback: EnvironmentalFeedback;
    location?: string;
}
// ========================================================================================
// CUSTOM COMPONENTS
// ========================================================================================
/**
 * Combined Real-time Chart Component with amber/orange theme
 * Shows temperature and humidity in one chart with different colored lines
 */
const CombinedEnvironmentalChart = ({
    data,
    height = 220,
    maxDataPoints = 12
}: {
    data: { time: string; temperature: number; humidity: number; timestamp: Date }[];
    height?: number;
    maxDataPoints?: number;
}) => {
    const chartWidth = width - 20; // Slightly more space to avoid overflow

    // Filter data to show only recent points (last 5 minutes)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const filteredData = data
        .filter(item => item.timestamp >= fiveMinutesAgo)
        .filter(item => !isNaN(item.temperature) && isFinite(item.temperature) &&
            !isNaN(item.humidity) && isFinite(item.humidity))
        .slice(-maxDataPoints);

    if (filteredData.length === 0) {
        return (
            <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={tw`text-amber-600 text-sm font-medium`}>Initializing sensors...</Text>
            </View>
        );
    }

    // Prepare validated data
    const validData = filteredData.map(item => ({
        ...item,
        temperature: isNaN(item.temperature) || !isFinite(item.temperature) ? 20 : Number(item.temperature.toFixed(1)),
        humidity: isNaN(item.humidity) || !isFinite(item.humidity) ? 60 : Number(item.humidity.toFixed(0))
    }));

    // Create simplified time labels to prevent squeezing - use real time stamps
    const timeLabels = validData.map((item, index) => {
        if (index === 0) return item.time;
        if (index === validData.length - 1) return 'Now';
        // Show every other for space, using actual time
        return index % 2 === 0 ? item.time : '';
    });

    const chartData = {
        labels: timeLabels,
        datasets: [
            {
                data: validData.map(item => item.temperature),
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red for temperature
                strokeWidth: 3
            },
            {
                data: validData.map(item => item.humidity),
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue for humidity
                strokeWidth: 3
            }
        ]
    };

    const chartConfig = {
        backgroundColor: '#fffbeb',
        backgroundGradientFrom: '#fffbeb',
        backgroundGradientTo: '#fef3c7',
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(146, 64, 14, ${opacity * 0.8})`,
        labelColor: (opacity = 1) => `rgba(146, 64, 14, ${opacity * 0.9})`,
        style: {
            borderRadius: 16
        },
        // Remove dots entirely
        propsForBackgroundLines: {
            strokeDasharray: '3,3',
            stroke: '#fbbf24',
            strokeWidth: 1,
            opacity: 0.3
        }
    };

    const currentTemp = validData.length > 0 ? validData[validData.length - 1].temperature : 0;
    const currentHumidity = validData.length > 0 ? validData[validData.length - 1].humidity : 0;

    return (
        <View style={{ marginVertical: 0 }}>
            {/* Combined Chart Header - cramped */}
            <View style={tw`flex-row justify-between items-center mb-1 px-1`}>
                <View style={tw`flex-row items-center`}>
                    <Ionicons name="analytics-outline" size={20} color="#92400e" style={tw`mr-1`} />
                    <Text style={tw`text-lg font-bold text-amber-800`}>
                        Environmental Monitor
                    </Text>
                    <Text style={tw`text-xs text-red-500 ml-1`}>LIVE DATA</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-xs text-amber-700 font-semibold`}>
                        {validData.length} readings
                    </Text>
                    <Text style={tw`text-xs text-blue-500 ml-1`}>UPDATING</Text>
                </View>
            </View>

            {/* Current Values Display - overlapped a bit */}
            <View style={tw`flex-row justify-between mb-1 px-1`}>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`w-3 h-3 bg-red-500 rounded-full mr-1`} />
                    <Text style={tw`text-red-800 font-bold text-sm`}>
                        Temp: {currentTemp.toFixed(1)}°C
                    </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`w-3 h-3 bg-blue-500 rounded-full mr-1`} />
                    <Text style={tw`text-blue-800 font-bold text-sm`}>
                        Humidity: {currentHumidity}%
                    </Text>
                    <Text style={tw`text-xs text-gray-500 ml-1`}>%</Text>
                </View>
            </View>

            {/* Combined Line Chart - more segments for space */}
            <LineChart
                data={chartData}
                width={chartWidth}
                height={height}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 4,
                    borderRadius: 16,
                    elevation: 3,
                    shadowColor: '#f59e0b',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4
                }}
                withDots={false}
                withShadow={false}
                withScrollableDot={false}
                withInnerLines={true}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={true}
                segments={6}
            />

            {/* Chart Legend - cramped */}
            <View style={tw`flex-row justify-center items-center mt-1 px-1`}>
                <Ionicons name="pulse-outline" size={12} color="#d97706" style={tw`mr-1`} />
                <Text style={tw`text-xs text-amber-600 font-medium`}>
                    Live monitoring • Updates every 5s
                </Text>
                <Text style={tw`text-xs text-gray-400 ml-1`}>CHART ACTIVE</Text>
            </View>
        </View>
    );
};
// ========================================================================================
// UTILITY FUNCTIONS
// ========================================================================================
/**
 * Analyzes environmental conditions and returns feedback with suitability rating
 */
const getEnvironmentalFeedback = (
    temperature: number,
    humidity: number
): EnvironmentalFeedback => {
    // Mock diseases based on environmental conditions
    const diseases = [];
    // Add mock diseases based on conditions
    if (humidity > 80 && temperature > 25) {
        diseases.push({
            name: 'Aspergillosis',
            severity: 'high',
            environmentalFactors: ['High humidity', 'Warm temperature']
        });
    }
    if (temperature > 32) {
        diseases.push({
            name: 'Heat Stress',
            severity: 'critical',
            environmentalFactors: ['High temperature']
        });
    }
    if (temperature < 15) {
        diseases.push({
            name: 'Cold Stress',
            severity: 'high',
            environmentalFactors: ['Low temperature']
        });
    }
    if (humidity < 30) {
        diseases.push({
            name: 'Dehydration',
            severity: 'medium',
            environmentalFactors: ['Low humidity']
        });
    }
    // Get quick measures from diseases
    const quickMeasures = diseases.length > 0 && diseases[0].environmentalFactors
        ? [`Address ${diseases[0].environmentalFactors.join(' and ')} issues`]
        : [];
    let status = '';
    let description = '';
    let suitability: EnvironmentalFeedback['suitability'] = 'moderate';
    let color = '#F59E0B';
    let bgColor = '#FFFBEB';
    let recommendations: string[] = [];
    let healthScore = 50;
    // Temperature analysis
    const tempScore = temperature >= 21 && temperature <= 27 ? 100 :
        temperature >= 18 && temperature <= 30 ? 80 :
            temperature >= 15 && temperature <= 32 ? 60 :
                temperature >= 10 && temperature <= 35 ? 40 : 20;
    // Humidity analysis
    const humidityScore = humidity >= 40 && humidity <= 70 ? 100 :
        humidity >= 30 && humidity <= 80 ? 80 :
            humidity >= 20 && humidity <= 85 ? 60 :
                humidity >= 10 && humidity <= 90 ? 40 : 20;
    // Combined health score
    healthScore = Math.round((tempScore + humidityScore) / 2);
    // Determine overall suitability
    if (healthScore >= 90) {
        suitability = 'excellent';
        status = 'Perfect Environment';
        description = 'Conditions are ideal for chicken health and productivity.';
        color = '#059669';
        bgColor = '#ECFDF5';
        recommendations = [
            'Maintain current environmental conditions.',
            'Ensure good ventilation and air circulation.',
            'Continue regular health monitoring.',
            'Monitor for any sudden changes in weather.'
        ];
    } else if (healthScore >= 75) {
        suitability = 'good';
        status = 'Good Environment';
        description = 'Conditions are generally suitable with minor considerations.';
        color = '#10B981';
        bgColor = '#ECFDF5';
        recommendations = [
            'Maintain stable temperature and humidity levels.',
            'Ensure adequate ventilation.',
            'Monitor chicken behavior and health.',
            'Consider shade areas during hot periods.'
        ];
    } else if (healthScore >= 60) {
        suitability = 'moderate';
        status = 'Moderate Conditions';
        description = 'Environmental conditions need some improvement for optimal health.';
        color = '#F59E0B';
        bgColor = '#FFFBEB';
        recommendations = [
            'Improve ventilation to regulate humidity.',
            'Provide shade and cooling during hot periods.',
            'Ensure fresh water is always available.',
            'Monitor for signs of heat or cold stress.'
        ];
    } else if (healthScore >= 40) {
        suitability = 'poor';
        status = 'Poor Environment';
        description = 'Conditions may negatively impact chicken health and productivity.';
        color = '#EA580C';
        bgColor = '#FFF7ED';
        recommendations = [
            'Immediate action needed to improve conditions.',
            'Install proper ventilation systems.',
            'Provide adequate shade and cooling.',
            'Consider moving chickens to better environment.',
            'Consult veterinarian for health monitoring.'
        ];
    } else {
        suitability = 'critical';
        status = 'Critical Environment';
        description = 'Immediate intervention required - conditions pose serious health risks.';
        color = '#DC2626';
        bgColor = '#FEF2F2';
        recommendations = [
            'URGENT: Move chickens to suitable environment.',
            'Provide immediate veterinary care.',
            'Ensure proper hydration and cooling.',
            'Monitor closely for heat/cold stress symptoms.',
            'Emergency veterinary consultation recommended.'
        ];
    }
    return {
        status,
        description,
        suitability,
        color,
        bgColor,
        recommendations,
        diseases,
        quickMeasures,
        healthScore
    };
};
// ========================================================================================
// MAIN COMPONENT
// ========================================================================================
export default function EnvironmentalScannerScreen() {
    // State management - minimal, remove some
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [feedback, setFeedback] = useState<EnvironmentalFeedback | null>(null);
    const [history, setHistory] = useState<EnvironmentalReading[]>([]); // Keep but minimal use
    const [realTimeInterval, setRealTimeInterval] = useState<number | null>(null);
    const [graphData, setGraphData] = useState<{ time: string, temperature: number, humidity: number, timestamp: Date }[]>([]);
    const [updateCount, setUpdateCount] = useState(0); // For alternating phases
    // Animation refs - minimal, remove some
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    // Initialize component
    useEffect(() => {
        // Animation sequence - simpler but include cardAnim
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true
            }),
            Animated.spring(cardAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true
            }),
        ]).start();
        // Auto-start monitoring immediately - remove scanning
        setTimeout(() => {
            startRealTimeMonitoring();
        }, 100);
    }, []);
    // ========================================================================================
    // DATA GENERATION & MONITORING
    // ========================================================================================
    /**
     * Generates realistic environmental readings alternating bad/good every 10s
     */
    const generateNewReadings = () => {
        const currentTemp = isNaN(parseFloat(temperature)) ? 20 : parseFloat(temperature);
        const currentHumidity = isNaN(parseFloat(humidity)) ? 60 : parseFloat(humidity);

        // Alternate: 10s bad (updates 0-1 mod 4), 10s good (2-3 mod 4) - since 5s interval
        const isBadPhase = updateCount % 4 < 2;

        let newTemp = currentTemp;
        let newHumidity = currentHumidity;

        if (isBadPhase) {
            // Bad phase: simulate critical
            const criticalType = Math.random();
            if (criticalType < 0.25) {
                newTemp = Math.max(33, currentTemp + (Math.random() * 5 + 2));
                newHumidity = Math.max(20, Math.min(90, currentHumidity + (Math.random() - 0.5) * 10));
            } else if (criticalType < 0.5) {
                newTemp = Math.min(14, currentTemp - (Math.random() * 5 + 2));
                newHumidity = Math.max(20, Math.min(90, currentHumidity + (Math.random() - 0.5) * 10));
            } else if (criticalType < 0.75) {
                newHumidity = Math.max(81, currentHumidity + (Math.random() * 10 + 5));
                newTemp = Math.max(10, Math.min(45, currentTemp + (Math.random() - 0.5) * 4));
            } else {
                newHumidity = Math.min(29, currentHumidity - (Math.random() * 10 + 5));
                newTemp = Math.max(10, Math.min(45, currentTemp + (Math.random() - 0.5) * 4));
            }
        } else {
            // Good phase: ideal values
            newTemp = 24 + (Math.random() - 0.5) * 3; // Around 24°C
            newHumidity = 55 + (Math.random() - 0.5) * 10; // Around 55%
        }

        const validTemp = isNaN(newTemp) || !isFinite(newTemp) ? 20 : newTemp;
        const validHumidity = isNaN(newHumidity) || !isFinite(newHumidity) ? 60 : newHumidity;

        return {
            temperature: validTemp.toFixed(1),
            humidity: validHumidity.toFixed(0)
        };
    };
    /**
     * Starts real-time environmental monitoring
     */
    const startRealTimeMonitoring = () => {
        // Initialize graph data with initial good reading
        const initialTemp = 24;
        const initialHumidity = 55;
        const now = new Date();
        const timeLabel = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        setGraphData([{
            time: timeLabel,
            temperature: initialTemp,
            humidity: initialHumidity,
            timestamp: now
        }]);
        setTemperature(initialTemp.toFixed(1));
        setHumidity(initialHumidity.toFixed(0));

        const interval = setInterval(() => {
            setUpdateCount(prev => prev + 1); // Increment for phase
            const newReadings = generateNewReadings();
            setTemperature(newReadings.temperature);
            setHumidity(newReadings.humidity);
            // Add to graph data - new points push old to left/behind
            const newTime = new Date();
            const newTimeLabel = newTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
            setGraphData(prev => {
                const tempValue = parseFloat(newReadings.temperature);
                const humidityValue = parseFloat(newReadings.humidity);

                const validTemp = isNaN(tempValue) || !isFinite(tempValue) ? 20 : tempValue;
                const validHumidity = isNaN(humidityValue) || !isFinite(humidityValue) ? 60 : humidityValue;

                const updated = [
                    ...prev,
                    {
                        time: newTimeLabel,
                        temperature: validTemp,
                        humidity: validHumidity,
                        timestamp: newTime
                    }
                ];
                return updated.slice(-20); // Keep last 20, old goes behind
            });
            // Re-analyze with new readings
            const temp = parseFloat(newReadings.temperature);
            const humid = parseFloat(newReadings.humidity);
            const feedbackResult = getEnvironmentalFeedback(temp, humid);
            setFeedback(feedbackResult);
            // Save to history - minimal
            const reading: EnvironmentalReading = {
                id: Date.now().toString(),
                temperature: temp,
                humidity: humid,
                timestamp: new Date(),
                feedback: feedbackResult,
                location: 'Farm Location'
            };
            saveReading(reading);
        }, 5000); // Update every 5 seconds
        setRealTimeInterval(interval);
    };
    /**
     * Stops real-time monitoring
     */
    const stopRealTimeMonitoring = () => {
        if (realTimeInterval) {
            clearInterval(realTimeInterval);
            setRealTimeInterval(null);
        }
    };
    // ========================================================================================
    // DATA PERSISTENCE - minimal
    // ========================================================================================
    /**
     * Saves environmental reading to storage
     */
    const saveReading = async (reading: EnvironmentalReading) => {
        try {
            const newHistory = [reading, ...history.slice(0, 9)];
            setHistory(newHistory);
            await AsyncStorage.setItem(
                'environmental_reading_history',
                JSON.stringify(newHistory)
            );
        } catch (error) {
            console.error('Error saving reading:', error);
        }
    };
    // ========================================================================================
    // RENDER - noisy bad arrangement: cramped margins, extra texts, overlaps
    // ========================================================================================
    return (
        <View style={tw`flex-1`}>
            <LinearGradient
                colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
                style={tw`flex-1`}
            >
                <ScrollView
                    contentContainerStyle={tw`pb-10`}
                    showsVerticalScrollIndicator={true}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
                        {/* Header Section - full width, overlapping pills */}
                        <LinearGradient
                            colors={['#f59e0b', '#d97706', '#ea580c']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={tw`p-4 mb-2 shadow-xl`}
                        >
                            <View style={tw`flex-row items-center justify-between mb-2`}>
                                <TouchableOpacity
                                    style={tw`p-3 rounded-2xl bg-white bg-opacity-20`}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back-outline" size={20} color="white" />
                                </TouchableOpacity>
                                <View style={tw`flex-1 mx-2`}>
                                    <View style={tw`flex-row items-center mb-1`}>
                                        <View style={tw`w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse`} />
                                        <View style={tw`flex-row items-center flex-1`}>
                                            <Ionicons name="thermometer-outline" size={14} color="white" style={tw`mr-1`} />
                                            <Text style={tw`text-white text-xs font-semibold opacity-95 flex-1`} numberOfLines={1}>
                                                LIVE ENVIRONMENTAL MONITOR
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={tw`text-white text-2xl font-bold tracking-tight`} numberOfLines={1}>
                                        Environmental Monitor
                                    </Text>
                                    <View style={tw`flex-row items-center mt-1`}>
                                        <Ionicons name="flame-outline" size={14} color="#fed7aa" style={tw`mr-1`} />
                                        <Text style={tw`text-orange-100 text-xs font-medium flex-1`} numberOfLines={1}>
                                            Continuous monitoring • Amber alerts system
                                        </Text>
                                    </View>
                                </View>
                                <View style={tw`items-center`}>
                                    <TouchableOpacity style={tw`bg-white bg-opacity-20 p-3 rounded-2xl mb-1`}>
                                        <Ionicons name="analytics-outline" size={24} color="white" />
                                    </TouchableOpacity>
                                    <Text style={tw`text-white text-xs font-bold opacity-90`}>AI</Text>
                                </View>
                            </View>
                            {/* Status Pills - overlapping/noisy */}
                            <View style={tw`flex-row justify-between`}>
                                <View style={tw`bg-white bg-opacity-10 px-2 py-1 rounded-full backdrop-blur-lg flex-row items-center mr-1`}>
                                    <Ionicons name="radio-button-on" size={10} color="#ef4444" style={tw`mr-1`} />
                                    <Text style={tw`text-white text-xs font-bold`} numberOfLines={1}>LIVE</Text>
                                </View>
                                <View style={tw`bg-white bg-opacity-10 px-2 py-1 rounded-full backdrop-blur-lg flex-row items-center`}>
                                    <Ionicons name="analytics" size={10} color="white" style={tw`mr-1`} />
                                    <Text style={tw`text-white text-xs font-bold`} numberOfLines={1}>ANALYZING</Text>
                                </View>
                                <View style={tw`bg-white bg-opacity-10 px-2 py-1 rounded-full backdrop-blur-lg flex-row items-center ml-1`}>
                                    <Ionicons name="refresh" size={10} color="white" style={tw`mr-1`} />
                                    <Text style={tw`text-white text-xs font-bold`} numberOfLines={1}>AUTO-UPDATE</Text>
                                </View>
                                <Text style={tw`text-white text-xs absolute right-0`}>STATUS OK</Text>
                            </View>
                        </LinearGradient>

                        {/* Graph Section - after header */}
                        {graphData.length > 1 && (
                            <Animated.View style={[tw`mx-2 mb-2 mt-2 shadow-lg`, { transform: [{ scale: cardAnim }] }]}>
                                <LinearGradient
                                    colors={['#ffffff', '#f8fafc']}
                                    style={tw`rounded-2xl p-3 border border-gray-100`}
                                >
                                    <CombinedEnvironmentalChart
                                        data={graphData}
                                        height={200}
                                        maxDataPoints={12}
                                    />
                                    <Text style={tw`text-xs text-gray-500 text-center mt-0`}>DATA STREAMING</Text>
                                </LinearGradient>
                            </Animated.View>
                        )}

                        {/* Status Dashboard - cramped, extra texts */}
                        {feedback && (
                            <Animated.View style={[tw`mx-2 mb-2 shadow-lg`, { transform: [{ scale: cardAnim }] }]}>
                                <LinearGradient
                                    colors={['#ffffff', '#f8fafc']}
                                    style={tw`rounded-2xl p-3 border border-gray-100`}
                                >
                                    {/* Status Header - cramped */}
                                    <View style={tw`flex-row items-center justify-between mb-2`}>
                                        <View style={tw`flex-row items-center flex-1`}>
                                            <LinearGradient
                                                colors={feedback.suitability === 'excellent' ? ['#10b981', '#059669'] :
                                                    feedback.suitability === 'good' ? ['#3b82f6', '#1d4ed8'] :
                                                        feedback.suitability === 'moderate' ? ['#f59e0b', '#d97706'] :
                                                            feedback.suitability === 'poor' ? ['#ef4444', '#dc2626'] : ['#dc2626', '#991b1b']}
                                                style={tw`w-10 h-10 rounded-2xl mr-2 items-center justify-center`}
                                            >
                                                <Ionicons
                                                    name={feedback.suitability === 'excellent' ? 'checkmark-circle' :
                                                        feedback.suitability === 'good' ? 'thumbs-up' :
                                                            feedback.suitability === 'moderate' ? 'warning' :
                                                                feedback.suitability === 'poor' ? 'alert-circle' : 'close-circle'}
                                                    size={20}
                                                    color="white"
                                                />
                                            </LinearGradient>
                                            <View style={tw`flex-1`}>
                                                <Text style={tw`text-lg font-bold text-gray-900 mb-1`}>
                                                    {feedback.status}
                                                </Text>
                                                <Text style={tw`text-gray-600 text-xs font-medium`}>
                                                    Health Score: {feedback.healthScore}/100
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={tw`text-xs text-gray-400`}>SCORE</Text>
                                    </View>
                                    {/* Temperature & Humidity Cards - cramped */}
                                    <View style={tw`flex-row justify-between mb-2`}>
                                        <LinearGradient
                                            colors={['#fee2e2', '#fecaca']}
                                            style={tw`flex-1 p-3 rounded-2xl mr-1`}
                                        >
                                            <View style={tw`flex-row items-center justify-between mb-1`}>
                                                <Ionicons name="thermometer" size={20} color="#ef4444" />
                                                <Text style={tw`text-red-600 text-xs font-bold`}>TEMP</Text>
                                            </View>
                                            <Text style={tw`text-red-800 text-xl font-black`}>
                                                {temperature}°C
                                            </Text>
                                            <View style={tw`flex-row items-center mt-1`}>
                                                {parseFloat(temperature) > 27 ? (
                                                    <>
                                                        <Ionicons name="flame" size={10} color="#dc2626" style={tw`mr-1`} />
                                                        <Text style={tw`text-red-600 text-xs font-semibold`}>High</Text>
                                                    </>
                                                ) : parseFloat(temperature) < 18 ? (
                                                    <>
                                                        <Ionicons name="snow" size={10} color="#2563eb" style={tw`mr-1`} />
                                                        <Text style={tw`text-red-600 text-xs font-semibold`}>Low</Text>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ionicons name="checkmark-circle" size={10} color="#059669" style={tw`mr-1`} />
                                                        <Text style={tw`text-red-600 text-xs font-semibold`}>Normal</Text>
                                                    </>
                                                )}
                                            </View>
                                        </LinearGradient>
                                        <LinearGradient
                                            colors={['#dbeafe', '#bfdbfe']}
                                            style={tw`flex-1 p-3 rounded-2xl ml-1`}
                                        >
                                            <View style={tw`flex-row items-center justify-between mb-1`}>
                                                <Ionicons name="water" size={20} color="#3b82f6" />
                                                <Text style={tw`text-blue-600 text-xs font-bold`}>HUMIDITY</Text>
                                            </View>
                                            <Text style={tw`text-blue-800 text-xl font-black`}>
                                                {humidity}%
                                            </Text>
                                            <View style={tw`flex-row items-center mt-1`}>
                                                {parseFloat(humidity) > 70 ? (
                                                    <>
                                                        <Ionicons name="water" size={10} color="#2563eb" style={tw`mr-1`} />
                                                        <Text style={tw`text-blue-600 text-xs font-semibold`}>High</Text>
                                                    </>
                                                ) : parseFloat(humidity) < 40 ? (
                                                    <>
                                                        <Ionicons name="sunny" size={10} color="#f59e0b" style={tw`mr-1`} />
                                                        <Text style={tw`text-blue-600 text-xs font-semibold`}>Low</Text>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ionicons name="checkmark-circle" size={10} color="#059669" style={tw`mr-1`} />
                                                        <Text style={tw`text-blue-600 text-xs font-semibold`}>Normal</Text>
                                                    </>
                                                )}
                                            </View>
                                        </LinearGradient>
                                    </View>
                                    {/* Live Monitoring Status - cramped */}
                                    <LinearGradient
                                        colors={['#fef3c7', '#fbbf24']}
                                        style={tw`p-3 rounded-2xl mb-2`}
                                    >
                                        <View style={tw`flex-row items-center justify-center`}>
                                            <View style={tw`w-2 h-2 bg-amber-600 rounded-full mr-2 animate-pulse`} />
                                            <View>
                                                <View style={tw`flex-row items-center`}>
                                                    <Ionicons name="flame" size={14} color="#92400e" style={tw`mr-1`} />
                                                    <Text style={tw`text-amber-900 font-bold text-xs`}>
                                                        CONTINUOUS MONITORING
                                                    </Text>
                                                </View>
                                                <Text style={tw`text-amber-700 text-xs font-medium`}>
                                                    Always active • Updates every 5 seconds
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={tw`text-xs text-amber-500 text-center`}>PHASE ACTIVE</Text>
                                    </LinearGradient>
                                </LinearGradient>
                            </Animated.View>
                        )}
                        {/* Extra noisy footer text */}
                        <View style={tw`mx-4 mb-4`}>
                            <Text style={tw`text-gray-400 text-xs text-center`}>ENV DATA LOG • {updateCount} UPDATES</Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
            {/* Stop button - floating noisy */}
            <TouchableOpacity
                onPress={stopRealTimeMonitoring}
                style={tw`absolute bottom-4 right-4 bg-red-500 p-3 rounded-full`}
            >
                <Ionicons name="stop-circle" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}