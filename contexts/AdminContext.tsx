import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Farm, Schedule, AdminState, FilterOptions, UserRole, ScheduleStatus } from '@/types';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';
import { News } from '@/types/news';
import { userService, farmService, scheduleService, newsService } from '@/services/api';
import { useAuth } from './AuthContext';
interface AdminContextType {
    loading: boolean;
    users: User[];
    farms: Farm[];
    schedules: Schedule[];
    news: News[];
    dashboardStats: AdminState['dashboardStats'];
    

    loadDashboardStats: () => Promise<void>;
    loadSystemHealth: () => Promise<void>;
    // User management
    getAllUsers: () => Promise<User[]>;
    removeUser: (user: User) => Promise<void>;
    addUser: (user: User) => Promise<void>;
    // Schedule oversight
    addSchedule: (schedule: Schedule) => Promise<void>;
    removeSchedule: (schedule: Schedule) => Promise<void>;
    // News management
    addNews: (data: News) => Promise<void>;
    removeNews: (data: News) => Promise<void>;
    //Farms management
    addFarm: (farm: Farm) => Promise<void>;
    removeFarm: (farm: Farm) => Promise<void>;
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

// Provider component
export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const [users, setUsers] = useState<User[]>([])
    const [farms, setFarms] = useState<Farm[]>([])
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [news, setNews] = useState<News[]>([])

    const { authenticated } = useAuth()
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
    const { handleApiError } = useError(); // ✅ Use ErrorContext for routing

    // Load dashboard data on mount
    useEffect(() => {
        if (authenticated) {
            loadDashboardStats();
            loadSystemHealth();
        }
    }, [authenticated]);

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

            setUsers(users)
            setFarms(farms)
            setSchedules(schedules)
            setNews(news)

            const stats = {
                totalUsers: users.length,
                totalFarms: farms.length,
                totalSchedules: schedules.length,
                totalNews: news.length,
                activeUsers: users.filter(u => u.isActive).length,
                pendingSchedules: schedules.filter(s => s.status === ScheduleStatus.IN_PROGRESS).length,
            };


            setDashboardStats(stats);
        } catch (error: any) {
            console.error('Failed to load dashboard stats:', error);

            // ✅ Check if it's a network/server error that needs routing
            if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
                handleApiError(error); // ✅ Auto-route to appropriate error screen
            } else {
                setError('Failed to load dashboard stats'); // ✅ Show inline error for minor issues
            }
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
        } catch (error: any) {
            console.error('Failed to load system health:', error);

            // ✅ Check if it's a network/server error that needs routing
            if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
                handleApiError(error); // ✅ Auto-route to appropriate error screen
            } else {
                setError('Failed to load system health'); // ✅ Show inline error for minor issues
            }
        }
    };

    // User management functions
    const getAllUsers = async (): Promise<User[]> => {
        const response = await userService.getAllUsers();
        return response.success && response.data ? response.data : [];
    };

    const addUser = async (user: User): Promise<void> => {
        setUsers([...users, user])
    }


    const removeUser = async (user: User): Promise<void> => {
        setUsers(users.filter(u => u.id !== user.id))

    };

    // Farm management functions
    const getAllFarms = async (): Promise<Farm[]> => {
        const response = await farmService.getAllFarms();
        return response.success && response.data ? response.data : [];
    };

    const addFarm = async (farm: Farm): Promise<void> => {
        setFarms([...farms, farm])
    };

    const removeFarm = async (farm: Farm): Promise<void> => {
        setFarms(farms.filter(f => f.id !== farm.id))
    };


    const addSchedule = async (schedule: Schedule): Promise<void> => {
        setSchedules([...schedules, schedule])
    };

    const removeSchedule = async (schedule: Schedule): Promise<void> => {
        setSchedules(schedules.filter(s => s.id !== schedule.id))
    };



    // News management functions
    const addNews = async (newsData: News): Promise<void> => {
        setNews([...news, newsData])
    };

    const removeNews = async (news: News): Promise<void> => {
        setNews((prev) => prev.filter(n => n.id !== news.id))
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
        } catch (error: any) {
            console.error('Backup failed:', error);

            // ✅ Check if it's a network/server error that needs routing
            if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
                handleApiError(error); // ✅ Auto-route to appropriate error screen
            } else {
                setError('Backup failed'); // ✅ Show inline error for minor issues
            }
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
        loading,
        dashboardStats,
        users,
        farms,
        schedules,
        news,
        loadDashboardStats,
        loadSystemHealth,
        getAllUsers,
        addUser,
        removeUser,
        addFarm,
        removeFarm,
        addSchedule,
        removeSchedule,
        addNews,
        removeNews,
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

            {children}
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
