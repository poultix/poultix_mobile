import { useEffect, useState, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { cacheService } from '../services/storage/cacheService';

export const useOfflineSupport = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            setIsOnline(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);

    const getDataWithOfflineSupport = async <T>(
        cacheKey: string,
        fetchFunction: () => Promise<T>,
        fallbackData?: T,
        cacheTime?: number
    ): Promise<T> => {
        setIsLoading(true);
        
        try {
            // Try cache first
            const cachedData = await cacheService.get<T>(cacheKey);
            
            if (isOnline) {
                // If online, try to fetch fresh data
                try {
                    const freshData = await fetchFunction();
                    await cacheService.set(cacheKey, freshData, cacheTime);
                    setIsLoading(false);
                    return freshData;
                } catch (error) {
                    // If fetch fails but cached data exists, use cached
                    if (cachedData) {
                        setIsLoading(false);
                        return cachedData;
                    }
                    throw error;
                }
            } else {
                // If offline, use cached data or fallback
                if (cachedData) {
                    setIsLoading(false);
                    return cachedData;
                }
                if (fallbackData) {
                    setIsLoading(false);
                    return fallbackData;
                }
                throw new Error('No cached data available offline');
            }
        } catch (error) {
            setIsLoading(false);
            if (fallbackData) {
                return fallbackData;
            }
            throw error;
        }
    };

    const queueAction = async (actionData: any) => {
        if (!isOnline) {
            await cacheService.queueOfflineRequest(actionData);
            return { queued: true };
        }
        return { queued: false };
    };

    const syncQueuedActions = async () => {
        if (!isOnline) return;
        
        const queue = await cacheService.getOfflineQueue();
        if (queue.length === 0) return;

        // Process queued actions here
        // You can implement specific sync logic based on your needs
        
        await cacheService.clearOfflineQueue();
    };

    useEffect(() => {
        if (isOnline) {
            syncQueuedActions();
        }
    }, [isOnline]);

    return {
        isOnline,
        isLoading,
        getDataWithOfflineSupport,
        queueAction,
        syncQueuedActions
    };
};
