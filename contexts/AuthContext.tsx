import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { MockAuthService } from '@/services/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth state interface
interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;
}

// Auth actions
type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGOUT' }
    | { type: 'SET_CURRENT_USER'; payload: User | null }
    | { type: 'CLEAR_ERROR' };

// Context types
interface AuthContextType {
    state: AuthState;
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;
}

interface AuthActionsType {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    verifyCode: (email: string, code: string) => Promise<void>;
    getCurrentUser: () => User | null;
    isUserRole: (role: UserRole) => boolean;
    checkAuthStatus: () => Promise<void>;
    clearError: () => void;
    // Quick dev methods
    loginAsFarmer: () => Promise<void>;
    loginAsVeterinary: () => Promise<void>;
    loginAsAdmin: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                currentUser: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'LOGOUT':
            return {
                ...state,
                currentUser: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload,
                isAuthenticated: !!action.payload,
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

// Create contexts
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AuthActionsContext = createContext<AuthActionsType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
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

                dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to check auth status' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const { role, token } = await MockAuthService.signIn(email, password);

            // Create user object
            const user: User = {
                id: `user_${Date.now()}`,
                email,
                name: email.split('@')[0],
                role: role as UserRole,
                phone: '+250 788 000 000',
                location: 'Rwanda',
                createdAt: new Date(),
                isActive: true,
            };

            // Store in AsyncStorage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('role', role);

            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await MockAuthService.logout();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Logout failed' });
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name: string, role: string): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await MockAuthService.signUp(email, password, name, role);
            dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Sign up failed' });
            throw error;
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await MockAuthService.forgotPassword(email);
            dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Password reset failed' });
            throw error;
        }
    };

    const verifyCode = async (email: string, code: string): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await MockAuthService.verifyCode(email, code);
            dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Code verification failed' });
            throw error;
        }
    };

    const getCurrentUser = (): User | null => {
        return state.currentUser;
    };

    const isUserRole = (role: UserRole): boolean => {
        return state.currentUser?.role === role;
    };

    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
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
        state,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        token: state.token,
    };

    const actionsValue: AuthActionsType = {
        login,
        logout,
        signUp,
        forgotPassword,
        verifyCode,
        getCurrentUser,
        isUserRole,
        checkAuthStatus,
        clearError,
        loginAsFarmer,
        loginAsVeterinary,
        loginAsAdmin,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            <AuthActionsContext.Provider value={actionsValue}>
                {children}
            </AuthActionsContext.Provider>
        </AuthContext.Provider>
    );
};

// Hooks
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const useAuthActions = () => {
    const context = useContext(AuthActionsContext);
    if (!context) {
        throw new Error('useAuthActions must be used within an AuthProvider');
    }
    return context;
};