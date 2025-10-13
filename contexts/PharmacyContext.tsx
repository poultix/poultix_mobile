import React, { createContext, useContext, useEffect, useState } from 'react';
import { Pharmacy } from '@/types';
import { pharmacyService } from '@/services/api';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';
import { useAuth } from './AuthContext';


interface PharmacyContextType {
  pharmacies: Pharmacy[];
  currentPharmacy: Pharmacy | null;
  loading: boolean;
  error: string | null;
  getPharmacyById: (id: string) => Promise<Pharmacy | null>;
  addPharmacy: (data: Pharmacy) => void
  editPharmacy: (data: Pharmacy) => void;
  removePharmacy: (data: Pharmacy) => void;
  setCurrentPharmacy: (pharmacy: Pharmacy | null) => void;

}

// Create context
const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

// Provider component
export const PharmacyProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuth()
  const [currentPharmacy, setCurrentPharmacy] = useState<Pharmacy | null>(null)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { handleApiError } = useError();
  // Load pharmacies on mount
  useEffect(() => {
    if (authenticated) {
      loadPharmacies();
    }
  }, [authenticated]);

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


  const addPharmacy = (data: Pharmacy) => {
    setPharmacies(prev => [...prev, data])
  }

  const editPharmacy = (data: Pharmacy) => {
    setPharmacies(prev => prev.map(p => p.id === data.id ? data : p))
  }

  const removePharmacy = (data: Pharmacy) => {
    setPharmacies(prev => prev.filter(p => p.id !== data.id))
  }

  const contextValue: PharmacyContextType = {
    pharmacies,
    currentPharmacy,
    loading,
    error,
    getPharmacyById,
    setCurrentPharmacy,
    addPharmacy,
    editPharmacy,
    removePharmacy
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
