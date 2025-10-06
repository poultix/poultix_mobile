import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { HelpSupportResponse, HelpSupportCreateRequest } from '@/types';
import { supportService } from '@/services/api';
import { useError } from './ErrorContext';
import { HTTP_STATUS } from '@/services/constants';
import { useAuth } from './AuthContext';

interface SupportContextType {
  tickets: HelpSupportResponse[];
  currentTicket: HelpSupportResponse | null;
  loading: boolean;
  error: string | null;

  // API operations
  createTicket: (userId: string, ticketData: HelpSupportCreateRequest) => Promise<void>;
  getTicketById: (id: string) => Promise<HelpSupportResponse | null>;
  getTicketsByUser: (userId: string) => Promise<HelpSupportResponse[]>;
  deleteTicket: (id: string) => Promise<void>;
  setCurrentTicket: (ticket: HelpSupportResponse | null) => void;
  refreshTickets: () => Promise<void>;
}

// Create context
const SupportContext = createContext<SupportContextType | undefined>(undefined);

// Provider component
export const SupportProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuth()
  const [tickets, setTickets] = useState<HelpSupportResponse[]>([])
  const [currentTicket, setCurrentTicket] = useState<HelpSupportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { handleApiError } = useError();

  // Load tickets on mount
  useEffect(() => {
    if (authenticated) {
      loadTickets();
    }
  }, [authenticated]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await supportService.getAllTickets();

      if (response.success && response.data) {
        setTickets(response.data);
      } else {
        throw new Error(response.message || 'Failed to load support tickets');
      }
    } catch (error: any) {
      console.error('Failed to load support tickets:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to load support tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (userId: string, ticketData: HelpSupportCreateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await supportService.createTicket(userId, ticketData);

      if (response.success && response.data) {
        setTickets(prev => [...prev, response.data!]);
      } else {
        throw new Error(response.message || 'Failed to create support ticket');
      }
    } catch (error: any) {
      console.error('Failed to create support ticket:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to create support ticket');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTicketById = async (id: string): Promise<HelpSupportResponse | null> => {
    try {
      const response = await supportService.getTicketById(id);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get support ticket by ID:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to get support ticket');
      }
      return null;
    }
  };

  const getTicketsByUser = async (userId: string): Promise<HelpSupportResponse[]> => {
    try {
      const response = await supportService.getTicketsByUser(userId);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get support tickets by user:', error);
      setError(error.message || 'Failed to get user support tickets');
      return [];
    }
  };

  const deleteTicket = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await supportService.deleteTicket(id);

      if (response.success) {
        setTickets(prev => prev.filter(ticket => ticket.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete support ticket');
      }
    } catch (error: any) {
      console.error('Failed to delete support ticket:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        setError(error.message || 'Failed to delete support ticket');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshTickets = async (): Promise<void> => {
    await loadTickets();
  };

  const contextValue: SupportContextType = {
    tickets,
    currentTicket,
    loading,
    error,
    createTicket,
    getTicketById,
    getTicketsByUser,
    deleteTicket,
    setCurrentTicket,
    refreshTickets,
  };

  return (
    <SupportContext.Provider value={contextValue}>
      {children}
    </SupportContext.Provider>
  );
};

// Hook
export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};
