import { useState, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { User, Farm, Schedule, Veterinary, FilterOptions } from '@/types/entities';

// Generic CRUD hook
export const useCrud = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    createUser,
    updateUser,
    deleteUser,
    createFarm,
    updateFarm,
    deleteFarm,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    createVeterinary,
    updateVeterinary,
    deleteVeterinary,
  } = useApp();

  const executeOperation = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError: () => setError(null),
    
    // User operations
    createUser: (userData: Omit<User, 'id' | 'createdAt'>) => 
      executeOperation(() => createUser(userData)),
    
    updateUser: (id: string, userData: Partial<User>) => 
      executeOperation(() => updateUser(id, userData)),
    
    deleteUser: (id: string) => 
      executeOperation(() => deleteUser(id)),
    
    // Farm operations
    createFarm: (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>) => 
      executeOperation(() => createFarm(farmData)),
    
    updateFarm: (id: string, farmData: Partial<Farm>) => 
      executeOperation(() => updateFarm(id, farmData)),
    
    deleteFarm: (id: string) => 
      executeOperation(() => deleteFarm(id)),
    
    // Schedule operations
    createSchedule: (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => 
      executeOperation(() => createSchedule(scheduleData)),
    
    updateSchedule: (id: string, scheduleData: Partial<Schedule>) => 
      executeOperation(() => updateSchedule(id, scheduleData)),
    
    deleteSchedule: (id: string) => 
      executeOperation(() => deleteSchedule(id)),
    
    // Veterinary operations
    createVeterinary: (vetData: Omit<Veterinary, 'id'>) => 
      executeOperation(() => createVeterinary(vetData)),
    
    updateVeterinary: (id: string, vetData: Partial<Veterinary>) => 
      executeOperation(() => updateVeterinary(id, vetData)),
    
    deleteVeterinary: (id: string) => 
      executeOperation(() => deleteVeterinary(id)),
  };
};

// Specialized hooks for different entities
export const useUsers = () => {
  const { state, getUsersByRole, searchData, filterData } = useApp();
  const { createUser, updateUser, deleteUser, loading, error, clearError } = useCrud();
  
  return {
    users: state.users,
    loading,
    error,
    clearError,
    getUsersByRole,
    searchUsers: (query: string) => searchData(query, 'users'),
    filterUsers: (filters: FilterOptions) => filterData(filters).users,
    createUser,
    updateUser,
    deleteUser,
  };
};

export const useFarms = () => {
  const { state, getFarmsByUser, searchData, filterData } = useApp();
  const { createFarm, updateFarm, deleteFarm, loading, error, clearError } = useCrud();
  
  return {
    farms: state.farms,
    loading,
    error,
    clearError,
    getFarmsByUser,
    searchFarms: (query: string) => searchData(query, 'farms'),
    filterFarms: (filters: FilterOptions) => filterData(filters).farms,
    createFarm,
    updateFarm,
    deleteFarm,
  };
};

export const useSchedules = () => {
  const { state, getSchedulesByUser, searchData, filterData } = useApp();
  const { createSchedule, updateSchedule, deleteSchedule, loading, error, clearError } = useCrud();
  
  return {
    schedules: state.schedules,
    loading,
    error,
    clearError,
    getSchedulesByUser,
    searchSchedules: (query: string) => searchData(query, 'schedules'),
    filterSchedules: (filters: FilterOptions) => filterData(filters).schedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
};

export const useVeterinaries = () => {
  const { state, getVeterinaryByUser } = useApp();
  const { createVeterinary, updateVeterinary, deleteVeterinary, loading, error, clearError } = useCrud();
  
  return {
    veterinaries: state.veterinaries,
    loading,
    error,
    clearError,
    getVeterinaryByUser,
    createVeterinary,
    updateVeterinary,
    deleteVeterinary,
  };
};

// Role-specific data hooks
export const useRoleBasedData = () => {
  const { state, getFarmsByUser, getSchedulesByUser } = useApp();
  
  const getCurrentUserData = useCallback(() => {
    if (!state.currentUser) return null;
    
    const { currentUser } = state;
    
    switch (currentUser.role) {
      case 'admin':
        return {
          users: state.users,
          farms: state.farms,
          schedules: state.schedules,
          veterinaries: state.veterinaries,
        };
      
      case 'farmer':
        return {
          farms: getFarmsByUser(currentUser.id),
          schedules: getSchedulesByUser(currentUser.id),
        };
      
      case 'veterinary':
        return {
          assignedFarms: getFarmsByUser(currentUser.id),
          schedules: getSchedulesByUser(currentUser.id),
        };
      
      default:
        return null;
    }
  }, [state, getFarmsByUser, getSchedulesByUser]);
  
  return {
    currentUser: state.currentUser,
    getCurrentUserData,
    isAdmin: state.currentUser?.role === 'admin',
    isFarmer: state.currentUser?.role === 'farmer',
    isVeterinary: state.currentUser?.role === 'veterinary',
  };
};

// Data relationships hook
export const useDataRelationships = () => {
  const { state } = useApp();
  
  const getRelatedData = useCallback((entityType: string, entityId: string) => {
    switch (entityType) {
      case 'farm':
        const farm = state.farms.find(f => f.id === entityId);
        if (!farm) return null;
        
        return {
          farm,
          owner: state.users.find(u => u.id === farm.ownerId),
          assignedVet: farm.assignedVeterinaryId 
            ? state.users.find(u => u.id === farm.assignedVeterinaryId)
            : null,
          schedules: state.schedules.filter(s => s.farmId === entityId),
        };
      
      case 'schedule':
        const schedule = state.schedules.find(s => s.id === entityId);
        if (!schedule) return null;
        
        return {
          schedule,
          farm: state.farms.find(f => f.id === schedule.farmId),
          farmer: state.users.find(u => u.id === schedule.farmerId),
          veterinary: state.users.find(u => u.id === schedule.veterinaryId),
        };
      
      case 'user':
        const user = state.users.find(u => u.id === entityId);
        if (!user) return null;
        
        const relatedData: any = { user };
        
        if (user.role === 'farmer') {
          relatedData.ownedFarms = state.farms.filter(f => f.ownerId === entityId);
          relatedData.schedules = state.schedules.filter(s => s.farmerId === entityId);
        } else if (user.role === 'veterinary') {
          relatedData.assignedFarms = state.farms.filter(f => f.assignedVeterinaryId === entityId);
          relatedData.schedules = state.schedules.filter(s => s.veterinaryId === entityId);
          relatedData.veterinaryProfile = state.veterinaries.find(v => v.userId === entityId);
        }
        
        return relatedData;
      
      default:
        return null;
    }
  }, [state]);
  
  return { getRelatedData };
};
