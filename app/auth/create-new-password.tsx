import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from 'twrnc';
 

export default function CreateNewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewFocused, setIsNewFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

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
    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  // Reusable Input Component
  const PasswordInput = ({
    value,
    onChangeText,
    placeholder,
    show,
    setShow,
    isFocused,
    setIsFocused,
  }: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    show: boolean;
    setShow: (val: boolean) => void;
    isFocused: boolean;
    setIsFocused: (val: boolean) => void;
  }) => (
    <View
      style={tw`w-full flex-row items-center px-4 h-14 mb-4 rounded-xl border shadow-sm ${isFocused ? 'border-amber-500' : 'border-gray-200'} bg-white`}
    >
      <Ionicons name="key-outline" size={22} color="#64748B" />
      <TextInput
        style={tw`flex-1 ml-3 text-gray-900 text-base`}
        placeholder={placeholder}
        placeholderTextColor="#94A3AF"
        secureTextEntry={!show}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={() => setShow(!show)}>
        <Ionicons
          name={show ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color="#64748B"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/chicken-farmer.webp')}
      style={tw`flex-1`}
      imageStyle={tw`opacity-5`}
    >
      <LinearGradient
        colors={['#FFF7ED', '#FFEDD5']}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1`}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1`}
          >
            <Animated.View style={[tw`flex-1 px-5 pt-12`, { opacity: fadeAnim }]}>
              {/* Header */}
              <Text style={tw`text-4xl font-extrabold text-[#F97316] mb-2`}>
                Create New Password
              </Text>
              <Text style={tw`text-gray-500 text-lg mb-10`}>
                Enter a new password different from your previous password
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
              <PasswordInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                show={showNewPassword}
                setShow={setShowNewPassword}
                isFocused={isNewFocused}
                setIsFocused={setIsNewFocused}
              />

              {/* Confirm Password Input */}
              <PasswordInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                isFocused={isConfirmFocused}
                setIsFocused={setIsConfirmFocused}
              />

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
                  <View style={tw`bg-[#F97316] py-4 items-center`}>
                    <Text style={tw`text-white text-lg font-semibold`}>
                      Create new password
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
