import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiresIn?: number; // milliseconds
}

export class CacheService {
    private static instance: CacheService;
    private readonly defaultExpiration = 24 * 60 * 60 * 1000; // 24 hours

    static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    async set<T>(key: string, data: T, expiresIn?: number): Promise<void> {
        try {
            const cacheItem: CacheItem<T> = {
                data,
                timestamp: Date.now(),
                expiresIn: expiresIn || this.defaultExpiration
            };
            await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const cached = await AsyncStorage.getItem(key);
            if (!cached) return null;

            const cacheItem: CacheItem<T> = JSON.parse(cached);
            const now = Date.now();
            
            // Check if expired
            if (cacheItem.expiresIn && (now - cacheItem.timestamp) > cacheItem.expiresIn) {
                await this.remove(key);
                return null;
            }

            return cacheItem.data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Cache remove error:', error);
        }
    }

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }

    async getOrFetch<T>(
        key: string,
        fetchFunction: () => Promise<T>,
        expiresIn?: number
    ): Promise<T> {
        // Try to get from cache first
        const cached = await this.get<T>(key);
        if (cached) return cached;

        // If not cached, fetch and cache
        try {
            const data = await fetchFunction();
            await this.set(key, data, expiresIn);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    // Offline queue for failed requests
    async queueOfflineRequest(requestData: any): Promise<void> {
        try {
            const queue = await this.get<any[]>('offline_queue') || [];
            queue.push({
                ...requestData,
                timestamp: Date.now()
            });
            await this.set('offline_queue', queue);
        } catch (error) {
            console.error('Queue offline request error:', error);
        }
    }

    async getOfflineQueue(): Promise<any[]> {
        return await this.get<any[]>('offline_queue') || [];
    }

    async clearOfflineQueue(): Promise<void> {
        await this.remove('offline_queue');
    }
}

export const cacheService = CacheService.getInstance();
