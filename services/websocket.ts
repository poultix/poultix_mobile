import { Message, MessageCreateRequest, TypingIndicator, OnlineStatus, WebSocketMessage } from '@/types';

type WebSocketEventCallback = (data: any) => void;

export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectInterval = 1000; // Start with 1 second
    private listeners: Map<string, WebSocketEventCallback[]> = new Map();
    private isConnecting = false;
    private userId: string | null = null;
    private accessToken: string | null = null;

    // Connection management
    connect(userId: string, accessToken: string) {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }

        this.userId = userId;
        this.accessToken = accessToken;
        this.isConnecting = true;

        // In a real implementation, you'd get the WebSocket URL from your config
        const wsUrl = `ws://10.12.74.8:8080/ws?token=${accessToken}&userId=${userId}`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.isConnecting = false;
            this.scheduleReconnect();
        }
    }

    private setupEventListeners() {
        if (!this.ws) return;

        this.ws.onopen = (event) => {
            console.log('WebSocket connected');
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.reconnectInterval = 1000;
            this.emit('connected', { event });
        };

        this.ws.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
            this.isConnecting = false;
            this.emit('disconnected', { event });
            
            if (event.code !== 1000) { // Not a normal closure
                this.scheduleReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isConnecting = false;
            this.emit('error', { error });
        };
    }

    private handleMessage(message: WebSocketMessage) {
        switch (message.type) {
            case 'MESSAGE':
                this.emit('message', message.payload as Message);
                break;
            case 'TYPING':
                this.emit('typing', message.payload as TypingIndicator);
                break;
            case 'ONLINE_STATUS':
                this.emit('onlineStatus', message.payload as OnlineStatus);
                break;
            case 'READ_RECEIPT':
                this.emit('readReceipt', message.payload);
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            this.emit('maxReconnectAttemptsReached', {});
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 30000);
        
        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
        
        setTimeout(() => {
            if (this.userId && this.accessToken) {
                this.connect(this.userId, this.accessToken);
            }
        }, delay);
    }

    // Message sending
    sendMessage(messageData: MessageCreateRequest) {
        if (!this.isConnected()) {
            throw new Error('WebSocket is not connected');
        }

        const wsMessage: WebSocketMessage = {
            type: 'MESSAGE',
            payload: messageData,
            timestamp: new Date().toISOString(),
        };

        this.ws!.send(JSON.stringify(wsMessage));
    }

    // Typing indicators
    sendTypingIndicator(conversationId: string, isTyping: boolean) {
        if (!this.isConnected()) {
            return;
        }

        const typingData: TypingIndicator = {
            userId: this.userId!,
            conversationId,
            isTyping,
            timestamp: new Date().toISOString(),
        };

        const wsMessage: WebSocketMessage = {
            type: 'TYPING',
            payload: typingData,
            timestamp: new Date().toISOString(),
        };

        this.ws!.send(JSON.stringify(wsMessage));
    }

    // Read receipts
    sendReadReceipt(messageId: string) {
        if (!this.isConnected()) {
            return;
        }

        const wsMessage: WebSocketMessage = {
            type: 'READ_RECEIPT',
            payload: { messageId, userId: this.userId },
            timestamp: new Date().toISOString(),
        };

        this.ws!.send(JSON.stringify(wsMessage));
    }

    // Online status
    updateOnlineStatus(isOnline: boolean) {
        if (!this.isConnected()) {
            return;
        }

        const statusData: OnlineStatus = {
            userId: this.userId!,
            isOnline,
            lastSeen: new Date().toISOString(),
        };

        const wsMessage: WebSocketMessage = {
            type: 'ONLINE_STATUS',
            payload: statusData,
            timestamp: new Date().toISOString(),
        };

        this.ws!.send(JSON.stringify(wsMessage));
    }

    // Event listener management
    on(event: string, callback: WebSocketEventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    off(event: string, callback: WebSocketEventCallback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    private emit(event: string, data: any) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in WebSocket event listener for ${event}:`, error);
                }
            });
        }
    }

    // Utility methods
    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    disconnect() {
        if (this.ws) {
            this.ws.close(1000, 'User disconnected');
            this.ws = null;
        }
        this.listeners.clear();
        this.userId = null;
        this.accessToken = null;
        this.reconnectAttempts = 0;
    }

    getConnectionState(): string {
        if (!this.ws) return 'CLOSED';
        
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING';
            case WebSocket.OPEN:
                return 'OPEN';
            case WebSocket.CLOSING:
                return 'CLOSING';
            case WebSocket.CLOSED:
                return 'CLOSED';
            default:
                return 'UNKNOWN';
        }
    }
}

// Singleton instance
export const webSocketService = new WebSocketService();
