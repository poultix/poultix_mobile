import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  Vibration,
  Dimensions,
} from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import TopNavigation from '@/navigation/TopNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Feedback {
  isSick: boolean;
  status: string;
  description: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  color: string;
  bgColor: string;
}

interface PHReading {
  id: string;
  value: number;
  timestamp: Date;
  feedback: Feedback;
  chickenId?: string;
}

interface PHRange {
  min: number;
  max: number;
  label: string;
  color: string;
  description: string;
}

const getPhFeedback = (ph: number): Feedback => {
  if (ph < 4.5) {
    return {
      isSick: true,
      status: 'Severe Acidosis',
      description: 'pH is critically low. Immediate veterinary attention is needed.',
      severity: 'critical',
      color: '#DC2626',
      bgColor: '#FEF2F2',
      recommendations: [
        'Provide immediate access to clean, alkaline water.',
        'Consult a vet for electrolyte therapy.',
        'Avoid acidic feed.',
        'Monitor chicken closely for signs of distress.',
      ],
    };
  } else if (ph < 6.5) {
    return {
      isSick: true,
      status: 'Acidosis Warning',
      description: 'pH is below the normal range, indicating potential acidity issues.',
      severity: 'high',
      color: '#EA580C',
      bgColor: '#FFF7ED',
      recommendations: [
        'Adjust the diet with alkaline-rich feed.',
        'Add calcium supplements to water.',
        'Monitor for symptoms of diarrhea or stress.',
        'Increase fresh vegetable intake.',
      ],
    };
  } else if (ph <= 7.5) {
    return {
      isSick: false,
      status: 'Healthy Range',
      description: 'pH is within the optimal range. Your poultry is in excellent condition.',
      severity: 'low',
      color: '#059669',
      bgColor: '#ECFDF5',
      recommendations: [
        'Maintain current diet and hydration.',
        'Ensure a clean environment.',
        'Continue routine health checks.',
        'Keep up the excellent care!',
      ],
    };
  } else if (ph <= 8.5) {
    return {
      isSick: true,
      status: 'Alkalosis Warning',
      description: 'pH is above the normal range, indicating alkalinity issues.',
      severity: 'medium',
      color: '#D97706',
      bgColor: '#FFFBEB',
      recommendations: [
        'Avoid overuse of alkaline feed or medications.',
        'Ensure proper hydration with clean water.',
        'Consult a vet if symptoms persist.',
        'Review recent dietary changes.',
      ],
    };
  } else {
    return {
      isSick: true,
      status: 'Severe Alkalosis',
      description: 'pH is critically high. This may indicate kidney issues or dietary imbalance.',
      severity: 'critical',
      color: '#DC2626',
      bgColor: '#FEF2F2',
      recommendations: [
        'Seek veterinary assistance immediately.',
        'Provide balanced feed and avoid over-supplementing.',
        'Check water quality for high pH levels.',
        'Emergency vet consultation recommended.',
      ],
    };
  }
};

export default function PoultryPHInputScreen() {
  const [phReading, setPhReading] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [history, setHistory] = useState<PHReading[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [chickenId, setChickenId] = useState('');

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
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('ph_reading_history');
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

  const saveReading = async (reading: PHReading) => {
    try {
      const newHistory = [reading, ...history.slice(0, 9)]; // Keep last 10 readings
      setHistory(newHistory);
      await AsyncStorage.setItem('ph_reading_history', JSON.stringify(newHistory));
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

    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      scanAnim.stopAnimation();
      scanAnim.setValue(0);
      
      // Generate a realistic pH reading
      const simulatedPH = (Math.random() * 6 + 4).toFixed(1); // Random pH between 4.0 and 10.0
      setPhReading(simulatedPH);
      Vibration.vibrate([0, 100, 100, 100]);
      Alert.alert('Scan Complete!', `pH reading detected: ${simulatedPH}`, [
        { text: 'Analyze', onPress: () => handleSubmit(simulatedPH) }
      ]);
    }, 3000);
  };

  const handleSubmit = (customPh?: string) => {
    const ph = parseFloat(customPh || phReading);
    if (isNaN(ph) || ph < 0 || ph > 14) {
      setError('Please enter a valid pH value between 0 and 14.');
      Vibration.vibrate([0, 100, 100, 100]);
      return;
    }
    setError('');
    const feedbackResult = getPhFeedback(ph);
    setFeedback(feedbackResult);
    
    // Save to history
    const reading: PHReading = {
      id: Date.now().toString(),
      value: ph,
      timestamp: new Date(),
      feedback: feedbackResult,
      chickenId: chickenId || undefined
    };
    saveReading(reading);
    
    // Vibrate based on severity
    if (feedbackResult.severity === 'critical') {
      Vibration.vibrate([0, 200, 100, 200, 100, 200]);
    } else if (feedbackResult.severity === 'high') {
      Vibration.vibrate([0, 150, 100, 150]);
    } else if (feedbackResult.severity === 'low') {
      Vibration.vibrate(50);
    }
  };

  const handleReset = () => {
    setPhReading('');
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
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <TopNavigation />
      <ScrollView contentContainerStyle={tw`pb-20 px-6`} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header Section */}
          <LinearGradient
            colors={['#F97316', '#EA580C']}
            style={tw`rounded-3xl p-6 mb-6 shadow-lg`}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-2xl font-bold text-white mb-2`}>
                  🧪 pH Analyzer
                </Text>
                <Text style={tw`text-orange-100 text-sm opacity-90`}>
                  Advanced poultry health monitoring through stool analysis
                </Text>
              </View>
              <View style={tw`bg-white bg-opacity-20 rounded-2xl p-3`}>
                <Ionicons name="analytics-outline" size={32} color="white" />
              </View>
            </View>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={tw`flex-row justify-between mb-6`}>
            <View style={tw`bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm`}>
              <Text style={tw`text-gray-500 text-xs font-medium`}>TOTAL SCANS</Text>
              <Text style={tw`text-2xl font-bold text-gray-800`}>{history.length}</Text>
            </View>
            <View style={tw`bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm`}>
              <Text style={tw`text-gray-500 text-xs font-medium`}>LAST READING</Text>
              <Text style={tw`text-2xl font-bold text-gray-800`}>
                {history.length > 0 ? history[0].value.toFixed(1) : '--'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row justify-between mb-6`}>
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
                  {isScanning ? (
                    <Animated.View
                      style={{
                        transform: [{
                          rotate: scanAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg']
                          })
                        }]
                      }}
                    >
                      <Ionicons name="sync-outline" size={20} color="white" />
                    </Animated.View>
                  ) : (
                    <Ionicons name="scan-outline" size={20} color="white" />
                  )}
                  <Text style={tw`text-white font-semibold ml-2`}>
                    {isScanning ? 'Scanning...' : 'Smart Scan'}
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

          {error && (
            <View style={tw`bg-red-100 border border-red-300 p-4 rounded-xl flex-row items-center mb-6`}>
              <Ionicons name="alert-circle" size={22} color="#DC2626" style={tw`mr-2`} />
              <Text style={tw`text-red-600 font-medium flex-1`}>{error}</Text>
              <TouchableOpacity onPress={() => setError('')}>
                <Ionicons name="close-circle" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}

          {/* Manual Input Section */}
          {!feedback && !showHistory && (
            <View style={tw`bg-white rounded-2xl p-6 mb-6 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Manual pH Entry</Text>
              
              {/* Chicken ID Input */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 text-sm font-medium mb-2`}>Chicken ID (Optional)</Text>
                <View style={tw`bg-gray-50 rounded-xl p-4 flex-row items-center border border-gray-200`}>
                  <Ionicons name="pricetag-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                  <TextInput
                    style={tw`flex-1 text-base text-gray-800`}
                    placeholder="e.g., CH001, Hen-A"
                    placeholderTextColor="#9CA3AF"
                    value={chickenId}
                    onChangeText={setChickenId}
                  />
                </View>
              </View>

              {/* pH Input */}
              <View style={tw`mb-6`}>
                <Text style={tw`text-gray-600 text-sm font-medium mb-2`}>pH Reading</Text>
                <View style={tw`bg-gray-50 rounded-xl p-4 flex-row items-center border border-gray-200`}>
                  <Ionicons name="water-outline" size={20} color="#EF4444" style={tw`mr-3`} />
                  <TextInput
                    style={tw`flex-1 text-base text-gray-800`}
                    placeholder="Enter pH reading (0.0 - 14.0)"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={phReading}
                    onChangeText={setPhReading}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={tw`bg-orange-600 rounded-2xl p-4 shadow-lg`}
              >
                <Text style={tw`text-white font-semibold text-center text-lg`}>
                  Analyze pH Reading
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* History Section */}
          {showHistory && (
            <View style={tw`bg-white rounded-2xl p-6 mb-6 shadow-sm`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Reading History</Text>
              {history.length === 0 ? (
                <Text style={tw`text-gray-500 text-center py-8`}>No readings yet</Text>
              ) : (
                history.map((reading) => (
                  <View key={reading.id} style={tw`border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:mb-0`}>
                    <View style={tw`flex-row justify-between items-start mb-2`}>
                      <View style={tw`flex-1`}>
                        <Text style={tw`font-semibold text-gray-800`}>pH {reading.value.toFixed(1)}</Text>
                        <Text style={tw`text-sm text-gray-500`}>
                          {reading.timestamp.toLocaleDateString()} {reading.timestamp.toLocaleTimeString()}
                        </Text>
                        {reading.chickenId && (
                          <Text style={tw`text-xs text-blue-600`}>ID: {reading.chickenId}</Text>
                        )}
                      </View>
                      <View style={[tw`px-3 py-1 rounded-full`, { backgroundColor: reading.feedback.bgColor }]}>
                        <Text style={[tw`text-xs font-medium`, { color: reading.feedback.color }]}>
                          {reading.feedback.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Results Section */}
          {feedback && (
            <>
              <Card
                icon={feedback.isSick ? "alert-circle-outline" : "checkmark-circle-outline"}
                iconColor={feedback.color}
                title="Health Analysis"
              >
                <View style={[tw`p-4 rounded-xl mb-4`, { backgroundColor: feedback.bgColor }]}>
                  <Text style={[tw`text-lg font-bold mb-2`, { color: feedback.color }]}>
                    {feedback.status}
                  </Text>
                  <Text style={tw`text-gray-700 mb-2`}>
                    {feedback.description}
                  </Text>
                  <Text style={tw`text-sm text-gray-600`}>
                    Reading: pH {phReading} • Severity: {feedback.severity.toUpperCase()}
                  </Text>
                </View>
              </Card>

              <Card
                icon="medical-outline"
                iconColor={feedback.color}
                title="Recommendations"
              >
                {feedback.recommendations.map((tip, index) => (
                  <View key={index} style={tw`flex-row items-start mb-3 last:mb-0`}>
                    <View style={[tw`w-2 h-2 rounded-full mt-2 mr-3`, { backgroundColor: feedback.color }]} />
                    <Text style={tw`flex-1 text-gray-700 leading-6`}>{tip}</Text>
                  </View>
                ))}
              </Card>

              {feedback.isSick && (
                <Card
                  icon="location-outline"
                  iconColor="#3B82F6"
                  title="Next Steps"
                >
                  <View style={tw`space-y-3`}>
                    <TouchableOpacity style={tw`bg-blue-50 p-4 rounded-xl border border-blue-200`}>
                      <Text style={tw`text-blue-800 font-semibold mb-1`}>🏥 Find Veterinarian</Text>
                      <Text style={tw`text-blue-600 text-sm`}>Locate nearby veterinary services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`bg-green-50 p-4 rounded-xl border border-green-200`}>
                      <Text style={tw`text-green-800 font-semibold mb-1`}>💊 Find Pharmacy</Text>
                      <Text style={tw`text-green-600 text-sm`}>Get medications and supplements</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              )}

              <View style={tw`flex-row justify-between mt-6`}>
                <TouchableOpacity 
                  onPress={handleReset}
                  style={tw`flex-1 mr-2 bg-gray-100 p-4 rounded-2xl`}
                >
                  <Text style={tw`text-gray-700 font-semibold text-center`}>New Reading</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setShowHistory(true)}
                  style={tw`flex-1 ml-2 bg-blue-100 p-4 rounded-2xl`}
                >
                  <Text style={tw`text-blue-700 font-semibold text-center`}>View History</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
