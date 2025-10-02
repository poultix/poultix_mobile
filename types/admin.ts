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


// Admin-specific types
export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalFarms: number;
    activeFarms: number;
    totalSchedules: number;
    pendingSchedules: number;
    totalDevices: number;
    activeDevices: number;
    systemHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    lastUpdated: string;
}

export interface SystemMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    threshold?: {
        min: number;
        max: number;
    };
    timestamp: string;
}

export interface Alert {
    id: string;
    type: 'SYSTEM' | 'SECURITY' | 'PERFORMANCE' | 'USER';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    title: string;
    message: string;
    source: string;
    isRead: boolean;
    createdAt: string;
}

export interface ChartData {
    date: string;
    activeUsers: number;
    newUsers: number;
    totalFarms: number;
    messages: number;
    schedules: number;
}

export interface UpdateUserStatusRequest {
    isActive: boolean;
    reason?: string;
}

