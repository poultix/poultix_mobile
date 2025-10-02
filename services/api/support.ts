import { ApiResponse } from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

// Response types
export interface HelpSupportResponse {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'FARMER' | 'VETERINARY' | 'ADMIN';
    };
    subject: string;
    description: string;
    category: 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'GENERAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    assignedTo?: {
        id: string;
        name: string;
        email: string;
    };
    attachments?: {
        url: string;
        type: string;
        name: string;
        size: number;
    }[];
    resolution?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

// Request types
export interface HelpSupportCreateRequest {
    subject: string;
    description: string;
    category: 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'GENERAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    attachments?: {
        url: string;
        type: string;
        name: string;
        size: number;
    }[];
}

export class SupportService {
    // Create Support Ticket
    async createTicket(userId: string, ticketData: HelpSupportCreateRequest): Promise<ApiResponse<HelpSupportResponse>> {
        return await apiClient.post<HelpSupportResponse>(API_ENDPOINTS.SUPPORT.CREATE(userId), ticketData);
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
