import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Pharmacy, Vaccine } from '@/types/pharmacy';
import { MockDataService } from '@/services/mockData';


interface PharmacyContextType {
  pharmacies: Pharmacy[];
  currentPharmacy: Pharmacy | null;
  loading: boolean;
  error: string | null;

  addPharmacy: (pharmacy: Pharmacy) => void;
  editPharmacy: (pharmacy: Pharmacy) => void;
  deletePharmacy: (id: string) => void;
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
  // Load pharmacies on mount
  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    try {

      const pharmacies = await MockDataService.getPharmacies();
      setPharmacies(pharmacies)
    } catch (error) {

    }
  };

  const addPharmacy = (pharmacy: Pharmacy) => {
    setPharmacies((prev) => [...prev, pharmacy])
  };

  const editPharmacy = (data: Pharmacy) => {
    setPharmacies((prev) => prev.map(pharmacy =>
      pharmacy.id === data.id ? data : pharmacy
    ))
  };

  const deletePharmacy = (id: string) => {
    setPharmacies((prev) => prev.filter(pharmacy => pharmacy.id !== id))
  };



  const refreshPharmacies = async (): Promise<void> => {
    await loadPharmacies();
  };

  const contextValue: PharmacyContextType = {
    pharmacies,
    currentPharmacy,
    loading,
    error,
    addPharmacy,
    editPharmacy,
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
