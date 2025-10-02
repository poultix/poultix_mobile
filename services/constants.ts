import Constants from 'expo-constants';

export const SERVER_URL = "http://localhost:8080"

export const API_CONFIG = {
    BASE_URL: SERVER_URL,
    API_VERSION: 'api',
    TIMEOUT: 20000,
};

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        REFRESH_TOKEN: '/auth/refresh-token',
        LOGOUT: '/auth/logout',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        RESEND_VERIFICATION: '/auth/resend-verification',
    },

    // File Upload
    UPLOAD: {
        PROFILE_IMAGE: '/upload/profile-image',
        ATTACHMENT: '/upload/attachment',
        DOCUMENT: '/upload/document',
        DELETE: (folder: string, fileName: string) => `/upload/${folder}/${fileName}`,
    },

    // User Management
    USERS: {
        BASE: '/users',
        REGISTER: '/users/register',
        BY_ID: (id: string) => `/users/${id}`,
        BY_EMAIL: (email: string) => `/users/email/${email}`,
        ALL: '/users',
        BY_ROLE: (role: string) => `/users/role/${role}`,
        ACTIVE: '/users/active',
        UPDATE: (id: string) => `/users/${id}`,
        ACTIVATE: (id: string) => `/users/${id}/activate`,
        DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
        DELETE: (id: string) => `/users/${id}`,
    },

    // Farm Management
    FARMS: {
        BASE: '/farms',
        CREATE: (ownerId: string) => `/farms?ownerId=${ownerId}`,
        BY_ID: (id: string) => `/farms/${id}`,
        ALL: '/farms',
        BY_OWNER: (ownerId: string) => `/farms/owner/${ownerId}`,
        BY_VETERINARY: (veterinaryId: string) => `/farms/veterinary/${veterinaryId}`,
        BY_STATUS: (status: string) => `/farms/status/${status}`,
        ACTIVE: '/farms/active',
        UPDATE: (id: string) => `/farms/${id}`,
        ASSIGN_VETERINARY: (id: string, veterinaryId: string) => `/farms/${id}/assign-veterinary?veterinaryId=${veterinaryId}`,
        UPDATE_HEALTH_STATUS: (id: string, status: string) => `/farms/${id}/health-status?status=${status}`,
        DEACTIVATE: (id: string) => `/farms/${id}/deactivate`,
        DELETE: (id: string) => `/farms/${id}`,
    },

    // Veterinary Services
    VETERINARIES: {
        BASE: '/veterinaries',
        CREATE: (userId: string) => `/veterinaries?userId=${userId}`,
        BY_ID: (id: string) => `/veterinaries/${id}`,
        BY_USER: (userId: string) => `/veterinaries/user/${userId}`,
        ALL: '/veterinaries',
        ACTIVE: '/veterinaries/active',
        TOP_RATED: (minRating?: number) => `/veterinaries/top-rated${minRating ? `?minRating=${minRating}` : ''}`,
        UPDATE: (id: string) => `/veterinaries/${id}`,
        UPDATE_RATING: (id: string, rating: number) => `/veterinaries/${id}/rating?rating=${rating}`,
        INCREMENT_VISITS: (id: string) => `/veterinaries/${id}/increment-visits`,
        DEACTIVATE: (id: string) => `/veterinaries/${id}/deactivate`,
        DELETE: (id: string) => `/veterinaries/${id}`,
    },

    // Scheduling
    SCHEDULES: {
        BASE: '/schedules',
        CREATE: (createdBy: string) => `/schedules?createdBy=${createdBy}`,
        BY_ID: (id: string) => `/schedules/${id}`,
        ALL: '/schedules',
        BY_FARMER: (farmerId: string) => `/schedules/farmer/${farmerId}`,
        BY_VETERINARY: (veterinaryId: string) => `/schedules/veterinary/${veterinaryId}`,
        BY_STATUS: (status: string) => `/schedules/status/${status}`,
        BY_DATE: (date: string) => `/schedules/date/${date}`,
        BY_DATE_RANGE: (startDate: string, endDate: string) => `/schedules/date-range?startDate=${startDate}&endDate=${endDate}`,
        UPDATE: (id: string) => `/schedules/${id}`,
        UPDATE_STATUS: (id: string, status: string) => `/schedules/${id}/status?status=${status}`,
        COMPLETE: (id: string) => `/schedules/${id}/complete`,
        CANCEL: (id: string) => `/schedules/${id}/cancel`,
        DELETE: (id: string) => `/schedules/${id}`,
    },

    // Device Management
    DEVICES: {
        BASE: '/devices',
        CREATE: '/devices',
        BY_ID: (id: string) => `/devices/${id}`,
        BY_DEVICE_ID: (deviceId: string) => `/devices/device-id/${deviceId}`,
        ALL: '/devices',
        BY_FARM: (farmId: string) => `/devices/farm/${farmId}`,
        ACTIVE: '/devices/active',
        UPDATE: (id: string) => `/devices/${id}`,
        ACTIVATE: (id: string) => `/devices/${id}/activate`,
        DEACTIVATE: (id: string) => `/devices/${id}/deactivate`,
        DELETE: (id: string) => `/devices/${id}`,
    },

    // News Management
    NEWS: {
        BASE: '/news',
        CREATE: (authorId: string) => `/news?authorId=${authorId}`,
        BY_ID: (id: string) => `/news/${id}`,
        ALL: '/news',
        UPDATE: (id: string) => `/news/${id}`,
        DELETE: (id: string) => `/news/${id}`,
    },

    // Messaging
    MESSAGES: {
        BASE: '/messages',
        CREATE: '/messages',
        CONVERSATION: (user1Id: string, user2Id: string) => `/messages/conversation?user1Id=${user1Id}&user2Id=${user2Id}`,
        BY_SENDER: (senderId: string) => `/messages/sender/${senderId}`,
        DELETE: (id: string) => `/messages/${id}`,
    },

    // Pharmacy Services
    PHARMACIES: {
        BASE: '/pharmacies',
        CREATE: '/pharmacies',
        BY_ID: (id: string) => `/pharmacies/${id}`,
        ALL: '/pharmacies',
        UPDATE: (id: string) => `/pharmacies/${id}`,
        DELETE: (id: string) => `/pharmacies/${id}`,
    },

    // Sensor Data
    SENSOR_READINGS: {
        BASE: '/sensor-readings',
        CREATE: '/sensor-readings',
        BY_DEVICE: (deviceId: string) => `/sensor-readings/device/${deviceId}`,
        BY_FARM: (farmId: string) => `/sensor-readings/farm/${farmId}`,
    },

    // Support
    SUPPORT: {
        BASE: '/support',
        CREATE: (userId: string) => `/support?userId=${userId}`,
        BY_ID: (id: string) => `/support/${id}`,
        ALL: '/support',
        BY_USER: (userId: string) => `/support/user/${userId}`,
        DELETE: (id: string) => `/support/${id}`,
    },

    // Admin (for backward compatibility)
    ADMIN: {
        USERS: '/users',
        DASHBOARD_STATS: '/admin/stats',
        SYSTEM_METRICS: '/admin/metrics',
        ANALYTICS: '/admin/analytics',
        RECENT_ALERTS: '/admin/alerts',
    },
}

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    REQUEST_TIMEOUT: 408,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
}




// Google OAuth Configuration
export const GoogleAuthConfig = {
    // Get client IDs from app.json extra config or environment variables
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID || 
                    process.env.GOOGLE_ANDROID_CLIENT_ID || 
                    'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID || 
                process.env.GOOGLE_IOS_CLIENT_ID || 
                'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || 
                process.env.GOOGLE_WEB_CLIENT_ID || 
                'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',

    // OAuth scopes
    scopes: ['profile', 'email', 'openid'],

    // Redirect URI scheme (should match app.json scheme)
    redirectScheme: 'myapp',
    redirectPath: 'auth/google',
};

// Helper function to validate configuration
export const validateGoogleAuthConfig = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (GoogleAuthConfig.androidClientId.includes('YOUR_ANDROID_CLIENT_ID')) {
        errors.push('Android Client ID not configured');
    }
    
    if (GoogleAuthConfig.iosClientId.includes('YOUR_IOS_CLIENT_ID')) {
        errors.push('iOS Client ID not configured');
    }
    
    if (GoogleAuthConfig.webClientId.includes('YOUR_WEB_CLIENT_ID')) {
        errors.push('Web Client ID not configured');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Development helper to show configuration status
export const getConfigurationStatus = () => {
    const validation = validateGoogleAuthConfig();
    
    return {
        ...validation,
        config: {
            androidClientId: GoogleAuthConfig.androidClientId.includes('YOUR_ANDROID_CLIENT_ID') 
                ? '❌ Not configured' 
                : '✅ Configured',
            iosClientId: GoogleAuthConfig.iosClientId.includes('YOUR_IOS_CLIENT_ID') 
                ? '❌ Not configured' 
                : '✅ Configured',
            webClientId: GoogleAuthConfig.webClientId.includes('YOUR_WEB_CLIENT_ID') 
                ? '❌ Not configured' 
                : '✅ Configured',
            redirectUri: `${GoogleAuthConfig.redirectScheme}://${GoogleAuthConfig.redirectPath}`,
        }
    };
};
