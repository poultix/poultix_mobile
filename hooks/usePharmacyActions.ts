import { useError } from '@/contexts/ErrorContext';
import { usePharmacies } from '@/contexts/PharmacyContext';
import { pharmacyService } from '@/services/api';
import { HTTP_STATUS } from '@/services/constants';
import {PharmacyCreateRequest, PharmacyUpdateRequest } from '@/types/pharmacy';
import { useState } from 'react';
// Pharmacy data - using mock data

export const usePharmacyActions = () => {
  const [loading, setLoading] = useState(false)
  const { addPharmacy, editPharmacy, removePharmacy } = usePharmacies()
  const { handleApiError } = useError()

  const createPharmacy = async (pharmacyData: PharmacyCreateRequest): Promise<void> => {
    try {
      setLoading(true);


      const response = await pharmacyService.createPharmacy(pharmacyData);

      if (response.success && response.data) {
        addPharmacy(response.data)
      } else {
        throw new Error(response.message || 'Failed to create pharmacy');
      }
    } catch (error: any) {
      console.error('Failed to create pharmacy:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {

      }

    } finally {
      setLoading(false);
    }
  };


  const updatePharmacy = async (id: string, updates: PharmacyUpdateRequest): Promise<void> => {
    try {
      setLoading(true);

      const response = await pharmacyService.updatePharmacy(id, updates);

      if (response.success && response.data) {
        editPharmacy(response.data)
      } else {
        throw new Error(response.message || 'Failed to update pharmacy');
      }
    } catch (error: any) {
      console.error('Failed to update pharmacy:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
      }
    } finally {
      setLoading(false);
    }
  };


  const deletePharmacy = async (id: string): Promise<void> => {
    try {
      setLoading(true);

      const response = await pharmacyService.deletePharmacy(id);

      if (response.success && response.data) {
        removePharmacy(response.data)
      } else {
        throw new Error(response.message || 'Failed to delete pharmacy');
      }
    } catch (error: any) {
      console.error('Failed to delete pharmacy:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
      }
    } finally {
      setLoading(false);
    }
  };




  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };


  return {
    loading,
    createPharmacy,
    updatePharmacy,
    deletePharmacy,
    calculateDistance,
  };
};
