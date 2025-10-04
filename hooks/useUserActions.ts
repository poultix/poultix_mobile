import { User, UserRole, UserRegistrationRequest, UserUpdateRequest } from '@/types';
import { userService } from '@/services/api';

export interface UserActionsType {
  loadUsers: () => Promise<User[]>;
  createUser: (userData: UserRegistrationRequest) => Promise<User>;
  updateUser: (id: string, userData: UserUpdateRequest) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (users: User[], id: string) => User | undefined;
  getUsersByRole: (users: User[], role: UserRole) => User[];
  refreshUsers: () => Promise<void>;
}

export const useUserActions = (): UserActionsType => {
  const loadUsers = async (): Promise<User[]> => {
    const response = await userService.getAllUsers();
    return response.success && response.data ? response.data : [];
  };

  const refreshUsers = async (): Promise<void> => {
    // This method would typically refresh the context state
    await loadUsers();
  };

  const createUser = async (userData: UserRegistrationRequest): Promise<User> => {
    const response = await userService.register(userData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to create user');
  };

  const updateUser = async (id: string, userData: UserUpdateRequest): Promise<User> => {
    const response = await userService.updateUser(id, userData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to update user');
  };

  const deleteUser = async (id: string): Promise<void> => {
    const response = await userService.deleteUser(id);
    if (!response.success) {
      throw new Error('Failed to delete user');
    }
  };

  const getUserById = (users: User[], id: string): User | undefined => {
    return users.find(user => user.id === id);
  };
  const getUsersByRole = (users: User[], role: UserRole): User[] => {
    return users.filter(user => user.role === role);
  };

  return {
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByRole,
    refreshUsers,
  };
};
