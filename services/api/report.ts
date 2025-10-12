import { 
    Report, 
    ReportCreateRequest, 
    ReportUpdateRequest, 
    ReportFilter,
    ReportSummary,
    ApiResponse, 
    ApiResponseList 
} from '@/types';
import { apiClient } from '@/services/client';
import { API_ENDPOINTS } from '@/services/constants';

export class ReportService {
    // Get all reports with optional filtering
    async getAllReports(filter?: ReportFilter): Promise<ApiResponseList<Report>> {
        const params = new URLSearchParams();
        
        if (filter) {
            if (filter.type) params.append('type', filter.type);
            if (filter.status) params.append('status', filter.status);
            if (filter.priority) params.append('priority', filter.priority);
            if (filter.farmId) params.append('farmId', filter.farmId);
            if (filter.generatedBy) params.append('generatedBy', filter.generatedBy);
            if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
            if (filter.dateTo) params.append('dateTo', filter.dateTo);
            if (filter.limit) params.append('limit', filter.limit.toString());
            if (filter.offset) params.append('offset', filter.offset.toString());
        }
        
        const url = `${API_ENDPOINTS.FARMS.BASE}/reports${params.toString() ? '?' + params.toString() : ''}`;
        return await apiClient.get<Report[]>(url);
    }

    // Get reports by farm ID
    async getReportsByFarm(farmId: string, filter?: Omit<ReportFilter, 'farmId'>): Promise<ApiResponseList<Report>> {
        const params = new URLSearchParams();
        
        if (filter) {
            if (filter.type) params.append('type', filter.type);
            if (filter.status) params.append('status', filter.status);
            if (filter.priority) params.append('priority', filter.priority);
            if (filter.generatedBy) params.append('generatedBy', filter.generatedBy);
            if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
            if (filter.dateTo) params.append('dateTo', filter.dateTo);
            if (filter.limit) params.append('limit', filter.limit.toString());
            if (filter.offset) params.append('offset', filter.offset.toString());
        }
        
        const url = `${API_ENDPOINTS.FARMS.BASE}/${farmId}/reports${params.toString() ? '?' + params.toString() : ''}`;
        return await apiClient.get<Report[]>(url);
    }

    // Get reports by current user's farms
    async getMyFarmReports(filter?: ReportFilter): Promise<ApiResponseList<Report>> {
        const params = new URLSearchParams();
        
        if (filter) {
            if (filter.type) params.append('type', filter.type);
            if (filter.status) params.append('status', filter.status);
            if (filter.priority) params.append('priority', filter.priority);
            if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
            if (filter.dateTo) params.append('dateTo', filter.dateTo);
            if (filter.limit) params.append('limit', filter.limit.toString());
            if (filter.offset) params.append('offset', filter.offset.toString());
        }
        
        const url = `${API_ENDPOINTS.FARMS.BY_OWNER}/reports${params.toString() ? '?' + params.toString() : ''}`;
        return await apiClient.get<Report[]>(url);
    }

    // Get report by ID
    async getReportById(reportId: string): Promise<ApiResponse<Report>> {
        return await apiClient.get<Report>(`${API_ENDPOINTS.FARMS.BASE}/reports/${reportId}`);
    }

    // Create new report
    async createReport(reportData: ReportCreateRequest): Promise<ApiResponse<Report>> {
        return await apiClient.post<Report>(`${API_ENDPOINTS.FARMS.BASE}/reports`, reportData);
    }

    // Update existing report
    async updateReport(reportId: string, updates: ReportUpdateRequest): Promise<ApiResponse<Report>> {
        return await apiClient.put<Report>(`${API_ENDPOINTS.FARMS.BASE}/reports/${reportId}`, updates);
    }

    // Delete report
    async deleteReport(reportId: string): Promise<ApiResponse<unknown>> {
        return await apiClient.delete<unknown>(`${API_ENDPOINTS.FARMS.BASE}/reports/${reportId}`);
    }

    // Generate automated report for a farm
    async generateAutomatedReport(farmId: string, type: string, periodStart: string, periodEnd: string): Promise<ApiResponse<Report>> {
        const requestData = {
            farmId,
            type,
            periodStart,
            periodEnd
        };
        
        return await apiClient.post<Report>(`${API_ENDPOINTS.FARMS.BASE}/reports/generate`, requestData);
    }

    // Get report summary/analytics
    async getReportSummary(farmId?: string): Promise<ApiResponse<ReportSummary>> {
        const url = farmId 
            ? `${API_ENDPOINTS.FARMS.BASE}/${farmId}/reports/summary`
            : `${API_ENDPOINTS.FARMS.BASE}/reports/summary`;
            
        return await apiClient.get<ReportSummary>(url);
    }

    // Download report as PDF
    async downloadReport(reportId: string): Promise<Blob> {
        const response = await fetch(`${API_ENDPOINTS.FARMS.BASE}/reports/${reportId}/download`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await this.getAuthToken()}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to download report');
        }
        
        return await response.blob();
    }

    // Share report via email
    async shareReport(reportId: string, recipientEmails: string[], message?: string): Promise<ApiResponse<unknown>> {
        const requestData = {
            reportId,
            recipientEmails,
            message
        };
        
        return await apiClient.post<unknown>(`${API_ENDPOINTS.FARMS.BASE}/reports/${reportId}/share`, requestData);
    }

    // Private helper to get auth token
    private async getAuthToken(): Promise<string> {
        // This should get the token from your auth system
        // For now, return a placeholder
        return 'your-auth-token';
    }
}

export const reportService = new ReportService();
