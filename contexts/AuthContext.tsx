import { MockAuthService } from '@/services/mockData';
import { User, UserRole } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';


// Context types
interface AuthContextType {
    currentUser: User | null;
    authenticated: boolean;
    loading: boolean;
    error: string;
    logout: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name: string, role: string) => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    verifyCode: (email: string, code: string) => Promise<void>

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
            const token = await AsyncStorage.getItem('token');
            const userEmail = await AsyncStorage.getItem('userEmail');
            const role = await AsyncStorage.getItem('role');

            if (token && userEmail && role) {
                // Create user object from stored data
                const user: User = {
                    id: `user_${Date.now()}`,
                    email: userEmail,
                    name: userEmail.split('@')[0],
                    role: role as UserRole,
                    phone: '+250 788 000 000',
                    location: 'Rwanda',
                    createdAt: new Date(),
                    isActive: true,
                };
                setAuthenticated(true)
                setCurrentUser(user)

                if (role === 'ADMIN') {
                    router.replace('/dashboard/admin-dashboard');
                } else if (role === 'FARMER') {
                    router.replace('/dashboard/farmer-dashboard');
                } else if (role === 'VETERINARY') {
                    router.replace('/dashboard/veterinary-dashboard');
                }
            }
        } catch (error) {
            setError('Failed to check auth status');
        } finally {
            setLoading(false)
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true)
            const { user, token } = await MockAuthService.signIn(email, password);
            // Store in AsyncStorage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('role', user.role);
            setAuthenticated(true)
            setCurrentUser(user)
            setLoading(false)
        } catch (error) {
            setError('Login failed' + error)
            setLoading(false)
        }
    };

    const logout = async (): Promise<void> => {
        try {

            await MockAuthService.logout();
            setCurrentUser(null)
            router.push('/auth/login')
        } catch (error) {
            setError('Logout failed')
        }
    };

    const signUp = async (email: string, password: string, name: string, role: string): Promise<void> => {
        try {
            setLoading(true)
            await MockAuthService.signUp(email, password, name, role);

        } catch (error) {
            setError("Signup")
        } finally {
            setLoading(false)
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            setLoading(true);
            await MockAuthService.forgotPassword(email);

        } catch (error) {
            setLoading(false)
        } finally {
            setLoading(false)
        }
    };

    const verifyCode = async (email: string, code: string): Promise<void> => {
        try {
            setLoading(true)
            await MockAuthService.verifyCode(email, code);
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    };




    const isUserRole = (role: UserRole): boolean => {
        return currentUser?.role === role;
    };


    // Quick dev methods
    const loginAsFarmer = async (): Promise<void> => {
        await MockAuthService.loginAsFarmer();
        await checkAuthStatus();
    };

    const loginAsVeterinary = async (): Promise<void> => {
        await MockAuthService.loginAsVeterinary();
        await checkAuthStatus();
    };

    const loginAsAdmin = async (): Promise<void> => {
        await MockAuthService.loginAsAdmin();
        await checkAuthStatus();
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

