import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Pharmacy, Vaccine } from '@/types/pharmacy';
import { MockDataService } from '@/services/mockData';

// Pharmacy state interface
interface PharmacyState {
  pharmacies: Pharmacy[];
  currentPharmacy: Pharmacy | null;
  isLoading: boolean;
  error: string | null;
}

// Pharmacy actions
type PharmacyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PHARMACIES'; payload: Pharmacy[] }
  | { type: 'ADD_PHARMACY'; payload: Pharmacy }
  | { type: 'UPDATE_PHARMACY'; payload: Pharmacy }
  | { type: 'DELETE_PHARMACY'; payload: string }
  | { type: 'SET_CURRENT_PHARMACY'; payload: Pharmacy | null };

// Context types
interface PharmacyContextType {
  state: PharmacyState;
  pharmacies: Pharmacy[];
  currentPharmacy: Pharmacy | null;
  isLoading: boolean;
  error: string | null;
  // CRUD functions for hooks to call
  setPharmacies: (pharmacies: Pharmacy[] | ((prev: Pharmacy[]) => Pharmacy[])) => void;
  addPharmacy: (pharmacy: Pharmacy) => void;
  editPharmacy: (pharmacy: Pharmacy) => void;
  deletePharmacy: (id: string) => void;
  setCurrentPharmacy: (pharmacy: Pharmacy | null) => void;
  refreshPharmacies: () => Promise<void>;
}

// Initial state
const initialState: PharmacyState = {
  pharmacies: [],
  currentPharmacy: null,
  isLoading: false,
  error: null,
};

// Reducer
const pharmacyReducer = (state: PharmacyState, action: PharmacyAction): PharmacyState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PHARMACIES':
      return { ...state, pharmacies: action.payload, isLoading: false, error: null };
    case 'ADD_PHARMACY':
      return { ...state, pharmacies: [...state.pharmacies, action.payload] };
    case 'UPDATE_PHARMACY':
      return {
        ...state,
        pharmacies: state.pharmacies.map(pharmacy => 
          pharmacy.id === action.payload.id ? action.payload : pharmacy
        )
      };
    case 'DELETE_PHARMACY':
      return {
        ...state,
        pharmacies: state.pharmacies.filter(pharmacy => pharmacy.id !== action.payload)
      };
    case 'SET_CURRENT_PHARMACY':
      return {
        ...state,
        currentPharmacy: action.payload
      };
    default:
      return state;
  }
};

// Create context
const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

// Provider component
export const PharmacyProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(pharmacyReducer, initialState);

  // Load pharmacies on mount
  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const pharmacies = await MockDataService.getPharmacies();
      dispatch({ type: 'SET_PHARMACIES', payload: pharmacies });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load pharmacies' });
    }
  };

  // CRUD functions for hooks to call
  const setPharmacies = (pharmacies: Pharmacy[] | ((prev: Pharmacy[]) => Pharmacy[])) => {
    if (typeof pharmacies === 'function') {
      dispatch({ type: 'SET_PHARMACIES', payload: pharmacies(state.pharmacies) });
    } else {
      dispatch({ type: 'SET_PHARMACIES', payload: pharmacies });
    }
  };

  const addPharmacy = (pharmacy: Pharmacy) => {
    dispatch({ type: 'ADD_PHARMACY', payload: pharmacy });
  };

  const editPharmacy = (pharmacy: Pharmacy) => {
    dispatch({ type: 'UPDATE_PHARMACY', payload: pharmacy });
  };

  const deletePharmacy = (id: string) => {
    dispatch({ type: 'DELETE_PHARMACY', payload: id });
  };

  const setCurrentPharmacy = (pharmacy: Pharmacy | null) => {
    dispatch({ type: 'SET_CURRENT_PHARMACY', payload: pharmacy });
  };

  const refreshPharmacies = async (): Promise<void> => {
    await loadPharmacies();
  };

  const contextValue: PharmacyContextType = {
    state,
    pharmacies: state.pharmacies,
    currentPharmacy: state.currentPharmacy,
    isLoading: state.isLoading,
    error: state.error,
    setPharmacies,
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
