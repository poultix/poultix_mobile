// API Configuration for Poultix App
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URL: {
    development: 'http://localhost:8080/api/v1',
    staging: 'https://staging-api.poultix.rw/api/v1', 
    production: 'https://api.poultix.rw/api/v1'
  },
  
  // Current environment (should be set via environment variables)
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
  
  // API Endpoints following OpenAPI specification
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    
    // Users
    USERS: {
      PROFILE: '/users/profile',
      UPDATE: '/users/profile',
      DELETE: '/users',
      LIST: '/users',
      BY_ID: (id: string) => `/users/${id}`,
    },
    
    // Farms
    FARMS: {
      LIST: '/farms',
      CREATE: '/farms',
      BY_ID: (id: string) => `/farms/${id}`,
      UPDATE: (id: string) => `/farms/${id}`,
      DELETE: (id: string) => `/farms/${id}`,
      BY_USER: (userId: string) => `/farms/user/${userId}`,
    },
    
    // Veterinary
    VETERINARY: {
      LIST: '/veterinaries',
      CREATE: '/veterinaries',
      BY_ID: (id: string) => `/veterinaries/${id}`,
      UPDATE: (id: string) => `/veterinaries/${id}`,
      DELETE: (id: string) => `/veterinaries/${id}`,
      NEARBY: '/veterinaries/nearby',
    },
    
    // Pharmacy
    PHARMACY: {
      LIST: '/pharmacies',
      CREATE: '/pharmacies',
      BY_ID: (id: string) => `/pharmacies/${id}`,
      UPDATE: (id: string) => `/pharmacies/${id}`,
      DELETE: (id: string) => `/pharmacies/${id}`,
      VERIFY: (id: string) => `/pharmacies/${id}/verify`,
      DOCUMENTS: (id: string) => `/pharmacies/${id}/documents`,
      NEARBY: '/pharmacies/nearby',
    },
    
    // Schedules
    SCHEDULES: {
      LIST: '/schedules',
      CREATE: '/schedules',
      BY_ID: (id: string) => `/schedules/${id}`,
      UPDATE: (id: string) => `/schedules/${id}`,
      DELETE: (id: string) => `/schedules/${id}`,
      BY_VET: (vetId: string) => `/schedules/veterinary/${vetId}`,
      BY_FARMER: (farmerId: string) => `/schedules/farmer/${farmerId}`,
    },
    
    // News
    NEWS: {
      LIST: '/news',
      CREATE: '/news',
      BY_ID: (id: string) => `/news/${id}`,
      UPDATE: (id: string) => `/news/${id}`,
      DELETE: (id: string) => `/news/${id}`,
      PUBLISH: (id: string) => `/news/${id}/publish`,
    },
    
    // Messages/Chat
    MESSAGES: {
      LIST: '/messages',
      SEND: '/messages',
      BY_ID: (id: string) => `/messages/${id}`,
      CONVERSATION: (conversationId: string) => `/messages/conversation/${conversationId}`,
      MARK_READ: (id: string) => `/messages/${id}/read`,
    },
    
    // Vaccines
    VACCINES: {
      LIST: '/vaccines',
      CREATE: '/vaccines',
      BY_ID: (id: string) => `/vaccines/${id}`,
      UPDATE: (id: string) => `/vaccines/${id}`,
      DELETE: (id: string) => `/vaccines/${id}`,
      BY_PHARMACY: (pharmacyId: string) => `/vaccines/pharmacy/${pharmacyId}`,
    },
    
    // File Upload
    UPLOAD: {
      DOCUMENT: '/upload/document',
      IMAGE: '/upload/image',
      AVATAR: '/upload/avatar',
    },
    
    // Admin
    ADMIN: {
      USERS: '/admin/users',
      ANALYTICS: '/admin/analytics',
      REPORTS: '/admin/reports',
      SYSTEM_HEALTH: '/admin/health',
    }
  },
  
  // HTTP Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Request timeouts
  TIMEOUT: {
    DEFAULT: 30000, // 30 seconds
    UPLOAD: 120000, // 2 minutes for file uploads
  },
  
  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  }
};

// Get current API base URL
export const getApiBaseUrl = (): string => {
  return API_CONFIG.BASE_URL[API_CONFIG.ENVIRONMENT as keyof typeof API_CONFIG.BASE_URL];
};

// Build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${getApiBaseUrl()}${endpoint}`;
};
