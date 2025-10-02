import { Location } from "./farm";

export enum UserRole {
    ADMIN = 'ADMIN',
    FARMER = 'FARMER',
    VETERINARY = 'VETERINARY'
}

export interface User {
    id: string; // UUID
    name: string;
    email: string;
    password: string;
    avatar?: string;
    location?: Location;
    role: UserRole;
    isActive: boolean;
    emailVerified: boolean;
    recoverMode: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface Farmer {
    user: User,
    experience: number;
    specialization: string[];
    totalFarms: number;
}



export interface Veterinary {
    id: string;
    user: User;
    licenseNumber: string;
    specializations: string[];
    serviceRadius: number; // km
    availability: {
        [key: string]: {
            start: string;
            end: string;
            available: boolean;
        };
    };
    rates: {
        consultation: number;
        inspection: number;
        emergency: number;
        vaccination: number;
    };
    equipment: string[];
    certifications: string[];
    rating: number;
    totalVisits: number;
    joinDate: Date;
    isActive: boolean;
}



export interface UserUpdateRequest {
    name?: string;
    email?: string;
    phone?: string;
    location?: {
        address: string;
        latitude?: number;
        longitude?: number;
    };
}



// Response types
export interface VeterinaryResponse {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        location?: {
            address: string;
            latitude?: number;
            longitude?: number;
        };
    };
    specialization: string[];
    experience: number;
    rating: number;
    totalVisits: number;
    isAvailable: boolean;
    licenseNumber: string;
    education: string;
    certifications: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Request types
export interface VeterinaryCreateRequest {
    specialization: string[];
    experience: number;
    licenseNumber: string;
    education: string;
    certifications?: string[];
}

export interface VeterinaryUpdateRequest {
    specialization?: string[];
    experience?: number;
    licenseNumber?: string;
    education?: string;
    certifications?: string[];
    isAvailable?: boolean;
}