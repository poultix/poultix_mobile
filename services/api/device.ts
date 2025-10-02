import { ApiResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Response types
export interface DeviceResponse {
    id: string;
    deviceId: string;
    farmId: string;
    name: string;
    type: 'TEMPERATURE' | 'HUMIDITY' | 'PH' | 'WEIGHT' | 'CAMERA' | 'FEEDER' | 'WATERER';
    model: string;
    manufacturer: string;
    location: {
        area: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR';
    lastReading?: {
        value: number;
        unit: string;
        timestamp: string;
    };
    batteryLevel?: number;
    signalStrength?: number;
    isActive: boolean;
    installedAt: string;
    lastMaintenanceAt?: string;
    createdAt: string;
    updatedAt: string;
}

// Request types
export interface DeviceCreateRequest {
    deviceId: string;
    farmId: string;
    name: string;
    type: 'TEMPERATURE' | 'HUMIDITY' | 'PH' | 'WEIGHT' | 'CAMERA' | 'FEEDER' | 'WATERER';
    model: string;
    manufacturer: string;
    location: {
        area: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
}

export interface DeviceUpdateRequest {
    name?: string;
    location?: {
        area: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR';
    lastMaintenanceAt?: string;
}

export class DeviceService {
    // Register Device
    async registerDevice(deviceData: DeviceCreateRequest): Promise<ApiResponse<DeviceResponse>> {
        return await apiClient.post<DeviceResponse>(API_ENDPOINTS.DEVICES.CREATE, deviceData);
    }

    // Get Device by ID
    async getDeviceById(id: string): Promise<ApiResponse<DeviceResponse>> {
        return await apiClient.get<DeviceResponse>(API_ENDPOINTS.DEVICES.BY_ID(id));
    }

    // Get Device by Device ID
    async getDeviceByDeviceId(deviceId: string): Promise<ApiResponse<DeviceResponse>> {
        return await apiClient.get<DeviceResponse>(API_ENDPOINTS.DEVICES.BY_DEVICE_ID(deviceId));
    }

    // Get All Devices (Admin only)
    async getAllDevices(): Promise<ApiResponse<DeviceResponse[]>> {
        return await apiClient.get<DeviceResponse[]>(API_ENDPOINTS.DEVICES.ALL);
    }

    // Get Devices by Farm
    async getDevicesByFarm(farmId: string): Promise<ApiResponse<DeviceResponse[]>> {
        return await apiClient.get<DeviceResponse[]>(API_ENDPOINTS.DEVICES.BY_FARM(farmId));
    }

    // Get Active Devices
    async getActiveDevices(): Promise<ApiResponse<DeviceResponse[]>> {
        return await apiClient.get<DeviceResponse[]>(API_ENDPOINTS.DEVICES.ACTIVE);
    }

    // Update Device
    async updateDevice(id: string, updates: DeviceUpdateRequest): Promise<ApiResponse<DeviceResponse>> {
        return await apiClient.put<DeviceResponse>(API_ENDPOINTS.DEVICES.UPDATE(id), updates);
    }

    // Activate Device
    async activateDevice(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.DEVICES.ACTIVATE(id));
    }

    // Deactivate Device
    async deactivateDevice(id: string): Promise<ApiResponse<void>> {
        return await apiClient.patch<void>(API_ENDPOINTS.DEVICES.DEACTIVATE(id));
    }

    // Delete Device (Admin only)
    async deleteDevice(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.DEVICES.DELETE(id));
    }
}

export const deviceService = new DeviceService();
