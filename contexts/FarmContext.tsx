import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Farm, FarmStatus } from '@/types/farm';
import { User } from '@/types/user';
import { MockDataService } from '@/services/mockData';

// Farm state interface
interface FarmState {
  farms: Farm[];
  currentFarm: Farm | null;
  isLoading: boolean;
  error: string | null;
}

// Farm actions
type FarmAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FARMS'; payload: Farm[] }
  | { type: 'ADD_FARM'; payload: Farm }
  | { type: 'UPDATE_FARM'; payload: Farm }
  | { type: 'DELETE_FARM'; payload: string }
  | { type: 'SET_CURRENT_FARM'; payload: Farm | null };

// Context types
interface FarmContextType {
  state: FarmState;
  farms: Farm[];
  currentFarm: Farm | null;
  isLoading: boolean;
  error: string | null;
  // CRUD functions for hooks to call
  setFarms: (farms: Farm[] | ((prev: Farm[]) => Farm[])) => void;
  addFarm: (farm: Farm) => void;
  editFarm: (farm: Farm) => void;
  deleteFarm: (id: string) => void;
  setCurrentFarm: (farm: Farm | null) => void;
  refreshFarms: () => Promise<void>;
}

// Initial state
const initialState: FarmState = {
  farms: [],
  currentFarm: null,
  isLoading: false,
  error: null,
};

// Reducer
const farmReducer = (state: FarmState, action: FarmAction): FarmState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_FARMS':
      return { ...state, farms: action.payload, isLoading: false, error: null };
    case 'ADD_FARM':
      return { ...state, farms: [...state.farms, action.payload] };
    case 'UPDATE_FARM':
      return {
        ...state,
        farms: state.farms.map(farm => 
          farm.id === action.payload.id ? action.payload : farm
        )
      };
    case 'DELETE_FARM':
      return {
        ...state,
        farms: state.farms.filter(farm => farm.id !== action.payload)
      };
    case 'SET_CURRENT_FARM':
      return {
        ...state,
        currentFarm: action.payload
      };
    default:
      return state;
  }
};

// Create context
const FarmContext = createContext<FarmContextType | undefined>(undefined);

// Provider component
export const FarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(farmReducer, initialState);

  // Load farms on mount
  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const farms = await MockDataService.getFarms();
      dispatch({ type: 'SET_FARMS', payload: farms });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load farms' });
    }
  };

  // CRUD functions for hooks to call
  const setFarms = (farms: Farm[] | ((prev: Farm[]) => Farm[])) => {
    if (typeof farms === 'function') {
      dispatch({ type: 'SET_FARMS', payload: farms(state.farms) });
    } else {
      dispatch({ type: 'SET_FARMS', payload: farms });
    }
  };

  const addFarm = (farm: Farm) => {
    dispatch({ type: 'ADD_FARM', payload: farm });
  };

  const editFarm = (farm: Farm) => {
    dispatch({ type: 'UPDATE_FARM', payload: farm });
  };

  const deleteFarm = (id: string) => {
    dispatch({ type: 'DELETE_FARM', payload: id });
  };

  const setCurrentFarm = (farm: Farm | null) => {
    dispatch({ type: 'SET_CURRENT_FARM', payload: farm });
  };

  const refreshFarms = async (): Promise<void> => {
    await loadFarms();
  };

  const contextValue: FarmContextType = {
    state,
    farms: state.farms,
    currentFarm: state.currentFarm,
    isLoading: state.isLoading,
    error: state.error,
    setFarms,
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