import { useError } from '@/contexts/ErrorContext';
import { useNews } from '@/contexts/NewsContext';
import { newsService } from '@/services/api';
import { HTTP_STATUS } from '@/services/constants';
import { NewsCreateRequest, NewsUpdateRequest } from '@/types/news';
import { useState } from 'react';
import { Alert } from 'react-native';


export const useNewsActions = () => {
  const { handleApiError } = useError()
  const [loading, setLoading] = useState(false)
  const { addNews, editNews, removeNews } = useNews()


  const createNews = async (newsData: NewsCreateRequest) => {
    try {
      const response = await newsService.createNews(newsData)
      if (!response.data) return
      addNews(response.data)
    } catch (error) {
      console.error(error)
    }
  };
  const updateNews = async (id: string, updates: NewsUpdateRequest): Promise<void> => {
    try {
      setLoading(true);


      const response = await newsService.updateNews(id, updates);

      if (response.success && response.data) {
        editNews(response.data)
      } else {
        Alert.alert('Failed to update news', response.message || 'Failed to update news');
      }
    } catch (error: any) {
      console.error('Failed to update news:', error);


      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        Alert.alert('Failed to update news', error.message || 'Failed to update news');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: string): Promise<void> => {
    try {
      setLoading(true);

      const response = await newsService.deleteNews(id);

      if (response.success && response.data) {
        removeNews(response.data)
      } else {
        Alert.alert('Failed to delete news', response.message || 'Failed to delete news');
      }
    } catch (error: any) {
      console.error('Failed to delete news:', error);

      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error);
      } else {
        Alert.alert('Failed to delete news', error.message || 'Failed to delete news');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };


  return {
    loading,
    createNews,
    updateNews,
    deleteNews,
  };
};
