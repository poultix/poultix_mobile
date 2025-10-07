import { Farm, FarmCreateRequest, FarmStatus } from '@/types/farm';
import { farmService } from '@/services/api';
import { useFarms } from '@/contexts/FarmContext';

export interface FarmActionsType {
  loadFarms: () => Promise<Farm[]>;
  createFarm: (farmData: FarmCreateRequest) => Promise<void>;
  updateFarm: (id: string, farmData: Partial<Farm>) => Promise<void>;
  deleteFarm: (id: string) => Promise<void>;
  getFarmById: (farms: Farm[], id: string) => Farm | undefined;
  getFarmsByOwner: (farms: Farm[], ownerId: string) => Farm[];
  getFarmsByVeterinary: (farms: Farm[], veterinaryId: string) => Farm[];
  getFarmsByStatus: (farms: Farm[], status: FarmStatus) => Farm[];
  refreshFarms: () => Promise<Farm[]>;
}

export const useFarmActions = (): FarmActionsType => {
  const { addFarm } = useFarms()
  const loadFarms = async (): Promise<Farm[]> => {
    const response = await farmService.getAllFarms();
    return response.success && response.data ? response.data : [];
  };

  const createFarm = async (farmData: FarmCreateRequest) => {
    const response = await farmService.createFarm(farmData);
    if (!response || !response.data) {
      return
    }
    addFarm(response.data)
  };

  const updateFarm = async (id: string, farmData: Partial<Farm>): Promise<Farm> => {
   
    const farms = await loadFarms();
    const existingFarm = farms.find(farm => farm.id === id);

    if (!existingFarm) {
      throw new Error('Farm not found');
    }

    const updatedFarm = { ...existingFarm, ...farmData, updatedAt: new Date().toISOString() };
    return updatedFarm;
  };

  const deleteFarm = async (id: string): Promise<void> => {
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
