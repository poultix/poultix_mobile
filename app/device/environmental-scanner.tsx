import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

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

const getEnvironmentalFeedback = (temperature: number, humidity: number): EnvironmentalFeedback => {
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

export default function EnvironmentalScannerScreen() {
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [feedback, setFeedback] = useState<EnvironmentalFeedback | null>(null);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(true); // Start with scanning true
    const [history, setHistory] = useState<EnvironmentalReading[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [location, setLocation] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const scanAnim = useRef(new Animated.Value(0)).current;
    const historyAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadHistory();
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.parallel([
                Animated.spring(cardAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
                Animated.spring(buttonAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
            ]),
        ]).start();

        // Auto-start scanning when component mounts
        setTimeout(() => {
            simulateScanning();
        }, 1000); // Small delay before starting scan
    }, []);

    const loadHistory = async () => {
        try {
            const savedHistory = await AsyncStorage.getItem('environmental_reading_history');
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                setHistory(parsedHistory.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp)
                })));
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    const saveReading = async (reading: EnvironmentalReading) => {
        try {
            const newHistory = [reading, ...history.slice(0, 9)]; // Keep last 10 readings
            setHistory(newHistory);
            await AsyncStorage.setItem('environmental_reading_history', JSON.stringify(newHistory));
        } catch (error) {
            console.error('Error saving reading:', error);
        }
    };

    const simulateScanning = () => {
        setIsScanning(true);
        Vibration.vibrate(100);

        // Animate scanning effect
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(scanAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Simulate scanning delay (2 seconds as requested)
        setTimeout(() => {
            setIsScanning(false);
            scanAnim.stopAnimation();
            scanAnim.setValue(0);

            // Generate realistic environmental readings for Rwanda
            const simulatedTemp = (Math.random() * 15 + 15).toFixed(1); // 15-30°C
            const simulatedHumidity = (Math.random() * 40 + 30).toFixed(0); // 30-70%

            setTemperature(simulatedTemp);
            setHumidity(simulatedHumidity);
            Vibration.vibrate([0, 100, 100, 100]);

            // Auto-analyze the readings
            handleSubmit(simulatedTemp, simulatedHumidity);
        }, 2000); // 2 second scan as requested
    };

    const handleSubmit = (customTemp?: string, customHumidity?: string) => {
        const temp = parseFloat(customTemp || temperature);
        const humid = parseFloat(customHumidity || humidity);

        if (isNaN(temp) || temp < 0 || temp > 50) {
            setError('Please enter a valid temperature between 0°C and 50°C.');
            Vibration.vibrate([0, 100, 100, 100]);
            return;
        }

        if (isNaN(humid) || humid < 0 || humid > 100) {
            setError('Please enter a valid humidity between 0% and 100%.');
            Vibration.vibrate([0, 100, 100, 100]);
            return;
        }

        setError('');
        const feedbackResult = getEnvironmentalFeedback(temp, humid);
        setFeedback(feedbackResult);

        // Save to history
        const reading: EnvironmentalReading = {
            id: Date.now().toString(),
            temperature: temp,
            humidity: humid,
            timestamp: new Date(),
            feedback: feedbackResult,
            location: location || 'Farm Location'
        };
        saveReading(reading);

        // Vibrate based on suitability
        if (feedbackResult.suitability === 'critical') {
            Vibration.vibrate([0, 200, 100, 200, 100, 200]);
        } else if (feedbackResult.suitability === 'poor') {
            Vibration.vibrate([0, 150, 100, 150]);
        } else if (feedbackResult.suitability === 'excellent') {
            Vibration.vibrate(50);
        }
    };

    const handleReset = () => {
        setTemperature('');
        setHumidity('');
        setFeedback(null);
        setError('');
    };

    const Card = ({ icon, iconColor, title, children }: { icon: keyof typeof Ionicons.glyphMap; iconColor: string; title: string; children: React.ReactNode }) => (
        <Animated.View
            style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
                opacity: cardAnim,
                transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            }}
        >
            <View style={tw`flex-row items-center mb-4`}>
                <Ionicons name={icon} size={28} color={iconColor} style={tw`mr-3`} />
                <Text style={tw`text-lg font-bold text-gray-900`}>{title}</Text>
            </View>
            {children}
        </Animated.View>
    );

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <ScrollView contentContainerStyle={tw`pb-20 `} showsVerticalScrollIndicator={false}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    {/* Enhanced Header Section */}
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={tw` p-8 mb-6 shadow-xl`}
                    >
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <TouchableOpacity
                                className="p-3 rounded-2xl"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <View style={tw``}>
                                <Text style={tw`text-white text-sm opacity-90`}>
                                    Environmental Analysis Tool
                                </Text>
                                <Text style={tw`text-white text-2xl font-bold`}>
                                    Climate Scanner
                                </Text>
                                <Text style={tw`text-green-100 text-sm mt-1`}>
                                    Assess poultry environment suitability
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                            >
                                <Ionicons name="thermometer-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    {/* Quick Stats */}
                    <View style={tw`flex-row justify-between mb-6 px-4`}>
                        <View style={tw`bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm`}>
                            <Text style={tw`text-gray-500 text-xs font-medium`}>TOTAL SCANS</Text>
                            <Text style={tw`text-2xl font-bold text-gray-800`}>{history.length}</Text>
                        </View>
                        <View style={tw`bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm`}>
                            <Text style={tw`text-gray-500 text-xs font-medium`}>AVG HEALTH SCORE</Text>
                            <Text style={tw`text-2xl font-bold text-gray-800`}>
                                {history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.feedback.healthScore, 0) / history.length) : '--'}
                            </Text>
                        </View>
                    </View>

                    {/* Scanning State */}
                    {isScanning && (
                        <View style={tw`bg-white rounded-2xl p-8 mb-6 mx-4 shadow-sm items-center`}>
                            <Animated.View
                                style={{
                                    transform: [{
                                        rotate: scanAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '360deg']
                                        })
                                    }],
                                    marginBottom: 20
                                }}
                            >
                                <Ionicons name="scan-outline" size={48} color="#10B981" />
                            </Animated.View>
                            <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Scanning Your Farm</Text>
                            <Text style={tw`text-gray-600 text-center mb-4`}>
                                Analyzing environmental conditions to assess poultry health...
                            </Text>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse`} />
                                <Text style={tw`text-green-600 font-medium`}>Detecting temperature & humidity</Text>
                            </View>
                        </View>
                    )}

                    {/* Action Buttons - Only show after scanning is complete */}
                    {!isScanning && !feedback && (
                        <View style={tw`flex-row justify-between mb-6 px-4`}>
                            <TouchableOpacity
                                style={tw`flex-1 mr-2`}
                                onPress={simulateScanning}
                                disabled={isScanning}
                            >
                                <LinearGradient
                                    colors={isScanning ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']}
                                    style={tw`rounded-2xl p-4 shadow-lg`}
                                >
                                    <View style={tw`flex-row items-center justify-center`}>
                                        <Ionicons name="scan-outline" size={20} color="white" />
                                        <Text style={tw`text-white font-semibold ml-2`}>
                                            Rescan Farm
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={tw`flex-1 ml-2`}
                                onPress={() => setShowHistory(!showHistory)}
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#2563EB']}
                                    style={tw`rounded-2xl p-4 shadow-lg`}
                                >
                                    <View style={tw`flex-row items-center justify-center`}>
                                        <Ionicons name="time-outline" size={20} color="white" />
                                        <Text style={tw`text-white font-semibold ml-2`}>History</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {error && (
                        <View style={tw`bg-red-100 border border-red-300 p-4 rounded-xl flex-row items-center mb-6 mx-4`}>
                            <Ionicons name="alert-circle" size={22} color="#DC2626" style={tw`mr-2`} />
                            <Text style={tw`text-red-600 font-medium flex-1`}>{error}</Text>
                            <TouchableOpacity onPress={() => setError('')}>
                                <Ionicons name="close-circle" size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Manual Input Section */}
                    {!feedback && !showHistory && (
                        <View style={tw`bg-white rounded-2xl p-6 mb-6 mx-4 shadow-sm`}>
                            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Manual Environmental Entry</Text>

                            {/* Temperature Input */}
                            <View style={tw`mb-4`}>
                                <Text style={tw`text-gray-600 text-sm font-medium mb-2`}>Temperature (°C)</Text>
                                <View style={tw`bg-gray-50 rounded-2xl p-4 py-1 flex-row items-center border border-gray-200`}>
                                    <Ionicons name="thermometer-outline" size={20} color="#EF4444" style={tw`mr-3`} />
                                    <TextInput
                                        style={tw`flex-1 text-base text-gray-800`}
                                        placeholder="Enter temperature (0-50°C)"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        value={temperature}
                                        onChangeText={setTemperature}
                                    />
                                </View>
                            </View>

                            {/* Humidity Input */}
                            <View style={tw`mb-6`}>
                                <Text style={tw`text-gray-600 text-sm font-medium mb-2`}>Humidity (%)</Text>
                                <View style={tw`bg-gray-50 rounded-2xl p-4 py-1 flex-row items-center border border-gray-200`}>
                                    <Ionicons name="water-outline" size={20} color="#3B82F6" style={tw`mr-3`} />
                                    <TextInput
                                        style={tw`flex-1 text-base text-gray-800`}
                                        placeholder="Enter humidity (0-100%)"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        value={humidity}
                                        onChangeText={setHumidity}
                                    />
                                </View>
                            </View>

                            {/* Location Input */}
                            <View style={tw`mb-6`}>
                                <Text style={tw`text-gray-600 text-sm font-medium mb-2`}>Location (Optional)</Text>
                                <View style={tw`bg-gray-50 rounded-2xl p-4 py-1 flex-row items-center border border-gray-200`}>
                                    <Ionicons name="location-outline" size={20} color="#10B981" style={tw`mr-3`} />
                                    <TextInput
                                        style={tw`flex-1 text-base text-gray-800`}
                                        placeholder="e.g., Kigali Farm, Gasabo District"
                                        placeholderTextColor="#9CA3AF"
                                        value={location}
                                        onChangeText={setLocation}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleSubmit()}
                                style={tw`bg-green-600 rounded-2xl p-4 py-3 shadow-lg`}
                            >
                                <Text style={tw`text-white font-semibold text-center text-lg`}>
                                    Analyze Environment
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* History Section */}
                    {showHistory && (
                        <View style={tw`bg-white rounded-2xl p-6 mb-6 mx-4 shadow-sm `}>
                            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Environmental History</Text>
                            {history.length === 0 ? (
                                <Text style={tw`text-gray-500 text-center py-8`}>No readings yet</Text>
                            ) : (
                                history.map((reading) => (
                                    <View key={reading.id} style={tw`border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:mb-0`}>
                                        <View style={tw`flex-row justify-between items-start mb-2`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={tw`font-semibold text-gray-800`}>
                                                    {reading.temperature}°C • {reading.humidity}% Humidity
                                                </Text>
                                                <Text style={tw`text-sm text-gray-500`}>
                                                    {reading.timestamp.toLocaleDateString()} {reading.timestamp.toLocaleTimeString()}
                                                </Text>
                                                {reading.location && (
                                                    <Text style={tw`text-xs text-green-600`}>{reading.location}</Text>
                                                )}
                                            </View>
                                            <View style={[tw`px-3 py-1 rounded-full`, { backgroundColor: reading.feedback.bgColor }]}>
                                                <Text style={[tw`text-xs font-medium`, { color: reading.feedback.color }]}>
                                                    {reading.feedback.suitability.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={tw`flex-row items-center mt-2`}>
                                            <Ionicons name="heart-outline" size={14} color="#6B7280" style={tw`mr-1`} />
                                            <Text style={tw`text-sm text-gray-600`}>Health Score: {reading.feedback.healthScore}/100</Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    )}

                    {/* Results Section */}
                    {feedback && (
                        <View className='px-4'>
                            <Card
                                icon={feedback.suitability === 'excellent' || feedback.suitability === 'good' ? "checkmark-circle-outline" : "alert-circle-outline"}
                                iconColor={feedback.color}
                                title="Current Farm Condition"
                            >
                                <View style={[tw`p-4 rounded-xl mb-4`, { backgroundColor: feedback.bgColor }]}>
                                    <View style={tw`flex-row justify-between items-start mb-3`}>
                                        <Text style={[tw`text-lg font-bold`, { color: feedback.color }]}>
                                            {feedback.status}
                                        </Text>
                                        <View style={tw`bg-white bg-opacity-20 px-2 py-1 rounded-full`}>
                                            <Text style={[tw`text-xs font-bold`, { color: feedback.color }]}>
                                                Health Score: {feedback.healthScore}/100
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={tw`mb-3`}>
                                        <Text style={tw`text-gray-700 mb-2`}>
                                            <Text style={tw`font-semibold`}>Current Readings:</Text> {temperature}°C • {humidity}% Humidity
                                        </Text>
                                        <Text style={tw`text-gray-700 text-sm`}>
                                            <Text style={tw`font-semibold`}>Assessment:</Text> {feedback.suitability.toUpperCase()} suitability for poultry health
                                        </Text>
                                    </View>

                                    {/* Health Score Gauge */}
                                    <View style={tw`mb-3`}>
                                        <View style={tw`flex-row justify-between mb-1`}>
                                            <Text style={tw`text-sm font-medium text-gray-700`}>Environmental Health</Text>
                                            <Text style={tw`text-sm font-medium text-gray-700`}>{feedback.healthScore}%</Text>
                                        </View>
                                        <View style={tw`bg-gray-200 rounded-full h-4`}>
                                            <View
                                                style={[
                                                    tw`h-4 rounded-full`,
                                                    {
                                                        width: `${feedback.healthScore}%`,
                                                        backgroundColor: feedback.color
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <View style={tw`flex-row justify-between mt-1`}>
                                            <Text style={tw`text-xs text-gray-500`}>Critical</Text>
                                            <Text style={tw`text-xs text-gray-500`}>Poor</Text>
                                            <Text style={tw`text-xs text-gray-500`}>Moderate</Text>
                                            <Text style={tw`text-xs text-gray-500`}>Good</Text>
                                            <Text style={tw`text-xs text-gray-500`}>Excellent</Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>

                            <Card
                                icon="shield-checkmark-outline"
                                iconColor="#059669"
                                title="Disease Prevention Actions"
                            >
                                <Text style={tw`text-gray-700 mb-4`}>
                                    Based on your current farm conditions, here are targeted actions to prevent chicken diseases:
                                </Text>

                                <View style={tw`space-y-3`}>
                                    {/* Temperature-based actions */}
                                    {parseFloat(temperature) > 30 && (
                                        <View style={tw`bg-red-50 border border-red-200 rounded-xl p-4`}>
                                            <View style={tw`flex-row items-start mb-2`}>
                                                <Ionicons name="thermometer" size={20} color="#DC2626" style={tw`mr-3 mt-1`} />
                                                <View style={tw`flex-1`}>
                                                    <Text style={tw`text-red-800 font-semibold`}>HEAT STRESS PREVENTION</Text>
                                                    <Text style={tw`text-red-700 text-sm mt-1`}>
                                                        Current: {temperature}°C (Too Hot - Risk of heat stress)
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={tw`space-y-2`}>
                                                <Text style={tw`text-gray-700 text-sm font-medium`}>Immediate Actions:</Text>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Install shade structures immediately</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Provide cool drinking water (add ice blocks)</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Increase ventilation fans or open windows</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Spray water on roof to cool the coop</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    {parseFloat(temperature) < 18 && (
                                        <View style={tw`bg-blue-50 border border-blue-200 rounded-xl p-4`}>
                                            <View style={tw`flex-row items-start mb-2`}>
                                                <Ionicons name="snow" size={20} color="#2563EB" style={tw`mr-3 mt-1`} />
                                                <View style={tw`flex-1`}>
                                                    <Text style={tw`text-blue-800 font-semibold`}>COLD STRESS PREVENTION</Text>
                                                    <Text style={tw`text-blue-700 text-sm mt-1`}>
                                                        Current: {temperature}°C (Too Cold - Risk of cold stress)
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={tw`space-y-2`}>
                                                <Text style={tw`text-gray-700 text-sm font-medium`}>Immediate Actions:</Text>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Close windows and doors to retain heat</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Provide warm bedding (straw/hay)</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Use heat lamps or brooders</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Increase feed intake (higher energy feed)</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    {/* Humidity-based actions */}
                                    {parseFloat(humidity) > 75 && (
                                        <View style={tw`bg-orange-50 border border-orange-200 rounded-xl p-4`}>
                                            <View style={tw`flex-row items-start mb-2`}>
                                                <Ionicons name="water" size={20} color="#F59E0B" style={tw`mr-3 mt-1`} />
                                                <View style={tw`flex-1`}>
                                                    <Text style={tw`text-orange-800 font-semibold`}>HUMIDITY CONTROL</Text>
                                                    <Text style={tw`text-orange-700 text-sm mt-1`}>
                                                        Current: {humidity}% (Too Humid - Risk of respiratory diseases)
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={tw`space-y-2`}>
                                                <Text style={tw`text-gray-700 text-sm font-medium`}>Immediate Actions:</Text>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Install exhaust fans for better ventilation</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Use dehumidifiers if available</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Increase litter depth to absorb moisture</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Clean and dry the coop thoroughly</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    {parseFloat(humidity) < 35 && (
                                        <View style={tw`bg-yellow-50 border border-yellow-200 rounded-xl p-4`}>
                                            <View style={tw`flex-row items-start mb-2`}>
                                                <Ionicons name="sunny" size={20} color="#D97706" style={tw`mr-3 mt-1`} />
                                                <View style={tw`flex-1`}>
                                                    <Text style={tw`text-yellow-800 font-semibold`}>HUMIDITY INCREASE</Text>
                                                    <Text style={tw`text-yellow-700 text-sm mt-1`}>
                                                        Current: {humidity}% (Too Dry - Risk of dehydration)
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={tw`space-y-2`}>
                                                <Text style={tw`text-gray-700 text-sm font-medium`}>Immediate Actions:</Text>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Provide constant access to fresh water</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Add electrolytes to drinking water</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Use humidifiers or water trays</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>•</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Reduce ventilation to retain moisture</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    {/* General good condition actions */}
                                    {feedback.suitability === 'excellent' || feedback.suitability === 'good' ? (
                                        <View style={tw`bg-green-50 border border-green-200 rounded-xl p-4`}>
                                            <View style={tw`flex-row items-start mb-2`}>
                                                <Ionicons name="checkmark-circle" size={20} color="#059669" style={tw`mr-3 mt-1`} />
                                                <View style={tw`flex-1`}>
                                                    <Text style={tw`text-green-800 font-semibold`}>MAINTAIN EXCELLENT CONDITIONS</Text>
                                                    <Text style={tw`text-green-700 text-sm mt-1`}>
                                                        Your farm conditions are currently excellent!
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={tw`space-y-2`}>
                                                <Text style={tw`text-gray-700 text-sm font-medium`}>Continue These Practices:</Text>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>✓</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Keep monitoring conditions regularly</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>✓</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Maintain current ventilation and shade systems</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>✓</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Continue daily health checks</Text>
                                                </View>
                                                <View style={tw`flex-row items-start`}>
                                                    <Text style={tw`text-green-600 mr-2`}>✓</Text>
                                                    <Text style={tw`text-gray-700 text-sm`}>Keep records of environmental readings</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ) : null}
                                </View>

                                <Text style={tw`text-gray-600 text-xs mt-4`}>
                                    💡 These actions are based on current environmental readings and can help prevent common poultry diseases.
                                </Text>
                            </Card>

                            {/* Real-time Improvement Simulator */}
                            {(feedback.suitability === 'moderate' || feedback.suitability === 'poor') && (
                                <Card
                                    icon="bulb-outline"
                                    iconColor="#3B82F6"
                                    title="Real-time Improvement Simulator"
                                >
                                    <Text style={tw`text-gray-700 mb-4`}>
                                        See how small changes can improve your farm's health score:
                                    </Text>

                                    <View style={tw`space-y-3`}>
                                        {parseFloat(temperature) > 27 && (
                                            <TouchableOpacity
                                                style={tw`bg-blue-50 border border-blue-200 rounded-xl p-3`}
                                                onPress={() => Alert.alert('Improvement', 'If you add shade structures, temperature could drop by 5-8°C, improving health score by 15-20 points.')}
                                            >
                                                <Text style={tw`text-blue-800 font-medium text-sm`}>🛡️ Add Shade Structure</Text>
                                                <Text style={tw`text-blue-600 text-xs`}>Could improve health score by +15-20 points</Text>
                                            </TouchableOpacity>
                                        )}

                                        {parseFloat(humidity) > 70 && (
                                            <TouchableOpacity
                                                style={tw`bg-blue-50 border border-blue-200 rounded-xl p-3`}
                                                onPress={() => Alert.alert('Improvement', 'Installing ventilation fans could reduce humidity by 10-15%, improving health score by 10-15 points.')}
                                            >
                                                <Text style={tw`text-blue-800 font-medium text-sm`}>💨 Improve Ventilation</Text>
                                                <Text style={tw`text-blue-600 text-xs`}>Could improve health score by +10-15 points</Text>
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity
                                            style={tw`bg-green-50 border border-green-200 rounded-xl p-3`}
                                            onPress={() => Alert.alert('Improvement', 'Regular environmental monitoring ensures early detection of problems, maintaining high health scores.')}
                                        >
                                            <Text style={tw`text-green-800 font-medium text-sm`}>📊 Regular Monitoring</Text>
                                            <Text style={tw`text-green-600 text-xs`}>Prevents score drops through early intervention</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={tw`text-gray-600 text-xs mt-4 text-center`}>
                                        Tap any improvement to see potential impact on your farm's health score
                                    </Text>
                                </Card>
                            )}

                            <Card
                                icon="medical-outline"
                                iconColor={feedback.color}
                                title="Disease Prevention Recommendations"
                            >
                                {feedback.recommendations.map((tip, index) => (
                                    <View key={index} style={tw`flex-row items-start mb-3 last:mb-0`}>
                                        <View style={[tw`w-2 h-2 rounded-full mt-2 mr-3`, { backgroundColor: feedback.color }]} />
                                        <Text style={tw`flex-1 text-gray-700 leading-6`}>{tip}</Text>
                                    </View>
                                ))}
                            </Card>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}
