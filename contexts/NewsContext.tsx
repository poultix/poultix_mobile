import { newsService} from '@/services/api/news'
import { News } from '@/types/news'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { Alert } from 'react-native'


// Context types 
interface NewsContextType {
  news: News[]
  currentNews: News | null
  loading: boolean
  error: string | null

  // API operations
  addNews: (newsData: News) =>void
  removeNews: (newsData: News) =>void
  editNews: (newsData: News) =>void
  getNewsById: (id: string) => Promise<News | null>
  
  setCurrentNews: (news: News | null) => void
}

// Create context
const NewsContext = createContext<NewsContextType | undefined>(undefined)

// Provider component
export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuth()
  const [news, setNews] = useState<News[]>([])
  const [currentNews, setCurrentNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load news on mount
  useEffect(() => {
    if (authenticated) {
      loadNews()
    }
  }, [authenticated])

  const loadNews = async () => {
    try {
      setLoading(true)
      setError('')

      const newsData = await newsService.getAllNews()
      setNews(newsData.data)
    } catch (error: any) {
      console.error('Failed to load news:', error)
      setError(error.message || 'Failed to load news')
      Alert.alert('Error', 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }


  const getNewsById = async (id: string): Promise<News | null> => {
    try {
      const newsItem = await newsService.getNewsById(id)
      return newsItem.data
    } catch (error: any) {
      console.error('Failed to get news by ID:', error)
      setError(error.message || 'Failed to get news')
      Alert.alert('Error', error.message || 'Failed to get news by ID')
      return null
    }
  }



  const addNews = (newsData: News) => {

    setNews(prev => [...prev, newsData])
  }

  const editNews = (data: News) => {
    setNews(prev => prev.map(article => article.id === data.id ? data : article))
  }

  const removeNews = (data: News) => {
    setNews(prev => prev.filter(article => article.id !== data.id))
  }
  const contextValue: NewsContextType = {
    news,
    currentNews,
    loading,
    error,
    addNews,
    removeNews,
    editNews,
    getNewsById,
    setCurrentNews,
  }

  return (
    <NewsContext.Provider value={contextValue}>
      {children}
    </NewsContext.Provider>
  )
}

// Hook
export const useNews = () => {
  const context = useContext(NewsContext)
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider')
  }
  return context
}
