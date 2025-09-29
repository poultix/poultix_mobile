import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import { useDrawer } from '@/contexts/DrawerContext';

interface FloatingDrawerButtonProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  backgroundColor?: string;
}

export default function FloatingDrawerButton({ 
  position = 'top-left',
  color = 'white',
  backgroundColor = '#3B82F6'
}: FloatingDrawerButtonProps) {
  const { setIsDrawerVisible } = useDrawer();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsDrawerVisible(true);
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top-left':
        return tw`absolute top-12 left-4 z-50`;
      case 'top-right':
        return tw`absolute top-12 right-4 z-50`;
      case 'bottom-left':
        return tw`absolute bottom-8 left-4 z-50`;
      case 'bottom-right':
        return tw`absolute bottom-8 right-4 z-50`;
      default:
        return tw`absolute top-12 left-4 z-50`;
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        getPositionStyle(),
        tw`w-14 h-14 rounded-full items-center justify-center shadow-lg`,
        { backgroundColor }
      ]}
      activeOpacity={0.8}
    >
      <Ionicons name="menu-outline" size={24} color={color} />
    </TouchableOpacity>
  );
}
