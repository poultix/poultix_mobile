import React, { createContext, useContext, useEffect, useState } from 'react';
import { Farm, FarmStatus } from '@/types';
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
  getFarmById: (id: string) => Promise<Farm | null>;
  getFarmsByOwner: (ownerId: string) => Promise<Farm[]>;
  getFarmsByVeterinary: (veterinaryId: string) => Promise<Farm[]>;
  getFarmsByStatus: (status: FarmStatus) => Promise<Farm[]>;
  editFarm: (data: Farm) => void;
  removeFarm: (data: Farm) => void
  setCurrentFarm: (farm: Farm | null) => void;
  addFarm: (farm: Farm) => void
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


  const addFarm = (farm: Farm) => {
    setFarms(prev => [...prev, farm])
  }

  const editFarm = (farm: Farm) => {
    setFarms((prev) => prev.map(f => f.id === farm.id ? farm : f))
  }

  const removeFarm = (farm: Farm) => {
    setFarms((prev) => prev.filter(f => f.id !== farm.id))
  }



  const contextValue: FarmContextType = {
    farms,
    currentFarm,
    loading,
    error,
    addFarm,
    getFarmById,
    getFarmsByOwner,
    getFarmsByVeterinary,
    getFarmsByStatus,
    setCurrentFarm,
    editFarm,
    removeFarm
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