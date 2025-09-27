import { User, UserRole } from '@/types/user';
import { MockDataService } from '@/services/mockData';
import { useUsers } from '@/contexts/UserContext';

export interface UserActionsType {
  loadUsers: () => Promise<User[]>;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (users: User[], id: string) => User | undefined;
  getUsersByRole: (users: User[], role: UserRole) => User[];
  refreshUsers: () => Promise<void>;
}

export const useUserActions = (): UserActionsType => {
  const { addUser, editUser, deleteUser: deleteUserFromContext, refreshUsers } = useUsers();

  const loadUsers = async (): Promise<User[]> => {
    return await MockDataService.getUsers();
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date(),
    };

    // Add to context state
    addUser(newUser);
    return newUser;
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    const users = await loadUsers();
    const existingUser = users.find(user => user.id === id);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser = { ...existingUser, ...userData };
    // Update in context state
    editUser(updatedUser);
    return updatedUser;
  };

  const deleteUser = async (id: string): Promise<void> => {
    // Delete from context state
    deleteUserFromContext(id);
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
