import { ApiResponse, Vaccine, VaccineCreateRequest, VaccineUpdateRequest } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

export class VaccineService {
    // Create Vaccine
    async createVaccine(vaccineData: VaccineCreateRequest): Promise<ApiResponse<Vaccine>> {
        return await apiClient.post<Vaccine>(API_ENDPOINTS.VACCINES.CREATE, vaccineData);
    }

    // Get Vaccine by ID
    async getVaccineById(id: string): Promise<ApiResponse<Vaccine>> {
        return await apiClient.get<Vaccine>(API_ENDPOINTS.VACCINES.BY_ID(id));
    }

    // Get All Vaccines
    async getAllVaccines(): Promise<ApiResponse<Vaccine[]>> {
        return await apiClient.get<Vaccine[]>(API_ENDPOINTS.VACCINES.ALL);
    }

    // Get Vaccines by Type
    async getVaccinesByType(type: string): Promise<ApiResponse<Vaccine[]>> {
        return await apiClient.get<Vaccine[]>(API_ENDPOINTS.VACCINES.BY_TYPE(type));
    }

    // Get Vaccines by Target Disease
    async getVaccinesByTargetDisease(targetDisease: string): Promise<ApiResponse<Vaccine[]>> {
        return await apiClient.get<Vaccine[]>(API_ENDPOINTS.VACCINES.BY_TARGET_DISEASE(targetDisease));
    }

    // Get Vaccine by Name
    async getVaccineByName(name: string): Promise<ApiResponse<Vaccine>> {
        return await apiClient.get<Vaccine>(API_ENDPOINTS.VACCINES.BY_NAME(name));
    }

    // Get Vaccines by Prescription Required
    async getVaccinesByPrescriptionRequired(prescriptionRequired: boolean): Promise<ApiResponse<Vaccine[]>> {
        return await apiClient.get<Vaccine[]>(API_ENDPOINTS.VACCINES.BY_PRESCRIPTION_REQUIRED(prescriptionRequired));
    }

    // Search Vaccines
    async searchVaccines(keyword: string): Promise<ApiResponse<Vaccine[]>> {
        return await apiClient.get<Vaccine[]>(API_ENDPOINTS.VACCINES.SEARCH(keyword));
    }

    // Check if Vaccine Exists by Name
    async checkVaccineExists(name: string): Promise<ApiResponse<boolean>> {
        return await apiClient.get<boolean>(API_ENDPOINTS.VACCINES.EXISTS_BY_NAME(name));
    }

    // Update Vaccine
    async updateVaccine(id: string, updates: VaccineUpdateRequest): Promise<ApiResponse<Vaccine>> {
        return await apiClient.put<Vaccine>(API_ENDPOINTS.VACCINES.UPDATE(id), updates);
    }

    // Delete Vaccine
    async deleteVaccine(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.VACCINES.DELETE(id));
    }
}

export const vaccineService = new VaccineService();
