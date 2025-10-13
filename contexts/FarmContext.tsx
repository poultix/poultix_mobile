import React, { createContext, useContext, useEffect, useState } from 'react';
import { Farm } from '@/types/farm';
import { farmService } from '@/services/api/farm';
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
}

// Create context
const FarmContext = createContext<FarmContextType | undefined>(undefined);

// Provider component
export const FarmProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, isFarmer } = useAuth()
  const [farms, setFarms] = useState<Farm[]>([])
  const [farmerFarms, setFarmerFarms] = useState<Farm[]>([])
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAllFarms = async () => {
      try {
        setLoading(true);
        setError('');

        const farmsData = await farmService.getAllFarms();

        setFarms(farmsData.data);

      } catch (error: any) {
        console.error('Failed to load farms:', error);
        Alert.alert('Error', 'Failed to load farms');
      } finally {
        setLoading(false);
      }
    };

    const loadFarmerFarms = async () => {
      try {
        setLoading(true)
        const response = await farmService.getFarmsByOwner()
        setFarmerFarms(response.data)
      } catch (error) {
        console.error('Failed to load farms:', error);
        Alert.alert('Error', 'Failed to load farms');
      } finally {
        setLoading(false);
      }
    }

    if (authenticated) {
      loadAllFarms();
      if (isFarmer) loadFarmerFarms();
    }

  }, [authenticated, isFarmer]);



  const getFarmById = async (id: string): Promise<Farm | null> => {
    try {
      const farm = await farmService.getFarmById(id);
      return farm.data;
    } catch (error: any) {
      console.error('Failed to get farm by ID:', error);
      Alert.alert('Error', error.message || 'Failed to get farm by ID');
      return null;
    }
  };

  const getFarmsByUser = async (userId: string): Promise<Farm[]> => {
    try {
      const farmsData = await farmService.getFarmsByOwner();
      return farmsData.data;
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