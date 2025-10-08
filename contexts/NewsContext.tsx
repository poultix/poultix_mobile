import { newsService } from '@/services/api';
import { HTTP_STATUS } from '@/services/constants';
import { News, NewsUpdateRequest } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useError } from './ErrorContext';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';


// Context types
interface NewsContextType {
  news: News[];
  currentNews: News | null;
  loading: boolean;
  error: string | null;

  // API operations
  addNews: (newsData: News) => Promise<void>;
  getNewsById: (id: string) => Promise<News | null>;
  updateNews: (id: string, updates: NewsUpdateRequest) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  setCurrentNews: (news: News | null) => void;
  refreshNews: () => Promise<void>;
}

// Create context
const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Provider component
export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuth()
  const [news, setNews] = useState<News[]>([])
  const [currentNews, setCurrentNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { handleApiError } = useError(); // ✅ Use ErrorContext for routing

  // Load news on mount
  useEffect(() => {
    if (authenticated) {
      loadNews();
    }
  }, [authenticated]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await newsService.getAllNews();

      if (response.success && response.data) {
        setNews(response.data);
      } else {
        Alert.alert('Failed to load news', response.message || 'Failed to load news');
      }
    } catch (error: any) {
      console.error('Failed to load news:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to load news'); // ✅ Show inline error for minor issues
      }
    } finally {
      setLoading(false);
    }
  };


  const addNews = async (newsData: News): Promise<void> => {

        setNews(prev => [...prev, newsData]);
    
  };

  const getNewsById = async (id: string): Promise<News | null> => {
    try {
      const response = await newsService.getNewsById(id);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get news by ID:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to get news'); // ✅ Show inline error for minor issues
      }
      return null;
    }
  };

  const updateNews = async (id: string, updates: NewsUpdateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await newsService.updateNews(id, updates);

      if (response.success && response.data) {
        setNews(prev => prev.map(article => article.id === id ? response.data! : article));
      } else {
        Alert.alert('Failed to update news', response.message || 'Failed to update news');
      }
    } catch (error: any) {
      console.error('Failed to update news:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to update news'); // ✅ Show inline error for minor issues
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await newsService.deleteNews(id);

      if (response.success) {
        setNews(prev => prev.filter(article => article.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete news');
      }
    } catch (error: any) {
      console.error('Failed to delete news:', error);

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error); // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to delete news'); // ✅ Show inline error for minor issues
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async (): Promise<void> => {
    await loadNews();
  };

  const contextValue: NewsContextType = {
    news,
    currentNews,
    loading,
    error,
    addNews,
    getNewsById,
    updateNews,
    deleteNews,
    setCurrentNews,
    refreshNews,
  };

  return (
    <NewsContext.Provider value={contextValue}>
      {children}
    </NewsContext.Provider>
  );
};

// Hook
export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
