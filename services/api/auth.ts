import { User, ApiResponse, UserRole, UserRegistrationRequest, AuthResponse, UserLoginRequest, ForgotPasswordRequest ,PasswordResetRequest,EmailVerificationRequest} from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';
import * as SecureStore from 'expo-secure-store';
export class AuthService {
    // Register user (with auto-login)
    async register(userData: UserRegistrationRequest): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);

            // Store tokens securely (registration includes tokens)
            if (response.success && response.data) {
                await this.storeTokens(response.data.accessToken, response.data.refreshToken);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login(loginData: UserLoginRequest): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, loginData);

            // Store tokens securely
            if (response.success && response.data) {
                await this.storeTokens(response.data.accessToken, response.data.refreshToken);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Refresh access token using refresh token
    async refreshToken(): Promise<ApiResponse<AuthResponse>> {
        try {
            const refreshToken = await SecureStore.getItemAsync('refresh_token');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await apiClient.post<AuthResponse>(
                API_ENDPOINTS.AUTH.REFRESH_TOKEN,
                { refreshToken }
            );

            // Store new tokens securely
            if (response.success && response.data) {
                await this.storeTokens(response.data.accessToken, response.data.refreshToken);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Logout user
    async logout(): Promise<ApiResponse<void>> {
        try {
            // Get token for logout request (required by API)
            const token = await this.getAccessToken();
            
            // Call backend logout endpoint with Authorization header
            const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);

            // Clear stored tokens regardless of backend response
            await this.clearTokens();

            return response;
        } catch (error) {
            // Clear tokens even if backend call fails
            await this.clearTokens();
            throw error;
        }
    }

    // Request password reset
    async forgotPassword(forgotPasswordData: ForgotPasswordRequest): Promise<ApiResponse<void>> {
        return await apiClient.post<void>(
            API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
            forgotPasswordData
        );
    }

    // Reset password with reset code
    async resetPassword(resetPasswordData: PasswordResetRequest): Promise<ApiResponse<void>> {
        return await apiClient.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetPasswordData);
    }

    // Verify email with token
    async verifyEmail(verificationData: EmailVerificationRequest): Promise<ApiResponse<void>> {
        return await apiClient.post<void>(
            API_ENDPOINTS.AUTH.VERIFY_EMAIL,
            verificationData
        );
    }

    // Resend email verification
    async resendVerification(email: string): Promise<ApiResponse<void>> {
        return await apiClient.post<void>(`${API_ENDPOINTS.AUTH.RESEND_VERIFICATION}?email=${email}`);
    }

    // Token management utilities
    private async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
        try {
            await SecureStore.setItemAsync('access_token', accessToken);
            await SecureStore.setItemAsync('refresh_token', refreshToken);
        } catch (error) {
            console.error('Error storing tokens:', error);
            throw new Error('Failed to store authentication tokens');
        }
    }

    private async clearTokens(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    }

    // Get stored access token
    async getAccessToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync('access_token');
        } catch (error) {
            console.error('Error retrieving access token:', error);
            return null;
        }
    }

    // Get stored refresh token
    async getRefreshToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync('refresh_token');
        } catch (error) {
            console.error('Error retrieving refresh token:', error);
            return null;
        }
    }

    // Check if user is authenticated
    async isAuthenticated(): Promise<boolean> {
        const accessToken = await this.getAccessToken();
        return !!accessToken;
    }

    // Validate token and check expiry
    async isTokenValid(): Promise<boolean> {
        const accessToken = await this.getAccessToken();
        if (!accessToken) return false;

        try {
            // Check if token is expired by decoding (basic implementation)
            return !await this.isTokenExpired();
        } catch (error) {
            return false;
        }
    }

    // Check if token is expired
    async isTokenExpired(): Promise<boolean> {
        const accessToken = await this.getAccessToken();
        if (!accessToken) return true;

        try {
            // Basic JWT expiry check - decode the payload
            const payload = this.decodeJWTPayload(accessToken);
            if (!payload.exp) return false; // If no expiry, assume valid

            // Check if current time is past expiry (exp is in seconds, Date.now() is in milliseconds)
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return true; // Assume expired if we can't decode
        }
    }

    // Decode JWT payload (basic implementation without verification)
    private decodeJWTPayload(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Invalid JWT token format');
        }
    }

    // Get user info from token
    async getCurrentUserFromToken(): Promise<any | null> {
        const accessToken = await this.getAccessToken();
        if (!accessToken) return null;

        try {
            const payload = this.decodeJWTPayload(accessToken);
            return {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                name: payload.name,
                exp: payload.exp,
                iat: payload.iat
            };
        } catch (error) {
            console.error('Error decoding user from token:', error);
            return null;
        }
    }
}

export const authService = new AuthService();
