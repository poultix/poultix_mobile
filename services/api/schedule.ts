import { Schedule, ApiResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Request types
export interface ScheduleCreateRequest {
    farmId: string;
    veterinaryId: string;
    farmerId: string;
    type: 'INSPECTION' | 'VACCINATION' | 'TREATMENT' | 'CONSULTATION' | 'EMERGENCY';
    title: string;
    description?: string;
    scheduledDate: string; // ISO date string
    startTime: string;
    endTime: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    notes?: string;
}

export interface ScheduleUpdateRequest {
    farmId?: string;
    veterinaryId?: string;
    type?: 'INSPECTION' | 'VACCINATION' | 'TREATMENT' | 'CONSULTATION' | 'EMERGENCY';
    title?: string;
    description?: string;
    scheduledDate?: string; // ISO date string
    startTime?: string;
    endTime?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    notes?: string;
}

export class ScheduleService {
    // Create Schedule
    async createSchedule(createdBy: string, scheduleData: ScheduleCreateRequest): Promise<ApiResponse<Schedule>> {
        return await apiClient.post<Schedule>(API_ENDPOINTS.SCHEDULES.CREATE(createdBy), scheduleData);
    }

    // Get Schedule by ID
    async getScheduleById(id: string): Promise<ApiResponse<Schedule>> {
        return await apiClient.get<Schedule>(API_ENDPOINTS.SCHEDULES.BY_ID(id));
    }

    // Get All Schedules (Admin only)
    async getAllSchedules(): Promise<ApiResponse<Schedule[]>> {
        return await apiClient.get<Schedule[]>(API_ENDPOINTS.SCHEDULES.ALL);
    }

    // Get Schedules by Farmer
    async getSchedulesByFarmer(farmerId: string): Promise<ApiResponse<Schedule[]>> {
        return await apiClient.get<Schedule[]>(API_ENDPOINTS.SCHEDULES.BY_FARMER(farmerId));
    }

    // Get Schedules by Veterinary
    async getSchedulesByVeterinary(veterinaryId: string): Promise<ApiResponse<Schedule[]>> {
        return await apiClient.get<Schedule[]>(API_ENDPOINTS.SCHEDULES.BY_VETERINARY(veterinaryId));
    }

    // Get Schedules by Status
    async getSchedulesByStatus(status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'): Promise<ApiResponse<Schedule[]>> {
        return await apiClient.get<Schedule[]>(API_ENDPOINTS.SCHEDULES.BY_STATUS(status));
    }

    // Get Schedules by Date
    async getSchedulesByDate(date: string): Promise<ApiResponse<Schedule[]>> {
        return await apiClient.get<Schedule[]>(API_ENDPOINTS.SCHEDULES.BY_DATE(date));
    }

    // Get Schedules by Date Range
    async getSchedulesByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Schedule[]>> {
        return await apiClient.get<Schedule[]>(API_ENDPOINTS.SCHEDULES.BY_DATE_RANGE(startDate, endDate));
    }

    // Update Schedule
    async updateSchedule(id: string, updates: ScheduleUpdateRequest): Promise<ApiResponse<Schedule>> {
        return await apiClient.put<Schedule>(API_ENDPOINTS.SCHEDULES.UPDATE(id), updates);
    }

    // Update Schedule Status
    async updateScheduleStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'): Promise<ApiResponse<Schedule>> {
        return await apiClient.patch<Schedule>(API_ENDPOINTS.SCHEDULES.UPDATE_STATUS(id, status));
    }

    // Complete Schedule
    async completeSchedule(id: string): Promise<ApiResponse<Schedule>> {
        return await apiClient.patch<Schedule>(API_ENDPOINTS.SCHEDULES.COMPLETE(id));
    }

    // Cancel Schedule
    async cancelSchedule(id: string): Promise<ApiResponse<Schedule>> {
        return await apiClient.patch<Schedule>(API_ENDPOINTS.SCHEDULES.CANCEL(id));
    }

    // Delete Schedule (Admin only)
    async deleteSchedule(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.SCHEDULES.DELETE(id));
    }
}

export const scheduleService = new ScheduleService();
