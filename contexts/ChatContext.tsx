import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MockDataService } from '@/services/mockData';

// Types
export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    content: string;
    type: 'text' | 'image' | 'voice' | 'file';
    timestamp: Date;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    replyTo?: string;
    reactions?: { [userId: string]: string };
    isEdited?: boolean;
    isDeleted?: boolean;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    voiceDuration?: number;
}

export interface Chat {
    id: string;
    type: 'individual' | 'group';
    name?: string;
    participants: string[];
    participantNames: { [userId: string]: string };
    lastMessage?: Message;
    lastActivity: Date;
    unreadCount: number;
    isTyping: { [userId: string]: boolean };
    isOnline: { [userId: string]: boolean };
    avatar?: string;
    description?: string;
    createdBy?: string;
    createdAt: Date;
}

export interface TypingStatus {
    chatId: string;
    userId: string;
    userName: string;
    isTyping: boolean;
}

interface ChatState {
    chats: Chat[];
    messages: { [chatId: string]: Message[] };
    currentChatId: string | null;
    typingStatuses: TypingStatus[];
    onlineUsers: string[];
    isLoading: boolean;
    error: string | null;
    unreadTotal: number;
}

type ChatAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_CHATS'; payload: Chat[] }
    | { type: 'SET_MESSAGES'; payload: { chatId: string; messages: Message[] } }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'UPDATE_MESSAGE'; payload: { messageId: string; updates: Partial<Message> } }
    | { type: 'DELETE_MESSAGE'; payload: { chatId: string; messageId: string } }
    | { type: 'SET_CURRENT_CHAT'; payload: string | null }
    | { type: 'SET_TYPING'; payload: TypingStatus }
    | { type: 'CLEAR_TYPING'; payload: { chatId: string; userId: string } }
    | { type: 'SET_ONLINE_USERS'; payload: string[] }
    | { type: 'UPDATE_CHAT'; payload: { chatId: string; updates: Partial<Chat> } }
    | { type: 'MARK_MESSAGES_READ'; payload: { chatId: string; userId: string } }
    | { type: 'ADD_REACTION'; payload: { messageId: string; userId: string; reaction: string } }
    | { type: 'REMOVE_REACTION'; payload: { messageId: string; userId: string } };

const initialState: ChatState = {
    chats: [],
    messages: {},
    currentChatId: null,
    typingStatuses: [],
    onlineUsers: [],
    isLoading: false,
    error: null,
    unreadTotal: 0,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        
        case 'SET_CHATS':
            const unreadTotal = action.payload.reduce((sum, chat) => sum + chat.unreadCount, 0);
            return { ...state, chats: action.payload, unreadTotal };
        
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [action.payload.chatId]: action.payload.messages,
                },
            };
        
        case 'ADD_MESSAGE':
            const chatMessages = state.messages[action.payload.chatId] || [];
            const updatedChats = state.chats.map(chat => {
                if (chat.id === action.payload.chatId) {
                    return {
                        ...chat,
                        lastMessage: action.payload,
                        lastActivity: action.payload.timestamp,
                        unreadCount: action.payload.senderId === state.currentChatId ? chat.unreadCount : chat.unreadCount + 1,
                    };
                }
                return chat;
            });
            
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [action.payload.chatId]: [...chatMessages, action.payload],
                },
                chats: updatedChats,
            };
        
        case 'UPDATE_MESSAGE':
            const messagesCopy = { ...state.messages };
            Object.keys(messagesCopy).forEach(chatId => {
                messagesCopy[chatId] = messagesCopy[chatId].map(msg =>
                    msg.id === action.payload.messageId
                        ? { ...msg, ...action.payload.updates }
                        : msg
                );
            });
            return { ...state, messages: messagesCopy };
        
        case 'DELETE_MESSAGE':
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [action.payload.chatId]: state.messages[action.payload.chatId]?.filter(
                        msg => msg.id !== action.payload.messageId
                    ) || [],
                },
            };
        
        case 'SET_CURRENT_CHAT':
            return { ...state, currentChatId: action.payload };
        
        case 'SET_TYPING':
            const existingTypingIndex = state.typingStatuses.findIndex(
                t => t.chatId === action.payload.chatId && t.userId === action.payload.userId
            );
            
            let newTypingStatuses;
            if (existingTypingIndex >= 0) {
                newTypingStatuses = [...state.typingStatuses];
                newTypingStatuses[existingTypingIndex] = action.payload;
            } else {
                newTypingStatuses = [...state.typingStatuses, action.payload];
            }
            
            return { ...state, typingStatuses: newTypingStatuses };
        
        case 'CLEAR_TYPING':
            return {
                ...state,
                typingStatuses: state.typingStatuses.filter(
                    t => !(t.chatId === action.payload.chatId && t.userId === action.payload.userId)
                ),
            };
        
        case 'SET_ONLINE_USERS':
            return { ...state, onlineUsers: action.payload };
        
        case 'UPDATE_CHAT':
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? { ...chat, ...action.payload.updates }
                        : chat
                ),
            };
        
        case 'MARK_MESSAGES_READ':
            const updatedMessages = { ...state.messages };
            if (updatedMessages[action.payload.chatId]) {
                updatedMessages[action.payload.chatId] = updatedMessages[action.payload.chatId].map(msg => ({
                    ...msg,
                    status: msg.senderId !== action.payload.userId ? 'read' : msg.status,
                }));
            }
            
            const updatedChatsForRead = state.chats.map(chat =>
                chat.id === action.payload.chatId
                    ? { ...chat, unreadCount: 0 }
                    : chat
            );
            
            return {
                ...state,
                messages: updatedMessages,
                chats: updatedChatsForRead,
                unreadTotal: updatedChatsForRead.reduce((sum, chat) => sum + chat.unreadCount, 0),
            };
        
        case 'ADD_REACTION':
            const messagesWithReaction = { ...state.messages };
            Object.keys(messagesWithReaction).forEach(chatId => {
                messagesWithReaction[chatId] = messagesWithReaction[chatId].map(msg => {
                    if (msg.id === action.payload.messageId) {
                        const reactions = { ...msg.reactions };
                        reactions[action.payload.userId] = action.payload.reaction;
                        return { ...msg, reactions };
                    }
                    return msg;
                });
            });
            return { ...state, messages: messagesWithReaction };
        
        case 'REMOVE_REACTION':
            const messagesWithoutReaction = { ...state.messages };
            Object.keys(messagesWithoutReaction).forEach(chatId => {
                messagesWithoutReaction[chatId] = messagesWithoutReaction[chatId].map(msg => {
                    if (msg.id === action.payload.messageId) {
                        const reactions = { ...msg.reactions };
                        delete reactions[action.payload.userId];
                        return { ...msg, reactions };
                    }
                    return msg;
                });
            });
            return { ...state, messages: messagesWithoutReaction };
        
        default:
            return state;
    }
}

// Context
const ChatContext = createContext<ChatState | undefined>(undefined);
const ChatDispatchContext = createContext<React.Dispatch<ChatAction> | undefined>(undefined);

// Provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    // Load initial data
    useEffect(() => {
        loadChats();
        loadOnlineUsers();
        
        // Simulate real-time updates
        const interval = setInterval(() => {
            updateOnlineUsers();
            simulateTypingIndicators();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const loadChats = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            // Mock chats data
            const mockChats: Chat[] = [
                {
                    id: 'chat_farmer_vet',
                    type: 'individual',
                    participants: ['farmer_001', 'vet_001'],
                    participantNames: {
                        'farmer_001': 'John Uwimana',
                        'vet_001': 'Dr. Patricia Uwimana'
                    },
                    lastActivity: new Date('2024-06-27T10:30:00'),
                    unreadCount: 2,
                    isTyping: {},
                    isOnline: { 'farmer_001': true, 'vet_001': true },
                    createdAt: new Date('2024-06-25T09:00:00')
                },
                {
                    id: 'group_poultry_experts',
                    type: 'group',
                    name: 'Poultry Experts',
                    participants: ['farmer_001', 'vet_001', 'admin_001'],
                    participantNames: {
                        'farmer_001': 'John Uwimana',
                        'vet_001': 'Dr. Patricia Uwimana',
                        'admin_001': 'Admin User'
                    },
                    lastActivity: new Date('2024-06-27T14:15:00'),
                    unreadCount: 0,
                    isTyping: {},
                    isOnline: { 'farmer_001': true, 'vet_001': true, 'admin_001': false },
                    description: 'Group for discussing poultry health and farming techniques',
                    createdBy: 'admin_001',
                    createdAt: new Date('2024-06-20T08:00:00')
                }
            ];

            dispatch({ type: 'SET_CHATS', payload: mockChats });
            
            // Load messages for each chat
            for (const chat of mockChats) {
                await loadMessages(chat.id);
            }
            
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load chats' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const loadMessages = async (chatId: string) => {
        try {
            // Mock messages data
            const mockMessages: Message[] = [
                {
                    id: 'msg_001',
                    chatId,
                    senderId: 'farmer_001',
                    senderName: 'John Uwimana',
                    content: 'Hello Dr. Patricia, I have some chickens showing respiratory symptoms.',
                    type: 'text',
                    timestamp: new Date('2024-06-27T10:00:00'),
                    status: 'read'
                },
                {
                    id: 'msg_002',
                    chatId,
                    senderId: 'vet_001',
                    senderName: 'Dr. Patricia Uwimana',
                    content: 'Hi John! Can you describe the symptoms in more detail?',
                    type: 'text',
                    timestamp: new Date('2024-06-27T10:05:00'),
                    status: 'read'
                },
                {
                    id: 'msg_003',
                    chatId,
                    senderId: 'farmer_001',
                    senderName: 'John Uwimana',
                    content: 'They have difficulty breathing and some nasal discharge.',
                    type: 'text',
                    timestamp: new Date('2024-06-27T10:10:00'),
                    status: 'delivered'
                }
            ];

            dispatch({ type: 'SET_MESSAGES', payload: { chatId, messages: mockMessages } });
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const loadOnlineUsers = async () => {
        // Mock online users
        const onlineUsers = ['farmer_001', 'vet_001'];
        dispatch({ type: 'SET_ONLINE_USERS', payload: onlineUsers });
    };

    const updateOnlineUsers = () => {
        // Simulate online status changes
        const allUsers = ['farmer_001', 'vet_001', 'admin_001'];
        const onlineUsers = allUsers.filter(() => Math.random() > 0.3);
        dispatch({ type: 'SET_ONLINE_USERS', payload: onlineUsers });
    };

    const simulateTypingIndicators = () => {
        // Randomly show typing indicators
        if (Math.random() > 0.8) {
            const users = ['farmer_001', 'vet_001', 'admin_001'];
            const chats = ['chat_farmer_vet', 'group_poultry_experts'];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomChat = chats[Math.floor(Math.random() * chats.length)];
            
            dispatch({
                type: 'SET_TYPING',
                payload: {
                    chatId: randomChat,
                    userId: randomUser,
                    userName: randomUser === 'farmer_001' ? 'John' : randomUser === 'vet_001' ? 'Dr. Patricia' : 'Admin',
                    isTyping: true
                }
            });

            // Clear typing after 3 seconds
            setTimeout(() => {
                dispatch({
                    type: 'CLEAR_TYPING',
                    payload: { chatId: randomChat, userId: randomUser }
                });
            }, 3000);
        }
    };

    return (
        <ChatContext.Provider value={state}>
            <ChatDispatchContext.Provider value={dispatch}>
                {children}
            </ChatDispatchContext.Provider>
        </ChatContext.Provider>
    );
}

// Hooks
export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}

export function useChatActions() {
    const dispatch = useContext(ChatDispatchContext);
    const state = useContext(ChatContext);
    
    if (dispatch === undefined || state === undefined) {
        throw new Error('useChatActions must be used within a ChatProvider');
    }

    const sendMessage = async (chatId: string, content: string, type: Message['type'] = 'text', replyTo?: string, currentUser?: any) => {
        const message: Message = {
            id: `msg_${Date.now()}`,
            chatId,
            senderId: currentUser?.id || 'current_user',
            senderName: currentUser?.name || 'Current User',
            content,
            type,
            timestamp: new Date(),
            status: 'sending',
            replyTo
        };

        dispatch({ type: 'ADD_MESSAGE', payload: message });

        // Simulate sending delay
        setTimeout(() => {
            dispatch({
                type: 'UPDATE_MESSAGE',
                payload: { messageId: message.id, updates: { status: 'sent' } }
            });
        }, 1000);

        // Simulate delivery
        setTimeout(() => {
            dispatch({
                type: 'UPDATE_MESSAGE',
                payload: { messageId: message.id, updates: { status: 'delivered' } }
            });
        }, 2000);
    };

    const editMessage = async (messageId: string, newContent: string) => {
        dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
                messageId,
                updates: { content: newContent, isEdited: true }
            }
        });
    };

    const deleteMessage = async (chatId: string, messageId: string) => {
        dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
                messageId,
                updates: { isDeleted: true, content: 'This message was deleted' }
            }
        });
    };

    const markMessagesAsRead = (chatId: string, userId: string) => {
        dispatch({ type: 'MARK_MESSAGES_READ', payload: { chatId, userId } });
    };

    const setTyping = (chatId: string, userId: string, userName: string, isTyping: boolean) => {
        if (isTyping) {
            dispatch({
                type: 'SET_TYPING',
                payload: { chatId, userId, userName, isTyping }
            });
        } else {
            dispatch({
                type: 'CLEAR_TYPING',
                payload: { chatId, userId }
            });
        }
    };

    const addReaction = (messageId: string, userId: string, reaction: string) => {
        dispatch({
            type: 'ADD_REACTION',
            payload: { messageId, userId, reaction }
        });
    };

    const removeReaction = (messageId: string, userId: string) => {
        dispatch({
            type: 'REMOVE_REACTION',
            payload: { messageId, userId }
        });
    };

    const createIndividualChat = (chatId: string, participants: string[], participantNames: { [key: string]: string }) => {
        // Check if chat already exists
        const existingChat = state.chats.find(chat => chat.id === chatId);
        if (existingChat) {
            return existingChat;
        }

        const newChat: Chat = {
            id: chatId,
            type: 'individual',
            participants,
            participantNames,
            lastActivity: new Date(),
            unreadCount: 0,
            isTyping: {},
            isOnline: {},
            createdAt: new Date()
        };
        
        dispatch({ type: 'SET_CHATS', payload: [...state.chats, newChat] });
        dispatch({ type: 'SET_MESSAGES', payload: { chatId, messages: [] } });
        
        return newChat;
    };

    const createGroupChat = async (name: string, participants: string[], description?: string) => {
        const newChat: Chat = {
            id: `group_${Date.now()}`,
            type: 'group',
            name,
            participants,
            participantNames: {}, // This should be populated with actual user names
            lastActivity: new Date(),
            unreadCount: 0,
            isTyping: {},
            isOnline: {},
            description,
            createdBy: 'current_user',
            createdAt: new Date()
        };

        dispatch({ type: 'SET_CHATS', payload: [...state.chats, newChat] });
    };

    const forwardMessage = async (messageId: string, targetChatIds: string[]) => {
        // Implementation for forwarding messages
        console.log('Forwarding message', messageId, 'to chats', targetChatIds);
    };

    const searchMessages = (query: string, chatId?: string) => {
        const allMessages = chatId ? state.messages[chatId] || [] : Object.values(state.messages).flat();
        
        return allMessages.filter(msg =>
            msg.content.toLowerCase().includes(query.toLowerCase()) &&
            !msg.isDeleted
        );
    };

    return {
        sendMessage,
        editMessage,
        deleteMessage,
        markMessagesAsRead,
        setTyping,
        addReaction,
        removeReaction,
        createIndividualChat,
        createGroupChat,
        forwardMessage,
        searchMessages,
    };
}
