import { Farm, FarmStatus } from '@/types/farm';
import { farmService } from '@/services/api';

export interface FarmActionsType {
  loadFarms: () => Promise<Farm[]>;
  createFarm: (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Farm>;
  updateFarm: (id: string, farmData: Partial<Farm>) => Promise<Farm>;
  deleteFarm: (id: string) => Promise<void>;
  getFarmById: (farms: Farm[], id: string) => Farm | undefined;
  getFarmsByOwner: (farms: Farm[], ownerId: string) => Farm[];
  getFarmsByVeterinary: (farms: Farm[], veterinaryId: string) => Farm[];
  getFarmsByStatus: (farms: Farm[], status: FarmStatus) => Farm[];
  refreshFarms: () => Promise<Farm[]>;
}

export const useFarmActions = (): FarmActionsType => {
  const loadFarms = async (): Promise<Farm[]> => {
    const response = await farmService.getAllFarms();
    return response.success && response.data ? response.data : [];
  };

  const createFarm = async (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farm> => {
    const newFarm: Farm = {
      ...farmData,
      id: `farm_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app, this would make an API call
    return newFarm;
  };

  const updateFarm = async (id: string, farmData: Partial<Farm>): Promise<Farm> => {
    // In a real app, this would make an API call
    const farms = await loadFarms();
    const existingFarm = farms.find(farm => farm.id === id);
    
    if (!existingFarm) {
      throw new Error('Farm not found');
    }
    
    const updatedFarm = { ...existingFarm, ...farmData, updatedAt: new Date().toISOString() };
    return updatedFarm;
  };

  const deleteFarm = async (id: string): Promise<void> => {
    // In a real app, this would make an API call
    console.log(`Deleting farm with id: ${id}`);
  };

  const getFarmById = (farms: Farm[], id: string): Farm | undefined => {
    return farms.find(farm => farm.id === id);
  };

  const getFarmsByOwner = (farms: Farm[], ownerId: string): Farm[] => {
    return farms.filter(farm => farm.owner.id === ownerId);
  };

  const getFarmsByVeterinary = (farms: Farm[], veterinaryId: string): Farm[] => {
    return farms.filter(farm => farm.assignedVeterinary?.id === veterinaryId);
  };

  const getFarmsByStatus = (farms: Farm[], status: FarmStatus): Farm[] => {
    return farms.filter(farm => farm.healthStatus === status);
  };

  const refreshFarms = async (): Promise<Farm[]> => {
    return await loadFarms();
  };

  return {
    loadFarms,
    createFarm,
    updateFarm,
    deleteFarm,
    getFarmById,
    getFarmsByOwner,
    getFarmsByVeterinary,
    getFarmsByStatus,
    refreshFarms,
  };
};
