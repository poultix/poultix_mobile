import { ApiResponse, VeterinaryCreateRequest, VeterinaryResponse, VeterinaryUpdateRequest } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';


export class VeterinaryService {
    // Create Veterinary Profile
    async createVeterinary(veterinaryData: VeterinaryCreateRequest): Promise<ApiResponse<VeterinaryResponse>> {
        return await apiClient.post<VeterinaryResponse>(API_ENDPOINTS.VETERINARIES.CREATE, veterinaryData);
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
