import { useChat } from "@/contexts/ChatContext";
import { Chat, Message } from "@/types";

export function useChatActions() {
    const {
        chats,
        currentChatId,
        messages,
        typingStatuses,
        onlineUsers,
        loading,
        error,
        unreadTotal,
        updateMessage,
        addMessage,
        deleteMessage
    } = useChat()


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


        // Simulate sending delay
        setTimeout(() => {
            updateMessage(message)
        }, 1000);

        // Simulate delivery
        setTimeout(() => {
            updateMessage({ ...message, status: 'delivered' })
        }, 2000);
    };

    const editMessage = async (messageId: string, newContent: string) => {
        updateMessage(messageId, newContent)
    };

    const removeMessage = async (chatId: string, messageId: string) => {
        deleteMessage(messageId)
    };

    const markMessagesAsRead = (chatId: string, userId: string) => {
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
    };

    const removeReaction = (messageId: string, userId: string) => {
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
