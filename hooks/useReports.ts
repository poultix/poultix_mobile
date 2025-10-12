import { useState, useEffect, useCallback } from 'react';
import { 
    Report, 
    ReportFilter, 
    ReportCreateRequest, 
    ReportUpdateRequest,
    ReportSummary,
    ReportType,
    ReportStatus 
} from '@/types';
import { reportService } from '@/services/api/report';
import { useError } from '@/contexts/ErrorContext';
import { useAuth } from '@/contexts/AuthContext';

export const useReports = (farmId?: string) => {
    const { currentUser } = useAuth();
    const { showError } = useError();
    
    // State
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [reportSummary, setReportSummary] = useState<ReportSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Filter state
    const [activeFilter, setActiveFilter] = useState<ReportFilter>({});

    // Load reports
    const loadReports = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            setError(null);
            
            let response;
            if (farmId) {
                response = await reportService.getReportsByFarm(farmId, activeFilter);
            } else {
                response = await reportService.getMyFarmReports(activeFilter);
            }
            
            if (response.success) {
                setReports(response.data);
                applyFilters(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load reports';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [farmId, activeFilter, showError]);

    // Load report summary
    const loadReportSummary = useCallback(async () => {
        try {
            const response = await reportService.getReportSummary(farmId);
            if (response.success) {
                setReportSummary(response.data);
            }
        } catch (err: any) {
            console.error('Failed to load report summary:', err);
        }
    }, [farmId]);

    // Apply local filters to reports
    const applyFilters = useCallback((reportsToFilter: Report[]) => {
        let filtered = [...reportsToFilter];
        
        // Apply type filter
        if (activeFilter.type) {
            filtered = filtered.filter(report => report.type === activeFilter.type);
        }
        
        // Apply status filter
        if (activeFilter.status) {
            filtered = filtered.filter(report => report.status === activeFilter.status);
        }
        
        // Apply date range filter
        if (activeFilter.dateFrom) {
            filtered = filtered.filter(report => 
                new Date(report.reportDate) >= new Date(activeFilter.dateFrom!)
            );
        }
        
        if (activeFilter.dateTo) {
            filtered = filtered.filter(report => 
                new Date(report.reportDate) <= new Date(activeFilter.dateTo!)
            );
        }
        
        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
        
        setFilteredReports(filtered);
    }, [activeFilter]);

    // Update filter
    const updateFilter = useCallback((newFilter: Partial<ReportFilter>) => {
        setActiveFilter(prev => ({ ...prev, ...newFilter }));
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setActiveFilter({});
    }, []);

    // Refresh reports
    const refreshReports = useCallback(async () => {
        setRefreshing(true);
        await loadReports(false);
    }, [loadReports]);

    // Create report
    const createReport = useCallback(async (reportData: ReportCreateRequest): Promise<Report | null> => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await reportService.createReport(reportData);
            
            if (response.success) {
                // Add to local state
                setReports(prev => [response.data, ...prev]);
                applyFilters([response.data, ...reports]);
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create report';
            setError(errorMessage);
            showError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [reports, applyFilters, showError]);

    // Update report
    const updateReport = useCallback(async (reportId: string, updates: ReportUpdateRequest): Promise<boolean> => {
        try {
            setError(null);
            
            const response = await reportService.updateReport(reportId, updates);
            
            if (response.success) {
                // Update local state
                setReports(prev => prev.map(report => 
                    report.id === reportId ? response.data : report
                ));
                applyFilters(reports.map(report => 
                    report.id === reportId ? response.data : report
                ));
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update report';
            setError(errorMessage);
            showError(errorMessage);
            return false;
        }
    }, [reports, applyFilters, showError]);

    // Delete report
    const deleteReport = useCallback(async (reportId: string): Promise<boolean> => {
        try {
            setError(null);
            
            const response = await reportService.deleteReport(reportId);
            
            if (response.success) {
                // Remove from local state
                setReports(prev => prev.filter(report => report.id !== reportId));
                setFilteredReports(prev => prev.filter(report => report.id !== reportId));
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to delete report';
            setError(errorMessage);
            showError(errorMessage);
            return false;
        }
    }, [showError]);

    // Generate automated report
    const generateAutomatedReport = useCallback(async (
        targetFarmId: string, 
        type: ReportType, 
        periodStart: string, 
        periodEnd: string
    ): Promise<Report | null> => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await reportService.generateAutomatedReport(
                targetFarmId, 
                type, 
                periodStart, 
                periodEnd
            );
            
            if (response.success) {
                // Add to local state if it's for the current farm
                if (!farmId || targetFarmId === farmId) {
                    setReports(prev => [response.data, ...prev]);
                    applyFilters([response.data, ...reports]);
                }
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to generate report';
            setError(errorMessage);
            showError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [farmId, reports, applyFilters, showError]);

    // Download report
    const downloadReport = useCallback(async (reportId: string): Promise<boolean> => {
        try {
            const blob = await reportService.downloadReport(reportId);
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `report-${reportId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to download report';
            setError(errorMessage);
            showError(errorMessage);
            return false;
        }
    }, [showError]);

    // Share report
    const shareReport = useCallback(async (
        reportId: string, 
        recipientEmails: string[], 
        message?: string
    ): Promise<boolean> => {
        try {
            setError(null);
            
            const response = await reportService.shareReport(reportId, recipientEmails, message);
            
            if (response.success) {
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to share report';
            setError(errorMessage);
            showError(errorMessage);
            return false;
        }
    }, [showError]);

    // Get reports by status
    const getReportsByStatus = useCallback((status: ReportStatus) => {
        return filteredReports.filter(report => report.status === status);
    }, [filteredReports]);

    // Get reports by type
    const getReportsByType = useCallback((type: ReportType) => {
        return filteredReports.filter(report => report.type === type);
    }, [filteredReports]);

    // Load data on mount
    useEffect(() => {
        if (currentUser) {
            loadReports();
            loadReportSummary();
        }
    }, [currentUser, loadReports, loadReportSummary]);

    // Re-apply filters when active filter changes
    useEffect(() => {
        applyFilters(reports);
    }, [reports, applyFilters]);

    return {
        // Data
        reports: filteredReports,
        allReports: reports,
        reportSummary,
        
        // State
        loading,
        refreshing,
        error,
        activeFilter,
        
        // Actions
        loadReports,
        refreshReports,
        createReport,
        updateReport,
        deleteReport,
        generateAutomatedReport,
        downloadReport,
        shareReport,
        
        // Filters
        updateFilter,
        clearFilters,
        
        // Helpers
        getReportsByStatus,
        getReportsByType,
    };
};
