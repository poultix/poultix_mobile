import { User, UserRole } from '@/types/user';
import { MockAuthService } from '@/services/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthActionsType {
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  isUserRole: (user: User | null, role: UserRole) => boolean;
  checkAuthStatus: () => Promise<{ user: User; token: string } | null>;
  // Quick dev methods
  loginAsFarmer: () => Promise<{ user: User; token: string }>;
  loginAsVeterinary: () => Promise<{ user: User; token: string }>;
  loginAsAdmin: () => Promise<{ user: User; token: string }>;
}

export const useAuthActions = (): AuthActionsType => {
  const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const { user, token } = await MockAuthService.signIn(email, password);
    
   
    
    // Store in AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userEmail', email);
    await AsyncStorage.setItem('role', user.role);
    
    return { user, token };
  };

  const logout = async (): Promise<void> => {
    await MockAuthService.logout();
  };

  const signUp = async (email: string, password: string, name: string, role: string): Promise<void> => {
    await MockAuthService.signUp(email, password, name, role);
  };

  const forgotPassword = async (email: string): Promise<void> => {
    await MockAuthService.forgotPassword(email);
  };

  const verifyCode = async (email: string, code: string): Promise<void> => {
    await MockAuthService.verifyCode(email, code);
  };

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const role = await AsyncStorage.getItem('role');
      
      if (token && userEmail && role) {
        return {
          id: `user_${Date.now()}`,
          email: userEmail,
          name: userEmail.split('@')[0],
          role: role as UserRole,
          phone: '+250 788 000 000',
          location: 'Rwanda',
          createdAt: new Date(),
          isActive: true,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const isUserRole = (user: User | null, role: UserRole): boolean => {
    return user?.role === role;
  };

  const checkAuthStatus = async (): Promise<{ user: User; token: string } | null> => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const role = await AsyncStorage.getItem('role');
      
      if (token && userEmail && role) {
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
        
        return { user, token };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Quick dev methods
  const loginAsFarmer = async (): Promise<{ user: User; token: string }> => {
    await MockAuthService.loginAsFarmer();
    const result = await checkAuthStatus();
    if (!result) throw new Error('Failed to login as farmer');
    return result;
  };

  const loginAsVeterinary = async (): Promise<{ user: User; token: string }> => {
    await MockAuthService.loginAsVeterinary();
    const result = await checkAuthStatus();
    if (!result) throw new Error('Failed to login as veterinary');
    return result;
  };

  const loginAsAdmin = async (): Promise<{ user: User; token: string }> => {
    await MockAuthService.loginAsAdmin();
    const result = await checkAuthStatus();
    if (!result) throw new Error('Failed to login as admin');
    return result;
  };

  return {
    login,
    logout,
    signUp,
    forgotPassword,
    verifyCode,
    getCurrentUser,
    isUserRole,
    checkAuthStatus,
    loginAsFarmer,
    loginAsVeterinary,
    loginAsAdmin,
  };
};
