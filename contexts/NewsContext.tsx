import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { News,  NewsCreateRequest, NewsUpdateRequest} from '@/types';
import { newsService } from '@/services/api';


// Context types
interface NewsContextType {
  news: News[];
  currentNews: News | null;
  loading: boolean;
  error: string | null;

  // API operations
  createNews: (authorId: string, newsData: NewsCreateRequest) => Promise<void>;
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
  const [news, setNews] = useState<News[]>([])
  const [currentNews, setCurrentNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load news on mount
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await newsService.getAllNews();
      
      if (response.success && response.data) {
        setNews(response.data);
      } else {
        throw new Error(response.message || 'Failed to load news');
      }
    } catch (error: any) {
      console.error('Failed to load news:', error);
      setError(error.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };


  const createNews = async (authorId: string, newsData: NewsCreateRequest): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await newsService.createNews(authorId, newsData);
      
      if (response.success && response.data) {
        setNews(prev => [...prev, response.data!]);
      } else {
        throw new Error(response.message || 'Failed to create news');
      }
    } catch (error: any) {
      console.error('Failed to create news:', error);
      setError(error.message || 'Failed to create news');
      throw error;
    } finally {
      setLoading(false);
    }
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
      setError(error.message || 'Failed to get news');
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
        throw new Error(response.message || 'Failed to update news');
      }
    } catch (error: any) {
      console.error('Failed to update news:', error);
      setError(error.message || 'Failed to update news');
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
      setError(error.message || 'Failed to delete news');
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
    createNews,
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
