import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Farm, FarmStatus, FarmCreateRequest, FarmUpdateRequest } from '@/types';
import { farmService } from '@/services/api';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

// Farm context interface
interface FarmContextType {
  farms: Farm[];
  currentFarm: Farm | null;
  loading: boolean;
  error: string | null;

  // CRUD operations
  createFarm: (ownerId: string, farmData: FarmCreateRequest) => Promise<void>;
  getFarmById: (id: string) => Promise<Farm | null>;
  getFarmsByOwner: (ownerId: string) => Promise<Farm[]>;
  getFarmsByVeterinary: (veterinaryId: string) => Promise<Farm[]>;
  getFarmsByStatus: (status: FarmStatus) => Promise<Farm[]>;
  updateFarm: (id: string, updates: FarmUpdateRequest) => Promise<void>;
  assignVeterinary: (farmId: string, veterinaryId: string) => Promise<void>;
  updateHealthStatus: (farmId: string, status: FarmStatus) => Promise<void>;
  deleteFarm: (id: string) => Promise<void>;
  setCurrentFarm: (farm: Farm | null) => void;
  refreshFarms: () => Promise<void>;
}

// Create context
const FarmContext = createContext<FarmContextType | undefined>(undefined);

// Provider component
export const FarmProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuth()
  const [farms, setFarms] = useState<Farm[]>([])
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { handleApiError } = useError();

  useEffect(() => {
    if (authenticated) {
      loadFarms();
    }
  }, [authenticated]);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await farmService.getAllFarms();

      if (response.success && response.data) {
        setFarms(response.data);
      } else {
        Alert.alert('Failed to load farms', response.message || 'Failed to load farms');
      }
    } catch (error: any) {
      console.error('Failed to load farms:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to load farms');
      }
    } finally {
      setLoading(false);
    }
  };



  const createFarm = async (ownerId: string, farmData: FarmCreateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await farmService.createFarm(ownerId, farmData);

      if (response.success && response.data) {
        setFarms(prev => [...prev, response.data!]);
      } else {
        Alert.alert('Failed to create farm', response.message || 'Failed to create farm');
      }
    } catch (error: any) {
      console.error('Failed to create farm:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        Alert.alert('Failed to create farm', error.message || 'Failed to create farm');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFarmById = async (id: string): Promise<Farm | null> => {
    try {
      const response = await farmService.getFarmById(id);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get farm by ID:', error);
      Alert.alert('Failed to get farm by ID', error.message || 'Failed to get farm by ID');
      return null;
    }
  };

  const getFarmsByOwner = async (ownerId: string): Promise<Farm[]> => {
    try {
      const response = await farmService.getFarmsByOwner(ownerId);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get farms by owner:', error);
      setError(error.message || 'Failed to get farms');
      return [];
    }
  };

  const getFarmsByVeterinary = async (veterinaryId: string): Promise<Farm[]> => {
    try {
      const response = await farmService.getFarmsByVeterinary(veterinaryId);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get farms by veterinary:', error);
      setError(error.message || 'Failed to get farms');
      return [];
    }
  };

  const getFarmsByStatus = async (status: FarmStatus): Promise<Farm[]> => {
    try {
      const response = await farmService.getFarmsByStatus(status);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get farms by status:', error);
      setError(error.message || 'Failed to get farms');
      return [];
    }
  };

  const updateFarm = async (id: string, updates: FarmUpdateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await farmService.updateFarm(id, updates);

      if (response.success && response.data) {
        setFarms(prev => prev.map(farm => farm.id === id ? response.data! : farm));
      } else {
        throw new Error(response.message || 'Failed to update farm');
      }
    } catch (error: any) {
      console.error('Failed to update farm:', error);
      setError(error.message || 'Failed to update farm');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const assignVeterinary = async (farmId: string, veterinaryId: string): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await farmService.assignVeterinary(farmId, veterinaryId);

      if (response.success && response.data) {
        setFarms(prev => prev.map(farm => farm.id === farmId ? response.data! : farm));
      } else {
        throw new Error(response.message || 'Failed to assign veterinary');
      }
    } catch (error: any) {
      console.error('Failed to assign veterinary:', error);
      setError(error.message || 'Failed to assign veterinary');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateHealthStatus = async (farmId: string, status: FarmStatus): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await farmService.updateHealthStatus(farmId, status);

      if (response.success && response.data) {
        setFarms(prev => prev.map(farm => farm.id === farmId ? response.data! : farm));
      } else {
        Alert.alert('Failed to update health status', response.message || 'Failed to update health status');
      }
    } catch (error: any) {
      console.error('Failed to update health status:', error);
      Alert.alert('Failed to update health status', error.message || 'Failed to update health status');
    } finally {
      setLoading(false);
    }
  };

  const deleteFarm = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await farmService.deleteFarm(id);

      if (response.success) {
        setFarms(prev => prev.filter(farm => farm.id !== id));
      } else {
        Alert.alert('Failed to delete farm', response.message || 'Failed to delete farm');
      }
    } catch (error: any) {
      console.error('Failed to delete farm:', error);
      Alert.alert('Failed to delete farm', error.message || 'Failed to delete farm');
    } finally {
      setLoading(false);
    }
  };


  const refreshFarms = async (): Promise<void> => {
    await loadFarms();
  };

  const contextValue: FarmContextType = {
    farms,
    currentFarm,
    loading,
    error,
    createFarm,
    getFarmById,
    getFarmsByOwner,
    getFarmsByVeterinary,
    getFarmsByStatus,
    updateFarm,
    assignVeterinary,
    updateHealthStatus,
    deleteFarm,
    setCurrentFarm,
    refreshFarms,
  };

  return (
    <FarmContext.Provider value={contextValue}>
      {children}
    </FarmContext.Provider>
  );
};

// Hook
export const useFarms = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarms must be used within a FarmProvider');
  }
  return context;
};