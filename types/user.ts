// Location interface - matches backend LocationDTO
export interface Location {
    latitude: number;
    longitude: number;
}

// User roles enum - matches backend
export enum UserRole {
    ADMIN = 'ADMIN',
    FARMER = 'FARMER',
    VETERINARY = 'VETERINARY',
    PHARMACY = 'PHARMACY'
}

// User interface - matches backend UserDTO exactly
export interface User {
    id: string; 
    name: string;
    email: string;
    password: string;
    avatar?: string;
    phone?: string;
    location: Location;
    role: UserRole;
    isActive: boolean;
    emailVerified: boolean;
    isVerified: boolean; // For role-specific verification (pharmacy, veterinary, etc.)
    recoverMode: boolean;
    privateKey?: string;
    publicKey?: string;
    
    // Extended properties for display
    specialization?: string;
    licenseNumber?: string;
    experience?: number;
    farmsCount?: number;
    schedulesCount?: number;
    joinDate?: string;
    lastActive?: string;
    status?: string;
    
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}

export interface Farmer {
    user: User,
    experience: number;
    specialization: string[];
    totalFarms: number;
}



// Veterinary rates - matches backend
export interface VeterinaryRates {
    consultation: number;
    inspection: number;
    emergency: number;
    vaccination: number;
}

// Veterinary interface - matches backend VeterinaryDTO exactly
export interface Veterinary {
    id: string; // UUID
    user: User;
    serviceRadius: number;
    rates: VeterinaryRates;
    rating: number;
    totalVisits: number;
    joinDate: string; // ISO date-time
    isActive: boolean;
    farmManaged: string[]; // Array of farm IDs
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}



// User registration request - matches backend
export interface UserRegistrationRequest {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    location: Location;
    role: UserRole;
}

// User update request - matches backend
export interface UserUpdateRequest {
    name?: string;
    avatar?: string;
    phone?: string;
    location?: Location;
}

// Auth related types
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresAt: string; 
    user: User;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface PasswordResetRequest {
    resetCode: string;
    newPassword: string;
}

export interface EmailVerificationRequest {
    token: string;
}

// Veterinary request types - matches backend
export interface VeterinaryCreateRequest {
    serviceRadius: number;
}

export interface VeterinaryUpdateRequest {
    serviceRadius?: number;
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
        location?: Location;
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
