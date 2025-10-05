import { Location } from "./farm";
import { Vaccine } from "./vaccine";

export interface PharmacySchedule {
    day: string
    startTime: string
    endTime: string
}
export interface Pharmacy {
    id: string;
    name: string;
    address: string;
    distance: number;
    phone: string;
    schedule: PharmacySchedule[]
    isOpen: boolean;
    location: Location
    rating: number;
    vaccines: Vaccine[];
    createdAt: string;
    updatedAt: string;
}


// Request types
export interface PharmacyCreateRequest {
    name: string;
    address: string;
    location: {
        latitude: number;
        longitude: number;
    };
    phone: string;
    email?: string;
    website?: string;
    operatingHours: {
        [key: string]: {
            open: string;
            close: string;
            isOpen: boolean;
        };
    };
    services: string[];
    medications: {
        name: string;
        category: string;
        inStock: boolean;
        price?: number;
    }[];
    licenseNumber: string;
    rating?: number;
    description?: string;
}

export interface PharmacyUpdateRequest {
    name?: string;
    address?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    phone?: string;
    email?: string;
    website?: string;
    operatingHours?: {
        [key: string]: {
            open: string;
            close: string;
            isOpen: boolean;
        };
    };
    services?: string[];
    medications?: {
        name: string;
        category: string;
        inStock: boolean;
        price?: number;
    }[];
    licenseNumber?: string;
    rating?: number;
    description?: string;
}