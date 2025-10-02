import { News, ApiResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Request types
export interface NewsCreateRequest {
    title: string;
    content: string;
    category: 'HEALTH' | 'NUTRITION' | 'MANAGEMENT' | 'TECHNOLOGY' | 'MARKET' | 'GENERAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    excerpt?: string;
    imageUrl?: string;
    tags?: string[];
    isPublished?: boolean;
}

export interface NewsUpdateRequest {
    title?: string;
    content?: string;
    category?: 'HEALTH' | 'NUTRITION' | 'MANAGEMENT' | 'TECHNOLOGY' | 'MARKET' | 'GENERAL';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    excerpt?: string;
    imageUrl?: string;
    tags?: string[];
    isPublished?: boolean;
}

export class NewsService {
    // Create News Article
    async createNews(authorId: string, newsData: NewsCreateRequest): Promise<ApiResponse<News>> {
        return await apiClient.post<News>(API_ENDPOINTS.NEWS.CREATE(authorId), newsData);
    }

    // Get News by ID
    async getNewsById(id: string): Promise<ApiResponse<News>> {
        return await apiClient.get<News>(API_ENDPOINTS.NEWS.BY_ID(id));
    }

    // Get All News
    async getAllNews(): Promise<ApiResponse<News[]>> {
        return await apiClient.get<News[]>(API_ENDPOINTS.NEWS.ALL);
    }

    // Update News Article
    async updateNews(id: string, updates: NewsUpdateRequest): Promise<ApiResponse<News>> {
        return await apiClient.put<News>(API_ENDPOINTS.NEWS.UPDATE(id), updates);
    }

    // Delete News Article
    async deleteNews(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.NEWS.DELETE(id));
    }
}

export const newsService = new NewsService();
