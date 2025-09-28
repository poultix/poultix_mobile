import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { News, NewsPriority } from '@/types/news';
import { User } from '@/types/user';
import { MockDataService } from '@/services/mockData';

// News state interface
interface NewsState {
  news: News[];
  currentNews: News | null;
  isLoading: boolean;
  error: string | null;
}

// News actions
type NewsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NEWS'; payload: News[] }
  | { type: 'ADD_NEWS'; payload: News }
  | { type: 'UPDATE_NEWS'; payload: News }
  | { type: 'DELETE_NEWS'; payload: string }
  | { type: 'SET_CURRENT_NEWS'; payload: News | null };

// Context types
interface NewsContextType {
  news: News[];
  currentNews: News | null;
  loading: boolean;
  error: string | null;
  addNews: (news: News) => void;
  editNews: (news: News) => void;
  deleteNews: (title: string) => void;
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

      const news = await MockDataService.getNews();
      setNews(news)
    } catch (error) {
    }
  };


  const addNews = (news: News) => {
    setNews((prev) => [...prev, news])
  };

  const editNews = (news: News) => {
    setNews((prev) => prev.map(newsItem =>
      newsItem.title === news.title ? news : newsItem
    ))
  };

  const deleteNews = (title: string) => {
    setNews((prev) => prev.filter(newsItem => newsItem.title !== title))
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
    editNews,
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
