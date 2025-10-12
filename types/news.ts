import { User } from './user';

// News enums - matches backend
export enum NewsCategory {
    HEALTH = 'HEALTH',
    NUTRITION = 'NUTRITION', 
    MANAGEMENT = 'MANAGEMENT',
    TECHNOLOGY = 'TECHNOLOGY',
    MARKET = 'MARKET',
    GENERAL = 'GENERAL'
}

export enum NewsPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

// News interface - matches backend NewsDTO exactly
export interface News {
    id: string; // UUID
    title: string;
    content: string;
    category: string; // Can be NewsCategory enum value
    priority: NewsPriority;
    tags: string[];
    author: User;
    image?: string;
    location?: string;
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}


// Request types
export interface NewsCreateRequest {
    title: string;
    content: string;
    category: NewsCategory;
    priority: NewsPriority;
    image: string;
    tags: string[];
    location: string
}

export interface NewsUpdateRequest {
    title: string;
    content: string;
    category: NewsCategory;
    priority: NewsPriority;
    image: string;
    tags: string[];
    location: string;
}