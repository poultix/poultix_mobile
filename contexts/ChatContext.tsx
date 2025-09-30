import React, { createContext, useContext, useEffect, useState } from 'react'
import { Message, TypingStatus, User } from '@/types'




interface ChatContextTye {
    messages: Message[]
    currentChat: User | null
    currentMessage: Message | null
    typingStatuses: TypingStatus[]
    onlineUsers: Set<string>
    loading: boolean
    error: string | null
    unreadTotal: number
    addMessage: (data: Message) => void
    updateMessage: (data: Message) => void
    deleteMessage: (data: number) => void
    setCurrentChat: (user: User | null) => void
    setCurrentMessage: (message: Message | null) => void
}





// Context
const ChatContext = createContext<ChatContextTye | undefined>(undefined)

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
        // Mock online users
        const onlineUsers: Set<string> = new Set(['farmer_001', 'vet_001'])
        setOnlineUsers(onlineUsers)
    }

    const updateOnlineUsers = () => {
        // Simulate online status changes
        const allUsers = ['farmer_001', 'vet_001', 'admin_001']
        const onlineUsers = allUsers.filter(() => Math.random() > 0.3)
        setOnlineUsers(new Set(onlineUsers))
    }

    const simulateTypingIndicators = () => {
        // Randomly show typing indicators
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

    const deleteMessage = (data: number) => {
        setMessages((prev) => prev.filter(m => m.id !== data))
    }



    const returnValues: ChatContextTye = {
        currentMessage,
        currentChat,
        messages,
        typingStatuses,
        onlineUsers,
        loading,
        error,
        unreadTotal,
        addMessage,
        updateMessage,
        deleteMessage,
        setCurrentChat,
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
