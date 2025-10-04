import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Pharmacy, PharmacyCreateRequest, PharmacyUpdateRequest } from '@/types';
import { pharmacyService } from '@/services/api';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';


interface PharmacyContextType {
  pharmacies: Pharmacy[];
  currentPharmacy: Pharmacy | null;
  loading: boolean;
  error: string | null;

  // API operations
  createPharmacy: (pharmacyData: PharmacyCreateRequest) => Promise<void>;
  getPharmacyById: (id: string) => Promise<Pharmacy | null>;
  updatePharmacy: (id: string, updates: PharmacyUpdateRequest) => Promise<void>;
  deletePharmacy: (id: string) => Promise<void>;
  setCurrentPharmacy: (pharmacy: Pharmacy | null) => void;
  refreshPharmacies: () => Promise<void>;
}

// Create context
const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

// Provider component
export const PharmacyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPharmacy, setCurrentPharmacy] = useState<Pharmacy | null>(null)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { handleApiError } = useError(); // ✅ Use ErrorContext for routing
  // Load pharmacies on mount
  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await pharmacyService.getAllPharmacies();
      
      if (response.success && response.data) {
        setPharmacies(response.data);
      } else {
        throw new Error(response.message || 'Failed to load pharmacies');
      }
    } catch (error: any) {
      console.error('Failed to load pharmacies:', error);
      
      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to load pharmacies'); // ✅ Show inline error for minor issues
      }
    } finally {
      setLoading(false);
    }
  };

  const createPharmacy = async (pharmacyData: PharmacyCreateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await pharmacyService.createPharmacy(pharmacyData);
      
      if (response.success && response.data) {
        setPharmacies(prev => [...prev, response.data!]);
      } else {
        throw new Error(response.message || 'Failed to create pharmacy');
      }
    } catch (error: any) {
      console.error('Failed to create pharmacy:', error);
      
      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to create pharmacy'); // ✅ Show inline error for minor issues
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const getPharmacyById = async (id: string): Promise<Pharmacy | null> => {
    try {
      const response = await pharmacyService.getPharmacyById(id);
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get pharmacy by ID:', error);
      
      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to get pharmacy'); // ✅ Show inline error for minor issues
      }
      return null;
    }
  };

  const updatePharmacy = async (id: string, updates: PharmacyUpdateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await pharmacyService.updatePharmacy(id, updates);
      
      if (response.success && response.data) {
        setPharmacies(prev => prev.map(pharmacy => pharmacy.id === id ? response.data! : pharmacy));
      } else {
        throw new Error(response.message || 'Failed to update pharmacy');
      }
    } catch (error: any) {
      console.error('Failed to update pharmacy:', error);
      
      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to update pharmacy'); // ✅ Show inline error for minor issues
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePharmacy = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await pharmacyService.deletePharmacy(id);
      
      if (response.success) {
        setPharmacies(prev => prev.filter(pharmacy => pharmacy.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete pharmacy');
      }
    } catch (error: any) {
      console.error('Failed to delete pharmacy:', error);
      
      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to delete pharmacy'); // ✅ Show inline error for minor issues
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };



  const refreshPharmacies = async (): Promise<void> => {
    await loadPharmacies();
  };

  const contextValue: PharmacyContextType = {
    pharmacies,
    currentPharmacy,
    loading,
    error,
    createPharmacy,
    getPharmacyById,
    updatePharmacy,
    deletePharmacy,
    setCurrentPharmacy,
    refreshPharmacies,
  };

  return (
    <PharmacyContext.Provider value={contextValue}>
      {children}
    </PharmacyContext.Provider>
  );
};

// Hook
export const usePharmacies = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacies must be used within a PharmacyProvider');
  }
  return context;
};
