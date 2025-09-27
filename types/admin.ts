export interface AdminDashboardStats {
    totalUsers: number;
    totalFarms: number;
    totalSchedules: number;
    totalNews: number;
    activeUsers: number;
    pendingSchedules: number;
}

export interface SystemHealth {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    lastBackup: Date;
}


export interface AdminState {
    dashboardStats: AdminDashboardStats;
    systemHealth: SystemHealth
    isLoading: boolean;
    error: string | null;
}