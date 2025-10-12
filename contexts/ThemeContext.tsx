import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, getRoleTheme, getDarkTheme } from '@/utils/theme';
import { useAuth } from './AuthContext';

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    setThemeMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { currentUser } = useAuth();
    const [isDark, setIsDark] = useState(false);
    const [theme, setTheme] = useState<Theme>(getRoleTheme());

    // Load theme preference from storage
    useEffect(() => {
        loadThemePreference();
    }, []);

    // Update theme when user role changes or dark mode toggles
    useEffect(() => {
        const newTheme = isDark 
            ? getDarkTheme(currentUser?.role) 
            : getRoleTheme(currentUser?.role);
        setTheme(newTheme);
    }, [currentUser?.role, isDark]);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme_preference');
            if (savedTheme !== null) {
                const isDarkMode = JSON.parse(savedTheme);
                setIsDark(isDarkMode);
            }
        } catch (error) {
            console.log('Error loading theme preference:', error);
        }
    };

    const saveThemePreference = async (isDarkMode: boolean) => {
        try {
            await AsyncStorage.setItem('theme_preference', JSON.stringify(isDarkMode));
        } catch (error) {
            console.log('Error saving theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        saveThemePreference(newIsDark);
    };

    const setThemeMode = (isDarkMode: boolean) => {
        setIsDark(isDarkMode);
        saveThemePreference(isDarkMode);
    };

    const value: ThemeContextType = {
        theme,
        isDark,
        toggleTheme,
        setThemeMode,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Hook for getting theme-aware styles
export const useThemedStyles = () => {
    const { theme } = useTheme();
    
    return {
        // Container styles
        container: {
            backgroundColor: theme.background,
        },
        surface: {
            backgroundColor: theme.surface,
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: theme.borderRadius.lg,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        
        // Text styles
        textPrimary: {
            color: theme.text.primary,
        },
        textSecondary: {
            color: theme.text.secondary,
        },
        textDisabled: {
            color: theme.text.disabled,
        },
        textInverse: {
            color: theme.text.inverse,
        },
        
        // Button styles
        primaryButton: {
            backgroundColor: theme.primary,
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
        },
        secondaryButton: {
            backgroundColor: theme.secondary,
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
        },
        
        // Input styles
        input: {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.md,
            color: theme.text.primary,
        },
        
        // Border styles
        border: {
            borderColor: theme.border,
        },
        divider: {
            backgroundColor: theme.divider,
            height: 1,
        },
        
        // Status styles
        success: {
            backgroundColor: theme.success,
        },
        warning: {
            backgroundColor: theme.warning,
        },
        error: {
            backgroundColor: theme.error,
        },
        info: {
            backgroundColor: theme.info,
        },
    };
};
