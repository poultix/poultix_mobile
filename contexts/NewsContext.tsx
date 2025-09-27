import React, { createContext, useContext, useReducer, useEffect } from 'react';
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
  state: NewsState;
  news: News[];
  currentNews: News | null;
  isLoading: boolean;
  error: string | null;
  // CRUD functions for hooks to call
  setNews: (news: News[] | ((prev: News[]) => News[])) => void;
  addNews: (news: News) => void;
  editNews: (news: News) => void;
  deleteNews: (title: string) => void;
  setCurrentNews: (news: News | null) => void;
  refreshNews: () => Promise<void>;
}

// Initial state
const initialState: NewsState = {
  news: [],
  currentNews: null,
  isLoading: false,
  error: null,
};

// Reducer
const newsReducer = (state: NewsState, action: NewsAction): NewsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_NEWS':
      return { ...state, news: action.payload, isLoading: false, error: null };
    case 'ADD_NEWS':
      return { ...state, news: [...state.news, action.payload] };
    case 'UPDATE_NEWS':
      return {
        ...state,
        news: state.news.map(newsItem =>
          newsItem.title === action.payload.title ? action.payload : newsItem
        )
      };
    case 'DELETE_NEWS':
      return {
        ...state,
        news: state.news.filter(newsItem => newsItem.title !== action.payload)
      };
    case 'SET_CURRENT_NEWS':
      return {
        ...state,
        currentNews: action.payload
      };
    default:
      return state;
  }
};

// Create context
const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Provider component
export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(newsReducer, initialState);

    // Load news on mount
    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const news = await MockDataService.getNews();
            dispatch({ type: 'SET_NEWS', payload: news });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load news' });
        }
    };

    // CRUD functions for hooks to call
    const setNews = (news: News[] | ((prev: News[]) => News[])) => {
        if (typeof news === 'function') {
            dispatch({ type: 'SET_NEWS', payload: news(state.news) });
        } else {
            dispatch({ type: 'SET_NEWS', payload: news });
        }
    };

    const addNews = (news: News) => {
        dispatch({ type: 'ADD_NEWS', payload: news });
    };

    const editNews = (news: News) => {
        dispatch({ type: 'UPDATE_NEWS', payload: news });
    };

    const deleteNews = (title: string) => {
        dispatch({ type: 'DELETE_NEWS', payload: title });
    };

    const setCurrentNews = (news: News | null) => {
        dispatch({ type: 'SET_CURRENT_NEWS', payload: news });
    };

    const refreshNews = async (): Promise<void> => {
        await loadNews();
    };

    const contextValue: NewsContextType = {
        state,
        news: state.news,
        currentNews: state.currentNews,
        isLoading: state.isLoading,
        error: state.error,
        setNews,
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
