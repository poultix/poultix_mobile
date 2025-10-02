import { ApiResponse, SensorReadingCreateRequest, SensorReadingResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';


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
