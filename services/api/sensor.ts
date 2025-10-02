import { ApiResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Response types
export interface SensorReadingResponse {
    id: string;
    deviceId: string;
    farmId: string;
    sensorType: 'TEMPERATURE' | 'HUMIDITY' | 'PH' | 'WEIGHT' | 'AIR_QUALITY' | 'AMMONIA' | 'LIGHT';
    value: number;
    unit: string;
    threshold?: {
        min: number;
        max: number;
    };
    isWithinThreshold: boolean;
    alertLevel?: 'NORMAL' | 'WARNING' | 'CRITICAL';
    location?: {
        area: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    timestamp: string;
    createdAt: string;
}

// Request types
export interface SensorReadingCreateRequest {
    deviceId: string;
    sensorType: 'TEMPERATURE' | 'HUMIDITY' | 'PH' | 'WEIGHT' | 'AIR_QUALITY' | 'AMMONIA' | 'LIGHT';
    value: number;
    unit: string;
    threshold?: {
        min: number;
        max: number;
    };
    location?: {
        area: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    timestamp?: string;
}

export class SensorReadingService {
    // Create Sensor Reading (Device/Admin only)
    async createSensorReading(readingData: SensorReadingCreateRequest): Promise<ApiResponse<SensorReadingResponse>> {
        return await apiClient.post<SensorReadingResponse>(API_ENDPOINTS.SENSOR_READINGS.CREATE, readingData);
    }

    // Get Readings by Device
    async getReadingsByDevice(deviceId: string): Promise<ApiResponse<SensorReadingResponse[]>> {
        return await apiClient.get<SensorReadingResponse[]>(API_ENDPOINTS.SENSOR_READINGS.BY_DEVICE(deviceId));
    }

    // Get Readings by Farm
    async getReadingsByFarm(farmId: string): Promise<ApiResponse<SensorReadingResponse[]>> {
        return await apiClient.get<SensorReadingResponse[]>(API_ENDPOINTS.SENSOR_READINGS.BY_FARM(farmId));
    }
}

export const sensorReadingService = new SensorReadingService();
