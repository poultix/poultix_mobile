import { Farm, ApiResponse,FarmCreateRequest,FarmUpdateRequest, FarmStatus } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Request types

export class FarmService {
    // Create Farm
    async createFarm(ownerId: string, farmData: FarmCreateRequest): Promise<ApiResponse<Farm>> {
        return await apiClient.post<Farm>(API_ENDPOINTS.FARMS.CREATE(ownerId), farmData);
    }

    // Get Farm by ID
    async getFarmById(id: string): Promise<ApiResponse<Farm>> {
        return await apiClient.get<Farm>(API_ENDPOINTS.FARMS.BY_ID(id));
    }

    // Get All Farms (Admin/Veterinary only)
    async getAllFarms(): Promise<ApiResponse<Farm[]>> {
        return await apiClient.get<Farm[]>(API_ENDPOINTS.FARMS.ALL);
    }

    // Get Farms by Owner
    async getFarmsByOwner(ownerId: string): Promise<ApiResponse<Farm[]>> {
        return await apiClient.get<Farm[]>(API_ENDPOINTS.FARMS.BY_OWNER(ownerId));
    }

    // Get Farms assigned to Veterinary
    async getFarmsByVeterinary(veterinaryId: string): Promise<ApiResponse<Farm[]>> {
        return await apiClient.get<Farm[]>(API_ENDPOINTS.FARMS.BY_VETERINARY(veterinaryId));
    }

    // Get Farms by Health Status
    async getFarmsByStatus(status:FarmStatus): Promise<ApiResponse<Farm[]>> {
        return await apiClient.get<Farm[]>(API_ENDPOINTS.FARMS.BY_STATUS(status));
    }

    // Get Active Farms
    async getActiveFarms(): Promise<ApiResponse<Farm[]>> {
        return await apiClient.get<Farm[]>(API_ENDPOINTS.FARMS.ACTIVE);
    }

    // Update Farm
    async updateFarm(id: string, updates: FarmUpdateRequest): Promise<ApiResponse<Farm>> {
        return await apiClient.put<Farm>(API_ENDPOINTS.FARMS.UPDATE(id), updates);
    }

    // Assign Veterinary to Farm
    async assignVeterinary(farmId: string, veterinaryId: string): Promise<ApiResponse<Farm>> {
        return await apiClient.patch<Farm>(API_ENDPOINTS.FARMS.ASSIGN_VETERINARY(farmId, veterinaryId));
    }

    // Update Farm Health Status
    async updateHealthStatus(farmId: string, status: FarmStatus): Promise<ApiResponse<Farm>> {
        return await apiClient.patch<Farm>(API_ENDPOINTS.FARMS.UPDATE_HEALTH_STATUS(farmId, status));
    }

    // Deactivate Farm (Admin only)
    async deactivateFarm(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.FARMS.DEACTIVATE(id));
    }

    // Delete Farm (Admin only)
    async deleteFarm(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.FARMS.DELETE(id));
    }
}

export const farmService = new FarmService();
