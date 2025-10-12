import { UserRole } from '@/types/user';

// Theme interface for consistent typing
export interface Theme {
    // Primary colors
    primary: string;
    primaryDark: string;
    primaryLight: string;
    primaryRgb: string;
    
    // Secondary colors
    secondary: string;
    secondaryDark: string;
    secondaryLight: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Neutral colors
    background: string;
    surface: string;
    card: string;
    border: string;
    divider: string;
    
    // Text colors
    text: {
        primary: string;
        secondary: string;
        disabled: string;
        inverse: string;
    };
    
    // Tailwind classes for convenience
    tw: {
        bg: string;
        bgLight: string;
        bgDark: string;
        text: string;
        textLight: string;
        border: string;
        accent: string;
    };
    
    // Spacing and sizing
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    
    // Border radius
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        full: number;
    };
    
    // Shadows
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}

// Base theme configuration
const baseTheme = {
    // Status colors (consistent across roles)
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutral colors
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E5E7EB',
    divider: '#F3F4F6',
    
    // Spacing
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    
    // Border radius
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },
    
    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
};

export const getRoleTheme = (role?: UserRole): Theme => {
    let roleColors;
    
    switch (role) {
        case 'FARMER':
            roleColors = {
                primary: '#FF8C00',
                primaryDark: '#FF7F00',
                primaryLight: '#FFB347',
                primaryRgb: '255, 140, 0',
                secondary: '#FFA500',
                secondaryDark: '#FF8C00',
                secondaryLight: '#FFD700',
                tw: {
                    bg: 'bg-orange-500',
                    bgLight: 'bg-orange-50',
                    bgDark: 'bg-orange-600',
                    text: 'text-orange-500',
                    textLight: 'text-orange-400',
                    border: 'border-orange-500',
                    accent: 'bg-orange-100',
                },
            };
            break;
            
        case 'VETERINARY':
            roleColors = {
                primary: '#DC2626',
                primaryDark: '#B91C1C',
                primaryLight: '#F87171',
                primaryRgb: '220, 38, 38',
                secondary: '#EF4444',
                secondaryDark: '#DC2626',
                secondaryLight: '#FCA5A5',
                tw: {
                    bg: 'bg-red-600',
                    bgLight: 'bg-red-50',
                    bgDark: 'bg-red-700',
                    text: 'text-red-600',
                    textLight: 'text-red-400',
                    border: 'border-red-600',
                    accent: 'bg-red-100',
                },
            };
            break;
            
        case 'ADMIN':
            roleColors = {
                primary: '#7C3AED',
                primaryDark: '#6D28D9',
                primaryLight: '#A78BFA',
                primaryRgb: '124, 58, 237',
                secondary: '#8B5CF6',
                secondaryDark: '#7C3AED',
                secondaryLight: '#C4B5FD',
                tw: {
                    bg: 'bg-purple-600',
                    bgLight: 'bg-purple-50',
                    bgDark: 'bg-purple-700',
                    text: 'text-purple-600',
                    textLight: 'text-purple-400',
                    border: 'border-purple-600',
                    accent: 'bg-purple-100',
                },
            };
            break;
            
        case 'PHARMACY':
            roleColors = {
                primary: '#2563EB',
                primaryDark: '#1D4ED8',
                primaryLight: '#60A5FA',
                primaryRgb: '37, 99, 235',
                secondary: '#3B82F6',
                secondaryDark: '#2563EB',
                secondaryLight: '#93C5FD',
                tw: {
                    bg: 'bg-blue-600',
                    bgLight: 'bg-blue-50',
                    bgDark: 'bg-blue-700',
                    text: 'text-blue-600',
                    textLight: 'text-blue-400',
                    border: 'border-blue-600',
                    accent: 'bg-blue-100',
                },
            };
            break;
            
        default:
            roleColors = {
                primary: '#6B7280',
                primaryDark: '#4B5563',
                primaryLight: '#9CA3AF',
                primaryRgb: '107, 114, 128',
                secondary: '#9CA3AF',
                secondaryDark: '#6B7280',
                secondaryLight: '#D1D5DB',
                tw: {
                    bg: 'bg-gray-500',
                    bgLight: 'bg-gray-50',
                    bgDark: 'bg-gray-600',
                    text: 'text-gray-500',
                    textLight: 'text-gray-400',
                    border: 'border-gray-500',
                    accent: 'bg-gray-100',
                },
            };
    }
    
    return {
        ...roleColors,
        ...baseTheme,
        text: {
            primary: '#111827',
            secondary: '#6B7280',
            disabled: '#9CA3AF',
            inverse: '#FFFFFF',
        },
    };
};

// Dark theme support
export const getDarkTheme = (role?: UserRole): Theme => {
    const lightTheme = getRoleTheme(role);
    
    return {
        ...lightTheme,
        background: '#111827',
        surface: '#1F2937',
        card: '#374151',
        border: '#4B5563',
        divider: '#374151',
        text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            disabled: '#9CA3AF',
            inverse: '#111827',
        },
    };
};

// Utility functions for common theme operations
export const getThemeColor = (theme: Theme, colorKey: keyof Theme) => {
    return theme[colorKey];
};

export const getSpacing = (theme: Theme, size: keyof Theme['spacing']) => {
    return theme.spacing[size];
};

export const getBorderRadius = (theme: Theme, size: keyof Theme['borderRadius']) => {
    return theme.borderRadius[size];
};

export const getShadow = (theme: Theme, size: keyof Theme['shadows']) => {
    return theme.shadows[size];
};
