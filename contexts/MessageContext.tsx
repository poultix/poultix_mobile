import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MockDataService } from '@/services/mockData';

// Message interface (based on mockData structure)
interface Message {
    id: string;
    farmerId: string;
    veterinaryId: string;
    farmerName: string;
    veterinaryName: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
}

// Message state interface
interface MessageState {
    messages: Message[];
    currentMessage: Message | null;
    isLoading: boolean;
    error: string | null;
}

// Message actions
type MessageAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_MESSAGES'; payload: Message[] }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'UPDATE_MESSAGE'; payload: Message }
    | { type: 'DELETE_MESSAGE'; payload: string }
    | { type: 'MARK_AS_READ'; payload: string }
    | { type: 'SET_CURRENT_MESSAGE'; payload: Message | null };

// Context types
interface MessageContextType {
    state: MessageState;
    messages: Message[];
    currentMessage: Message | null;
    isLoading: boolean;
    error: string | null;
    // CRUD functions for hooks to call
    setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
    addMessage: (message: Message) => void;
    editMessage: (message: Message) => void;
    deleteMessage: (id: string) => void;
    markAsRead: (id: string) => void;
    setCurrentMessage: (message: Message | null) => void;
    refreshMessages: (userId: string, userRole: string) => Promise<void>;
}

// Initial state
const initialState: MessageState = {
    messages: [],
    currentMessage: null,
    isLoading: false,
    error: null,
};

// Reducer
const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_MESSAGES':
            return { ...state, messages: action.payload, isLoading: false, error: null };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'UPDATE_MESSAGE':
            return {
                ...state,
                messages: state.messages.map(message =>
                    message.id === action.payload.id ? action.payload : message
                )
            };
        case 'DELETE_MESSAGE':
            return {
                ...state,
                messages: state.messages.filter(message => message.id !== action.payload)
            };
        case 'MARK_AS_READ':
            return {
                ...state,
                messages: state.messages.map(message =>
                    message.id === action.payload ? { ...message, isRead: true } : message
                )
            };
        case 'SET_CURRENT_MESSAGE':
            return {
                ...state,
                currentMessage: action.payload
            };
        default:
            return state;
    }
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Provider component
export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(messageReducer, initialState);

    const loadMessages = async (userId: string, userRole: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const messages = await MockDataService.getMessages(userId, userRole);
            dispatch({ type: 'SET_MESSAGES', payload: messages });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load messages' });
        }
    };

    // CRUD functions for hooks to call
    const setMessages = (messages: Message[] | ((prev: Message[]) => Message[])) => {
        if (typeof messages === 'function') {
            dispatch({ type: 'SET_MESSAGES', payload: messages(state.messages) });
        } else {
            dispatch({ type: 'SET_MESSAGES', payload: messages });
        }
    };

    const addMessage = (message: Message) => {
        dispatch({ type: 'ADD_MESSAGE', payload: message });
    };

    const editMessage = (message: Message) => {
        dispatch({ type: 'UPDATE_MESSAGE', payload: message });
    };

    const deleteMessage = (id: string) => {
        dispatch({ type: 'DELETE_MESSAGE', payload: id });
    };

    const markAsRead = (id: string) => {
        dispatch({ type: 'MARK_AS_READ', payload: id });
    };

    const setCurrentMessage = (message: Message | null) => {
        dispatch({ type: 'SET_CURRENT_MESSAGE', payload: message });
    };

    const refreshMessages = async (userId: string, userRole: string): Promise<void> => {
        await loadMessages(userId, userRole);
    };
    const contextValue: MessageContextType = {
        state,
        messages: state.messages,
        currentMessage: state.currentMessage,
        isLoading: state.isLoading,
        error: state.error,
        setMessages,
        addMessage,
        editMessage,
        deleteMessage,
        markAsRead,
        setCurrentMessage,
        refreshMessages,
    };

    return (
        <MessageContext.Provider value={contextValue}>
            {children}
        </MessageContext.Provider>
    );
};

// Hook
export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
};
