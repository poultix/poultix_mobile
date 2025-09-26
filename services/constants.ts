export const SERVER_URL = "https://poultix-production.up.railway.app"

export const API_CONFIG = {
    BASE_URL: SERVER_URL,
    API_VERSION: 'v1',
    TIMEOUT: 20000,
};



export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        VERIFY_USER: '/auth/check-user',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
        ALL: '/user/all',
        PROFILE: (fileName: string) => `/profile/${fileName}`,
        UPDATE_PROFILE: (id: number) => `/user/profile/${id}`,
        GET_DATA: '/user',
        UPLOAD_AVATAR: '/upload/user',
        BY_ID: (id: number | string) => `/user/${id}`,
        UPDATE: '/user',
        EXPORT: '/user/export',
        DELETE: '/user'
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
