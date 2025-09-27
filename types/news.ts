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