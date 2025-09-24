import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
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
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in animation

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSendEmail = async () => {
    try {
      const result = await MockAuthService.forgotPassword(email);
      Alert.alert('Success', result.message);
      router.push('/(auth)/verify-code' as any);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}
      >
        <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
          {/* Enhanced Header */}
          <View style={tw`mb-8`}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={tw`rounded-b-3xl p-8 shadow-xl`}
            >
              <View style={tw`items-center mt-4`}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={tw`absolute left-0 top-0 bg-white bg-opacity-20 p-3 rounded-2xl`}
                >
                  <Ionicons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>
                
                <View style={tw`w-20 h-20 bg-white bg-opacity-20 rounded-full items-center justify-center mb-4`}>
                  <Ionicons name="key" size={32} color="white" />
                </View>
                <Text style={tw`text-white text-3xl font-bold mb-2`}>
                  Reset Password 🔑
                </Text>
                <Text style={tw`text-red-100 text-base text-center`}>
                  Enter your email to receive reset instructions
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={tw`px-6`}>

          {/* Email Input */}
          <View style={tw`mt-10`}>
            <View style={tw`relative`}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#64748B"
                style={tw`absolute left-4 top-1/2 transform -translate-y-1/2`}
              />
              <TextInput
                style={tw`h-14 px-12 bg-gray-50 rounded-xl border border-gray-200 text-lg text-gray-800 shadow-sm`}
                placeholder="johndoe@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
              />
            </View>

            {/* Send Email Button */}
            <TouchableOpacity
              style={tw`h-14 bg-amber-500 rounded-xl items-center justify-center mt-6 shadow-lg`}
              activeOpacity={0.85}
              onPress={handleSendEmail}
            >
              <Text style={tw`text-white font-bold text-lg tracking-wide`}>
                Send Recovery Email
              </Text>
            </TouchableOpacity>
          </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}