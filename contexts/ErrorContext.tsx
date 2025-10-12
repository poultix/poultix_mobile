import React, { createContext, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { HTTP_STATUS } from '@/services/constants';

interface ErrorContextType {
    handleApiError: (error: any) => void;
    routeToErrorScreen: (errorStatus: number) => void;
    getErrorMessage: (errorStatus: number) => string;
    showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
    const router = useRouter();

    const routeToErrorScreen = (errorStatus: number) => {
        switch (errorStatus) {
            case HTTP_STATUS.NETWORK_ERROR:
                router.push('/error/NetworkError');
                break;
                
            case HTTP_STATUS.SERVER_UNREACHABLE:
                router.push('/error/ServerUnreachable');
                break;
                
            case HTTP_STATUS.REQUEST_TIMEOUT:
                router.push('/error/RequestTimeout');
                break;
                
            case HTTP_STATUS.SERVICE_UNAVAILABLE:
            case HTTP_STATUS.INTERNAL_SERVER_ERROR:
                router.push('/error/ServerError');
                break;
                
            default:
                if (errorStatus >= 500) {
                    router.push('/error/ServerError');
                } else {
                    console.warn(`Unhandled error status: ${errorStatus}`);
                    router.push('/error/ServerError');
                }
                break;
        }
    };

    const handleApiError = (error: any) => {
        if (error?.status) {
            routeToErrorScreen(error.status);
        } else {
            router.push('/error/ServerError');
        }
    };

    const getErrorMessage = (errorStatus: number): string => {
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

    const showError = (message: string) => {
        Alert.alert('Error', message);
    };

    return (
        <ErrorContext.Provider value={{
            handleApiError,
            routeToErrorScreen,
            getErrorMessage,
            showError
        }}>
            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
}
