import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    ViewStyle,
    TouchableOpacityProps,
    TextInputProps,
    ViewProps,
    TextProps
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { Theme } from '@/utils/theme';
import tw from 'twrnc';

// Themed Container
interface ThemedContainerProps extends ViewProps {
    variant?: 'background' | 'surface' | 'card';
    padding?: keyof Theme['spacing'];
}

export const ThemedContainer: React.FC<ThemedContainerProps> = ({ 
    children, 
    variant = 'background', 
    padding = 'md',
    style,
    ...props 
}) => {
    const { theme } = useTheme();
    const styles = useThemedStyles();
    
    const getVariantStyle = () => {
        switch (variant) {
            case 'surface': return styles.surface;
            case 'card': return styles.card;
            default: return styles.container;
        }
    };
    
    return (
        <View 
            style={[
                getVariantStyle(),
                { padding: theme.spacing[padding as keyof typeof theme.spacing] },
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
};

// Themed Text
interface ThemedTextProps extends TextProps {
    variant?: 'primary' | 'secondary' | 'disabled' | 'inverse';
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'base',
    weight = 'normal',
    style,
    ...props 
}) => {
    const styles = useThemedStyles();
    
    const getVariantStyle = () => {
        switch (variant) {
            case 'secondary': return styles.textSecondary;
            case 'disabled': return styles.textDisabled;
            case 'inverse': return styles.textInverse;
            default: return styles.textPrimary;
        }
    };
    
    const getSizeClass = () => {
        switch (size) {
            case 'xs': return 'text-xs';
            case 'sm': return 'text-sm';
            case 'lg': return 'text-lg';
            case 'xl': return 'text-xl';
            case '2xl': return 'text-2xl';
            case '3xl': return 'text-3xl';
            default: return 'text-base';
        }
    };
    
    const getWeightClass = () => {
        switch (weight) {
            case 'medium': return 'font-medium';
            case 'semibold': return 'font-semibold';
            case 'bold': return 'font-bold';
            default: return 'font-normal';
        }
    };
    
    return (
        <Text 
            style={[
                getVariantStyle(),
                tw`${getSizeClass()} ${getWeightClass()}`,
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

// Themed Button
interface ThemedButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    fullWidth?: boolean;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({ 
    children, 
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    style,
    disabled,
    ...props 
}) => {
    const { theme } = useTheme();
    const styles = useThemedStyles();
    
    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'secondary':
                return {
                    backgroundColor: theme.secondary,
                    borderRadius: theme.borderRadius.md,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: theme.primary,
                    borderWidth: 1,
                    borderRadius: theme.borderRadius.md,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                };
            default:
                return styles.primaryButton;
        }
    };
    
    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'sm':
                return {
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                };
            case 'lg':
                return {
                    paddingVertical: theme.spacing.lg,
                    paddingHorizontal: theme.spacing.xl,
                };
            default:
                return {
                    paddingVertical: theme.spacing.md,
                    paddingHorizontal: theme.spacing.lg,
                };
        }
    };
    
    const getTextColor = () => {
        if (disabled) return theme.text.disabled;
        if (variant === 'outline' || variant === 'ghost') return theme.primary;
        return theme.text.inverse;
    };
    
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    
    return (
        <TouchableOpacity
            style={[
                getVariantStyle(),
                getSizeStyle(),
                fullWidth && { width: '100%' },
                disabled && { opacity: 0.5 },
                tw`flex-row items-center justify-center`,
                style
            ]}
            disabled={disabled || loading}
            {...props}
        >
            {icon && iconPosition === 'left' && (
                <Ionicons 
                    name={icon} 
                    size={iconSize} 
                    color={getTextColor()} 
                    style={tw`mr-2`}
                />
            )}
            
            <ThemedText 
                variant={variant === 'outline' || variant === 'ghost' ? 'primary' : 'inverse'}
                weight="semibold"
                style={{ color: getTextColor() }}
            >
                {loading ? 'Loading...' : children}
            </ThemedText>
            
            {icon && iconPosition === 'right' && (
                <Ionicons 
                    name={icon} 
                    size={iconSize} 
                    color={getTextColor()} 
                    style={tw`ml-2`}
                />
            )}
        </TouchableOpacity>
    );
};

// Themed Input
interface ThemedInputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
}

export const ThemedInput: React.FC<ThemedInputProps> = ({ 
    label,
    error,
    icon,
    iconPosition = 'left',
    style,
    ...props 
}) => {
    const { theme } = useTheme();
    const styles = useThemedStyles();
    
    return (
        <View style={tw`mb-4`}>
            {label && (
                <ThemedText 
                    variant="secondary" 
                    size="sm" 
                    weight="medium"
                    style={tw`mb-2`}
                >
                    {label}
                </ThemedText>
            )}
            
            <View style={tw`relative`}>
                {icon && iconPosition === 'left' && (
                    <View style={tw`absolute left-3 top-3 z-10`}>
                        <Ionicons 
                            name={icon} 
                            size={20} 
                            color={theme.text.secondary} 
                        />
                    </View>
                )}
                
                <TextInput
                    style={[
                        styles.input,
                        icon && iconPosition === 'left' && { paddingLeft: theme.spacing.xl + theme.spacing.md },
                        icon && iconPosition === 'right' && { paddingRight: theme.spacing.xl + theme.spacing.md },
                        error && { borderColor: theme.error },
                        style
                    ]}
                    placeholderTextColor={theme.text.disabled}
                    {...props}
                />
                
                {icon && iconPosition === 'right' && (
                    <View style={tw`absolute right-3 top-3 z-10`}>
                        <Ionicons 
                            name={icon} 
                            size={20} 
                            color={theme.text.secondary} 
                        />
                    </View>
                )}
            </View>
            
            {error && (
                <ThemedText 
                    size="sm" 
                    style={{ color: theme.error, marginTop: theme.spacing.xs }}
                >
                    {error}
                </ThemedText>
            )}
        </View>
    );
};

// Themed Card
interface ThemedCardProps extends ViewProps {
    padding?: keyof Theme['spacing'];
    shadow?: boolean;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({ 
    children, 
    padding = 'lg',
    shadow = true,
    style,
    ...props 
}) => {
    const { theme } = useTheme();
    const styles = useThemedStyles();
    
    return (
        <View 
            style={[
                styles.card,
                { padding: theme.spacing[padding as keyof typeof theme.spacing] },
                !shadow && { shadowOpacity: 0, elevation: 0 },
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
};

// Themed Divider
interface ThemedDividerProps extends ViewProps {
    margin?: keyof Theme['spacing'];
}

export const ThemedDivider: React.FC<ThemedDividerProps> = ({ 
    margin = 'md',
    style,
    ...props 
}) => {
    const { theme } = useTheme();
    const styles = useThemedStyles();
    
    return (
        <View 
            style={[
                styles.divider,
                { marginVertical: theme.spacing[margin as keyof typeof theme.spacing] },
                style
            ]}
            {...props}
        />
    );
};

// Themed Status Badge
interface ThemedStatusBadgeProps extends ViewProps {
    status: 'success' | 'warning' | 'error' | 'info';
    text: string;
    size?: 'sm' | 'md';
}

export const ThemedStatusBadge: React.FC<ThemedStatusBadgeProps> = ({ 
    status,
    text,
    size = 'md',
    style,
    ...props 
}) => {
    const { theme } = useTheme();
    
    const getStatusColor = () => {
        switch (status) {
            case 'success': return theme.success;
            case 'warning': return theme.warning;
            case 'error': return theme.error;
            case 'info': return theme.info;
        }
    };
    
    const padding = size === 'sm' ? theme.spacing.xs : theme.spacing.sm;
    
    return (
        <View 
            style={[
                {
                    backgroundColor: getStatusColor() + '20',
                    borderColor: getStatusColor(),
                    borderWidth: 1,
                    borderRadius: theme.borderRadius.full,
                    paddingHorizontal: padding * 2,
                    paddingVertical: padding,
                },
                style
            ]}
            {...props}
        >
            <ThemedText 
                size={size === 'sm' ? 'xs' : 'sm'}
                weight="medium"
                style={{ color: getStatusColor() }}
            >
                {text}
            </ThemedText>
        </View>
    );
};
