import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Schedule, ScheduleType, ScheduleStatus, SchedulePriority } from '@/types/schedule';
import { User } from '@/types/user';
import { MockDataService } from '@/services/mockData';

// Schedule state interface
interface ScheduleState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
}

// Schedule actions
type ScheduleAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SCHEDULES'; payload: Schedule[] }
  | { type: 'ADD_SCHEDULE'; payload: Schedule }
  | { type: 'UPDATE_SCHEDULE'; payload: Schedule }
  | { type: 'DELETE_SCHEDULE'; payload: string }
  | { type: 'SET_CURRENT_SCHEDULE'; payload: Schedule | null };

// Context types
interface ScheduleContextType {
  state: ScheduleState;
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
  // CRUD functions for hooks to call
  setSchedules: (schedules: Schedule[] | ((prev: Schedule[]) => Schedule[])) => void;
  addSchedule: (schedule: Schedule) => void;
  editSchedule: (schedule: Schedule) => void;
  deleteSchedule: (id: string) => void;
  setCurrentSchedule: (schedule: Schedule | null) => void;
  refreshSchedules: () => Promise<void>;
}

// Initial state
const initialState: ScheduleState = {
  schedules: [],
  currentSchedule: null,
  isLoading: false,
  error: null,
};

// Reducer
const scheduleReducer = (state: ScheduleState, action: ScheduleAction): ScheduleState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SCHEDULES':
      return { ...state, schedules: action.payload, isLoading: false, error: null };
    case 'ADD_SCHEDULE':
      return { ...state, schedules: [...state.schedules, action.payload] };
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.map(schedule => 
          schedule.id === action.payload.id ? action.payload : schedule
        )
      };
    case 'DELETE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload)
      };
    case 'SET_CURRENT_SCHEDULE':
      return {
        ...state,
        currentSchedule: action.payload
      };
    default:
      return state;
  }
};

// Create context
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// Provider component
export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // Load schedules on mount
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const schedules = await MockDataService.getSchedules('');
      dispatch({ type: 'SET_SCHEDULES', payload: schedules });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load schedules' });
    }
  };

  // CRUD functions for hooks to call
  const setSchedules = (schedules: Schedule[] | ((prev: Schedule[]) => Schedule[])) => {
    if (typeof schedules === 'function') {
      dispatch({ type: 'SET_SCHEDULES', payload: schedules(state.schedules) });
    } else {
      dispatch({ type: 'SET_SCHEDULES', payload: schedules });
    }
  };

  const addSchedule = (schedule: Schedule) => {
    dispatch({ type: 'ADD_SCHEDULE', payload: schedule });
  };

  const editSchedule = (schedule: Schedule) => {
    dispatch({ type: 'UPDATE_SCHEDULE', payload: schedule });
  };

  const deleteSchedule = (id: string) => {
    dispatch({ type: 'DELETE_SCHEDULE', payload: id });
  };

  const setCurrentSchedule = (schedule: Schedule | null) => {
    dispatch({ type: 'SET_CURRENT_SCHEDULE', payload: schedule });
  };

  const refreshSchedules = async (): Promise<void> => {
    await loadSchedules();
  };

  const contextValue: ScheduleContextType = {
    state,
    schedules: state.schedules,
    currentSchedule: state.currentSchedule,
    isLoading: state.isLoading,
    error: state.error,
    setSchedules,
    addSchedule,
    editSchedule,
    deleteSchedule,
    setCurrentSchedule,
    refreshSchedules,
  };

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Hook
export const useSchedules = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedules must be used within a ScheduleProvider');
  }
  return context;
};
