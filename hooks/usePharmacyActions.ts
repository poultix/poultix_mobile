import { Pharmacy } from '@/types/pharmacy';
// Pharmacy data - using mock data

export interface PharmacyActionsType {
  loadPharmacies: () => Promise<Pharmacy[]>;
  createPharmacy: (pharmacyData: Omit<Pharmacy, 'id'>) => Promise<Pharmacy>;
  updatePharmacy: (id: string, pharmacyData: Partial<Pharmacy>) => Promise<Pharmacy>;
  deletePharmacy: (id: string) => Promise<void>;
  getPharmacyById: (pharmacies: Pharmacy[], id: string) => Pharmacy | undefined;
  getPharmaciesByDistance: (pharmacies: Pharmacy[], maxDistance: number) => Pharmacy[];
  getOpenPharmacies: (pharmacies: Pharmacy[]) => Pharmacy[];
  getNearbyPharmacies: (pharmacies: Pharmacy[], latitude: number, longitude: number, radius: number) => Pharmacy[];
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  refreshPharmacies: () => Promise<Pharmacy[]>;
}

export const usePharmacyActions = (): PharmacyActionsType => {
  const loadPharmacies = async (): Promise<Pharmacy[]> => {
    return []; // Pharmacy mock data not implemented yet
  };

  const createPharmacy = async (pharmacyData: Omit<Pharmacy, 'id'>): Promise<Pharmacy> => {
    const newPharmacy: Pharmacy = {
      ...pharmacyData,
      id: `pharmacy_${Date.now()}`,
    };
    
    // In a real app, this would make an API call
    return newPharmacy;
  };

  const updatePharmacy = async (id: string, pharmacyData: Partial<Pharmacy>): Promise<Pharmacy> => {
    // In a real app, this would make an API call
    const pharmacies = await loadPharmacies();
    const existingPharmacy = pharmacies.find(pharmacy => pharmacy.id === id);
    
    if (!existingPharmacy) {
      throw new Error('Pharmacy not found');
    }
    
    const updatedPharmacy = { ...existingPharmacy, ...pharmacyData };
    return updatedPharmacy;
  };

  const deletePharmacy = async (id: string): Promise<void> => {
    // In a real app, this would make an API call
    console.log(`Deleting pharmacy with id: ${id}`);
  };

  const getPharmacyById = (pharmacies: Pharmacy[], id: string): Pharmacy | undefined => {
    return pharmacies.find(pharmacy => pharmacy.id === id);
  };

  const getPharmaciesByDistance = (pharmacies: Pharmacy[], maxDistance: number): Pharmacy[] => {
    return pharmacies.filter(pharmacy => pharmacy.distance <= maxDistance);
  };

  const getOpenPharmacies = (pharmacies: Pharmacy[]): Pharmacy[] => {
    return pharmacies.filter(pharmacy => pharmacy.isOpen);
  };

  const getNearbyPharmacies = (pharmacies: Pharmacy[], latitude: number, longitude: number, radius: number): Pharmacy[] => {
    return pharmacies.filter(pharmacy => {
      const distance = calculateDistance(
        latitude, longitude,
        pharmacy.location.latitude, pharmacy.location.longitude
      );
      return distance <= radius;
    });
  };

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const refreshPharmacies = async (): Promise<Pharmacy[]> => {
    return await loadPharmacies();
  };

  return {
    loadPharmacies,
    createPharmacy,
    updatePharmacy,
    deletePharmacy,
    getPharmacyById,
    getPharmaciesByDistance,
    getOpenPharmacies,
    getNearbyPharmacies,
    calculateDistance,
    refreshPharmacies,
  };
};
