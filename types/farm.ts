import { User, Location } from './user';

// Health status enum - matches backend
export enum HealthStatus {
    EXCELLENT = 'EXCELLENT',
    GOOD = 'GOOD',
    FAIR = 'FAIR',
    POOR = 'POOR',
    CRITICAL = 'CRITICAL'
}

// Livestock interface - matches backend
export interface Livestock {
    total: number;
    healthy: number;
    sick: number;
    atRisk: number;
    breeds: string[];
}

// Facilities interface - matches backend
export interface Facilities {
    coops: number;
    feedStorage: boolean;
    waterSystem: string;
    electricityAccess: boolean;
}

// Farm interface - matches backend FarmDTO exactly
export interface Farm {
    id: string; // UUID format
    name: string;
    owner: User;
    location: Location;
    size: number; // in hectares
    establishedDate: string; // ISO date
    livestock: Livestock;
    facilities: Facilities;
    assignedVeterinary?: User;
    status: FarmStatus;
    healthStatus: HealthStatus;
    lastInspection?: string; // ISO date-time
    certifications: string[];
    isActive: boolean;
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}

// Request types for farms - matches backend
export interface FarmCreateRequest {
    name: string;
    location?: Location;
    livestock?: Livestock;
    facilities?: Facilities;
}

export interface FarmUpdateRequest {
    name?: string;
    location?: Location;
    livestock?: Livestock;
    facilities?: Facilities;
    isActive?: boolean;
}

// For backward compatibility
export interface Coords extends Location {}
export interface FarmLiveStock extends Livestock {}
export interface FarmFacility extends Facilities {}
export enum FarmStatus {
    EXCELLENT = 'EXCELLENT',
    GOOD = 'GOOD',
    FAIR = 'FAIR',
    POOR = 'POOR',
    CRITICAL = 'CRITICAL'
}
