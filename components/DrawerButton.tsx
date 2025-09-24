import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import { useDrawer } from '@/contexts/DrawerContext';

interface DrawerButtonProps {
  color?: string;
  size?: number;
  style?: any;
  backgroundColor?: string;
}

export default function DrawerButton({ 
  color = 'white', 
  size = 24, 
  style,
  backgroundColor = 'bg-white bg-opacity-20'
}: DrawerButtonProps) {
  const { setIsDrawerVisible } = useDrawer();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsDrawerVisible(true);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[tw`${backgroundColor} p-3 rounded-2xl`, style]}
      activeOpacity={0.7}
    >
      <Ionicons name="menu-outline" size={size} color={color} />
    </TouchableOpacity>
  );
}
