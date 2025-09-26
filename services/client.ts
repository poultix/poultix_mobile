import * as SecureStore from 'expo-secure-store'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosProgressEvent, CancelToken } from 'axios';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS } from './constants';
import { ApiResponse, ApiError } from '@/types';

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
            (config) => {
                try {
                    const token = this.getAuthToken();
                    console.log('Token in interceptor:', token, 'For URL:', config.url);
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                } catch (error) {
                    console.error('Error in request interceptor:', error.message);
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
                        await this.handleUnauthorized();
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
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data?.message || 'An error occurred',
                errors: error.response.data?.errors || {},
            };
        }

        if (error.code === 'ECONNABORTED') {
            return {
                status: HTTP_STATUS.REQUEST_TIMEOUT,
                message: 'Request timeout',
                errors: {},
                code: error.code,
            };
        }

        return {
            status: HTTP_STATUS.SERVICE_UNAVAILABLE,
            message: 'Network error',
            errors: {},
            code: error.code,
        };
    }

    private async getAuthToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync('access_token');
        } catch (error) {
            console.error('Error accessing localStorage:', error.message);
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
                `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh`,
                { refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === HTTP_STATUS.OK) {
                const { accessToken } = response.data;
                await SecureStore.setItemAsync('access_token', accessToken);
                console.log('Token refreshed successfully');
                this.refreshAttempts = 0;
            } else {
                throw new Error('Refresh token invalid or expired');
            }
        } catch (error) {
            console.error('Failed to refresh token:', error.message);
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
                    console.error('Error in logout callback:', error.message);
                }
            });
        } catch (error) {
            console.error('Error during logout:', error.message);
        } finally {
            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error('Error in final logout callback:', error.message);
                }
            });
        }
    }

    public onLogout(callback: () => void) {
        try {
            this.logoutListeners.push(callback);
        } catch (error) {
            console.error('Error adding logout listener:', error.message);
        }
    }

    public removeLogoutListener(callback: () => void) {
        try {
            this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback);
        } catch (error) {
            console.error('Error removing logout listener:', error.message);
        }
    }

    async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { params });
            return response.data;
        } catch (error) {
            console.error(`GET ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.get<T>(endpoint, params); // Retry
            }
            throw this.normalizeError(error);
        }
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data);
            console.log("This is the response", response, "endpoint", endpoint)
            return response.data;
        } catch (error) {
            console.error(`POST ${endpoint} failed:`, error.request);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
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
            console.error(`PUT ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
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
            console.error(`PATCH ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
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
            console.error(`DELETE ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.delete<T>(endpoint); // Retry
            }
            throw this.normalizeError(error);;
        }
    }

    async uploadFile<T>(
        endpoint: string,
        file: File,
        onUploadProgress?: (event: AxiosProgressEvent) => void,
        cancelToken?: CancelToken,
        timeout?: number
    ): Promise<ApiResponse<T>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
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
            console.error(`UPLOAD ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                await this.handleUnauthorized();
                return this.uploadFile<T>(endpoint, file, onUploadProgress, cancelToken, timeout); // Retry
            }
            throw this.normalizeError(error);
        }
    }
}

export const apiClient = new ApiClient();