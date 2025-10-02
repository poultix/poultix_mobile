import { ApiResponse, FileUploadResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Response type (matching backend DTO)

export class UploadService {
    // Upload profile image
    async uploadProfileImage(file: File | Blob, fileName?: string): Promise<ApiResponse<FileUploadResponse>> {
        const formData = new FormData();
        formData.append('file', file, fileName);

        return await apiClient.uploadFile<FileUploadResponse>(
            API_ENDPOINTS.UPLOAD.PROFILE_IMAGE,
            formData,
        );
    }

    // Upload general attachment
    async uploadAttachment(file: File | Blob, fileName?: string): Promise<ApiResponse<FileUploadResponse>> {
        const formData = new FormData();
        formData.append('file', file, fileName);

        return await apiClient.post<FileUploadResponse>(
            API_ENDPOINTS.UPLOAD.ATTACHMENT,
            formData,
        );
    }

    // Upload document to specific folder
    async uploadDocument(
        file: File | Blob,
        folder: string,
        fileName?: string
    ): Promise<ApiResponse<FileUploadResponse>> {
        const formData = new FormData();
        formData.append('file', file, fileName);
        formData.append('folder', folder);

        return await apiClient.post<FileUploadResponse>(
            API_ENDPOINTS.UPLOAD.DOCUMENT,
            formData,
        );
    }

    // Delete uploaded file
    async deleteFile(folder: string, fileName: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.UPLOAD.DELETE(folder, fileName));
    }

    // Upload multiple files
    async uploadMultiple(
        files: (File | Blob)[],
        uploadType: 'profile-image' | 'attachment' | 'document',
        folder?: string
    ): Promise<ApiResponse<FileUploadResponse[]>> {
        const uploadPromises = files.map(async (file, index) => {
            const fileName = `file_${index}_${Date.now()}`;

            switch (uploadType) {
                case 'profile-image':
                    return this.uploadProfileImage(file, fileName);
                case 'attachment':
                    return this.uploadAttachment(file, fileName);
                case 'document':
                    if (!folder) throw new Error('Folder required for document upload');
                    return this.uploadDocument(file, folder, fileName);
                default:
                    throw new Error('Invalid upload type');
            }
        });

        try {
            const results = await Promise.all(uploadPromises);
            const uploadedFiles = results
                .filter(result => result.success && result.data)
                .map(result => result.data!);

            return {
                success: true,
                message: `Successfully uploaded ${uploadedFiles.length} files`,
                data: uploadedFiles,
                status: 200
            };
        } catch (error) {
            throw error;
        }
    }

    // Validate file before upload
    validateFile(
        file: File | Blob,
        maxSizeInMB: number = 5,
        allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    ): { isValid: boolean; error?: string } {
        // Check file size
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            return {
                isValid: false,
                error: `File size must be less than ${maxSizeInMB}MB`
            };
        }

        // Check file type (if it's a File object with type property)
        if ('type' in file && file.type && !allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
            };
        }

        return { isValid: true };
    }

    // Get file URL for display
    getFileUrl(fileName: string): string {
        // Assuming your backend serves files at /files/{fileName}
        return `${API_ENDPOINTS.USERS.BASE}/../files/${fileName}`;
    }
}

export const uploadService = new UploadService();
