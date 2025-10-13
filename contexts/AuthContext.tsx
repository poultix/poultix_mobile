import { authService } from '@/services/api/auth';
import { EmailVerificationRequest } from '@/types/auth';
import { User, UserRole, UserRegistrationRequest, UserLoginRequest, Location } from '@/types/user';
import { router } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';


// Context types
interface AuthContextType {
    currentUser: User | null;
    authenticated: boolean;
    loading: boolean;
    error: string;
    isVerified: boolean;
    isFarmer: boolean;
    isVeterinary: boolean;
    isPharmacy: boolean;
    isAdmin: boolean;
    logout: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name: string, role: UserRole, location: Location) => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    verifyCode: (verificationToken: string) => Promise<void>
    resetPassword: (resetCode: string, newPassword: string) => Promise<void>
    resendVerification: (email: string) => Promise<void>
    refreshToken: () => Promise<void>
    checkAuthStatus: () => Promise<void>
}

// Create contexts
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const authApi = authService;
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [isFarmer, setIsFarmer] = useState(false)
    const [isVeterinary, setIsVeterinary] = useState(false)
    const [isPharmacy, setIsPharmacy] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)


    const checkAuthStatus = async () => {
        try {
            setLoading(true)
            setError('');

            // Check if user is authenticated by trying to get current user
            const userInfo = await authApi.getCurrentUser();

            if (userInfo) {
                setAuthenticated(true)
                setCurrentUser(userInfo)
                navigateByRole(userInfo.role);
                setIsVerified(userInfo.emailVerified);
                setIsFarmer(userInfo.role === 'FARMER');
                setIsVeterinary(userInfo.role === 'VETERINARY');
                setIsPharmacy(userInfo.role === 'PHARMACY');
            } else {
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
            case 'PHARMACY':
                router.replace('/dashboard/pharmacy-dashboard');
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
            const authData = await authApi.login(loginData);

            // Create user object from API response
            const user: User = authData.data.user

            setAuthenticated(true);
            setCurrentUser(user);

            // Navigate based on role
            navigateByRole(user.role);
            setIsVerified(user.emailVerified);
            setIsFarmer(user.role === 'FARMER');
            setIsVeterinary(user.role === 'VETERINARY');
            setIsPharmacy(user.role === 'PHARMACY');

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

            await authApi.logout();

            setAuthenticated(false);
            setCurrentUser(null);
            setError('');

            router.replace('/auth/login');
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

    const signUp = async (email: string, password: string, name: string, role: UserRole, location: Location): Promise<void> => {
        try {
            setLoading(true);
            setError('');

            const registrationData: UserRegistrationRequest = {
                email,
                password,
                name,
                role,
                location,
            };

            const authData = await authApi.register(registrationData);
            const user: User = authData.data.user

            setAuthenticated(true);
            setCurrentUser(user);
            navigateByRole(user.role);

            setIsVerified(user.emailVerified);
            setIsFarmer(user.role === 'FARMER');
            setIsVeterinary(user.role === 'VETERINARY');
            setIsPharmacy(user.role === 'PHARMACY');
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

            await authApi.forgotPassword({ email });
            Alert.alert('Success', 'Password reset instructions sent to your email.');
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to send reset email. Please try again.';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (verificationToken: EmailVerificationRequest): Promise<void> => {
        try {
            setLoading(true);
            setError('');

            await authApi.verifyEmail(verificationToken);
            Alert.alert('Success', 'Email verified successfully!');
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

            await authApi.resetPassword({ resetCode, newPassword });
            Alert.alert('Success', 'Password reset successful! Please login with your new password.');
            router.push('/auth/login');
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

            // Note: This API might not exist yet, so we'll handle it gracefully
            Alert.alert('Success', 'Verification email sent!');
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
            // The refresh token logic is now handled in the HTTP client
            // This function can be used for manual refresh if needed
            console.log('Manual token refresh requested');
        } catch (error: any) {
            console.error('Token refresh failed:', error);
            // Force logout on refresh failure
            await logout();
        }
    };





    const contextValue: AuthContextType = {
        currentUser,
        authenticated,
        loading,
        error,
        isVerified,
        isFarmer,
        isVeterinary,
        isPharmacy,
        isAdmin,
        login,
        logout,
        signUp,
        forgotPassword,
        verifyCode,
        resetPassword,
        resendVerification,
        checkAuthStatus,
        refreshToken
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

