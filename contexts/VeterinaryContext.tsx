import React, { createContext, useContext, useEffect, useState } from 'react';
import { VeterinaryResponse, VeterinaryCreateRequest, VeterinaryUpdateRequest } from '@/types';
import { veterinaryService } from '@/services/api';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';
import { useAuth } from './AuthContext';

interface VeterinaryContextType {
  veterinaries: VeterinaryResponse[];
  currentVeterinary: VeterinaryResponse | null;
  loading: boolean;
  error: string | null;

  // API operations
  createVeterinary: (veterinaryData: VeterinaryCreateRequest) => Promise<void>;
  getVeterinaryById: (id: string) => Promise<VeterinaryResponse | null>;
  getVeterinaryByUserId: (userId: string) => Promise<VeterinaryResponse | null>;
  getActiveVeterinaries: () => Promise<VeterinaryResponse[]>;
  getTopRatedVeterinaries: (minRating?: number) => Promise<VeterinaryResponse[]>;
  updateVeterinary: (id: string, updates: VeterinaryUpdateRequest) => Promise<void>;
  updateRating: (id: string, rating: number) => Promise<void>;
  incrementVisits: (id: string) => Promise<void>;
  deactivateVeterinary: (id: string) => Promise<void>;
  deleteVeterinary: (id: string) => Promise<void>;
  setCurrentVeterinary: (veterinary: VeterinaryResponse | null) => void;
  refreshVeterinaries: () => Promise<void>;
}

// Create context
const VeterinaryContext = createContext<VeterinaryContextType | undefined>(undefined);

// Provider component
export const VeterinaryProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuth()
  const [veterinaries, setVeterinaries] = useState<VeterinaryResponse[]>([])
  const [currentVeterinary, setCurrentVeterinary] = useState<VeterinaryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { handleApiError } = useError();

  // Load veterinaries on mount
  useEffect(() => {
    if (authenticated) {
      loadVeterinaries();
    }
  }, [authenticated]);

  const loadVeterinaries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await veterinaryService.getAllVeterinaries();

      if (response.success && response.data) {
        setVeterinaries(response.data);
      } else {
        throw new Error(response.message || 'Failed to load veterinaries');
      }
    } catch (error: any) {
      console.error('Failed to load veterinaries:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to load veterinaries');
      }
    } finally {
      setLoading(false);
    }
  };

  const createVeterinary = async (veterinaryData: VeterinaryCreateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await veterinaryService.createVeterinary(veterinaryData);

      if (response.success && response.data) {
        setVeterinaries(prev => [...prev, response.data!]);
      } else {
        throw new Error(response.message || 'Failed to create veterinary profile');
      }
    } catch (error: any) {
      console.error('Failed to create veterinary:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to create veterinary profile');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getVeterinaryById = async (id: string): Promise<VeterinaryResponse | null> => {
    try {
      const response = await veterinaryService.getVeterinaryById(id);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get veterinary by ID:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to get veterinary');
      }
      return null;
    }
  };

  const getVeterinaryByUserId = async (userId: string): Promise<VeterinaryResponse | null> => {
    try {
      const response = await veterinaryService.getVeterinaryByUserId(userId);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get veterinary by user ID:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to get veterinary profile');
      }
      return null;
    }
  };

  const getActiveVeterinaries = async (): Promise<VeterinaryResponse[]> => {
    try {
      const response = await veterinaryService.getActiveVeterinaries();

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get active veterinaries:', error);
      setError(error.message || 'Failed to get active veterinaries');
      return [];
    }
  };

  const getTopRatedVeterinaries = async (minRating?: number): Promise<VeterinaryResponse[]> => {
    try {
      const response = await veterinaryService.getTopRatedVeterinaries(minRating);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get top-rated veterinaries:', error);
      setError(error.message || 'Failed to get top-rated veterinaries');
      return [];
    }
  };

  const updateVeterinary = async (id: string, updates: VeterinaryUpdateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await veterinaryService.updateVeterinary(id, updates);

      if (response.success && response.data) {
        setVeterinaries(prev => prev.map(vet => vet.id === id ? response.data! : vet));
      } else {
        throw new Error(response.message || 'Failed to update veterinary');
      }
    } catch (error: any) {
      console.error('Failed to update veterinary:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to update veterinary');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRating = async (id: string, rating: number): Promise<void> => {
    try {
      const response = await veterinaryService.updateRating(id, rating);

      if (response.success) {
        // Update local state
        setVeterinaries(prev => prev.map(vet =>
          vet.id === id ? { ...vet, rating } : vet
        ));
      } else {
        throw new Error(response.message || 'Failed to update rating');
      }
    } catch (error: any) {
      console.error('Failed to update rating:', error);
      setError(error.message || 'Failed to update rating');
      throw error;
    }
  };

  const incrementVisits = async (id: string): Promise<void> => {
    try {
      const response = await veterinaryService.incrementVisits(id);

      if (response.success) {
        // Update local state
        setVeterinaries(prev => prev.map(vet =>
          vet.id === id ? { ...vet, totalVisits: vet.totalVisits + 1 } : vet
        ));
      } else {
        throw new Error(response.message || 'Failed to increment visits');
      }
    } catch (error: any) {
      console.error('Failed to increment visits:', error);
      setError(error.message || 'Failed to increment visits');
      throw error;
    }
  };

  const deactivateVeterinary = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await veterinaryService.deactivateVeterinary(id);

      if (response.success) {
        setVeterinaries(prev => prev.map(vet =>
          vet.id === id ? { ...vet, isActive: false } : vet
        ));
      } else {
        throw new Error(response.message || 'Failed to deactivate veterinary');
      }
    } catch (error: any) {
      console.error('Failed to deactivate veterinary:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to deactivate veterinary');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteVeterinary = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await veterinaryService.deleteVeterinary(id);

      if (response.success) {
        setVeterinaries(prev => prev.filter(vet => vet.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete veterinary');
      }
    } catch (error: any) {
      console.error('Failed to delete veterinary:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to delete veterinary');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshVeterinaries = async (): Promise<void> => {
    await loadVeterinaries();
  };

  const contextValue: VeterinaryContextType = {
    veterinaries,
    currentVeterinary,
    loading,
    error,
    createVeterinary,
    getVeterinaryById,
    getVeterinaryByUserId,
    getActiveVeterinaries,
    getTopRatedVeterinaries,
    updateVeterinary,
    updateRating,
    incrementVisits,
    deactivateVeterinary,
    deleteVeterinary,
    setCurrentVeterinary,
    refreshVeterinaries,
  };

  return (
    <VeterinaryContext.Provider value={contextValue}>
      {children}
    </VeterinaryContext.Provider>
  );
};

// Hook
export const useVeterinaries = () => {
  const context = useContext(VeterinaryContext);
  if (!context) {
    throw new Error('useVeterinaries must be used within a VeterinaryProvider');
  }
  return context;
};
