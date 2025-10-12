import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
    Pharmacy, 
    PharmacyRegistrationRequest,
    PharmacyVerificationRequest,
    DocumentUpload,
    VerificationStatus,
    PharmacistResponsibleRequest
} from '@/types';
import { usePharmacyVerification } from '@/hooks/usePharmacyVerification';

interface PharmacyVerificationContextType {
    // Current pharmacy data
    currentPharmacy: Pharmacy | null;
    verificationStatus: VerificationStatus | null;
    missingDocuments: string[];
    requiredDocuments: string[];
    uploadedDocuments: DocumentUpload[];
    
    // Location data
    provinces: string[];
    districts: string[];
    
    // Loading states
    loading: boolean;
    uploading: boolean;
    submitting: boolean;
    
    // Error state
    error: string;
    
    // Actions
    registerPharmacy: (data: PharmacyRegistrationRequest) => Promise<void>;
    uploadDocument: (documentType: string, file: File) => Promise<void>;
    submitForVerification: () => Promise<void>;
    loadPharmacyData: (pharmacyId: string) => Promise<void>;
    loadLocationData: () => Promise<void>;
    loadDistrictsByProvince: (province: string) => Promise<void>;
    updatePharmacistInfo: (data: PharmacistResponsibleRequest) => Promise<void>;
    
    // Form state management
    saveFormProgress: (formData: Partial<PharmacyRegistrationRequest>) => void;
    getFormProgress: () => Partial<PharmacyRegistrationRequest> | null;
    clearFormProgress: () => void;
}

const PharmacyVerificationContext = createContext<PharmacyVerificationContextType | undefined>(undefined);

export const PharmacyVerificationProvider = ({ children }: { children: React.ReactNode }) => {
    const {
        currentPharmacy,
        verificationStatus,
        missingDocuments,
        requiredDocuments,
        uploadedDocuments,
        provinces,
        districts,
        loading,
        uploading,
        submitting,
        error,
        registerPharmacy,
        uploadDocument,
        submitForVerification,
        loadPharmacyData,
        loadLocationData,
        loadDistrictsByProvince,
        updatePharmacistInfo,
        saveFormProgress,
        getFormProgress,
        clearFormProgress,
    } = usePharmacyVerification();

    const contextValue: PharmacyVerificationContextType = {
        currentPharmacy,
        verificationStatus,
        missingDocuments,
        requiredDocuments,
        uploadedDocuments,
        provinces,
        districts,
        loading,
        uploading,
        submitting,
        error,
        registerPharmacy,
        uploadDocument,
        submitForVerification,
        loadPharmacyData,
        loadLocationData,
        loadDistrictsByProvince,
        updatePharmacistInfo,
        saveFormProgress,
        getFormProgress,
        clearFormProgress,
    };

    return (
        <PharmacyVerificationContext.Provider value={contextValue}>
            {children}
        </PharmacyVerificationContext.Provider>
    );
};

export const usePharmacyVerificationContext = () => {
    const context = useContext(PharmacyVerificationContext);
    if (!context) {
        throw new Error('usePharmacyVerificationContext must be used within a PharmacyVerificationProvider');
    }
    return context;
};
