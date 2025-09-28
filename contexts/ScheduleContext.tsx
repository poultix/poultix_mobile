import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Schedule, ScheduleType, ScheduleStatus, SchedulePriority } from '@/types/schedule';
import { User } from '@/types/user';
import { MockDataService } from '@/services/mockData';

interface ScheduleContextType {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  loading: boolean;
  error: string | null;

  addSchedule: (schedule: Schedule) => void;
  editSchedule: (schedule: Schedule) => void;
  deleteSchedule: (id: string) => void;
  setCurrentSchedule: (schedule: Schedule | null) => void;
  refreshSchedules: () => Promise<void>;
}


// Create context
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// Provider component
export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Load schedules on mount
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {

      const data = await MockDataService.getSchedules('');
      setSchedules(data)
    } catch (error) {

    }
  };


  const addSchedule = (data: Schedule) => {
    setSchedules((prev) => [...prev, data])
  };

  const editSchedule = (data: Schedule) => {
    setSchedules(prev => prev.map(schedule =>
      schedule.id === data.id ? data : schedule
    ))
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter(schedule => schedule.id !== id))
  };



  const refreshSchedules = async (): Promise<void> => {
    await loadSchedules();
  };

  const contextValue: ScheduleContextType = {
    schedules,
    currentSchedule,
    loading,
    error,
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
