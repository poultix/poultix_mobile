import { useChat } from "@/contexts/ChatContext";
import { Message, User, MessageStatus, MessageType } from "@/types";

export function useChatActions() {
    const {
        messages,
        currentChat,
        typingStatuses,
        onlineUsers,
        loading,
        error,
        unreadTotal,
        addMessage,
        updateMessage,
        deleteMessage
    } = useChat();

    const sendMessage = async (content: string, receiver: User, sender: User, type: MessageType = MessageType.TEXT) => {
        const message: Message = {
            id: Date.now(),
            sender,
            receiver,
            content,
            type,
            timestamp: new Date().toISOString(),
            edited: false,
            status: MessageStatus.SENDING
        };

        // Add message immediately
        addMessage(message);

        // Simulate message processing (you can add real API calls here)
        console.log('Message sent:', message);
    };

    const editMessage = async (messageId: number, newContent: string) => {
        const existingMessage = messages.find(m => m.id === messageId);
        if (existingMessage) {
            const updatedMessage: Message = {
                ...existingMessage,
                content: newContent,
                edited: true
            };
            updateMessage(updatedMessage);
        }
    };

    const removeMessage = async (messageId: number) => {
        deleteMessage(messageId);
    };

    const markMessagesAsRead = (messageId: number) => {
        // This would typically update message read status
        // For now, just log the action
        console.log('Marking message as read:', messageId);
    };

    const setTyping = (chatId: string, userId: string, userName: string, isTyping: boolean) => {
        // This would typically update typing status
        // The ChatContext already handles typing simulation
        console.log(`${userName} is ${isTyping ? 'typing' : 'not typing'} in chat ${chatId}`);
    };

    const addReaction = (messageId: number, userId: number, emoji: string) => {
        const existingMessage = messages.find(m => m.id === messageId);
        if (existingMessage) {
            const reactions = existingMessage.reactions || [];
            const existingReactionIndex = reactions.findIndex(r => r.userId === userId);
            
            let updatedReactions;
            if (existingReactionIndex >= 0) {
                // Update existing reaction
                updatedReactions = reactions.map(r => 
                    r.userId === userId ? { ...r, emoji } : r
                );
            } else {
                // Add new reaction
                updatedReactions = [...reactions, { userId, emoji }];
            }

            const updatedMessage: Message = {
                ...existingMessage,
                reactions: updatedReactions
            };
            updateMessage(updatedMessage);
        }
    };

    const removeReaction = (messageId: number, userId: number) => {
        const existingMessage = messages.find(m => m.id === messageId);
        if (existingMessage && existingMessage.reactions) {
            const updatedReactions = existingMessage.reactions.filter(r => r.userId !== userId);
            const updatedMessage: Message = {
                ...existingMessage,
                reactions: updatedReactions
            };
            updateMessage(updatedMessage);
        }
    };

    const forwardMessage = async (messageId: number, targetUsers: User[], sender: User) => {
        const messageToForward = messages.find(m => m.id === messageId);
        if (messageToForward) {
            targetUsers.forEach(targetUser => {
                const forwardedMessage: Message = {
                    id: Date.now() + Math.random(), // Ensure unique ID
                    sender,
                    receiver: targetUser,
                    content: messageToForward.content,
                    type: messageToForward.type,
                    timestamp: new Date().toISOString(),
                    edited: false,
                    status: MessageStatus.SENDING
                };
                addMessage(forwardedMessage);
            });
        }
    };

    const searchMessages = (query: string) => {
        return messages.filter(msg =>
            msg.content.toLowerCase().includes(query.toLowerCase())
        );
    };

    const replyToMessage = async (originalMessage: Message, replyContent: string, sender: User) => {
        const replyMessage: Message = {
            id: Date.now(),
            sender,
            receiver: originalMessage.sender,
            content: replyContent,
            type: MessageType.TEXT,
            timestamp: new Date().toISOString(),
            edited: false,
            status: MessageStatus.SENDING,
            replyTo: originalMessage
        };

        addMessage(replyMessage);
    };

    return {
        sendMessage,
        editMessage,
        removeMessage,
        markMessagesAsRead,
        setTyping,
        addReaction,
        removeReaction,
        forwardMessage,
        searchMessages,
        replyToMessage,
    };
}
