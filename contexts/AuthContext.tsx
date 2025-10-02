import { authService } from '@/services/api';
import type {  } from '@/services/api';
import { User, UserRole,UserRegistrationRequest, UserLoginRequest } from '@/types';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';


// Context types
interface AuthContextType {
    currentUser: User | null;
    authenticated: boolean;
    loading: boolean;
    error: string;
    logout: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name: string, role:UserRole) => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    verifyCode: (verificationToken: string) => Promise<void>
    resetPassword: (resetCode: string, newPassword: string) => Promise<void>
    resendVerification: (email: string) => Promise<void>
    refreshToken: () => Promise<void>
    // Dev helpers
    loginAsFarmer: () => Promise<void>
    loginAsVeterinary: () => Promise<void>
    loginAsAdmin: () => Promise<void>
}

// Create contexts
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [authenticated, setAuthenticated] = useState(false)

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setLoading(true)
            setError('');
            
            const isAuth = await authService.isAuthenticated();
            const isTokenValid = await authService.isTokenValid();
            
            if (isAuth && isTokenValid) {
                // Get user info from JWT token
                const userInfo = await authService.getCurrentUserFromToken();
                
                if (userInfo) {
                    const user: User = {
                        id: userInfo.id,
                        email: userInfo.email,
                        name: userInfo.name,
                        role: userInfo.role as UserRole,
                        phone: '',
                        location: '',
                        createdAt: new Date(),
                        isActive: true,
                    };
                    
                    setAuthenticated(true)
                    setCurrentUser(user)
                    
                    // Navigate based on role
                    navigateByRole(user.role);
                } else {
                    // Token invalid, clear and redirect
                    await authService.logout();
                    setAuthenticated(false);
                    setCurrentUser(null);
                    router.push('/auth/login');
                }
            } else if (isAuth && !isTokenValid) {
                // Try to refresh token
                try {
                    await authService.refreshToken();
                    // Retry auth check
                    await checkAuthStatus();
                    return;
                } catch (refreshError) {
                    // Refresh failed, logout
                    await authService.logout();
                    setAuthenticated(false);
                    setCurrentUser(null);
                    router.push('/auth/login');
                }
            } else {
                // Not authenticated
                setAuthenticated(false);
                setCurrentUser(null);
                router.push('/auth/login');
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            setError('Failed to check authentication status');
            setAuthenticated(false);
            setCurrentUser(null);
            router.push('/auth/login');
        } finally {
            setLoading(false)
        }
    };
    
    const navigateByRole = (role: UserRole) => {
        switch (role) {
            case 'ADMIN':
                router.replace('/dashboard/admin-dashboard');
                break;
            case 'FARMER':
                router.replace('/dashboard/farmer-dashboard');
                break;
            case 'VETERINARY':
                router.replace('/dashboard/veterinary-dashboard');
                break;
            default:
                router.replace('/');
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            
            const loginData: UserLoginRequest = { email, password };
            const response = await authService.login(loginData);
            
            if (response.success && response.data) {
                const authData = response.data;
                
                // Create user object from API response
                const user: User = {
                    id: authData.user.id,
                    email: authData.user.email,
                    name: authData.user.name,
                    role: authData.user.role,
                    phone: authData.user.phone || '',
                    location: authData.user.location || '',
                    createdAt: new Date(),
                    isActive: authData.user.isActive,
                };
                
                setAuthenticated(true);
                setCurrentUser(user);
                
                // Navigate based on role
                navigateByRole(user.role);
                
                Alert.alert('Success', 'Login successful!');
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Login failed. Please try again.';
            setError(errorMessage);
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setLoading(true);
            
            // Call API logout (this clears server-side tokens)
            await authService.logout();
            
            // Clear local state
            setAuthenticated(false);
            setCurrentUser(null);
            setError('');
            
            // Navigate to login
            router.push('/auth/login');
        } catch (error: any) {
            // Even if API call fails, clear local state
            setAuthenticated(false);
            setCurrentUser(null);
            setError('');
            router.push('/auth/login');
            
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name: string, role: UserRole): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            
            const registrationData: UserRegistrationRequest = {
                email,
                password,
                name,
                role,
            };
            
            const response = await authService.register(registrationData);
            
            if (response.success && response.data) {
                const authData = response.data;
                
                // Create user object from API response
                const user: User = {
                    id: authData.user.id,
                    email: authData.user.email,
                    name: authData.user.name,
                    role: authData.user.role,
                    phone: authData.user.phone || '',
                    location: authData.user.location || '',
                    createdAt: new Date(),
                    isActive: authData.user.isActive,
                };
                
                setAuthenticated(true);
                setCurrentUser(user);
                
                // Navigate based on role (registration includes auto-login)
                navigateByRole(user.role);
                
                Alert.alert('Success', 'Registration successful! You are now logged in.');
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            
            const response = await authService.forgotPassword({ email });
            
            if (response.success) {
                Alert.alert('Success', 'Password reset instructions sent to your email.');
            } else {
                throw new Error(response.message || 'Failed to send reset email');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to send reset email. Please try again.';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (verificationToken: string): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            
            const response = await authService.verifyEmail({ verificationToken });
            
            if (response.success) {
                Alert.alert('Success', 'Email verified successfully!');
            } else {
                throw new Error(response.message || 'Email verification failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Email verification failed. Please try again.';
            setError(errorMessage);
            Alert.alert('Verification Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const resetPassword = async (resetCode: string, newPassword: string): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            
            const response = await authService.resetPassword({ resetCode, newPassword });
            
            if (response.success) {
                Alert.alert('Success', 'Password reset successful! Please login with your new password.');
                router.push('/auth/login');
            } else {
                throw new Error(response.message || 'Password reset failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Password reset failed. Please try again.';
            setError(errorMessage);
            Alert.alert('Reset Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const resendVerification = async (email: string): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            
            const response = await authService.resendVerification(email);
            
            if (response.success) {
                Alert.alert('Success', 'Verification email sent!');
            } else {
                throw new Error(response.message || 'Failed to send verification email');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to send verification email. Please try again.';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const refreshToken = async (): Promise<void> => {
        try {
            await authService.refreshToken();
        } catch (error: any) {
            console.error('Token refresh failed:', error);
            // Force logout on refresh failure
            await logout();
        }
    };




    const isUserRole = (role: UserRole): boolean => {
        return currentUser?.role === role;
    };


    // Quick dev methods (for testing)
    const loginAsFarmer = async (): Promise<void> => {
        await login('farmer@test.com', 'password123');
    };

    const loginAsVeterinary = async (): Promise<void> => {
        await login('vet@test.com', 'password123');
    };

    const loginAsAdmin = async (): Promise<void> => {
        await login('admin@test.com', 'password123');
    };

    const contextValue: AuthContextType = {
        currentUser,
        authenticated,
        loading,
        error,
        login,
        logout,
        signUp,
        forgotPassword,
        verifyCode,
        resetPassword,
        resendVerification,
        refreshToken,
        loginAsFarmer,
        loginAsVeterinary,
        loginAsAdmin,
    };



    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

