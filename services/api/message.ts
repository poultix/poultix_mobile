import { ApiResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

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

export class MessageService {
    // Send Message
    async sendMessage(messageData: MessageCreateRequest): Promise<ApiResponse<MessageResponse>> {
        return await apiClient.post<MessageResponse>(API_ENDPOINTS.MESSAGES.CREATE, messageData);
    }

    // Get Conversation between two users
    async getConversation(user1Id: string, user2Id: string): Promise<ApiResponse<MessageResponse[]>> {
        return await apiClient.get<MessageResponse[]>(API_ENDPOINTS.MESSAGES.CONVERSATION(user1Id, user2Id));
    }

    // Get Messages by Sender
    async getMessagesBySender(senderId: string): Promise<ApiResponse<MessageResponse[]>> {
        return await apiClient.get<MessageResponse[]>(API_ENDPOINTS.MESSAGES.BY_SENDER(senderId));
    }

    // Delete Message
    async deleteMessage(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.MESSAGES.DELETE(id));
    }
}

export const messageService = new MessageService();
