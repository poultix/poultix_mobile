import { Vaccine } from './vaccine';

// Pharmacy enums - matches backend
export enum PharmacyType {
    RETAIL = 'RETAIL',
    WHOLESALE = 'WHOLESALE',
    VETERINARY_CLINIC = 'VETERINARY_CLINIC'
}

export enum OwnershipType {
    PRIVATE = 'PRIVATE',
    GOVERNMENT = 'GOVERNMENT',
    NGO = 'NGO',
    COOPERATIVE = 'COOPERATIVE'
}

export enum OwnershipStatus {
    OWNED = 'OWNED',
    RENTED = 'RENTED'
}

export enum VerificationStatus {
    UNVERIFIED = 'UNVERIFIED',
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED'
}

// Coordinates interface - matches backend
export interface Coordinates {
    latitude: number;
    longitude: number;
}

// Pharmacy schedule interface - matches backend
export interface PharmacySchedule {
    day: string;
    startTime: string; // date-time format
    endTime: string; // date-time format
}

// Pharmacist responsible interface - matches backend
export interface PharmacistResponsible {
    id: string; // UUID
    fullName: string;
    nationalId: string;
    phoneNumber: string;
    email: string;
    qualification: string;
    registrationNumber: string;
    experienceYears: number;
    photoIdPath?: string;
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}

// Main Pharmacy interface - matches backend PharmacyDTO exactly
export interface Pharmacy {
    id: string; // UUID
    name: string;
    address: string;
    schedule: PharmacySchedule;
    phone: string;
    isOpen: boolean;
    location: Coordinates;
    rating: number;
    vaccines: Vaccine[];
    licenseNumber: string;
    registrationDate: string; // ISO date
    tinNumber: string;
    pharmacyType: PharmacyType;
    ownershipType: OwnershipType;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    pharmacistResponsible: PharmacistResponsible;
    ownershipStatus: OwnershipStatus;
    premisesSize?: string;
    storageFacilities?: string;
    businessLicensePath?: string;
    pharmacistLicensePath?: string;
    premisesInspectionPath?: string;
    taxClearancePath?: string;
    insuranceCertificatePath?: string;
    complianceCertificatePath?: string;
    verificationStatus: VerificationStatus;
    missingDocuments: string[];
    adminComments?: string;
    lastReviewedBy?: string;
    distance?: number; // Distance in km for search results
    lastReviewedAt?: string; // ISO date-time
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}

// Pharmacist responsible request - matches backend
export interface PharmacistResponsibleRequest {
    fullName: string;
    nationalId: string;
    phoneNumber: string;
    email: string;
    qualification: string;
    registrationNumber: string;
    experienceYears: number;
}

// Pharmacy registration request - matches backend
export interface PharmacyRegistrationRequest {
    name: string;
    address: string;
    phone: string;
    licenseNumber: string;
    registrationDate: string; // ISO date
    tinNumber: string;
    pharmacyType: PharmacyType;
    ownershipType: OwnershipType;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    latitude: number;
    longitude: number;
    pharmacistResponsible: PharmacistResponsibleRequest;
    ownershipStatus: OwnershipStatus;
    premisesSize?: string;
    storageFacilities?: string;
}

// Pharmacy create request - matches backend
export interface PharmacyCreateRequest {
    name: string;
    address: string;
    phone: string;
    location?: Coordinates;
    services?: string[];
    vaccines?: Vaccine[];
    schedule?: PharmacySchedule;
}

// Pharmacy update request - matches backend
export interface PharmacyUpdateRequest {
    name?: string;
    address?: string;
    phone?: string;
    location?: Coordinates;
    services?: string[];
    vaccines?: Vaccine[];
    schedule?: PharmacySchedule;
}

// Pharmacy verification request - matches backend
export interface PharmacyVerificationRequest {
    pharmacyId: string; // UUID
    verificationStatus: VerificationStatus;
    adminComments?: string;
    missingDocuments?: string[];
    reviewerName: string;
}

// Document upload interface - matches backend
export interface DocumentUpload {
    pharmacyId: string; // UUID
    documentType: string;
    fileName: string;
    filePath: string;
    fileSize: string;
    contentType: string;
    uploadedAt: string; // ISO date-time
    uploadedBy: string;
    isRequired: boolean;
    status: string;
}