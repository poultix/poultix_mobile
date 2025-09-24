import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function Tester() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>
          Test Screen
        </Text>
        <Text style={tw`text-gray-600 text-center mb-8`}>
          This is a test screen for development purposes.
        </Text>
        <TouchableOpacity
          style={tw`bg-blue-500 px-6 py-3 rounded-lg`}
          onPress={() => console.log('Test button pressed')}
        >
          <Text style={tw`text-white font-semibold`}>
            Test Button
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
