import { Pharmacy, ApiResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Request types
export interface PharmacyCreateRequest {
    name: string;
    address: string;
    location: {
        latitude: number;
        longitude: number;
    };
    phone: string;
    email?: string;
    website?: string;
    operatingHours: {
        [key: string]: {
            open: string;
            close: string;
            isOpen: boolean;
        };
    };
    services: string[];
    medications: {
        name: string;
        category: string;
        inStock: boolean;
        price?: number;
    }[];
    licenseNumber: string;
    rating?: number;
    description?: string;
}

export interface PharmacyUpdateRequest {
    name?: string;
    address?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    phone?: string;
    email?: string;
    website?: string;
    operatingHours?: {
        [key: string]: {
            open: string;
            close: string;
            isOpen: boolean;
        };
    };
    services?: string[];
    medications?: {
        name: string;
        category: string;
        inStock: boolean;
        price?: number;
    }[];
    licenseNumber?: string;
    rating?: number;
    description?: string;
}

export class PharmacyService {
    // Create Pharmacy (Admin only)
    async createPharmacy(pharmacyData: PharmacyCreateRequest): Promise<ApiResponse<Pharmacy>> {
        return await apiClient.post<Pharmacy>(API_ENDPOINTS.PHARMACIES.CREATE, pharmacyData);
    }

    // Get Pharmacy by ID
    async getPharmacyById(id: string): Promise<ApiResponse<Pharmacy>> {
        return await apiClient.get<Pharmacy>(API_ENDPOINTS.PHARMACIES.BY_ID(id));
    }

    // Get All Pharmacies
    async getAllPharmacies(): Promise<ApiResponse<Pharmacy[]>> {
        return await apiClient.get<Pharmacy[]>(API_ENDPOINTS.PHARMACIES.ALL);
    }

    // Update Pharmacy (Admin only)
    async updatePharmacy(id: string, updates: PharmacyUpdateRequest): Promise<ApiResponse<Pharmacy>> {
        return await apiClient.put<Pharmacy>(API_ENDPOINTS.PHARMACIES.UPDATE(id), updates);
    }

    // Delete Pharmacy (Admin only)
    async deletePharmacy(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.PHARMACIES.DELETE(id));
    }
}

export const pharmacyService = new PharmacyService();
