import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import tw from 'twrnc'
import { router } from 'expo-router'
import { News, NewsPriority } from '@/types'

// New context imports
import { useAuth } from '@/contexts/AuthContext'
import { useNews } from '@/contexts/NewsContext'
import { useNewsActions } from '@/hooks/useNewsActions'



export default function AddNewsScreen() {
  // Use new contexts
  const { currentUser } = useAuth()
  const { isLoading } = useNews()
  const { createNews } = useNewsActions()
  
  const [article, setArticle] = useState<Partial<News>>({
    title: '',
    content: '',
    category:'General',
    priority: NewsPriority.MEDIUM,
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const headerAnim = useRef(new Animated.Value(-50)).current
  const formAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(headerAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(formAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  // Check admin access
  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      Alert.alert(
        'Access Denied',
        'Only administrators can add news articles.',
        [{ text: 'OK', onPress: () => router.back() }]
      )
    }
  }, [currentUser])

  const addTag = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handlePublish = async () => {
    if (!article.title?.trim() || !article.content?.trim()) {
      Alert.alert('Missing Information', 'Please fill in both title and content.')
      return
    }

    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated')
      return
    }

    try {
      setIsPublishing(true)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      
      // Create news article using context action
      await createNews({
        title: article.title!,
        content: article.content!,
        category: article.category || NewsCategory.GENERAL,
        priority: article.priority || NewsPriority.MEDIUM,
        tags: article.tags || [],
        author: currentUser,
        publishedAt: new Date(),
        isPublished: true
      })
      
      Alert.alert(
        'Success!',
        'News article has been published successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      )
      
    } catch (error) {
      console.error('Error publishing article:', error)
      Alert.alert('Error', 'Failed to publish article. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }
  const resetForm = () => {
    setArticle({
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
      tags: [],
      author: article.author
    })
    setTagInput('')
  }

  const categories = [
    { value: 'general', label: 'General', color: '#6B7280' },
    { value: 'health', label: 'Health & Disease', color: '#EF4444' },
    { value: 'nutrition', label: 'Nutrition', color: '#10B981' },
    { value: 'breeding', label: 'Breeding', color: '#F59E0B' },
    { value: 'market', label: 'Market News', color: '#3B82F6' },
    { value: 'technology', label: 'Technology', color: '#8B5CF6' },
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: '#6B7280' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#EF4444' },
    { value: 'urgent', label: 'Urgent', color: '#DC2626' },
  ]

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={tw`flex-1`}
          contentContainerStyle={tw`flexGrow pb-2`}
          bounces={true}
        >
          <Animated.View style={[tw`flex-1 min-h-full`, { opacity: fadeAnim }]}>
            {/* Header */}
            <Animated.View 
              style={[
                tw` pb-4`,
                { transform: [{ translateY: headerAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={tw` p-8 shadow-xl`}
              >
                <View style={tw`flex-row items-center justify-between mb-4`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white text-sm opacity-90`}>
                      Content Management
                    </Text>
                    <Text style={tw`text-white text-2xl font-bold`}>
                      Add News Article 📰
                    </Text>
                    <Text style={tw`text-blue-100 text-sm mt-1`}>
                      Share important updates with the community
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Form */}
            <Animated.View 
              style={[
                tw`px-4 mb-4`,
                { opacity: formAnim }
              ]}
            >
              {/* Title Input */}
              <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                <Text style={tw`text-gray-800 font-bold text-lg mb-3`}>Article Title</Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl p-4 text-gray-800 text-base`}
                  placeholder="Enter a compelling title..."
                  value={article.title}
                  onChangeText={(text) => setArticle(prev => ({ ...prev, title: text }))}
                  maxLength={100}
                />
                <Text style={tw`text-gray-400 text-xs mt-2`}>
                  {article.title.length}/100 characters
                </Text>
              </View>

              {/* Category & Priority */}
              <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                <Text style={tw`text-gray-800 font-bold text-lg mb-3`}>Category & Priority</Text>
                
                <Text style={tw`text-gray-600 font-medium mb-2`}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-4`}>
                  <View style={tw`flex-row`}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.value}
                        onPress={() => setArticle(prev => ({ ...prev, category: cat.value }))}
                        style={[
                          tw`mr-3 px-4 py-2 rounded-full border`,
                          article.category === cat.value 
                            ? { backgroundColor: cat.color, borderColor: cat.color }
                            : tw`border-gray-300`
                        ]}
                      >
                        <Text style={[
                          tw`font-medium`,
                          article.category === cat.value ? tw`text-white` : tw`text-gray-600`
                        ]}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <Text style={tw`text-gray-600 font-medium mb-2`}>Priority</Text>
                <View style={tw`flex-row flex-wrap`}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority.value}
                      onPress={() => setArticle(prev => ({ ...prev, priority: priority.value as any }))}
                      style={[
                        tw`mr-3 mb-2 px-4 py-2 rounded-full border`,
                        article.priority === priority.value 
                          ? { backgroundColor: priority.color, borderColor: priority.color }
                          : tw`border-gray-300`
                      ]}
                    >
                      <Text style={[
                        tw`font-medium`,
                        article.priority === priority.value ? tw`text-white` : tw`text-gray-600`
                      ]}>
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Content Input */}
              <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                <Text style={tw`text-gray-800 font-bold text-lg mb-3`}>Article Content</Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl p-4 text-gray-800 text-base min-h-40`}
                  placeholder="Write your article content here..."
                  value={article.content}
                  onChangeText={(text) => setArticle(prev => ({ ...prev, content: text }))}
                  multiline
                  textAlignVertical="top"
                />
                <Text style={tw`text-gray-400 text-xs mt-2`}>
                  {article.content.length} characters (minimum 50)
                </Text>
              </View>

              {/* Tags */}
              <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                <Text style={tw`text-gray-800 font-bold text-lg mb-3`}>Tags</Text>
                <View style={tw`flex-row items-center mb-3`}>
                  <TextInput
                    style={tw`flex-1 bg-gray-50 rounded-xl p-3 text-gray-800 mr-3`}
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={addTag}
                  />
                  <TouchableOpacity
                    onPress={addTag}
                    style={tw`bg-blue-500 p-3 rounded-xl`}
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={tw`flex-row flex-wrap`}>
                  {article.tags.map((tag, index) => (
                    <View key={index} style={tw`bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center`}>
                      <Text style={tw`text-blue-800 text-sm mr-1`}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeTag(tag)}>
                        <Ionicons name="close-circle" size={16} color="#1E40AF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={tw`flex-row justify-between`}>
                <TouchableOpacity
                  onPress={resetForm}
                  style={tw`flex-1 bg-gray-200 rounded-2xl p-4 mr-2 items-center`}
                >
                  <Text style={tw`text-gray-700 font-semibold text-base`}>Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={publishArticle}
                  disabled={isPublishing}
                  style={tw`flex-1 bg-blue-500 rounded-2xl p-4 ml-2 items-center ${isPublishing ? 'opacity-50' : ''}`}
                >
                  <Text style={tw`text-white font-semibold text-base`}>
                    {isPublishing ? 'Publishing...' : 'Publish Article'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
