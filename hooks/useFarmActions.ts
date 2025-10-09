import { Farm, FarmCreateRequest, FarmStatus } from '@/types/farm';
import { farmService } from '@/services/api';
import { useFarms } from '@/contexts/FarmContext';
import { Alert } from 'react-native';
import { useState } from 'react';


export const useFarmActions = () => {
  const { addFarm, editFarm, removeFarm } = useFarms()
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
      removeFarm(response.data)
    } catch (error: any) {
      console.error('Failed to delete farm:', error);
      Alert.alert('Failed to delete farm', error.message || 'Failed to delete farm');
    } finally {
      setLoading(false);
    }
  };

  const updateHealthStatus = async (farmId: string, status: FarmStatus): Promise<void> => {
    try {
      setLoading(true);


      const response = await farmService.updateHealthStatus(farmId, status);

      if (response.success && response.data) {
        editFarm(response.data)
      } else {
        Alert.alert('Failed to update health status', response.message || 'Failed to update health status');
      }
    } catch (error: any) {
      console.error('Failed to update health status:', error);
      Alert.alert('Failed to update health status', error.message || 'Failed to update health status');
    } finally {
      setLoading(false);
    }
  };

  const assignVeterinary = async (farmId: string): Promise<void> => {
    try {
      const response = await farmService.assignVeterinary(farmId);
      if (response.success && response.data) {
        editFarm(response.data)
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
      editFarm(updatedFarm)
    } catch (error) {
      console.error('Error unassigning veterinary:', error);
      throw error;
    }
  };


  return {
    loading,
    loadFarms,
    createFarm,
    updateFarm,
    deleteFarm,
    assignVeterinary,
    unassignVeterinary,
    updateHealthStatus
  };
};
