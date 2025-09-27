import { News, NewsPriority } from '@/types/news';
import { MockDataService } from '@/services/mockData';

export interface NewsActionsType {
  loadNews: () => Promise<News[]>;
  createNews: (newsData: Omit<News, 'createdAt' | 'updatedAt'>) => Promise<News>;
  updateNews: (title: string, newsData: Partial<News>) => Promise<News>;
  deleteNews: (title: string) => Promise<void>;
  getNewsByTitle: (news: News[], title: string) => News | undefined;
  getNewsByCategory: (news: News[], category: string) => News[];
  getNewsByPriority: (news: News[], priority: NewsPriority) => News[];
  getNewsByAuthor: (news: News[], authorId: string) => News[];
  refreshNews: () => Promise<News[]>;
}

export const useNewsActions = (): NewsActionsType => {
  const loadNews = async (): Promise<News[]> => {
    return await MockDataService.getNews();
  };

  const createNews = async (newsData: Omit<News, 'createdAt' | 'updatedAt'>): Promise<News> => {
    const newNews: News = {
      ...newsData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // In a real app, this would make an API call
    return newNews;
  };

  const updateNews = async (title: string, newsData: Partial<News>): Promise<News> => {
    // In a real app, this would make an API call
    const news = await loadNews();
    const existingNews = news.find(newsItem => newsItem.title === title);
    
    if (!existingNews) {
      throw new Error('News not found');
    }
    
    const updatedNews = { ...existingNews, ...newsData, updatedAt: new Date() };
    return updatedNews;
  };

  const deleteNews = async (title: string): Promise<void> => {
    // In a real app, this would make an API call
    console.log(`Deleting news with title: ${title}`);
  };

  const getNewsByTitle = (news: News[], title: string): News | undefined => {
    return news.find(newsItem => newsItem.title === title);
  };

  const getNewsByCategory = (news: News[], category: string): News[] => {
    return news.filter(newsItem => newsItem.category === category);
  };

  const getNewsByPriority = (news: News[], priority: NewsPriority): News[] => {
    return news.filter(newsItem => newsItem.priority === priority);
  };

  const getNewsByAuthor = (news: News[], authorId: string): News[] => {
    return news.filter(newsItem => newsItem.author.id === authorId);
  };

  const refreshNews = async (): Promise<News[]> => {
    return await loadNews();
  };

  return {
    loadNews,
    createNews,
    updateNews,
    deleteNews,
    getNewsByTitle,
    getNewsByCategory,
    getNewsByPriority,
    getNewsByAuthor,
    refreshNews,
  };
};
