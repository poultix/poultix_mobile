import { ApiResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Response types
export interface VeterinaryResponse {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        location?: {
            address: string;
            latitude?: number;
            longitude?: number;
        };
    };
    specialization: string[];
    experience: number;
    rating: number;
    totalVisits: number;
    isAvailable: boolean;
    licenseNumber: string;
    education: string;
    certifications: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Request types
export interface VeterinaryCreateRequest {
    specialization: string[];
    experience: number;
    licenseNumber: string;
    education: string;
    certifications?: string[];
}

export interface VeterinaryUpdateRequest {
    specialization?: string[];
    experience?: number;
    licenseNumber?: string;
    education?: string;
    certifications?: string[];
    isAvailable?: boolean;
}

export class VeterinaryService {
    // Create Veterinary Profile
    async createVeterinary(userId: string, veterinaryData: VeterinaryCreateRequest): Promise<ApiResponse<VeterinaryResponse>> {
        return await apiClient.post<VeterinaryResponse>(API_ENDPOINTS.VETERINARIES.CREATE(userId), veterinaryData);
    }

    // Get Veterinary by ID
    async getVeterinaryById(id: string): Promise<ApiResponse<VeterinaryResponse>> {
        return await apiClient.get<VeterinaryResponse>(API_ENDPOINTS.VETERINARIES.BY_ID(id));
    }

    // Get Veterinary by User ID
    async getVeterinaryByUserId(userId: string): Promise<ApiResponse<VeterinaryResponse>> {
        return await apiClient.get<VeterinaryResponse>(API_ENDPOINTS.VETERINARIES.BY_USER(userId));
    }

    // Get All Veterinaries
    async getAllVeterinaries(): Promise<ApiResponse<VeterinaryResponse[]>> {
        return await apiClient.get<VeterinaryResponse[]>(API_ENDPOINTS.VETERINARIES.ALL);
    }

    // Get Active Veterinaries
    async getActiveVeterinaries(): Promise<ApiResponse<VeterinaryResponse[]>> {
        return await apiClient.get<VeterinaryResponse[]>(API_ENDPOINTS.VETERINARIES.ACTIVE);
    }

    // Get Top-Rated Veterinaries
    async getTopRatedVeterinaries(minRating?: number): Promise<ApiResponse<VeterinaryResponse[]>> {
        return await apiClient.get<VeterinaryResponse[]>(API_ENDPOINTS.VETERINARIES.TOP_RATED(minRating));
    }

    // Update Veterinary Profile
    async updateVeterinary(id: string, updates: VeterinaryUpdateRequest): Promise<ApiResponse<VeterinaryResponse>> {
        return await apiClient.put<VeterinaryResponse>(API_ENDPOINTS.VETERINARIES.UPDATE(id), updates);
    }

    // Update Veterinary Rating
    async updateRating(id: string, rating: number): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.VETERINARIES.UPDATE_RATING(id, rating));
    }

    // Increment Total Visits
    async incrementVisits(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.VETERINARIES.INCREMENT_VISITS(id));
    }

    // Deactivate Veterinary (Admin only)
    async deactivateVeterinary(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.VETERINARIES.DEACTIVATE(id));
    }

    // Delete Veterinary (Admin only)
    async deleteVeterinary(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.VETERINARIES.DELETE(id));
    }
}

export const veterinaryService = new VeterinaryService();
