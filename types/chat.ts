import { User } from "./user";

export interface TypingStatus {
    chatId: string;
    userId: string;
    userName: string;
    isTyping: boolean;
}


export enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    AUDIO = "AUDIO",
    FILE = "FILE",
    VIDEO = "VIDEO"
}
export enum MessageStatus{
    SENDING="SENDING",
    DELIVERED="DELIVERED",
    READ="READ",
    FAILED="FAILED"
}

/**
 * Represents a direct message between users.
 */
export interface Message {
    id: string
    sender: User
    receiver: User
    content: string
    timestamp: string
    edited?: boolean
    type: MessageType
    reactions?: Reaction[]
    replyTo?: Message
    fileName?: string
    status:MessageStatus
}


export interface Reaction {
    userId: string
    emoji: string
}

export interface ChatReaction {
    messageId: number,
    reactions: Reaction[]
}


/**
 * Request payload for sending a direct message.
 */
export interface SendMessageRequest {
    content: string
    receiverId: number
    senderId: number
    type: MessageType
    fileName?: string
    replyToId?: number
}

// Response types
export interface MessageResponse {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE';
    attachments?: {
        url: string;
        type: string;
        name: string;
        size: number;
    }[];
    isRead: boolean;
    readAt?: string;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}

// Request types
export interface MessageCreateRequest {
    receiverId: string;
    content: string;
    messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE';
    attachments?: {
        url: string;
        type: string;
        name: string;
        size: number;
    }[];
}