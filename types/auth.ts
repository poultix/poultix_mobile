import { Coords } from "./farm";
import { User, UserRole } from "./user";

// Request types (matching backend DTOs)
export interface UserRegistrationRequest {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    location: Coords;
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

// Response types (matching backend DTOs)
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: 'Bearer';
    expiresAt: string; // ISO date string
    user: User;
}
