import { HTTP_STATUS } from '@/services/constants';

/**
 * Gets the appropriate error route based on the error status
 * @param errorStatus - The HTTP status code or custom error code
 * @returns The error route path
 */
export const getErrorRoute = (errorStatus: number): string => {
    switch (errorStatus) {
        case HTTP_STATUS.NETWORK_ERROR:
            return '/error/NetworkError';
            
        case HTTP_STATUS.SERVER_UNREACHABLE:
            return '/error/ServerUnreachable';
            
        case HTTP_STATUS.REQUEST_TIMEOUT:
            return '/error/RequestTimeout';
            
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            return '/error/ServerError';
            
        default:
            if (errorStatus >= 500) {
                return '/error/ServerError';
            } else {
                console.warn(`Unhandled error status: ${errorStatus}`);
                return '/error/ServerError';
            }
    }
};

/**
 * Gets the error route from an error object
 * @param error - The error object from your API client
 * @returns The error route path
 */
export const getErrorRouteFromError = (error: any): string => {
    if (error?.status) {
        return getErrorRoute(error.status);
    } else {
        return '/error/ServerError';
    }
};

/**
 * Error types for better organization
 */
export const ErrorTypes = {
    NETWORK: 'NETWORK',
    SERVER: 'SERVER', 
    TIMEOUT: 'TIMEOUT',
    CONNECTION: 'CONNECTION'
} as const;

/**
 * Gets user-friendly error messages based on status
 */
export const getErrorMessage = (errorStatus: number): string => {
    switch (errorStatus) {
        case HTTP_STATUS.NETWORK_ERROR:
            return 'No internet connection available';
            
        case HTTP_STATUS.SERVER_UNREACHABLE:
            return 'Cannot reach our servers';
            
        case HTTP_STATUS.REQUEST_TIMEOUT:
            return 'Request timed out';
            
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
            return 'Service temporarily unavailable';
            
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            return 'Internal server error';
            
        default:
            return 'An unexpected error occurred';
    }
};
