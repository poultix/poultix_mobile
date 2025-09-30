import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { SafeAreaView } from "react-native-safe-area-context";
// New context imports
import { useNews } from '@/contexts/NewsContext';
import { useAuth } from '@/contexts/AuthContext';

export default function NewsScreen() {
  const { isDrawerVisible, setIsDrawerVisible } = useDrawer();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Use new contexts
  const { news, currentNews, setCurrentNews, loading } = useNews();
  const { currentUser } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  const categories = ['All', 'Health', 'Nutrition', 'Breeding', 'Market', 'Technology'];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filter news by category
  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(article => article.category.toLowerCase() === selectedCategory.toLowerCase());

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#10B981';
      case 'low': return '#6B7280';
      default: return '#9CA3AF';
    }
  };

  const handleArticlePress = (article: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentNews(article);
    // Navigate to article detail (you can implement this)
    console.log('Article pressed:', article.title);
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading news...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
      
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw`px-4 pt-2 pb-4`}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={tw`rounded-3xl p-6 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-medium`}>Latest Updates</Text>
                <Text style={tw`text-white text-2xl font-bold`}>Poultry News 📰</Text>
                <Text style={tw`text-yellow-100 text-sm`}>
                  Stay informed with industry updates
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Category Filter */}
        <View style={tw`px-4 mb-4`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={tw`flex-row gap-3`}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={tw`px-4 py-2 rounded-full ${
                    selectedCategory === category ? 'bg-orange-500' : 'bg-white'
                  } shadow-sm`}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={tw`font-medium ${
                    selectedCategory === category ? 'text-white' : 'text-gray-700'
                  }`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* News List */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`px-4 pb-4`}
        >
          <Animated.View style={[{ transform: [{ translateY: slideAnim }] }]}>
            {filteredNews.length === 0 ? (
              <View style={tw`flex-1 justify-center items-center py-20`}>
                <Ionicons name="newspaper-outline" size={64} color="#9CA3AF" />
                <Text style={tw`text-gray-500 text-lg font-medium mt-4`}>
                  No news articles found
                </Text>
                <Text style={tw`text-gray-400 text-center mt-2`}>
                  Check back later for updates
                </Text>
              </View>
            ) : (
              filteredNews.map((article, index) => (
                <TouchableOpacity
                  key={ index}
                  style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100`}
                  onPress={() => handleArticlePress(article)}
                >
                  <View style={tw`flex-row items-start justify-between mb-3`}>
                    <View style={tw`flex-1 mr-3`}>
                      <View style={tw`flex-row items-center mb-2`}>
                        <View style={[
                          tw`px-2 py-1 rounded-full mr-2`,
                          { backgroundColor: getPriorityColor(article.priority) + '20' }
                        ]}>
                          <Text style={[
                            tw`text-xs font-medium`,
                            { color: getPriorityColor(article.priority) }
                          ]}>
                            {article.priority}
                          </Text>
                        </View>
                        <Text style={tw`text-gray-500 text-xs`}>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={tw`text-gray-900 font-bold text-lg mb-2`}>
                        {article.title}
                      </Text>
                      <Text style={tw`text-gray-600 text-sm mt-2 leading-5`}>
                        {article.content.substring(0, 150)}...
                      </Text>
                    </View>
                    <View style={tw`w-20 h-20 bg-gray-200 rounded-xl items-center justify-center`}>
                      <Ionicons name="newspaper-outline" size={32} color="#9CA3AF" />
                    </View>
                  </View>
                  
                  <View style={tw`pt-3 border-t border-gray-100 mt-3`}>
                    <View style={tw`flex-row items-center justify-between`}>
                      <Text style={tw`text-orange-600 font-medium text-xs`}>
                        {article.author?.name || 'Admin'}
                      </Text>
                      <View style={tw`flex-row items-center`}>
                        {article.tags && article.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                          <View key={tagIndex} style={tw`bg-gray-100 rounded-full px-2 py-1 ml-1`}>
                            <Text style={tw`text-gray-500 text-xs`}>{tag}</Text>
                          </View>
                        ))}
                        <Ionicons name="chevron-forward-outline" size={16} color="#9CA3AF" style={tw`ml-2`} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
