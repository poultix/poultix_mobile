import { newsService } from '@/services/api'
import { HTTP_STATUS } from '@/services/constants'
import { News } from '@/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useError } from './ErrorContext'
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
  const { handleApiError } = useError() // ✅ Use ErrorContext for routing

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

      const response = await newsService.getAllNews()

      if (response.success && response.data) {
        setNews(response.data)
      } else {
        Alert.alert('Failed to load news', response.message || 'Failed to load news')
      }
    } catch (error: any) {
      console.error('Failed to load news:', error)

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error) // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to load news') // ✅ Show inline error for minor issues
      }
    } finally {
      setLoading(false)
    }
  }


  const getNewsById = async (id: string): Promise<News | null> => {
    try {
      const response = await newsService.getNewsById(id)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (error: any) {
      console.error('Failed to get news by ID:', error)

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error) // ✅ Auto-route to appropriate error screen
      } else {
        setError(error.message || 'Failed to get news') // ✅ Show inline error for minor issues
      }
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
