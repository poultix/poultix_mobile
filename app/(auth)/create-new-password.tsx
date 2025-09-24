import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import { router } from 'expo-router';

export default function CreateNewPasswordScreen() {
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreatePassword = () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Simulate password update success and navigate back
      router.back();
    });
  };

  return (
    <ImageBackground
      source={require('@/assets/images/chicken-farmer.webp')} // Replace with your image
      style={tw`flex-1`}
      imageStyle={tw`opacity-5`}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FFF7ED']} // White to light orange-cream gradient
        style={tw`flex-1`}
      >
        <SafeAreaView style={tw`flex-1`}>
          <StatusBar style="dark" backgroundColor="transparent" translucent />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1`}
          >
            <Animated.View style={[tw`flex-1 px-5 pt-12`, { opacity: fadeAnim }]}>
              {/* Header */}
              <View style={tw`flex-row items-center mb-8`}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={28} color="#6B7280" />
                </TouchableOpacity>
                <Text style={tw`text-gray-500 text-sm ml-4`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>

              <Text style={tw`text-4xl font-extrabold text-[#EF4444] mb-2`}>Create New Password</Text>
              <Text style={tw`text-gray-500 text-lg mb-10`}>
                Please, enter a new password below different from the previous password
              </Text>

              {/* Error Message */}
              {error && (
                <View style={tw`bg-red-50 px-4 py-3 rounded-xl border border-red-200 flex-row items-center mb-6`}>
                  <Ionicons name="alert-circle" size={22} color="#EF4444" style={tw`mr-2`} />
                  <Text style={tw`flex-1 text-red-600 font-medium text-sm`}>{error}</Text>
                  <TouchableOpacity onPress={() => setError(null)}>
                    <Ionicons name="close-circle" size={22} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}

              {/* New Password Input */}
              <View style={tw`bg-gray-100 rounded-xl p-4 mb-4 flex-row items-center`}>
                <TextInput
                  style={tw`flex-1 text-gray-900 text-base`}
                  placeholder="New password"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={tw`bg-gray-100 rounded-xl p-4 mb-8 flex-row items-center`}>
                <TextInput
                  style={tw`flex-1 text-gray-900 text-base`}
                  placeholder="Confirm password"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Create New Password Button */}
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
                  style={tw`rounded-2xl overflow-hidden shadow-2xl border border-white/20`}
                  onPress={handleCreatePassword}
                  activeOpacity={0.9}
                >
                  <View style={tw`bg-[#EF4444] py-4 items-center relative`}>
                    <Text style={tw`text-white text-lg font-semibold z-10`}>Create new password</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
