import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Farm, FarmStatus } from '@/types/farm';
import { User } from '@/types/user';
import { MockDataService } from '@/services/mockData';

// Farm state interface
interface FarmContextType {
  farms: Farm[];
  currentFarm: Farm | null;
  loading: boolean;
  error: string | null;

  addFarm: (farm: Farm) => void;
  editFarm: (farm: Farm) => void;
  deleteFarm: (id: string) => void;
  setCurrentFarm: (farm: Farm | null) => void;
  refreshFarms: () => Promise<void>;
}

// Create context
const FarmContext = createContext<FarmContextType | undefined>(undefined);

// Provider component
export const FarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Load farms on mount
  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {

      const farms = await MockDataService.getFarms();
      setFarms(farms)
    } catch (error) {
    }
  }; 



  const addFarm = (farm: Farm) => {
    setFarms((prev) => [...prev, farm])

  };

  const editFarm = (payload: Farm) => {
    setFarms((prev) => prev.map(farm =>
      farm.id === payload.id ? payload : farm
    ))
  };

  const deleteFarm = (id: string) => {
    setFarms((prev) => prev.filter(farm => farm.id !== id))
  };


  const refreshFarms = async (): Promise<void> => {
    await loadFarms();
  };

  const contextValue: FarmContextType = {
    farms,
    currentFarm,
    loading,
    error,
    addFarm,
    editFarm,
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