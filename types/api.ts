/**
 * Generic API Response types - matches backend ApiResponse wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * API error structure.
 */
export interface ApiError {
    success: false;
    message: string;
    error?: string;
    status?: number;
}

/**
 * List response types
 */
export interface ApiResponseList<T> {
    success: boolean;
    message: string;
    data: T[];
}

/**
 * Specific API response types
 */
export interface ApiResponseVoid {
    success: boolean;
    message: string;
    data: unknown;
}

export interface ApiResponseString {
    success: boolean;
    message: string;
    data: string;
}

export interface ApiResponseBoolean {
    success: boolean;
    message: string;
    data: boolean;
}

/**
 * Generic paginated response type
 */
export interface PaginatedResponse<T> extends ApiResponseList<T> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

/**
 * Generic socket response wrapper.
 */
export interface SocketResponse<T> {
    success: boolean
    data?: T
    error?: string
} 