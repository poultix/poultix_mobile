import { MockDataService } from '@/services/mockData';

// Message interface (based on mockData structure)
export interface Message {
  id: string;
  farmerId: string;
  veterinaryId: string;
  farmerName: string;
  veterinaryName: string;
  message: string;
  timestamp: Date;
  isFromFarmer: boolean;
  isRead: boolean;
}

export interface MessageActionsType {
  loadMessages: (userId: string, userRole: string) => Promise<Message[]>;
  sendMessage: (fromId: string, toId: string, message: string, isFromFarmer: boolean) => Promise<Message>;
  markAsRead: (messages: Message[], messageId: string) => Message[];
  deleteMessage: (messages: Message[], messageId: string) => Message[];
  getMessageById: (messages: Message[], id: string) => Message | undefined;
  getMessagesByUser: (messages: Message[], userId: string, isFromFarmer: boolean) => Message[];
  getUnreadMessages: (messages: Message[], userId: string, isFromFarmer: boolean) => Message[];
  refreshMessages: (userId: string, userRole: string) => Promise<Message[]>;
}

export const useMessageActions = (): MessageActionsType => {
  const loadMessages = async (userId: string, userRole: string): Promise<Message[]> => {
    return await MockDataService.getMessages(userId, userRole);
  };

  const sendMessage = async (fromId: string, toId: string, message: string, isFromFarmer: boolean): Promise<Message> => {
    await MockDataService.sendMessage(fromId, toId, message, isFromFarmer);
    
    // Return the new message object
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      farmerId: isFromFarmer ? fromId : toId,
      veterinaryId: isFromFarmer ? toId : fromId,
      farmerName: isFromFarmer ? 'Current Farmer' : 'Other Farmer',
      veterinaryName: isFromFarmer ? 'Current Vet' : 'Other Vet',
      message,
      timestamp: new Date(),
      isFromFarmer,
      isRead: false
    };
    
    return newMessage;
  };

  const markAsRead = (messages: Message[], messageId: string): Message[] => {
    return messages.map(message => 
      message.id === messageId ? { ...message, isRead: true } : message
    );
  };

  const deleteMessage = (messages: Message[], messageId: string): Message[] => {
    return messages.filter(message => message.id !== messageId);
  };

  const getMessageById = (messages: Message[], id: string): Message | undefined => {
    return messages.find(message => message.id === id);
  };

  const getMessagesByUser = (messages: Message[], userId: string, isFromFarmer: boolean): Message[] => {
    if (isFromFarmer) {
      return messages.filter(message => message.farmerId === userId);
    } else {
      return messages.filter(message => message.veterinaryId === userId);
    }
  };

  const getUnreadMessages = (messages: Message[], userId: string, isFromFarmer: boolean): Message[] => {
    return getMessagesByUser(messages, userId, isFromFarmer).filter(message => !message.isRead);
  };

  const refreshMessages = async (userId: string, userRole: string): Promise<Message[]> => {
    return await loadMessages(userId, userRole);
  };

  return {
    loadMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    getMessageById,
    getMessagesByUser,
    getUnreadMessages,
    refreshMessages,
  };
};
