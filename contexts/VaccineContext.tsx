import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Vaccine, VaccineCreateRequest, VaccineUpdateRequest } from '@/types';
import { vaccineService } from '@/services/api/vaccine';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';
import { useAuth } from './AuthContext';

interface VaccineContextType {
  vaccines: Vaccine[];
  currentVaccine: Vaccine | null;
  loading: boolean;
  error: string | null;

  // API operations
  createVaccine: (vaccineData: VaccineCreateRequest) => Promise<void>;
  getVaccineById: (id: string) => Promise<Vaccine | null>;
  getVaccinesByType: (type: string) => Promise<Vaccine[]>;
  getVaccinesByTargetDisease: (targetDisease: string) => Promise<Vaccine[]>;
  getVaccineByName: (name: string) => Promise<Vaccine | null>;
  getVaccinesByPrescriptionRequired: (prescriptionRequired: boolean) => Promise<Vaccine[]>;
  searchVaccines: (keyword: string) => Promise<Vaccine[]>;
  checkVaccineExists: (name: string) => Promise<boolean>;
  updateVaccine: (id: string, updates: VaccineUpdateRequest) => Promise<void>;
  deleteVaccine: (id: string) => Promise<void>;
  setCurrentVaccine: (vaccine: Vaccine | null) => void;
  refreshVaccines: () => Promise<void>;
}

// Create context
const VaccineContext = createContext<VaccineContextType | undefined>(undefined);

// Provider component
export const VaccineProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuth()
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [currentVaccine, setCurrentVaccine] = useState<Vaccine | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { handleApiError } = useError();

  const loadVaccines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await vaccineService.getAllVaccines();

      if (response.success && response.data) {
        setVaccines(response.data);
      } else {
        throw new Error(response.message || 'Failed to load vaccines');
      }
    } catch (error: any) {
      console.error('Failed to load vaccines:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to load vaccines');
      }
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  // Load vaccines on mount 
  useEffect(() => {
    if (authenticated) {
      loadVaccines();
    }
  }, [ authenticated]);

  const createVaccine = async (vaccineData: VaccineCreateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await vaccineService.createVaccine(vaccineData);

      if (response.success && response.data) {
        setVaccines(prev => [...prev, response.data!]);
      } else {
        throw new Error(response.message || 'Failed to create vaccine');
      }
    } catch (error: any) {
      console.error('Failed to create vaccine:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to create vaccine');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getVaccineById = async (id: string): Promise<Vaccine | null> => {
    try {
      const response = await vaccineService.getVaccineById(id);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get vaccine by ID:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to get vaccine');
      }
      return null;
    }
  };

  const getVaccinesByType = async (type: string): Promise<Vaccine[]> => {
    try {
      const response = await vaccineService.getVaccinesByType(type);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get vaccines by type:', error);
      setError(error.message || 'Failed to get vaccines by type');
      return [];
    }
  };

  const getVaccinesByTargetDisease = async (targetDisease: string): Promise<Vaccine[]> => {
    try {
      const response = await vaccineService.getVaccinesByTargetDisease(targetDisease);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get vaccines by target disease:', error);
      setError(error.message || 'Failed to get vaccines by target disease');
      return [];
    }
  };

  const getVaccineByName = async (name: string): Promise<Vaccine | null> => {
    try {
      const response = await vaccineService.getVaccineByName(name);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get vaccine by name:', error);
      setError(error.message || 'Failed to get vaccine by name');
      return null;
    }
  };

  const getVaccinesByPrescriptionRequired = async (prescriptionRequired: boolean): Promise<Vaccine[]> => {
    try {
      const response = await vaccineService.getVaccinesByPrescriptionRequired(prescriptionRequired);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get vaccines by prescription required:', error);
      setError(error.message || 'Failed to get vaccines by prescription required');
      return [];
    }
  };

  const searchVaccines = async (keyword: string): Promise<Vaccine[]> => {
    try {
      const response = await vaccineService.searchVaccines(keyword);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to search vaccines:', error);
      setError(error.message || 'Failed to search vaccines');
      return [];
    }
  };

  const checkVaccineExists = async (name: string): Promise<boolean> => {
    try {
      const response = await vaccineService.checkVaccineExists(name);

      if (response.success && response.data !== undefined) {
        return response.data;
      }
      return false;
    } catch (error: any) {
      console.error('Failed to check vaccine existence:', error);
      setError(error.message || 'Failed to check vaccine existence');
      return false;
    }
  };

  const updateVaccine = async (id: string, updates: VaccineUpdateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await vaccineService.updateVaccine(id, updates);

      if (response.success && response.data) {
        setVaccines(prev => prev.map(vaccine => vaccine.id === id ? response.data! : vaccine));
      } else {
        throw new Error(response.message || 'Failed to update vaccine');
      }
    } catch (error: any) {
      console.error('Failed to update vaccine:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to update vaccine');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteVaccine = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await vaccineService.deleteVaccine(id);

      if (response.success) {
        setVaccines(prev => prev.filter(vaccine => vaccine.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete vaccine');
      }
    } catch (error: any) {
      console.error('Failed to delete vaccine:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to delete vaccine');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshVaccines = async (): Promise<void> => {
    await loadVaccines();
  };

  const contextValue: VaccineContextType = {
    vaccines,
    currentVaccine,
    loading,
    error,
    createVaccine,
    getVaccineById,
    getVaccinesByType,
    getVaccinesByTargetDisease,
    getVaccineByName,
    getVaccinesByPrescriptionRequired,
    searchVaccines,
    checkVaccineExists,
    updateVaccine,
    deleteVaccine,
    setCurrentVaccine,
    refreshVaccines,
  };

  return (
    <VaccineContext.Provider value={contextValue}>
      {children}
    </VaccineContext.Provider>
  );
};

// Hook
export const useVaccines = () => {
  const context = useContext(VaccineContext);
  if (!context) {
    throw new Error('useVaccines must be used within a VaccineProvider');
  }
  return context;
};
