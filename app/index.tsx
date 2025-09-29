import { ActivityIndicator, Text, View } from 'react-native';

export default function Index() {

  return (
    <View className={`flex-1 justify-center items-center bg-white`}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className={`text-gray-600 mt-4`}>Loading...</Text>
    </View>
  );
}
