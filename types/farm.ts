import { User } from "./user";

export interface Coords {
    latitude: number;
    longitude: number;
}




export interface FarmFacility {
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
    location: Coords;
    size: number;
    livestock: FarmLiveStock
    facilities: FarmFacility
    assignedVeterinary?: User;
    healthStatus: FarmStatus;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FarmLiveStock {
    total: number;
    healthy: number;
    sick: number;
    atRisk: number;
}

export interface FarmCreateRequest {
    name: string;
    location: Coords;
    livestock: FarmLiveStock
    facilities: FarmFacility;
}

export interface FarmUpdateRequest {
    name: string;
    location: Coords;
    livestock: FarmLiveStock
    facilities: FarmFacility;
    isActive: boolean;
}
