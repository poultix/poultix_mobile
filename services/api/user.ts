import { User, ApiResponse, UserRegistrationRequest, UserUpdateRequest } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';


export class UserService {
    // Create/Register User
    async register(userData: UserRegistrationRequest): Promise<ApiResponse<User>> {
        return await apiClient.post<User>(API_ENDPOINTS.USERS.REGISTER, userData);
    }

    // Get User by ID
    async getUserById(id: string): Promise<ApiResponse<User>> {
        return await apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
    }

    // Get User by Email (Admin only)
    async getUserByEmail(email: string): Promise<ApiResponse<User>> {
        return await apiClient.get<User>(API_ENDPOINTS.USERS.BY_EMAIL(email));
    }

    // Get All Users (Admin only)
    async getAllUsers(): Promise<ApiResponse<User[]>> {
        return await apiClient.get<User[]>(API_ENDPOINTS.USERS.ALL);
    }

    // Get Users by Role (Admin only)
    async getUsersByRole(role: 'FARMER' | 'VETERINARY' | 'ADMIN'): Promise<ApiResponse<User[]>> {
        return await apiClient.get<User[]>(API_ENDPOINTS.USERS.BY_ROLE(role));
    }

    // Get Active Users (Admin only)
    async getActiveUsers(): Promise<ApiResponse<User[]>> {
        return await apiClient.get<User[]>(API_ENDPOINTS.USERS.ACTIVE);
    }

    // Update User Profile
    async updateUser(id: string, updates: UserUpdateRequest): Promise<ApiResponse<User>> {
        return await apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), updates);
    }

    // Activate User Account (Admin only)
    async activateUser(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.USERS.ACTIVATE(id));
    }

    // Deactivate User Account (Admin only)
    async deactivateUser(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.USERS.DEACTIVATE(id));
    }

    // Delete User Account (Admin only)
    async deleteUser(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
    }
}

export const userService = new UserService();
