import { ApiError, ApiResponse } from '@/types';
import axios, { AxiosInstance, AxiosProgressEvent, AxiosResponse, CancelToken } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, HTTP_STATUS } from './constants';

class ApiClient {
    private axiosInstance: AxiosInstance;
    private logoutListeners: (() => void)[] = [];
    private refreshAttempts: number = 0;
    private maxRefreshAttempts: number = 3;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    const token = await this.getAuthToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                } catch (error) {
                    return Promise.reject(error);
                }
            },
            (error) => {
                console.error('Request interceptor error:', error.message);
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle errors
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                const apiError = this.normalizeError(error);

                if (
                    apiError.status === HTTP_STATUS.UNAUTHORIZED ||
                    apiError.status === HTTP_STATUS.FORBIDDEN
                ) {
                    try {
                        // await this.handleUnauthorized();
                        return this.axiosInstance.request(error.config);
                    } catch (refreshError) {
                        return Promise.reject(this.normalizeError(refreshError));
                    }
                }

                return Promise.reject(apiError);
            }
        );

    }
    private normalizeError(error: any): ApiError {
        // Server responded with an error status
        if (error.response) {
            const status = error.response.status;
            if (status >= 500) {
                return {
                    success: false,
                    message: 'Request timeout',
                    error: 'Request timeout',
                    status: HTTP_STATUS.REQUEST_TIMEOUT,
                };
            }
            return {
                success: false,
                status: status,
                message: error.response.data?.message || 'An error occurred',
            };
        }

       
        if (error.request) {
            // Request timeout
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    status: HTTP_STATUS.REQUEST_TIMEOUT,
                    message: 'Request timeout - please check your connection and try again',
                    error: 'Request timeout',
                };
            }
            
            // Network connection issues
            if (error.code === 'NETWORK_ERROR' || 
                error.message?.includes('Network Error') ||
                error.message?.includes('fetch'))
            {
                return {
                    success: false,
                    status: HTTP_STATUS.NETWORK_ERROR,
                    message: 'No internet connection - please check your network settings',
                    error: 'Network error',
                };
            }
            
            // Server unreachable (connection refused, DNS issues, etc.)
            if (error.code === 'ECONNREFUSED' || 
                error.code === 'ENOTFOUND' ||
                error.code === 'ETIMEDOUT' ||
                error.message?.includes('connect ECONNREFUSED') ||
                error.message?.includes('getaddrinfo ENOTFOUND'))
            {
                return {
                    success: false,
                    status: HTTP_STATUS.SERVER_UNREACHABLE,
                    message: 'Cannot reach server - please try again later',
                    error: 'Server unreachable',
                };
            }
        }

        // Generic connection failure
        return {
            success: false,
            message: 'Connection failed',
            error: 'Connection failed',
            status: HTTP_STATUS.CONNECTION_FAILED,
        };
    }

    /**
     * Handles errors and returns normalized error for components to handle
     * @param error - The error object
     * @returns Normalized ApiError with status for routing decisions
     */
    public handleError(error: any): ApiError {
        return this.normalizeError(error);
    }

    private async getAuthToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync('access_token');
        } catch (error) {
            console.error('Error accessing localStorage:', (error as Error).message || 'Unknown error');
            this.logout();
            return null;
        }
    }

    private async handleUnauthorized() {
        try {
            if (this.refreshAttempts >= this.maxRefreshAttempts) {
                console.warn('Max refresh attempts reached, logging out');
                this.logout();
                throw new Error('Max refresh attempts exceeded');
            }
            this.refreshAttempts++;
            const refreshToken = await SecureStore.getItemAsync('refresh_token');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh-token`,
                { refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === HTTP_STATUS.OK && response.data.success) {
                const { accessToken, refreshToken } = response.data.data;
                await SecureStore.setItemAsync('access_token', accessToken);
                await SecureStore.setItemAsync('refresh_token', refreshToken);
                console.log('Token refreshed successfully');
                this.refreshAttempts = 0;
            } else {
                throw new Error('Refresh token invalid or expired');
            }
        } catch (error) {
            console.error('Failed to refresh token:', (error as Error).message || 'Unknown error');
            this.logout();
            throw this.normalizeError(error);
        }
    }

    public async logout() {
        try {
            console.log('Logging out user');
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error('Error in logout callback:', (error as Error).message || 'Unknown error');
                }
            });
        } catch (error) {
            console.error('Error during logout:', (error as Error).message || 'Unknown error');
        } finally {
            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error('Error in final logout callback:', (error as Error).message || 'Unknown error');
                }
            });
        }
    }


    async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { params });
            return response.data;
        } catch (error) {
            if ((error as any).status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.get<T>(endpoint, params); // Retry
            }
            throw this.normalizeError(error);
        }
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            if ((error as any).status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.post<T>(endpoint, data); // Retry
            }
            throw this.normalizeError(error);
        }
    }

    async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            if ((error as any).status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.put<T>(endpoint, data); // Retry
            }
            throw this.normalizeError(error);;
        }
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.patch<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            if ((error as any).status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.patch<T>(endpoint, data); // Retry
            }
            throw this.normalizeError(error);;
        }
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint);
            return response.data;
        } catch (error) {
            if ((error as any).status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.delete<T>(endpoint); // Retry
            }
            throw this.normalizeError(error);;
        }
    }

    async uploadFile<T>(
        endpoint: string,
        formData: FormData,
        onUploadProgress?: (event: AxiosProgressEvent) => void,
        cancelToken?: CancelToken,
        timeout?: number
    ): Promise<ApiResponse<T>> {
        try {

            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
                cancelToken,
                timeout: timeout ?? API_CONFIG.TIMEOUT,
            });
            return response.data;
        } catch (error) {
            if ((error as any).status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.uploadFile<T>(endpoint, formData, onUploadProgress, cancelToken, timeout); // Retry
            }
            throw this.normalizeError(error);
        }
    }
}

export const apiClient = new ApiClient();