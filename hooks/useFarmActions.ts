import { Farm, FarmCreateRequest, FarmStatus } from '@/types/farm';
import { farmService } from '@/services/api';
import { useFarms } from '@/contexts/FarmContext';
import { Alert } from 'react-native';
import { useState } from 'react';

export interface FarmActionsType {
  loadFarms: () => Promise<Farm[]>;
  createFarm: (farmData: FarmCreateRequest) => Promise<void>;
  updateFarm: (id: string, farmData: Partial<Farm>) => Promise<void>;
  deleteFarm: (id: string) => Promise<void>;
  assignVeterinary: (farmId: string) => Promise<void>;
  unassignVeterinary: (farmId: string) => Promise<void>;
  getFarmById: (farms: Farm[], id: string) => Farm | undefined;
  getFarmsByOwner: (farms: Farm[], ownerId: string) => Farm[];
  getFarmsByVeterinary: (farms: Farm[], veterinaryId: string) => Farm[];
  getFarmsByStatus: (farms: Farm[], status: FarmStatus) => Farm[];
  refreshFarms: () => Promise<Farm[]>;
}

export const useFarmActions = (): FarmActionsType => {
  const { addFarm, refreshFarms: contextRefresh } = useFarms()
  const [loading, setLoading] = useState(false)
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

  const updateFarm = async (id: string, farmData: Partial<Farm>): Promise<void> => {

    const farms = await loadFarms();
    const existingFarm = farms.find(farm => farm.id === id);

    if (!existingFarm) {
      throw new Error('Farm not found');
    }

    const updatedFarm = { ...existingFarm, ...farmData, updatedAt: new Date().toISOString() };
    addFarm(updatedFarm)
  };

  const deleteFarm = async (id: string): Promise<void> => {
    try {
      setLoading(true);

      const response = await farmService.deleteFarm(id);

      if (!response || !response.data) {
        return
      }
      addFarm(response.data)
    } catch (error: any) {
      console.error('Failed to delete farm:', error);
      Alert.alert('Failed to delete farm', error.message || 'Failed to delete farm');
    } finally {
      setLoading(false);
    }
  };
  const assignVeterinary = async (farmId: string): Promise<void> => {
    try {
      const response = await farmService.assignVeterinary(farmId);
      if (response.success && response.data) {
        addFarm(response.data);
        await contextRefresh();
      }
    } catch (error) {
      console.error('Error assigning veterinary:', error);
      throw error;
    }
  };

  const unassignVeterinary = async (farmId: string): Promise<void> => {
    try {
      // For unassign, we need to use updateFarm since there's no specific unassign endpoint
      const farms = await loadFarms();
      const existingFarm = farms.find(farm => farm.id === farmId);

      if (!existingFarm) {
        throw new Error('Farm not found');
      }

      const updatedFarm = { ...existingFarm, assignedVeterinary: undefined, updatedAt: new Date().toISOString() };
      addFarm(updatedFarm);
      await contextRefresh();
    } catch (error) {
      console.error('Error unassigning veterinary:', error);
      throw error;
    }
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
    assignVeterinary,
    unassignVeterinary,
    getFarmById,
    getFarmsByOwner,
    getFarmsByVeterinary,
    getFarmsByStatus,
    refreshFarms,
  };
};
