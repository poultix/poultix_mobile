import { ApiResponse,MessageCreateRequest,Message } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';


export class MessageService {
    // Send Message
    async sendMessage(messageData: MessageCreateRequest): Promise<ApiResponse<Message>> {
        return await apiClient.post<Message>(API_ENDPOINTS.MESSAGES.CREATE, messageData);
    }

    // Get Conversation between two users
    async getConversation(user1Id: string, user2Id: string): Promise<ApiResponse<Message[]>> {
        return await apiClient.get<Message[]>(API_ENDPOINTS.MESSAGES.CONVERSATION(user1Id, user2Id));
    }

    // Get Messages by Sender
    async getMessagesBySender(senderId: string): Promise<ApiResponse<Message[]>> {
        return await apiClient.get<Message[]>(API_ENDPOINTS.MESSAGES.BY_SENDER(senderId));
    }

    // Delete Message
    async deleteMessage(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.MESSAGES.DELETE(id));
    }
}

export const messageService = new MessageService();
