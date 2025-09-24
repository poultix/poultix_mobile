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
        <Animated.View style={[tw`flex-1 px-6 pt-10`, { opacity: fadeAnim }]}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`h-12 w-12 items-center justify-center rounded-full bg-gray-100 shadow-md text-red-600`}
          >
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>

          {/* Key Icon in Red Circle */}
          <View style={tw`items-center mt-10`}>
            <View
              style={tw`w-20 h-20 rounded-full bg-red-600 items-center justify-center mb-6 shadow-lg border-4 border-red-700`}
            >
              <Ionicons name="key-outline" size={36} color="#fff" />
            </View>
          </View>

          {/* Title and Description */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-3xl text-red-600 font-extrabold text-center tracking-tight`}>
              Password Recovery
            </Text>
            <Text style={tw`text-gray-600 mt-3 text-center text-base leading-6`}>
              Enter your registered email to receive{'\n'}password reset instructions
            </Text>
          </View>

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
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}