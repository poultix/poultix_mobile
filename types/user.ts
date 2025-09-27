export enum UserRole {
    ADMIN = 'ADMIN',
    FARMER = 'FARMER',
    VETERINARY = 'VETERINARY'
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone: string;
    avatar?: string;
    location: string;
    createdAt: Date;
    isActive: boolean;
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