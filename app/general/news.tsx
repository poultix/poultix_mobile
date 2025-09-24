import React, { useState, useEffect, useRef } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Animated,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import tw from 'twrnc'
import CustomDrawer from '@/components/CustomDrawer'
import { useDrawer } from '@/contexts/DrawerContext'
import { MockDataService } from '@/services/mockData'

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  publishedAt: string;
  author: string;
  imageUrl?: string;
}

export default function News() {
  const router = useRouter()
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer()
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-20)).current

  const categories = ['All', 'Health', 'Nutrition', 'Breeding', 'Market', 'Technology']

  useEffect(() => {
    loadNews()
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const loadNews = async () => {
    try {
      const articles = await MockDataService.getNewsArticles()
      setNewsArticles(articles)
    } catch (error) {
      console.error('Error loading news:', error)
    }
  }

  const filteredNews = selectedCategory === 'All' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#EF4444'
      case 'high': return '#F59E0B'
      case 'medium': return '#3B82F6'
      default: return '#6B7280'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return 'medical-outline'
      case 'Nutrition': return 'nutrition-outline'
      case 'Breeding': return 'heart-outline'
      case 'Market': return 'trending-up-outline'
      case 'Technology': return 'hardware-chip-outline'
      default: return 'newspaper-outline'
    }
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      
      
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Enhanced Header */}
        <Animated.View 
          style={[
            tw`px-4 pt-2 pb-4`,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={tw`rounded-3xl p-8 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white text-sm opacity-90`}>
                  Latest Updates
                </Text>
                <Text style={tw`text-white text-2xl font-bold`}>
                  Poultry Health News 📰
                </Text>
                <Text style={tw`text-purple-100 text-sm mt-1`}>
                  Stay informed with expert insights
                </Text>
              </View>
              <TouchableOpacity
                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                onPress={() => router.push('/admin/add-news')}
              >
                <Ionicons name="add-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            {/* News Stats */}
            <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6 mt-4`}>
              <Text style={tw`text-white font-bold text-lg mb-4`}>Today's Updates</Text>
              <View style={tw`flex-row justify-between`}>
                <View style={tw`items-center flex-1`}>
                  <Text style={tw`text-white text-2xl font-bold`}>{newsArticles.length}</Text>
                  <Text style={tw`text-purple-100 text-xs font-medium`}>Articles</Text>
                </View>
                <View style={tw`items-center flex-1`}>
                  <Text style={tw`text-green-200 text-2xl font-bold`}>
                    {newsArticles.filter(a => a.priority === 'urgent').length}
                  </Text>
                  <Text style={tw`text-purple-100 text-xs font-medium`}>Urgent</Text>
                </View>
                <View style={tw`items-center flex-1`}>
                  <Text style={tw`text-blue-200 text-2xl font-bold`}>
                    {categories.length - 1}
                  </Text>
                  <Text style={tw`text-purple-100 text-xs font-medium`}>Categories</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View 
          style={[
            tw`px-4 mb-4`,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`px-2`}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setSelectedCategory(category)
                }}
                style={[
                  tw`mr-3 px-4 py-2 rounded-full flex-row items-center`,
                  selectedCategory === category 
                    ? tw`bg-purple-500` 
                    : tw`bg-white border border-gray-200`
                ]}
              >
                <Ionicons 
                  name={getCategoryIcon(category) as keyof typeof Ionicons.glyphMap} 
                  size={16} 
                  color={selectedCategory === category ? 'white' : '#6B7280'} 
                />
                <Text style={[
                  tw`ml-2 font-medium`,
                  selectedCategory === category ? tw`text-white` : tw`text-gray-600`
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* News Articles */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`px-4 pb-4`}
        >
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {filteredNews.map((article, index) => (
              <TouchableOpacity
                key={article.id}
                style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100`}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  // Navigate to article detail
                }}
              >
                <View style={tw`flex-row items-start justify-between mb-3`}>
                  <View style={tw`flex-1 mr-3`}>
                    <View style={tw`flex-row items-center mb-2`}>
                      <View style={[
                        tw`px-2 py-1 rounded-full mr-2`,
                        { backgroundColor: getPriorityColor(article.priority) + '20' }
                      ]}>
                        <Text style={[
                          tw`text-xs font-bold capitalize`,
                          { color: getPriorityColor(article.priority) }
                        ]}>
                          {article.priority}
                        </Text>
                      </View>
                      <Text style={tw`text-gray-500 text-xs`}>
                        {article.category} • {article.publishedAt}
                      </Text>
                    </View>
                    <Text style={tw`text-gray-900 font-bold text-lg mb-2`}>
                      {article.title}
                    </Text>
                    <Text style={tw`text-gray-600 text-sm leading-5`}>
                      {article.summary}
                    </Text>
                  </View>
                  <View style={tw`w-20 h-20 bg-gray-200 rounded-xl items-center justify-center`}>
                    <Ionicons 
                      name={getCategoryIcon(article.category) as keyof typeof Ionicons.glyphMap} 
                      size={24} 
                      color="#6B7280" 
                    />
                  </View>
                </View>
                
                <View style={tw`flex-row items-center justify-between pt-3 border-t border-gray-100`}>
                  <View style={tw`flex-row items-center`}>
                    <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
                    <Text style={tw`text-gray-500 text-sm ml-1`}>
                      {article.author}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center`}>
                    {article.tags.slice(0, 2).map((tag, tagIndex) => (
                      <View key={tagIndex} style={tw`bg-gray-100 rounded-full px-2 py-1 ml-1`}>
                        <Text style={tw`text-gray-600 text-xs`}>#{tag}</Text>
                      </View>
                    ))}
                    <Ionicons name="chevron-forward-outline" size={16} color="#9CA3AF" style={tw`ml-2`} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </ScrollView>
      </Animated.View>
      
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </SafeAreaView>
  )
}
