import { User } from "./user";

export interface Location {
    latitude: number;
    longitude: number;
}

export interface LiveStock {
    total: number;
    healthy: number;
    sick: number;
    atRisk: number;
    breeds: string[];
}


export interface Facility {
    coops: number;
    feedStorage: boolean;
    waterSystem: string;
    electricityAccess: boolean;
}

export enum FarmStatus {
    EXCELLENT = 'EXCELLENT',
    GOOD = 'GOOD',
    FAIR = 'FAIR',
    POOR = 'POOR',
    CRITICAL = 'CRITICAL'
}


export interface Farm {
    id: string;
    name: string;
    owner: User
    location: Location;
    size: number;
    establishedDate: string;
    livestock: LiveStock
    facilities: Facility
    assignedVeterinary?: User;
    healthStatus: FarmStatus;
    lastInspection?: string;
    certifications: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FarmCreateRequest {
    name: string;
    location: {
        address: string;
        latitude?: number;
        longitude?: number;
    };
    livestock: {
        total: number;
        healthy: number;
        sick: number;
        atRisk: number;
    };
    facilities: {
        coops: number;
        feeders: number;
        waterers: number;
    };
    healthStatus: 'HEALTHY' | 'AT_RISK' | 'SICK' | 'QUARANTINE';
}

export interface FarmUpdateRequest {
    name?: string;
    location?: {
        address: string;
        latitude?: number;
        longitude?: number;
    };
    livestock?: {
        total: number;
        healthy: number;
        sick: number;
        atRisk: number;
    };
    facilities?: {
        coops: number;
        feeders: number;
        waterers: number;
    };
    healthStatus?: 'HEALTHY' | 'AT_RISK' | 'SICK' | 'QUARANTINE';
}
