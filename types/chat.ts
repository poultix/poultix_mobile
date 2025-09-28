
export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    content: string;
    type: 'text' | 'image' | 'voice' | 'file';
    timestamp: Date;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    replyTo?: string;
    reactions?: { [userId: string]: string };
    isEdited?: boolean;
    isDeleted?: boolean;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    voiceDuration?: number;
}



export interface Chat {
    id: string;
    type: 'individual' | 'group';
    name?: string;
    participants: string[];
    participantNames: { [userId: string]: string };
    lastMessage?: Message;
    lastActivity: Date;
    unreadCount: number;
    isTyping: { [userId: string]: boolean };
    isOnline: { [userId: string]: boolean };
    avatar?: string;
    description?: string;
    createdBy?: string;
    createdAt: Date;
}

export interface TypingStatus {
    chatId: string;
    userId: string;
    userName: string;
    isTyping: boolean;
}