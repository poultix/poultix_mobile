import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole} from '@/types';
import { userService } from '@/services/api';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';
import { useAuth } from './AuthContext';

// Context types
interface UserContextType {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  // CRUD functions
  getUserById: (id: string) => Promise<User | null>;
  getUsersByRole: (role: UserRole) => User[];
  addUser: (data:User) => void;
  editUser: (data:User) => void;
  removeUser: (data:User) => void;
}


// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { handleApiError } = useError(); // ✅ Use ErrorContext for routing
  // Load users on mount
  useEffect(() => {
    if (authenticated) {
      loadUsers();
    }
  }, [authenticated]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userService.getAllUsers();

      if (response.success && response.data) {
        // Convert API users to our User type
        const convertedUsers: User[] = response.data.map(apiUser => ({
          id: apiUser.id,
          email: apiUser.email,
          name: apiUser.name,
          role: apiUser.role,
          password: '', // Not provided by API for security
          emailVerified: true,
          recoverMode: false,
          location: apiUser.location,
          createdAt: new Date(apiUser.createdAt || Date.now()).toISOString(),
          updatedAt: new Date(apiUser.updatedAt || Date.now()).toISOString(),
          isActive: apiUser.isActive,
        }));

        setUsers(convertedUsers);
      } else {
        throw new Error(response.message || 'Failed to load users');
      }
    } catch (error: any) {
      console.error('Failed to load users:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to load users'); // ✅ Show inline error for minor issues
      }
    } finally {
      setLoading(false);
    }
  };



  const getUserById = async (id: string): Promise<User | null> => {
    try {
      const response = await userService.getUserById(id);

      if (response.success && response.data) {
        return {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
          password: '', // Not provided by API for security
          emailVerified: true,
          recoverMode: false,
          location: response.data.location,
          createdAt: new Date(response.data.createdAt || Date.now()).toISOString(),
          updatedAt: new Date(response.data.updatedAt || Date.now()).toISOString(),
          isActive: response.data.isActive,
        };
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get user by ID:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to get user'); // ✅ Show inline error for minor issues
      }
      return null;
    }
  };

  const getUsersByRole = (role: UserRole): User[] => {
    return users.filter(user => user.role === role);
  };

  const addUser = (data: User) => {
    setUsers(prev => [...prev, data])
  }

  const editUser = (data: User) => {
    setUsers(prev => prev.map(user => user.id === data.id ? data : user))
  }

  const removeUser = (data: User) => {
    setUsers(prev => prev.filter(user => user.id !== data.id))
  }

  const contextValue: UserContextType = {
    users,
    currentUser,
    loading,
    error,
    getUserById,
    getUsersByRole,
    addUser,
    editUser,
    removeUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};