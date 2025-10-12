import React from 'react';
import { View, ActivityIndicator, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedText } from './ThemedComponents';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

// Skeleton placeholder component
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8, 
  style 
}) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        {
          width,
          height,
          backgroundColor: theme.border,
          borderRadius,
        },
        style
      ]}
    />
  );
};

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  color,
  text = 'Loading...' 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={tw`items-center justify-center py-8`}>
      <ActivityIndicator 
        size={size} 
        color={color || theme.primary} 
      />
      {text && (
        <ThemedText 
          variant="secondary" 
          size="sm" 
          style={tw`mt-3 text-center`}
        >
          {text}
        </ThemedText>
      )}
    </View>
  );
};

// Full screen loading
export const FullScreenLoading: React.FC<{ text?: string }> = ({ 
  text = 'Loading...' 
}) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        tw`flex-1 items-center justify-center`,
        { backgroundColor: theme.background }
      ]}
    >
      <View 
        style={[
          tw`p-8 rounded-2xl items-center`,
          { backgroundColor: theme.surface }
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText weight="medium" style={tw`mt-4`}>
          {text}
        </ThemedText>
      </View>
    </View>
  );
};

// Card skeleton loader
export const CardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        tw`p-4 m-2 rounded-xl`,
        { backgroundColor: theme.surface }
      ]}
    >
      <View style={tw`flex-row items-center mb-3`}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={tw`ml-3 flex-1`}>
          <Skeleton width="60%" height={16} style={tw`mb-2`} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      <Skeleton width="100%" height={12} style={tw`mb-2`} />
      <Skeleton width="80%" height={12} style={tw`mb-2`} />
      <Skeleton width="90%" height={12} />
    </View>
  );
};

// List skeleton loader
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </View>
  );
};

// Empty state component
interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder-outline',
  title,
  description,
  actionText,
  onAction
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={tw`flex-1 items-center justify-center p-8`}>
      <View 
        style={[
          tw`w-24 h-24 rounded-full items-center justify-center mb-6`,
          { backgroundColor: theme.primary + '15' }
        ]}
      >
        <Ionicons name={icon} size={48} color={theme.primary} />
      </View>
      
      <ThemedText size="xl" weight="bold" style={tw`text-center mb-2`}>
        {title}
      </ThemedText>
      
      {description && (
        <ThemedText 
          variant="secondary" 
          style={tw`text-center mb-6 px-4`}
        >
          {description}
        </ThemedText>
      )}
      
      {actionText && onAction && (
        <TouchableOpacity
          style={[
            tw`px-6 py-3 rounded-xl`,
            { backgroundColor: theme.primary }
          ]}
          onPress={onAction}
        >
          <ThemedText variant="inverse" weight="medium">
            {actionText}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Shimmer effect for loading placeholders
export const ShimmerPlaceholder: React.FC<SkeletonProps> = (props) => {
  const { theme } = useTheme();
  
  return (
    <LinearGradient
      colors={[
        theme.border,
        theme.divider,
        theme.border
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        {
          width: props.width || '100%',
          height: props.height || 20,
          borderRadius: props.borderRadius || 8,
        },
        props.style
      ]}
    />
  );
};

// Refresh control component
interface RefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
  title?: string;
}

export const RefreshControl: React.FC<RefreshControlProps> = ({
  refreshing,
  onRefresh,
  title = 'Pull to refresh'
}) => {
  const { theme } = useTheme();
  
  if (!refreshing) return null;
  
  return (
    <View style={tw`items-center py-4`}>
      <ActivityIndicator size="small" color={theme.primary} />
      <ThemedText variant="secondary" size="sm" style={tw`mt-2`}>
        {title}
      </ThemedText>
    </View>
  );
};

// Progressive loading component
interface ProgressLoadingProps {
  progress: number; // 0-100
  text?: string;
}

export const ProgressLoading: React.FC<ProgressLoadingProps> = ({
  progress,
  text = 'Loading...'
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={tw`items-center justify-center p-8`}>
      <View style={tw`w-full mb-4`}>
        <View 
          style={[
            tw`h-2 rounded-full`,
            { backgroundColor: theme.border }
          ]}
        >
          <View 
            style={[
              tw`h-2 rounded-full`,
              { 
                backgroundColor: theme.primary,
                width: `${progress}%`
              }
            ]}
          />
        </View>
      </View>
      
      <ThemedText weight="medium" style={tw`text-center mb-2`}>
        {text}
      </ThemedText>
      
      <ThemedText variant="secondary" size="sm">
        {Math.round(progress)}% complete
      </ThemedText>
    </View>
  );
};
