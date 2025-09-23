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
}