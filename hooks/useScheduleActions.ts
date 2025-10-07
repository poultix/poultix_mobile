import { Schedule, ScheduleType, ScheduleStatus, SchedulePriority, ScheduleCreateRequest } from '@/types/schedule';
import { scheduleService } from '@/services/api';
import { useSchedules } from '@/contexts/ScheduleContext';

export interface ScheduleActionsType {
  loadSchedules: () => Promise<Schedule[]>;
  createSchedule: (scheduleData: ScheduleCreateRequest) => Promise<void>;
  updateSchedule: (id: string, scheduleData: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  getScheduleById: (schedules: Schedule[], id: string) => Schedule | undefined;
  getSchedulesByFarmer: (schedules: Schedule[], farmerId: string) => Schedule[];
  getSchedulesByVeterinary: (schedules: Schedule[], veterinaryId: string) => Schedule[];
  getSchedulesByStatus: (schedules: Schedule[], status: ScheduleStatus) => Schedule[];
  getSchedulesByType: (schedules: Schedule[], type: ScheduleType) => Schedule[];
  getSchedulesByPriority: (schedules: Schedule[], priority: SchedulePriority) => Schedule[];
  refreshSchedules: () => Promise<Schedule[]>;
}

export const useScheduleActions = (): ScheduleActionsType => {

  const { schedules, addSchedule } = useSchedules()

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

  const updateSchedule = async (id: string, scheduleData: Partial<Schedule>) => {
    const schedules = await loadSchedules();
    const existingSchedule = schedules.find(schedule => schedule.id === id);

    if (!existingSchedule) {
      throw new Error('Schedule not found');
    }

    const updatedSchedule = { ...existingSchedule, ...scheduleData, updatedAt: new Date() };


  };

  const deleteSchedule = async (id: string): Promise<void> => {
    // In a real app, this would make an API call
    console.log(`Deleting schedule with id: ${id}`);
  };

  const getScheduleById = (schedules: Schedule[], id: string): Schedule | undefined => {
    return schedules.find(schedule => schedule.id === id);
  };

  const getSchedulesByFarmer = (schedules: Schedule[], farmerId: string): Schedule[] => {
    return schedules.filter(schedule => schedule.farmer.id === farmerId);
  };

  const getSchedulesByVeterinary = (schedules: Schedule[], veterinaryId: string): Schedule[] => {
    return schedules.filter(schedule => schedule.veterinary.id === veterinaryId);
  };

  const getSchedulesByStatus = (schedules: Schedule[], status: ScheduleStatus): Schedule[] => {
    return schedules.filter(schedule => schedule.status === status);
  };

  const getSchedulesByType = (schedules: Schedule[], type: ScheduleType): Schedule[] => {
    return schedules.filter(schedule => schedule.type === type);
  };

  const getSchedulesByPriority = (schedules: Schedule[], priority: SchedulePriority): Schedule[] => {
    return schedules.filter(schedule => schedule.priority === priority);
  };

  const refreshSchedules = async (): Promise<Schedule[]> => {
    return await loadSchedules();
  };

  return {
    loadSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    getSchedulesByFarmer,
    getSchedulesByVeterinary,
    getSchedulesByStatus,
    getSchedulesByType,
    getSchedulesByPriority,
    refreshSchedules,
  };
};
