import React, { createContext, useContext, useEffect, useState } from 'react';
import { Farm } from '@/types/farm';
import { farmApi } from '@/services/api/farm';
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
  getFarmsByUser: (userId: string) => Promise<Farm[]>;
  editFarm: (data: Farm) => void;
  removeFarm: (data: Farm) => void
  setCurrentFarm: (farm: Farm | null) => void;
  addFarm: (farm: Farm) => void
  refreshFarms: () => Promise<void>;
}

// Create context
const FarmContext = createContext<FarmContextType | undefined>(undefined);

// Provider component
export const FarmProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, currentUser } = useAuth()
  const [farms, setFarms] = useState<Farm[]>([])
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authenticated) {
      loadFarms();
    }
  }, [authenticated]);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError('');

      const farmsData = await farmApi.getAllFarms();
      setFarms(farmsData);
    } catch (error: any) {
      console.error('Failed to load farms:', error);
      setError(error.message || 'Failed to load farms');
      Alert.alert('Error', 'Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const refreshFarms = async () => {
    await loadFarms();
  };



  const getFarmById = async (id: string): Promise<Farm | null> => {
    try {
      const farm = await farmApi.getFarmById(id);
      return farm;
    } catch (error: any) {
      console.error('Failed to get farm by ID:', error);
      Alert.alert('Error', error.message || 'Failed to get farm by ID');
      return null;
    }
  };

  const getFarmsByUser = async (userId: string): Promise<Farm[]> => {
    try {
      const farmsData = await farmApi.getFarmsByUser(userId);
      return farmsData;
    } catch (error: any) {
      console.error('Failed to get farms by user:', error);
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
    getFarmsByUser,
    setCurrentFarm,
    editFarm,
    removeFarm,
    refreshFarms
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