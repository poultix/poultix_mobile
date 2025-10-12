import { User } from './user';

// Message enums - matches backend
export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    AUDIO = 'AUDIO',
    FILE = 'FILE',
    VIDEO = 'VIDEO'
}

export enum MessageStatus {
    SENDING = 'SENDING',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
    FAILED = 'FAILED'
}

// Reaction interface - matches backend
export interface Reaction {
    userId: string; // UUID
    emoji: string;
}

// Message interface - matches backend MessageDTO exactly
export interface Message {
    id: string; // UUID
    sender: User;
    receiver: User;
    content: string;
    type: MessageType;
    status: MessageStatus;
    edited: boolean;
    fileName?: string;
    reactions: Reaction[];
    replyTo?: { id: string; content: string; }; // Reference to another Message
    timestamp: string; // ISO date-time
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}

// Request types - matches backend
export interface MessageCreateRequest {
    receiverId: string; // UUID
    content: string;
    type?: MessageType;
    fileName?: string;
    replyToId?: string; // UUID
}

// WebSocket message types for real-time features
export interface WebSocketMessage {
    type: 'MESSAGE' | 'TYPING' | 'ONLINE_STATUS' | 'READ_RECEIPT';
    payload: any;
    timestamp: string;
}

export interface TypingIndicator {
    userId: string;
    conversationId: string;
    isTyping: boolean;
    timestamp: string;
}

export interface OnlineStatus {
    userId: string;
    isOnline: boolean;
    lastSeen: string;
}

// Legacy types for backward compatibility
export interface Conversation {
    id: string;
    participants: User[];
    lastMessage?: Message;
    lastActivity: string;
    unreadCount: number;
}
