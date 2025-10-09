import React, { createContext, useContext, useEffect, useState } from 'react';
import { Schedule, ScheduleStatus } from '@/types';
import { scheduleService } from '@/services/api';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';
import { useAuth } from './AuthContext';
interface ScheduleContextType {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  loading: boolean;
  error: string | null;

  // API operations
  addSchedule: (scheduleData: Schedule) => void;
  getScheduleById: (id: string) => Promise<Schedule | null>;
  getSchedulesByFarmer: (farmerId: string) => Promise<Schedule[]>;
  getSchedulesByVeterinary: (veterinaryId: string) => Promise<Schedule[]>;
  getSchedulesByStatus: (status: ScheduleStatus) => Promise<Schedule[]>;
  getSchedulesByDate: (date: string) => Promise<Schedule[]>;
  getSchedulesByDateRange: (startDate: string, endDate: string) => Promise<Schedule[]>;
  editSchedule: (data: Schedule) => void;
  removeSchedule: (data: Schedule) => void
  setCurrentSchedule: (schedule: Schedule | null) => void;
}


// Create context
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);
// Provider component
export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { handleApiError } = useError(); // Use ErrorContext for routing
  // Load schedules on mount
  useEffect(() => {
    if (authenticated) {
      loadSchedules().catch(handleApiError);
    }
  }, [authenticated]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await scheduleService.getAllSchedules();

      if (response.success && response.data) {
        setSchedules(response.data);
        console.log(response.data)
      } else {
        throw new Error(response.message || 'Failed to load schedules');
      }
    } catch (error: any) {
      console.error('Failed to load schedules:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to load schedules'); // ✅ Show inline error for minor issues
      }
    } finally {
      setLoading(false);
    }
  };


  const getScheduleById = async (id: string): Promise<Schedule | null> => {
    try {
      const response = await scheduleService.getScheduleById(id);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get schedule by ID:', error);
      setError(error.message || 'Failed to get schedule');
      return null;
    }
  };

  const getSchedulesByFarmer = async (farmerId: string): Promise<Schedule[]> => {
    try {
      const response = await scheduleService.getSchedulesByFarmer(farmerId);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get schedules by farmer:', error);
      setError(error.message || 'Failed to get schedules');
      return [];
    }
  };

  const getSchedulesByVeterinary = async (veterinaryId: string): Promise<Schedule[]> => {
    try {
      const response = await scheduleService.getSchedulesByVeterinary(veterinaryId);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get schedules by veterinary:', error);
      setError(error.message || 'Failed to get schedules');
      return [];
    }
  };

  const getSchedulesByStatus = async (status: ScheduleStatus): Promise<Schedule[]> => {
    try {
      // Convert ScheduleStatus to service expected format
      const serviceStatus = status === ScheduleStatus.SCHEDULED ? 'PENDING' :
        status === ScheduleStatus.IN_PROGRESS ? 'CONFIRMED' :
          status === ScheduleStatus.COMPLETED ? 'COMPLETED' :
            status === ScheduleStatus.CANCELLED ? 'CANCELLED' : 'PENDING';
      const response = await scheduleService.getSchedulesByStatus(serviceStatus as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED');

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get schedules by status:', error);
      setError(error.message || 'Failed to get schedules');
      return [];
    }
  };

  const getSchedulesByDate = async (date: string): Promise<Schedule[]> => {
    try {
      const response = await scheduleService.getSchedulesByDate(date);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get schedules by date:', error);
      setError(error.message || 'Failed to get schedules');
      return [];
    }
  };

  const getSchedulesByDateRange = async (startDate: string, endDate: string): Promise<Schedule[]> => {
    try {
      const response = await scheduleService.getSchedulesByDateRange(startDate, endDate);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get schedules by date range:', error);
      setError(error.message || 'Failed to get schedules');
      return [];
    }
  };

  const addSchedule = (scheduleData: Schedule) => {
    setSchedules(prev => [...prev, scheduleData]);
  };

  const editSchedule = (data: Schedule) => {
    setSchedules(prev => prev.map(s => s.id === data.id ? data : s))
  }

  const removeSchedule = (data: Schedule) => {
    setSchedules(prev => prev.filter(s => s.id !== data.id))
  }







  const contextValue: ScheduleContextType = {
    schedules,
    currentSchedule,
    loading,
    error,
    addSchedule,
    getScheduleById,
    getSchedulesByFarmer,
    getSchedulesByVeterinary,
    getSchedulesByStatus,
    getSchedulesByDate,
    getSchedulesByDateRange,
    setCurrentSchedule,
    editSchedule,
    removeSchedule
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
