import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedText } from './ThemedComponents';
import DrawerButton from '@/components/DrawerButton';
import tw from 'twrnc';

interface ThemedHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    showDrawer?: boolean;
    rightComponent?: React.ReactNode;
    gradient?: boolean;
    style?: ViewStyle;
    onBackPress?: () => void;
}

export const ThemedHeader: React.FC<ThemedHeaderProps> = ({
    title,
    subtitle,
    showBack = false,
    showDrawer = false,
    rightComponent,
    gradient = true,
    style,
    onBackPress,
}) => {
    const { theme } = useTheme();
    const router = useRouter();
    
    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };
    
    const content = (
        <View style={[tw`px-6 py-4`, style]}>
            <View style={tw`flex-row items-center justify-between`}>
                {/* Left side */}
                <View style={tw`flex-row items-center flex-1`}>
                    {showBack && (
                        <TouchableOpacity
                            style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-4`}
                            onPress={handleBackPress}
                        >
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>
                    )}
                    
                    <View style={tw`flex-1`}>
                        <ThemedText 
                            variant="inverse" 
                            size="2xl" 
                            weight="bold"
                            style={tw`mb-1`}
                        >
                            {title}
                        </ThemedText>
                        {subtitle && (
                            <ThemedText 
                                variant="inverse" 
                                size="sm"
                                style={tw`opacity-80`}
                            >
                                {subtitle}
                            </ThemedText>
                        )}
                    </View>
                </View>
                
                {/* Right side */}
                <View style={tw`flex-row items-center`}>
                    {rightComponent}
                    {showDrawer && <DrawerButton />}
                </View>
            </View>
        </View>
    );
    
    if (gradient) {
        return (
            <LinearGradient
                colors={[theme.primary, theme.primaryDark]}
                style={tw`shadow-xl`}
            >
                {content}
            </LinearGradient>
        );
    }
    
    return (
        <View style={[{ backgroundColor: theme.primary }, tw`shadow-xl`]}>
            {content}
        </View>
    );
};

// Specialized header variants
export const DashboardHeader: React.FC<{
    userName: string;
    userRole: string;
    subtitle?: string;
    rightComponent?: React.ReactNode;
}> = ({ userName, userRole, subtitle, rightComponent }) => {
    const { theme } = useTheme();
    
    return (
        <ThemedHeader
            title={`Welcome, ${userName}`}
            subtitle={subtitle || `${userRole} Dashboard`}
            showDrawer
            rightComponent={
                <View style={tw`flex-row items-center`}>
                    {rightComponent}
                    <View style={tw`bg-white bg-opacity-20 p-2 rounded-xl mr-3`}>
                        <Ionicons name="notifications-outline" size={20} color="white" />
                    </View>
                </View>
            }
        />
    );
};

export const PageHeader: React.FC<{
    title: string;
    subtitle?: string;
    showBack?: boolean;
    rightComponent?: React.ReactNode;
}> = ({ title, subtitle, showBack = true, rightComponent }) => {
    return (
        <ThemedHeader
            title={title}
            subtitle={subtitle}
            showBack={showBack}
            rightComponent={rightComponent}
        />
    );
};

export const ModalHeader: React.FC<{
    title: string;
    onClose?: () => void;
    rightComponent?: React.ReactNode;
}> = ({ title, onClose, rightComponent }) => {
    const router = useRouter();
    
    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };
    
    return (
        <ThemedHeader
            title={title}
            gradient={false}
            rightComponent={
                <View style={tw`flex-row items-center`}>
                    {rightComponent}
                    <TouchableOpacity
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl ml-2`}
                        onPress={handleClose}
                    >
                        <Ionicons name="close" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            }
        />
    );
};
