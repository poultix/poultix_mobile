import { Location } from "./farm";
import { User } from "./user";

export enum NewsPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum NewsCategory {
    HEALTH = 'HEALTH',
    NUTRITION = 'NUTRITION',
    MANAGEMENT = 'MANAGEMENT',
    TECHNOLOGY = 'TECHNOLOGY',
    MARKET = 'MARKET',
    GENERAL = 'GENERAL'
}

export interface News {
    id: string
    title: string;
    content: string;
    category: NewsCategory;
    priority: NewsPriority;
    tags: string[];
    image: string
    location: Location
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