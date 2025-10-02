export interface Pharmacy {
    id: string;
    name: string;
    address: string;
    distance: number;
    phone: string;
    isOpen: boolean;
    location: {
        latitude: number;
        longitude: number;
    };
    rating?: number;
    services?: string[];
    vaccines?: Vaccine[];
}

export interface Vaccine {
    name: string,
    description: string,
    price: number,
    createdAt: Date,
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