import { User, ApiResponse, UpdateUserStatusRequest, ChartData, SystemMetric, AdminStats, Alert } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';
export class AdminService {
    // User Management
    async getAllUsers(): Promise<ApiResponse<User[]>> {
        return await apiClient.get<User[]>(API_ENDPOINTS.USERS.ALL);
    }

    async getUserById(id: string): Promise<ApiResponse<User>> {
        return await apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
    }

    async updateUser(id: string, updates: UpdateUserStatusRequest): Promise<ApiResponse<User>> {
        return await apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), updates);
    }

    async activateUser(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.USERS.ACTIVATE(id));
    }

    async deactivateUser(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.USERS.DEACTIVATE(id));
    }

    async deleteUser(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
    }

    // Message Management
    async deleteMessage(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.MESSAGES.DELETE(id));
    }

    // Analytics & Metrics
    async getAnalytics(): Promise<ApiResponse<ChartData[]>> {
        return await apiClient.get<ChartData[]>(API_ENDPOINTS.ADMIN.ANALYTICS);
    }

    async getSystemMetrics(): Promise<ApiResponse<SystemMetric[]>> {
        return await apiClient.get<SystemMetric[]>(API_ENDPOINTS.ADMIN.SYSTEM_METRICS);
    }

    async getDashboardStats(): Promise<ApiResponse<AdminStats>> {
        return await apiClient.get<AdminStats>(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
    }

    async getRecentAlerts(): Promise<ApiResponse<Alert[]>> {
        return await apiClient.get<Alert[]>(API_ENDPOINTS.ADMIN.RECENT_ALERTS);
    }

    // Farm Management (Admin oversight)
    async approveFarm(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(`/admin/farms/${id}/approve`);
    }

    async suspendFarm(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(`/admin/farms/${id}/suspend`);
    }

    // Schedule Management (Admin oversight)
    async approveSchedule(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(`/admin/schedules/${id}/approve`);
    }

    async cancelSchedule(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(`/admin/schedules/${id}/cancel`);
    }

    // System Management
    async performBackup(): Promise<ApiResponse<{ backupId: string; timestamp: string }>> {
        return await apiClient.post<{ backupId: string; timestamp: string }>('/admin/system/backup');
    }

    async getSystemHealth(): Promise<ApiResponse<{ status: string; components: any[] }>> {
        return await apiClient.get<{ status: string; components: any[] }>('/admin/system/health');
    }
}

export const adminService = new AdminService();