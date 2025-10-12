import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    Pharmacy, 
    PharmacyRegistrationRequest,
    DocumentUpload,
    VerificationStatus,
    PharmacistResponsibleRequest
} from '@/types';
import { pharmacyService } from '@/services/api/pharmacy';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';

const FORM_PROGRESS_KEY = 'pharmacy_registration_progress';

export const usePharmacyVerification = () => {
    const { currentUser } = useAuth();
    const { showError } = useError();

    // State
    const [currentPharmacy, setCurrentPharmacy] = useState<Pharmacy | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
    const [missingDocuments, setMissingDocuments] = useState<string[]>([]);
    const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);
    const [uploadedDocuments, setUploadedDocuments] = useState<DocumentUpload[]>([]);
    const [provinces, setProvinces] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    
    // Loading states
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Load initial data
    useEffect(() => {
        loadLocationData();
        loadRequiredDocuments();
    }, []);

    // Register pharmacy
    const registerPharmacy = useCallback(async (data: PharmacyRegistrationRequest) => {
        try {
            setSubmitting(true);
            setError('');
            
            const response = await pharmacyService.registerPharmacy(data);
            
            if (response.success) {
                setCurrentPharmacy(response.data);
                await clearFormProgress();
                // Load verification status and missing documents
                await loadPharmacyData(response.data.id);
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to register pharmacy';
            setError(errorMessage);
            showError(errorMessage);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [showError]);

    // Upload document
    const uploadDocument = useCallback(async (documentType: string, file: File) => {
        if (!currentPharmacy) {
            throw new Error('No pharmacy selected');
        }

        try {
            setUploading(true);
            setError('');
            
            const response = await pharmacyService.uploadDocument(
                currentPharmacy.id, 
                documentType, 
                file,
                currentUser?.id
            );
            
            if (response.success) {
                // Update uploaded documents list
                setUploadedDocuments(prev => [...prev, response.data]);
                // Refresh missing documents
                await loadMissingDocuments(currentPharmacy.id);
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to upload document';
            setError(errorMessage);
            showError(errorMessage);
            throw err;
        } finally {
            setUploading(false);
        }
    }, [currentPharmacy, currentUser, showError]);

    // Submit for verification
    const submitForVerification = useCallback(async () => {
        if (!currentPharmacy) {
            throw new Error('No pharmacy selected');
        }

        try {
            setSubmitting(true);
            setError('');
            
            // Check if all required documents are uploaded
            if (missingDocuments.length > 0) {
                throw new Error('Please upload all required documents before submitting');
            }
            
            // Update verification status to PENDING
            const verificationRequest = {
                pharmacyId: currentPharmacy.id,
                verificationStatus: VerificationStatus.PENDING,
                reviewerName: 'System',
            };
            
            const response = await pharmacyService.verifyPharmacy(verificationRequest);
            
            if (response.success) {
                setCurrentPharmacy(response.data);
                setVerificationStatus(VerificationStatus.PENDING);
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to submit for verification';
            setError(errorMessage);
            showError(errorMessage);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [currentPharmacy, missingDocuments, showError]);

    // Load pharmacy data
    const loadPharmacyData = useCallback(async (pharmacyId: string) => {
        try {
            setLoading(true);
            setError('');
            
            // Load pharmacy details
            const pharmacyResponse = await pharmacyService.getPharmacyById(pharmacyId);
            if (pharmacyResponse.success) {
                setCurrentPharmacy(pharmacyResponse.data);
            }
            
            // Load verification status
            const statusResponse = await pharmacyService.getVerificationStatus(pharmacyId);
            if (statusResponse.success) {
                setVerificationStatus(statusResponse.data);
            }
            
            // Load missing documents
            await loadMissingDocuments(pharmacyId);
            
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load pharmacy data';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [showError]);

    // Load missing documents
    const loadMissingDocuments = useCallback(async (pharmacyId: string) => {
        try {
            const response = await pharmacyService.getMissingDocuments(pharmacyId);
            if (response.success) {
                setMissingDocuments(response.data);
            }
        } catch (err: any) {
            console.error('Failed to load missing documents:', err);
        }
    }, []);

    // Load required documents
    const loadRequiredDocuments = useCallback(async () => {
        try {
            const response = await pharmacyService.getRequiredDocuments();
            if (response.success) {
                setRequiredDocuments(response.data);
            }
        } catch (err: any) {
            console.error('Failed to load required documents:', err);
        }
    }, []);

    // Load location data
    const loadLocationData = useCallback(async () => {
        try {
            const response = await pharmacyService.getProvinces();
            if (response.success) {
                setProvinces(response.data);
            }
        } catch (err: any) {
            console.error('Failed to load provinces:', err);
        }
    }, []);

    // Load districts by province
    const loadDistrictsByProvince = useCallback(async (province: string) => {
        try {
            const response = await pharmacyService.getDistrictsByProvince(province);
            if (response.success) {
                setDistricts(response.data);
            }
        } catch (err: any) {
            console.error('Failed to load districts:', err);
        }
    }, []);

    // Update pharmacist info (placeholder - extend as needed)
    const updatePharmacistInfo = useCallback(async (data: PharmacistResponsibleRequest) => {
        // This would be part of updating the pharmacy registration
        // Implementation depends on your backend API structure
        console.log('Update pharmacist info:', data);
    }, []);

    // Form progress management
    const saveFormProgress = useCallback(async (formData: Partial<PharmacyRegistrationRequest>) => {
        try {
            await AsyncStorage.setItem(FORM_PROGRESS_KEY, JSON.stringify(formData));
        } catch (err) {
            console.error('Failed to save form progress:', err);
        }
    }, []);

    const getFormProgress = useCallback((): Partial<PharmacyRegistrationRequest> | null => {
        try {
            // Use synchronous method for immediate return
            return null; // For now, return null - in real app you'd implement sync storage
        } catch (err) {
            console.error('Failed to get form progress:', err);
            return null;
        }
    }, []);

    const clearFormProgress = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(FORM_PROGRESS_KEY);
        } catch (err) {
            console.error('Failed to clear form progress:', err);
        }
    }, []);

    return {
        // State
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
        
        // Actions
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
};
