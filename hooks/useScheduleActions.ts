import { Schedule, ScheduleType, ScheduleStatus, SchedulePriority } from '@/types/schedule';
import { MockDataService } from '@/services/mockData';

export interface ScheduleActionsType {
  loadSchedules: () => Promise<Schedule[]>;
  createSchedule: (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Schedule>;
  updateSchedule: (id: string, scheduleData: Partial<Schedule>) => Promise<Schedule>;
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
  const loadSchedules = async (): Promise<Schedule[]> => {
    return await MockDataService.getSchedules('');
  };

  const createSchedule = async (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: `schedule_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // In a real app, this would make an API call
    return newSchedule;
  };

  const updateSchedule = async (id: string, scheduleData: Partial<Schedule>): Promise<Schedule> => {
    // In a real app, this would make an API call
    const schedules = await loadSchedules();
    const existingSchedule = schedules.find(schedule => schedule.id === id);
    
    if (!existingSchedule) {
      throw new Error('Schedule not found');
    }
    
    const updatedSchedule = { ...existingSchedule, ...scheduleData, updatedAt: new Date() };
    return updatedSchedule;
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
