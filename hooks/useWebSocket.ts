import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { webSocketService } from '@/services/websocket';
import { Message, TypingIndicator, OnlineStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface UseWebSocketReturn {
    isConnected: boolean;
    connectionState: string;
    sendMessage: (messageData: any) => void;
    sendTypingIndicator: (conversationId: string, isTyping: boolean) => void;
    sendReadReceipt: (messageId: string) => void;
    updateOnlineStatus: (isOnline: boolean) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
    const { currentUser, authenticated } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [connectionState, setConnectionState] = useState('CLOSED');
    const appStateRef = useRef(AppState.currentState);

    // Initialize connection when user is authenticated
    useEffect(() => {
        if (authenticated && currentUser?.id) {
            // In a real app, you'd get the access token from your auth system
            const accessToken = 'your-access-token'; // Replace with actual token
            webSocketService.connect(currentUser.id, accessToken);
        }

        return () => {
            if (!authenticated) {
                webSocketService.disconnect();
            }
        };
    }, [authenticated, currentUser]);

    // Handle app state changes (foreground/background)
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
                // App came to foreground
                if (authenticated && currentUser?.id) {
                    webSocketService.updateOnlineStatus(true);
                }
            } else if (nextAppState.match(/inactive|background/)) {
                // App went to background
                webSocketService.updateOnlineStatus(false);
            }
            appStateRef.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [authenticated, currentUser]);

    // WebSocket event listeners
    useEffect(() => {
        const handleConnected = () => {
            setIsConnected(true);
            setConnectionState('OPEN');
            // Send initial online status
            webSocketService.updateOnlineStatus(true);
        };

        const handleDisconnected = () => {
            setIsConnected(false);
            setConnectionState('CLOSED');
        };

        const handleError = (error: any) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        const handleMaxReconnectAttempts = () => {
            console.log('Max reconnection attempts reached');
            setIsConnected(false);
            setConnectionState('FAILED');
        };

        // Add event listeners
        webSocketService.on('connected', handleConnected);
        webSocketService.on('disconnected', handleDisconnected);
        webSocketService.on('error', handleError);
        webSocketService.on('maxReconnectAttemptsReached', handleMaxReconnectAttempts);

        // Update connection state periodically
        const stateInterval = setInterval(() => {
            setConnectionState(webSocketService.getConnectionState());
        }, 1000);

        return () => {
            webSocketService.off('connected', handleConnected);
            webSocketService.off('disconnected', handleDisconnected);
            webSocketService.off('error', handleError);
            webSocketService.off('maxReconnectAttemptsReached', handleMaxReconnectAttempts);
            clearInterval(stateInterval);
        };
    }, []);

    // Wrapper functions
    const sendMessage = useCallback((messageData: any) => {
        try {
            webSocketService.sendMessage(messageData);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }, []);

    const sendTypingIndicator = useCallback((conversationId: string, isTyping: boolean) => {
        webSocketService.sendTypingIndicator(conversationId, isTyping);
    }, []);

    const sendReadReceipt = useCallback((messageId: string) => {
        webSocketService.sendReadReceipt(messageId);
    }, []);

    const updateOnlineStatus = useCallback((isOnline: boolean) => {
        webSocketService.updateOnlineStatus(isOnline);
    }, []);

    return {
        isConnected,
        connectionState,
        sendMessage,
        sendTypingIndicator,
        sendReadReceipt,
        updateOnlineStatus,
    };
};

// Hook for listening to specific WebSocket events
export const useWebSocketEvent = (
    event: string, 
    callback: (data: any) => void, 
    deps: any[] = []
) => {
    const callbackRef = useRef(callback);
    
    // Update callback ref when dependencies change
    useEffect(() => {
        callbackRef.current = callback;
    }, deps);

    useEffect(() => {
        const eventHandler = (data: any) => {
            callbackRef.current(data);
        };

        webSocketService.on(event, eventHandler);
        
        return () => {
            webSocketService.off(event, eventHandler);
        };
    }, [event]);
};

// Specific hooks for common events
export const useWebSocketMessages = (onMessage: (message: Message) => void) => {
    useWebSocketEvent('message', onMessage, [onMessage]);
};

export const useWebSocketTyping = (onTyping: (typing: TypingIndicator) => void) => {
    useWebSocketEvent('typing', onTyping, [onTyping]);
};

export const useWebSocketOnlineStatus = (onOnlineStatus: (status: OnlineStatus) => void) => {
    useWebSocketEvent('onlineStatus', onOnlineStatus, [onOnlineStatus]);
};

export const useWebSocketReadReceipts = (onReadReceipt: (receipt: any) => void) => {
    useWebSocketEvent('readReceipt', onReadReceipt, [onReadReceipt]);
};
