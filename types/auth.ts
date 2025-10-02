import { UserRole } from "./user";

// Request types (matching backend DTOs)
export interface UserRegistrationRequest {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    location?: string;
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
    verificationToken: string;
}

// Response types (matching backend DTOs)
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: 'Bearer';
    expiresAt: string; // ISO date string
    user: {
        id: string;
        name: string;
        email: string;
        role:UserRole;
        avatar?: string;
        phone?: string;
        location?: string;
        isActive: boolean;
        emailVerified: boolean;
    };
}
