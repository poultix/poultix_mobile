import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import TopNavigation from '../navigation/TopNavigation';

interface Feedback {
  isSick: boolean;
  status: string;
  description: string;
  recommendations: string[];
}

const getPhFeedback = (ph: number) => {
  if (ph < 4.5) {
    return {
      isSick: true,
      status: 'Severe Acidosis',
      description: 'pH is critically low. Immediate veterinary attention is needed.',
      recommendations: [
        'Provide immediate access to clean, alkaline water.',
        'Consult a vet for electrolyte therapy.',
        'Avoid acidic feed.',
      ],
    };
  } else if (ph < 6.5) {
    return {
      isSick: true,
      status: 'Acidosis Warning',
      description: 'pH is below the normal range, indicating potential acidity issues.',
      recommendations: [
        'Adjust the diet with alkaline-rich feed.',
        'Add calcium supplements.',
        'Monitor for symptoms of diarrhea or stress.',
      ],
    };
  } else if (ph <= 7.5) {
    return {
      isSick: false,
      status: 'Normal',
      description: 'pH is within the healthy range. Your poultry is likely in good condition.',
      recommendations: [
        'Maintain current diet and hydration.',
        'Ensure a clean environment.',
        'Continue routine health checks.',
      ],
    };
  } else if (ph <= 8.5) {
    return {
      isSick: true,
      status: 'Alkalosis Warning',
      description: 'pH is above the normal range, indicating alkalinity issues.',
      recommendations: [
        'Avoid overuse of alkaline feed or medications.',
        'Ensure proper hydration.',
        'Consult a vet if symptoms persist.',
      ],
    };
  } else {
    return {
      isSick: true,
      status: 'Severe Alkalosis',
      description: 'pH is critically high. This may indicate kidney issues or dietary imbalance.',
      recommendations: [
        'Seek veterinary assistance immediately.',
        'Provide balanced feed and avoid over-supplementing.',
        'Check water quality for high pH levels.',
      ],
    };
  }
};

export default function PoultryPHInputScreen() {
  const [phReading, setPhReading] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(cardAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(buttonAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleSubmit = () => {
    const ph = parseFloat(phReading);
    if (isNaN(ph) || ph < 0 || ph > 14) {
      setError('Please enter a valid pH value between 0 and 14.');
      return;
    }
    setError('');
    setFeedback(getPhFeedback(ph));
  };

  const handleReset = () => {
    setPhReading('');
    setFeedback(null);
    setError('');
  };

  const Card = ({ icon, iconColor, title, children }: { icon: string; iconColor: string; title: string; children: React.ReactNode }) => (
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
    <SafeAreaView style={tw`flex-1`}>
      
      <TopNavigation />
      <ScrollView contentContainerStyle={tw`bg-white pb-20 px-6`}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={tw`text-base text-gray-500 mb-8`}>
            Enter the pH reading of your poultry's stool to check for health issues.
          </Text>

          {error && (
            <View style={tw`bg-red-100 border border-red-300 p-4 rounded-xl flex-row items-center mb-6`}>
              <Ionicons name="alert-circle" size={22} color="#DC2626" style={tw`mr-2`} />
              <Text style={tw`text-red-600 font-medium flex-1`}>{error}</Text>
              <TouchableOpacity onPress={() => setError('')}>
                <Ionicons name="close-circle" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}

          {!feedback ? (
            <>
              <View style={tw`bg-gray-100 rounded-xl p-4 flex-row items-center border border-gray-200 mb-6`}>
                <TextInput
                  style={tw`flex-1 text-base text-gray-800`}
                  placeholder="Enter pH reading (e.g., 6.5)"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={phReading}
                  onChangeText={setPhReading}
                />
                <Ionicons name="water-outline" size={22} color="#EF4444" />
              </View>

              <Animated.View
                style={{
                  opacity: buttonAnim,
                  transform: [
                    {
                      scale: buttonAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={tw`py-4 px-6 bg-orange-600 rounded-2xl items-center`}
                  onPress={handleSubmit}
                >
                  <Text style={tw`text-white font-semibold text-base`}>Submit Reading</Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <>
              <Card
                icon={feedback.isSick ? 'alert-circle-outline' : 'checkmark-circle-outline'}
                iconColor={feedback.isSick ? '#DC2626' : '#10B981'}
                title="Health Status"
              >
                <Text style={tw`text-base mb-4 text-gray-700`}>
                  {feedback.description} (Your input: pH {phReading})
                </Text>
              </Card>

              <Card
                icon={feedback.isSick ? 'medkit-outline' : 'heart-outline'}
                iconColor={feedback.isSick ? '#EF4444' : '#10B981'}
                title={feedback.isSick ? 'Recommendations' : 'Health Tips'}
              >
                {feedback.recommendations.map((tip, index) => (
                  <Text key={index} style={tw`text-sm text-gray-700 mb-2`}>
                    • {tip}
                  </Text>
                ))}
              </Card>
              {feedback.isSick && (
                <Card
                  icon="information-circle-outline"
                  iconColor="#3B82F6"
                  title="Vet & Pharmacy Recommendations"
                >
                  <Text style={tw`text-sm text-gray-700 mb-2`}>
                    • Visit the nearest vet for diagnosis and proper treatment.
                  </Text>
                  <Text style={tw`text-sm text-gray-700 mb-2`}>
                    • Look for veterinary pharmacies nearby for electrolyte supplements and medications.
                  </Text>
                  <Text style={tw`text-sm text-gray-700 mb-2`}>
                    • Ensure any medication used is approved for poultry and dosage is vet-advised.
                  </Text>
                </Card>
              )}

              <TouchableOpacity onPress={handleReset} style={tw`mt-2 py-3`}>
                <Text style={tw`text-blue-600 font-semibold text-center`}>Reset</Text>
              </TouchableOpacity>
            </>
          )}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
