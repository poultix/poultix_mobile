import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farm } from '@/types/farm';
import { Schedule, ScheduleStatus, AdminState, FilterOptions, User, UserRole } from '@/types';
import { News } from '@/types/news';
import { userService, farmService, scheduleService, newsService } from '@/services/api';


// Context types
interface AdminContextType {
    dashboardStats: AdminState['dashboardStats'];
    systemHealth: AdminState['systemHealth'];
    loading: boolean;
    error: string | null;
}

interface AdminActionsType {
    loadDashboardStats: () => Promise<void>;
    loadSystemHealth: () => Promise<void>;
    // User management
    getAllUsers: () => Promise<User[]>;
    activateUser: (userId: string) => Promise<void>;
    deactivateUser: (userId: string) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    // Farm management
    getAllFarms: () => Promise<Farm[]>;
    approveFarm: (farmId: string) => Promise<void>;
    suspendFarm: (farmId: string) => Promise<void>;
    // Schedule oversight
    getAllSchedules: () => Promise<Schedule[]>;
    approveSchedule: (scheduleId: string) => Promise<void>;
    cancelSchedule: (scheduleId: string) => Promise<void>;
    // News management
    publishNews: (newsData: Omit<News, 'createdAt' | 'updatedAt'>) => Promise<void>;
    unpublishNews: (newsTitle: string) => Promise<void>;
    // System management
    performBackup: () => Promise<void>;
    clearSystemLogs: () => Promise<void>;
    // Analytics
    getUserAnalytics: (dateRange?: { start: Date; end: Date }) => Promise<any>;
    getFarmAnalytics: (dateRange?: { start: Date; end: Date }) => Promise<any>;
    getScheduleAnalytics: (dateRange?: { start: Date; end: Date }) => Promise<any>;
    // Search and filter
    searchUsers: (query: string, filters?: FilterOptions) => Promise<User[]>;
    searchFarms: (query: string, filters?: FilterOptions) => Promise<Farm[]>;
    searchSchedules: (query: string, filters?: FilterOptions) => Promise<Schedule[]>;
    clearError: () => void;
    refreshDashboard: () => Promise<void>;
}

// Create contexts
const AdminContext = createContext<AdminContextType | undefined>(undefined);
const AdminActionsContext = createContext<AdminActionsType | undefined>(undefined);

// Provider component
export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const [dashboardStats, setDashboardStats] = useState<AdminState['dashboardStats']>({
        totalUsers: 0,
        totalFarms: 0,
        totalSchedules: 0,
        totalNews: 0,
        activeUsers: 0,
        pendingSchedules: 0,
    });
    const [systemHealth, setSystemHealth] = useState<AdminState['systemHealth']>({
        status: 'healthy',
        uptime: 0,
        lastBackup: new Date(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load dashboard data on mount
    useEffect(() => {
        loadDashboardStats();
        loadSystemHealth();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load data from API services
            const [usersRes, farmsRes, schedulesRes, newsRes] = await Promise.all([
                userService.getAllUsers(),
                farmService.getAllFarms(),
                scheduleService.getAllSchedules(),
                newsService.getAllNews()
            ]);
            
            const users = usersRes.success && usersRes.data ? usersRes.data : [];
            const farms = farmsRes.success && farmsRes.data ? farmsRes.data : [];
            const schedules = schedulesRes.success && schedulesRes.data ? schedulesRes.data : [];
            const news = newsRes.success && newsRes.data ? newsRes.data : [];

            const stats = {
                totalUsers: users.length,
                totalFarms: farms.length,
                totalSchedules: schedules.length,
                totalNews: news.length,
                activeUsers: users.filter(u => u.isActive).length,
                pendingSchedules: schedules.filter(s => s.status === ScheduleStatus.IN_PROGRESS).length,
            };

            setDashboardStats(stats);
        } catch (error) {
            setError('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    const loadSystemHealth = async () => {
        try {
            // Simulate system health check
            const health = {
                status: 'healthy' as const,
                uptime: Math.floor(Math.random() * 100000),
                lastBackup: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
            };

            setSystemHealth(health);
        } catch (error) {
            setError('Failed to load system health');
        }
    };

    // User management functions
    const getAllUsers = async (): Promise<User[]> => {
        const response = await userService.getAllUsers();
        return response.success && response.data ? response.data : [];
    };

    const activateUser = async (userId: string): Promise<void> => {
        // Implementation for activating user
        console.log('Activating user:', userId);
    };

    const deactivateUser = async (userId: string): Promise<void> => {
        // Implementation for deactivating user
        console.log('Deactivating user:', userId);
    };

    const deleteUser = async (userId: string): Promise<void> => {
        // Implementation for deleting user
        console.log('Deleting user:', userId);
    };

    // Farm management functions
    const getAllFarms = async (): Promise<Farm[]> => {
        const response = await farmService.getAllFarms();
        return response.success && response.data ? response.data : [];
    };

    const approveFarm = async (farmId: string): Promise<void> => {
        // Implementation for approving farm
        console.log('Approving farm:', farmId);
    };

    const suspendFarm = async (farmId: string): Promise<void> => {
        // Implementation for suspending farm
        console.log('Suspending farm:', farmId);
    };

    // Schedule oversight functions
    const getAllSchedules = async (): Promise<Schedule[]> => {
        const response = await scheduleService.getAllSchedules();
        return response.success && response.data ? response.data : [];
    };

    const approveSchedule = async (scheduleId: string): Promise<void> => {
        // Implementation for approving schedule
        console.log('Approving schedule:', scheduleId);
    };

    const cancelSchedule = async (scheduleId: string): Promise<void> => {
        // Implementation for canceling schedule
        console.log('Canceling schedule:', scheduleId);
    };

    // News management functions
    const publishNews = async (newsData: Omit<News, 'createdAt' | 'updatedAt'>): Promise<void> => {
        // Implementation for publishing news
        console.log('Publishing news:', newsData.title);
    };

    const unpublishNews = async (newsTitle: string): Promise<void> => {
        // Implementation for unpublishing news
        console.log('Unpublishing news:', newsTitle);
    };

    // System management functions
    const performBackup = async (): Promise<void> => {
        try {
            setLoading(true);
            // Simulate backup process
            await new Promise(resolve => setTimeout(resolve, 3000));

            const newHealth = {
                ...systemHealth,
                lastBackup: new Date(),
            };
            setSystemHealth(newHealth);
        } catch (error) {
            setError('Backup failed');
        } finally {
            setLoading(false);
        }
    };

    const clearSystemLogs = async (): Promise<void> => {
        // Implementation for clearing system logs
        console.log('Clearing system logs');
    };

    // Analytics functions
    const getUserAnalytics = async (dateRange?: { start: Date; end: Date }): Promise<any> => {
        const users = await getAllUsers();
        return {
            totalUsers: users.length,
            activeUsers: users.filter((u: User) => u.isActive).length,
            usersByRole: {
                farmers: users.filter((u: User) => u.role === UserRole.FARMER).length,
                veterinarians: users.filter((u: User) => u.role === UserRole.VETERINARY).length,
                admins: users.filter((u: User) => u.role === UserRole.ADMIN).length,
            }
        };
    };

    const getFarmAnalytics = async (dateRange?: { start: Date; end: Date }): Promise<any> => {
        const farms = await getAllFarms();
        return {
            totalFarms: farms.length,
            totalLivestock: farms.reduce((sum: number, farm: Farm) => sum + farm.livestock.total, 0),
            healthyLivestock: farms.reduce((sum: number, farm: Farm) => sum + farm.livestock.healthy, 0),
        };
    };

    const getScheduleAnalytics = async (dateRange?: { start: Date; end: Date }): Promise<any> => {
        const schedules = await getAllSchedules();
        return {
            totalSchedules: schedules.length,
            pendingSchedules: schedules.filter((s: Schedule) => s.status === ScheduleStatus.IN_PROGRESS).length,
            completedSchedules: schedules.filter((s: Schedule) => s.status === ScheduleStatus.COMPLETED).length,
        };
    };

    // Search functions
    const searchUsers = async (query: string, filters?: FilterOptions): Promise<User[]> => {
        const users = await getAllUsers();
        return users.filter((u: User) => u.name.toLowerCase().includes(query.toLowerCase()) ||
                          u.email.toLowerCase().includes(query.toLowerCase()));
    };

    const searchFarms = async (query: string, filters?: FilterOptions): Promise<Farm[]> => {
        const farms = await getAllFarms();
        return farms.filter((f: Farm) => f.name.toLowerCase().includes(query.toLowerCase()));
    };

    const searchSchedules = async (query: string, filters?: FilterOptions): Promise<Schedule[]> => {
        const schedules = await getAllSchedules();
        return schedules.filter((s: Schedule) => s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.description.toLowerCase().includes(query.toLowerCase())
        );
    };

    const refreshDashboard = async (): Promise<void> => {
        await Promise.all([loadDashboardStats(), loadSystemHealth()]);
    };

    const clearError = (): void => {
        setError(null);
    };

    const contextValue: AdminContextType = {
        dashboardStats,
        systemHealth,
        loading,
        error,
    };

    const actionsValue: AdminActionsType = {
        loadDashboardStats,
        loadSystemHealth,
        getAllUsers,
        activateUser,
        deactivateUser,
        deleteUser,
        getAllFarms,
        approveFarm,
        suspendFarm,
        getAllSchedules,
        approveSchedule,
        cancelSchedule,
        publishNews,
        unpublishNews,
        performBackup,
        clearSystemLogs,
        getUserAnalytics,
        getFarmAnalytics,
        getScheduleAnalytics,
        searchUsers,
        searchFarms,
        searchSchedules,
        clearError,
        refreshDashboard,
    };

    return (
        <AdminContext.Provider value={contextValue}>
            <AdminActionsContext.Provider value={actionsValue}>
                {children}
            </AdminActionsContext.Provider>
        </AdminContext.Provider>
    );
};

// Hooks
export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const useAdminActions = () => {
    const context = useContext(AdminActionsContext);
    if (!context) {
        throw new Error('useAdminActions must be used within an AdminProvider');
    }
    return context;
};