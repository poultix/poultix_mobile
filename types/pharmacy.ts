import { Coords } from "./farm";
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
    location: Coords
    rating: number;
    vaccines: Vaccine[];
    createdAt: string;
    updatedAt: string;
}


// Request types
export interface PharmacyCreateRequest {
    name: string;
    address: string;
    phone: string
    location: Coords
    services: string[];
    vaccines: Vaccine[];
    schedule: PharmacySchedule
}

export interface PharmacyUpdateRequest {
    name: string;
    address: string;
    phone: string
    location: Coords
    services: string[];
    vaccines: Vaccine[];
    schedule: PharmacySchedule
}