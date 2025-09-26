import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { MockAuthService } from '@/services/mockData';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import tw from 'twrnc';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSendEmail = async () => {
    try {router.push('/auth/verify-code');
      const result = await MockAuthService.forgotPassword(email);
      Alert.alert('Success', result.message);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
          {/* Header */}
          <View className="mb-8">
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              className="rounded-b-3xl p-8 shadow-xl"
            >
              <View className="items-center mt-4">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="absolute left-0 top-0 bg-white/20 p-3 rounded-2xl"
                >
                  <Ionicons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>

                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                  <Ionicons name="key" size={32} color="white" />
                </View>
                <Text className="text-white text-3xl font-bold mb-2">
                  Reset Password 🔑
                </Text>
                <Text className="text-red-100 text-base text-center">
                  Enter your email to receive reset instructions
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Form */}
          <View className="px-6">
            {/* Email Input */}
            <View className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm flex-row items-center px-4 h-14">
              <Ionicons name="mail-outline" size={22} color="#64748B" />
              <TextInput
                className="flex-1 ml-3 text-lg text-gray-800"
                placeholder="johndoe@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Send Email Button */}
            <TouchableOpacity
              onPress={handleSendEmail}
              activeOpacity={0.9}
              className="rounded-xl overflow-hidden shadow-lg mt-6"
            >
              <LinearGradient
                colors={['#FF6500', '#FF4C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 items-center justify-center"
              >
                <Text className="text-white font-bold text-lg tracking-wide">
                  Send Recovery Email
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
