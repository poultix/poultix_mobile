import { useChat } from "@/contexts/ChatContext";
import { Message, User, MessageStatus, MessageType } from "@/types";

export const useChatActions = () => {
    const {
        messages,
        addMessage,
        updateMessage,
        deleteMessage
    } = useChat();

    const sendMessage = async (content: string, receiver: User, sender: User, type: MessageType = MessageType.TEXT) => {
        const message: Message = {
            id: Date.now().toString(),
            sender,
            receiver,
            content,
            type,
            timestamp: new Date().toISOString(),
            edited: false,
            status: MessageStatus.SENDING,
            fileName: '',
            reactions: [],
            replyTo: null as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add message immediately
        addMessage(message);

        // Simulate message processing (you can add real API calls here)
        console.log('Message sent:', message);
    };

    const editMessage = async (messageId: string, newContent: string) => {
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

    const removeMessage = async (messageId: string) => {
        deleteMessage(messageId);
    };

    const markMessagesAsRead = (messageId: string) => {
        // This would typically update message read status
        // For now, just log the action
        console.log('Marking message as read:', messageId);
    };

    const setTyping = (chatId: string, userId: string, userName: string, isTyping: boolean) => {
        // This would typically update typing status
        // The ChatContext already handles typing simulation
        console.log(`${userName} is ${isTyping ? 'typing' : 'not typing'} in chat ${chatId}`);
    };

    const addReaction = (messageId: string, userId: string, emoji: string) => {
        const existingMessage = messages.find(m => m.id === messageId);
        if (existingMessage) {
            const reactions = existingMessage.reactions || [];
            
            const existingReactionIndex = reactions.findIndex(r => r.userId === userId && r.emoji === emoji);
            let updatedReactions;
            if (existingReactionIndex >= 0) {
                // Update existing reaction
                updatedReactions = reactions.map(r => 
                    r.userId === userId ? { ...r, emoji } : r
                );
            } else {
                // Add new reaction
                updatedReactions = [...existingMessage.reactions, { userId, emoji }];
            }

            const updatedMessage: Message = {
                ...existingMessage,
                reactions: updatedReactions
            };
            updateMessage(updatedMessage);
        }
    };

    const removeReaction = (messageId: string, userId: string, emoji: string) => {
        const existingMessage = messages.find(m => m.id === messageId);
        if (existingMessage && existingMessage.reactions) {
            const updatedReactions = existingMessage.reactions.filter(r => r.userId !== userId || r.emoji !== emoji);
            const updatedMessage: Message = {
                ...existingMessage,
                reactions: updatedReactions
            };
            updateMessage(updatedMessage);
        }
    };

    const forwardMessage = async (messageId: string, targetUsers: User[], sender: User) => {
        const messageToForward = messages.find(m => m.id === messageId);
        if (messageToForward) {
            targetUsers.forEach(targetUser => {
                const forwardedMessage: Message = {
                    id: `${Date.now()}_${Math.random()}`,
                    sender,
                    receiver: targetUser,
                    content: messageToForward.content,
                    type: messageToForward.type,
                    timestamp: new Date().toISOString(),
                    edited: false,
                    status: MessageStatus.SENDING,
                    fileName: '',
                    reactions: [],
                    replyTo: null as any,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                addMessage(forwardedMessage);
            });
        }
    };

    const searchMessages = (query: string) => {
        return messages.filter((msg: Message) =>
            msg.content.toLowerCase().includes(query.toLowerCase())
        );
    };

    const replyToMessage = async (originalMessage: Message, replyContent: string, sender: User) => {
        const replyMessage: Message = {
            id: Date.now().toString(),
            sender,
            receiver: originalMessage.sender,
            content: replyContent,
            type: MessageType.TEXT,
            timestamp: new Date().toISOString(),
            edited: false,
            status: MessageStatus.SENDING,
            fileName: '',
            reactions: [],
            replyTo: originalMessage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        addMessage(replyMessage);
    };

    const createGroupChat = (name: string, participants: User[], userId: string) => {
        // This would create a group chat - placeholder implementation
        console.log(`Creating group chat "${name}" with ${participants.length} participants by user ${userId}`);
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
        createGroupChat,
    };
}
