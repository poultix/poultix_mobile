import { 
    Pharmacy, 
    ApiResponse, 
    ApiResponseList,
    PharmacyCreateRequest, 
    PharmacyUpdateRequest,
    PharmacyRegistrationRequest,
    PharmacyVerificationRequest,
    DocumentUpload,
    VerificationStatus
} from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

export class PharmacyService {
    // Register new pharmacy (for pharmacy users)
    async registerPharmacy(pharmacyData: PharmacyRegistrationRequest): Promise<ApiResponse<Pharmacy>> {
        return await apiClient.post<Pharmacy>(API_ENDPOINTS.PHARMACIES.REGISTER, pharmacyData);
    }

    // Create Pharmacy (Admin only)
    async createPharmacy(pharmacyData: PharmacyCreateRequest): Promise<ApiResponse<Pharmacy>> {
        return await apiClient.post<Pharmacy>(API_ENDPOINTS.PHARMACIES.CREATE, pharmacyData);
    }

    // Get Pharmacy by ID
    async getPharmacyById(id: string): Promise<ApiResponse<Pharmacy>> {
        return await apiClient.get<Pharmacy>(`${API_ENDPOINTS.PHARMACIES.BASE}/${id}`);
    }

    // Get All Pharmacies
    async getAllPharmacies(): Promise<ApiResponseList<Pharmacy>> {
        return await apiClient.get<Pharmacy[]>(API_ENDPOINTS.PHARMACIES.BASE);
    }

    // Update Pharmacy
    async updatePharmacy(id: string, updates: PharmacyUpdateRequest): Promise<ApiResponse<Pharmacy>> {
        return await apiClient.put<Pharmacy>(`${API_ENDPOINTS.PHARMACIES.BASE}/${id}`, updates);
    }

    // Delete Pharmacy (Admin only)
    async deletePharmacy(id: string): Promise<ApiResponse<unknown>> {
        return await apiClient.delete<unknown>(`${API_ENDPOINTS.PHARMACIES.BASE}/${id}`);
    }

    // Verify pharmacy (Admin only)
    async verifyPharmacy(verificationData: PharmacyVerificationRequest): Promise<ApiResponse<Pharmacy>> {
        return await apiClient.post<Pharmacy>(API_ENDPOINTS.PHARMACIES.VERIFY, verificationData);
    }

    // Get verification status
    async getVerificationStatus(pharmacyId: string): Promise<ApiResponse<VerificationStatus>> {
        return await apiClient.get<VerificationStatus>(`${API_ENDPOINTS.PHARMACIES.BASE}/${pharmacyId}/verification-status`);
    }

    // Get missing documents
    async getMissingDocuments(pharmacyId: string): Promise<ApiResponseList<string>> {
        return await apiClient.get<string[]>(`${API_ENDPOINTS.PHARMACIES.BASE}/${pharmacyId}/missing-documents`);
    }

    // Get required documents
    async getRequiredDocuments(): Promise<ApiResponseList<string>> {
        return await apiClient.get<string[]>(`${API_ENDPOINTS.PHARMACIES.BASE}/required-documents`);
    }

    // Get provinces
    async getProvinces(): Promise<ApiResponseList<string>> {
        return await apiClient.get<string[]>(`${API_ENDPOINTS.PHARMACIES.BASE}/provinces`);
    }

    // Get districts by province
    async getDistrictsByProvince(province: string): Promise<ApiResponseList<string>> {
        return await apiClient.get<string[]>(`${API_ENDPOINTS.PHARMACIES.BASE}/districts/${province}`);
    }

    // Get pending verifications (Admin only)
    async getPendingVerifications(): Promise<ApiResponseList<Pharmacy>> {
        return await apiClient.get<Pharmacy[]>(`${API_ENDPOINTS.PHARMACIES.BASE}/pending-verifications`);
    }

    // Upload document
    async uploadDocument(
        pharmacyId: string, 
        documentType: string, 
        file: File | FormData,
        uploadedBy?: string
    ): Promise<ApiResponse<DocumentUpload>> {
        const formData = file instanceof FormData ? file : new FormData();
        if (!(file instanceof FormData)) {
            formData.append('file', file);
        }
        
        const params = new URLSearchParams();
        if (uploadedBy) {
            params.append('uploadedBy', uploadedBy);
        }
        
        const url = `${API_ENDPOINTS.PHARMACIES.UPLOAD_DOCUMENT(pharmacyId, documentType)}${params.toString() ? '?' + params.toString() : ''}`;
        
        return await apiClient.post<DocumentUpload>(url, formData);
    }
}

export const pharmacyService = new PharmacyService();
