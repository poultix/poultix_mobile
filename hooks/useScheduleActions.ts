import { Schedule, ScheduleStatus,ScheduleCreateRequest, ScheduleUpdateRequest } from '@/types/schedule';
import { scheduleService } from '@/services/api';
import { useSchedules } from '@/contexts/ScheduleContext';
import { useState } from 'react';



export const useScheduleActions = () => {
  const [loading, setLoading] = useState(false)
  const { editSchedule, removeSchedule, addSchedule } = useSchedules()

  const loadSchedules = async (): Promise<Schedule[]> => {
    const response = await scheduleService.getAllSchedules();
    return response.success && response.data ? response.data : [];
  };

  const createSchedule = async (scheduleData: ScheduleCreateRequest) => {
    const response = await scheduleService.createSchedule(scheduleData);
    if (response.success && response.data) {
      addSchedule(response.data)
    }

  };

  const updateSchedule = async (id: string, updates: ScheduleUpdateRequest): Promise<void> => {
    try {
      setLoading(true);
      const response = await scheduleService.updateSchedule(id, updates);

      if (response.success && response.data) {
        editSchedule(response.data)
      } else {
        throw new Error(response.message || 'Failed to update schedule');
      }
    } catch (error: any) {
      console.error('Failed to update schedule:', error);

    } finally {
      setLoading(false);
    }
  };


  const updateScheduleStatus = async (id: string, status: ScheduleStatus): Promise<void> => {
    try {
      setLoading(true);

      // Convert ScheduleStatus to service expected format
      const serviceStatus = status === ScheduleStatus.SCHEDULED ? 'PENDING' :
        status === ScheduleStatus.IN_PROGRESS ? 'CONFIRMED' :
          status === ScheduleStatus.COMPLETED ? 'COMPLETED' :
            status === ScheduleStatus.CANCELLED ? 'CANCELLED' : 'PENDING';
      const response = await scheduleService.updateScheduleStatus(id, serviceStatus as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED');

      if (response.success && response.data) {
        editSchedule(response.data)
      }
    } catch (error: any) {
      console.error('Failed to update schedule status:', error);
    } finally {
      setLoading(false);
    }
  };



  const completeSchedule = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await scheduleService.completeSchedule(id);

      if (response.success && response.data) {
        editSchedule(response.data)
      }
    } catch (error: any) {
      console.error('Failed to complete schedule:', error);

    } finally {
      setLoading(false);
    }
  };

  const cancelSchedule = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await scheduleService.cancelSchedule(id);

      if (response.success && response.data) {
        editSchedule(response.data)
      }
    } catch (error: any) {
      console.error('Failed to cancel schedule:', error);

    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: string): Promise<void> => {
    try {
      setLoading(true);


      const response = await scheduleService.deleteSchedule(id);

      if (response.success && response.data) {
        removeSchedule(response.data)
      }
    } catch (error: any) {
      console.error('Failed to delete schedule:', error);
    } finally {
      setLoading(false);
    }
  };





  return {
    loadSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    loading,
    updateScheduleStatus,
    completeSchedule,
    cancelSchedule,
    
  };
};
