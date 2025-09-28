import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { MockDataService } from '@/services/mockData';
import { Chat, Message, TypingStatus } from '@/types';




interface ChatContextTye {
    chats: Chat[];
    messages: Message[];
    currentChatId: string | null;
    typingStatuses: TypingStatus[];
    onlineUsers: string[];
    loading: boolean;
    error: string | null;
    unreadTotal: number;
    addMessage: (data: Message) => void
    updateMessage: (data: Message) => void
    deleteMessage: (data: string) => void
}



// Context
const ChatContext = createContext<ChatContextTye | undefined>(undefined);

// Provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [chats, setChats] = useState<Chat[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [currentChatId, setCurrentChatId] = useState<string | null>(null)
    const [typingStatuses, setTypingStatuses] = useState<TypingStatus[]>([])
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [unreadTotal, setUnreadTotal] = useState(0)
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

            setChats(mockChats);

            // Load messages for each chat
            for (const chat of mockChats) {
                await loadMessages(chat.id);
            }

        } catch (error) {
        } finally {
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
            setMessages(mockMessages)
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const loadOnlineUsers = async () => {
        // Mock online users
        const onlineUsers = ['farmer_001', 'vet_001'];
        setOnlineUsers(onlineUsers)
    };

    const updateOnlineUsers = () => {
        // Simulate online status changes
        const allUsers = ['farmer_001', 'vet_001', 'admin_001'];
        const onlineUsers = allUsers.filter(() => Math.random() > 0.3);
        setOnlineUsers(onlineUsers)
    };

    const simulateTypingIndicators = () => {
        // Randomly show typing indicators
        if (Math.random() > 0.8) {
            const users = ['farmer_001', 'vet_001', 'admin_001'];
            const chats = ['chat_farmer_vet', 'group_poultry_experts'];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomChat = chats[Math.floor(Math.random() * chats.length)];


            const payload = {
                chatId: randomChat,
                userId: randomUser,
                userName: randomUser === 'farmer_001' ? 'John' : randomUser === 'vet_001' ? 'Dr. Patricia' : 'Admin',
                isTyping: true
            }

            const existingTypingIndex = typingStatuses.findIndex(
                t => t.chatId === randomChat && t.userId === randomUser
            );

            let newTypingStatuses = [];
            if (existingTypingIndex >= 0) {
                newTypingStatuses = typingStatuses;
                newTypingStatuses[existingTypingIndex] = payload;
            } else {
                newTypingStatuses = [...typingStatuses, payload];
            }

            setTypingStatuses(newTypingStatuses)


            // Clear typing after 3 seconds
            setTimeout(() => {
                setTypingStatuses((prev) => prev.filter(
                    t => !(t.chatId === payload.chatId && t.userId === payload.userId)
                ))
            }, 3000);
        }
    };

    const addMessage = (data: Message) => {
        const chatMessages = messages[data.chatId] || [];
        const updatedChats = chats.map(chat => {
            if (chat.id === data.chatId) {
                return {
                    ...chat,
                    lastMessage: data,
                    lastActivity: data.timestamp,
                    unreadCount: data.senderId === currentChatId ? chat.unreadCount : chat.unreadCount + 1,
                };
            }
            return chat;
        });

        setMessages(prev => {
            return {
                ...prev,
                [data.chatId]: [...chatMessages, data],
            }
        })

        setChats(updatedChats)
    }

    const updateMessage = (data: Message) => {
        setMessages((prev) => {
            const message = prev.filter(m => m.id === data.id)[0]
            const newMessage = { ...message, ...data }
            if (message) return [...prev, newMessage]
            return prev
        })
    }

    const deleteMessage = (data: string) => {
        setMessages((prev) => prev.filter(m => m.id !== data))
    }

    const updateChat = (chat: Chat) => {
        chats.map(chat =>
            chat.id === chat.chatId
                ? { ...chat, ...action.payload.updates }
                : chat)
    }

    const returnValues: ChatContextTye = {
        chats,
        currentChatId,
        messages,
        typingStatuses,
        onlineUsers,
        loading,
        error,
        unreadTotal,
        addMessage,
        updateMessage,
        deleteMessage
    }

    return (
        <ChatContext.Provider value={returnValues}>

            {children}

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
