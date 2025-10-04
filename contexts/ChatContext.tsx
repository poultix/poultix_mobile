import React, { createContext, useContext, useEffect, useState } from 'react'
import { Message, TypingStatus, User,MessageCreateRequest} from '@/types'
import { messageService } from '@/services/api'




interface ChatContextType {
    messages: Message[]
    currentChat: User | null
    editMessage: Message | null
    currentMessage: Message | null
    typingStatuses: TypingStatus[]
    onlineUsers: Set<string>
    loading: boolean
    error: string | null
    unreadTotal: number
    // API methods
    sendMessage: (receiverId: string, content: string, messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE') => Promise<void>
    getConversation: (user1Id: string, user2Id: string) => Promise<void>
    getMessagesBySender: (senderId: string) => Promise<void>
    deleteMessage: (messageId: string) => Promise<void>
    // UI state methods
    addMessage: (data: Message) => void
    updateMessage: (data: Message) => void
    setCurrentChat: (user: User | null) => void
    setCurrentMessage: (message: Message | null) => void
    setEditMessage: (message: Message | null) => void
}





// Context
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [currentChat, setCurrentChat] = useState<User | null>(null)
    const [typingStatuses, setTypingStatuses] = useState<TypingStatus[]>([])
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [unreadTotal, setUnreadTotal] = useState(0)
    const [currentMessage, setCurrentMessage] = useState<Message | null>(null)
    const [editMessage, setEditMessage] = useState<Message | null>(null)
    // Load initial data
    useEffect(() => {
        loadOnlineUsers()

        // Simulate real-time updates
        const interval = setInterval(() => {
            updateOnlineUsers()
            simulateTypingIndicators()
        }, 3000)

        return () => clearInterval(interval)
    }, [])


    const loadOnlineUsers = async () => {
        // TODO: Replace with real API call for online users
        const onlineUsers: Set<string> = new Set(['farmer_001', 'vet_001'])
        setOnlineUsers(onlineUsers)
    }

    const updateOnlineUsers = () => {
        // TODO: Replace with real-time online status from WebSocket/API
        const allUsers = ['farmer_001', 'vet_001', 'admin_001']
        const onlineUsers = allUsers.filter(() => Math.random() > 0.3)
        setOnlineUsers(new Set(onlineUsers))
    }

    const simulateTypingIndicators = () => {
        // TODO: Replace with real-time typing indicators from WebSocket
        if (Math.random() > 0.8) {
            const users = ['farmer_001', 'vet_001', 'admin_001']
            const chats = ['chat_farmer_vet', 'group_poultry_experts']
            const randomUser = users[Math.floor(Math.random() * users.length)]
            const randomChat = chats[Math.floor(Math.random() * chats.length)]

            const payload = {
                chatId: randomChat,
                userId: randomUser,
                userName: randomUser === 'farmer_001' ? 'John' : randomUser === 'vet_001' ? 'Dr. Patricia' : 'Admin',
                isTyping: true
            }

            const existingTypingIndex = typingStatuses.findIndex(
                t => t.chatId === randomChat && t.userId === randomUser
            )

            let newTypingStatuses = []
            if (existingTypingIndex >= 0) {
                newTypingStatuses = typingStatuses
                newTypingStatuses[existingTypingIndex] = payload
            } else {
                newTypingStatuses = [...typingStatuses, payload]
            }

            setTypingStatuses(newTypingStatuses)

            // Clear typing after 3 seconds
            setTimeout(() => {
                setTypingStatuses((prev) => prev.filter(
                    t => !(t.chatId === payload.chatId && t.userId === payload.userId)
                ))
            }, 3000)
        }
    }

    // API Methods
    const sendMessage = async (receiverId: string, content: string, messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' = 'TEXT'): Promise<void> => {
        try {
            setLoading(true)
            setError(null)
            
            const messageData: MessageCreateRequest = {
                receiverId,
                content,
                messageType,
            }
            
            const response = await messageService.sendMessage(messageData)
            
            if (response.success && response.data) {
                // Convert API response to our Message format
                const newMessage=response.data
                
                // Add to local state
                addMessage(newMessage)
            } else {
                throw new Error(response.message || 'Failed to send message')
            }
        } catch (error: any) {
            console.error('Failed to send message:', error)
            setError(error.message || 'Failed to send message')
            throw error
        } finally {
            setLoading(false)
        }
    }
    
    const getConversation = async (user1Id: string, user2Id: string): Promise<void> => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await messageService.getConversation(user1Id, user2Id)
            
            if (response.success && response.data) {
                // Convert API messages to our Message format
                const conversationMessages: Message[] = response.data
                
                setMessages(conversationMessages)
            } else {
                throw new Error(response.message || 'Failed to load conversation')
            }
        } catch (error: any) {
            console.error('Failed to load conversation:', error)
            setError(error.message || 'Failed to load conversation')
        } finally {
            setLoading(false)
        }
    }
    
    const getMessagesBySender = async (senderId: string): Promise<void> => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await messageService.getMessagesBySender(senderId)
            
            if (response.success && response.data) {
                // Convert and set messages
                const senderMessages: Message[] = response.data
                
                setMessages(senderMessages)
            } else {
                throw new Error(response.message || 'Failed to load messages')
            }
        } catch (error: any) {
            console.error('Failed to load messages by sender:', error)
            setError(error.message || 'Failed to load messages')
        } finally {
            setLoading(false)
        }
    }
    
    const deleteMessage = async (messageId: string): Promise<void> => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await messageService.deleteMessage(messageId)
            
            if (response.success) {
                // Remove from local state
                setMessages(prev => prev.filter(m => m.id !== messageId))
            } else {
                throw new Error(response.message || 'Failed to delete message')
            }
        } catch (error: any) {
            console.error('Failed to delete message:', error)
            setError(error.message || 'Failed to delete message')
            throw error
        } finally {
            setLoading(false)
        }
    }

    // UI State Methods (keep existing functionality)
    const addMessage = (data: Message) => {
        setMessages(prevMessages => {
            if (data.sender.id === currentChat?.id) {
                return prevMessages.map(m =>
                    m.content === data.content &&
                        m.sender.id === data.sender.id &&
                        m.receiver.id === data.receiver.id
                        ? { ...m, id: data.id }
                        : m
                )
            }
            const messageExists = prevMessages.some(m => m.id === data.id)
            if (messageExists) {
                return prevMessages
            }
            return [...prevMessages, data]
        })
    }

    const updateMessage = (data: Message) => {
        setMessages((prev) => {
            const message = prev.filter(m => m.id === data.id)[0]
            const newMessage = { ...message, ...data }
            if (message) return [...prev, newMessage]
            return prev
        })
    }



    const returnValues: ChatContextType = {
        editMessage,
        currentMessage,
        currentChat,
        messages,
        typingStatuses,
        onlineUsers,
        loading,
        error,
        unreadTotal,
        // API methods
        sendMessage,
        getConversation,
        getMessagesBySender,
        deleteMessage,
        // UI state methods
        addMessage,
        updateMessage,
        setCurrentChat,
        setEditMessage,
        setCurrentMessage
    }

    return (
        <ChatContext.Provider value={returnValues}>

            {children}

        </ChatContext.Provider>
    )
}

// Hooks
export function useChat() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}
