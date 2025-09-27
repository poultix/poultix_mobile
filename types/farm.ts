import { User } from "./user";

export interface Location {
    address: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    district: string;
    sector: string;
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
    establishedDate: Date;
    livestock: LiveStock
    facilities: Facility
    assignedVeterinary?: User;
    healthStatus: FarmStatus;
    lastInspection?: Date;
    certifications: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}