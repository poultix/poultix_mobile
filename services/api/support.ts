import { ApiResponse, HelpSupportCreateRequest, HelpSupportResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';


export class SupportService {
    // Create Support Ticket
    async createTicket( ticketData: HelpSupportCreateRequest): Promise<ApiResponse<HelpSupportResponse>> {
        return await apiClient.post<HelpSupportResponse>(API_ENDPOINTS.SUPPORT.CREATE, ticketData);
    }

    // Get Ticket by ID
    async getTicketById(id: string): Promise<ApiResponse<HelpSupportResponse>> {
        return await apiClient.get<HelpSupportResponse>(API_ENDPOINTS.SUPPORT.BY_ID(id));
    }

    // Get All Tickets (Admin only)
    async getAllTickets(): Promise<ApiResponse<HelpSupportResponse[]>> {
        return await apiClient.get<HelpSupportResponse[]>(API_ENDPOINTS.SUPPORT.ALL);
    }

    // Get Tickets by User
    async getTicketsByUser(userId: string): Promise<ApiResponse<HelpSupportResponse[]>> {
        return await apiClient.get<HelpSupportResponse[]>(API_ENDPOINTS.SUPPORT.BY_USER(userId));
    }

    // Delete Ticket
    async deleteTicket(id: string): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(API_ENDPOINTS.SUPPORT.DELETE(id));
    }
}

export const supportService = new SupportService();
