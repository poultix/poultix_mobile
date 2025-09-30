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