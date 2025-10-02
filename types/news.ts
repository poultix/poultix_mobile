import { User } from "./user";

export enum NewsPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export interface News {
    title: string;
    content: string;
    category: string;
    priority: NewsPriority;
    tags: string[];
    author: User;
    createdAt: Date;
    updatedAt: Date;
}


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