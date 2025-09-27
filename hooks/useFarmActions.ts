import { Farm, FarmStatus } from '@/types/farm';
import { MockDataService } from '@/services/mockData';

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
    return await MockDataService.getFarms();
  };

  const createFarm = async (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farm> => {
    const newFarm: Farm = {
      ...farmData,
      id: `farm_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    
    const updatedFarm = { ...existingFarm, ...farmData, updatedAt: new Date() };
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
