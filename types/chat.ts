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
    id: number
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
    userId: number
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