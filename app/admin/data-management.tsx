import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import { router } from 'expo-router';

// New context imports
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNews } from '@/contexts/NewsContext';
import { useFarms } from '@/contexts/FarmContext';
import { useUsers } from '@/contexts/UserContext';
import { usePharmacies } from '@/contexts/PharmacyContext';

export default function DataManagementScreen() {
  const { currentUser } = useAuth();
  const { isLoading: adminLoading } = useAdmin();
  const { news } = useNews();
  const { farms } = useFarms();
  const { users } = useUsers();
  const { pharmacies } = usePharmacies();
  
  const [selectedTab, setSelectedTab] = useState<'news' | 'farms' | 'users' | 'pharmacies'>('news');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check admin access
    if (currentUser && currentUser.role !== 'ADMIN') {
      Alert.alert(
        'Access Denied',
        'Only administrators can access data management.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentUser]);

  const getDataForTab = () => {
    switch (selectedTab) {
      case 'news': return news;
      case 'farms': return farms;
      case 'users': return users;
      case 'pharmacies': return pharmacies;
      default: return [];
    }
  };

  const filteredData = getDataForTab().filter((item: any) => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (adminLoading || !currentUser) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading data management...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw`px-4 pt-2 pb-4`}>
          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            style={tw`rounded-3xl p-6 shadow-xl`}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <TouchableOpacity
                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View style={tw`flex-1 ml-4`}>
                <Text style={tw`text-white font-medium`}>Admin Panel</Text>
                <Text style={tw`text-white text-2xl font-bold`}>Data Management 📊</Text>
                <Text style={tw`text-purple-100 text-sm`}>
                  Manage system data and content
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Search */}
        <View style={tw`px-4 mb-4`}>
          <View style={tw`bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                style={tw`flex-1 ml-3 text-gray-900`}
                placeholder="Search data..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={tw`px-4 mb-4`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={tw`flex-row gap-3`}>
              {(['news', 'farms', 'users', 'pharmacies'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={tw`px-4 py-2 rounded-full ${
                    selectedTab === tab ? 'bg-purple-500' : 'bg-white'
                  } shadow-sm`}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text style={tw`font-medium ${
                    selectedTab === tab ? 'text-white' : 'text-gray-700'
                  }`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getDataForTab().length})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Data List */}
        <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
          {filteredData.length === 0 ? (
            <View style={tw`flex-1 justify-center items-center py-20`}>
              <Ionicons name="folder-outline" size={64} color="#9CA3AF" />
              <Text style={tw`text-gray-500 text-lg font-medium mt-4`}>
                No {selectedTab} found
              </Text>
              <Text style={tw`text-gray-400 text-center mt-2`}>
                {searchQuery ? 'Try adjusting your search' : `No ${selectedTab} data available`}
              </Text>
            </View>
          ) : (
            filteredData.map((item: any, index: number) => (
              <View
                key={item.id || index}
                style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100`}
              >
                <View style={tw`flex-row items-start justify-between`}>
                  <View style={tw`flex-1 mr-3`}>
                    <Text style={tw`font-bold text-gray-800 text-lg mb-1`}>
                      {item.title || item.name || item.email || 'Untitled'}
                    </Text>
                    <Text style={tw`text-gray-600 text-sm mb-2`}>
                      {selectedTab === 'news' && item.category}
                      {selectedTab === 'farms' && item.location?.address}
                      {selectedTab === 'users' && item.role}
                      {selectedTab === 'pharmacies' && item.address}
                    </Text>
                    {item.description && (
                      <Text style={tw`text-gray-700 text-sm leading-5`}>
                        {item.description.substring(0, 100)}...
                      </Text>
                    )}
                  </View>
                  <View style={tw`items-end`}>
                    <View style={tw`w-3 h-3 rounded-full ${
                      item.isActive !== false ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </View>
                </View>
                
                <View style={tw`flex-row items-center justify-between pt-3 border-t border-gray-100 mt-3`}>
                  <Text style={tw`text-gray-400 text-xs`}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date'}
                  </Text>
                  <View style={tw`flex-row gap-2`}>
                    <TouchableOpacity
                      style={tw`bg-blue-500 px-3 py-1 rounded-lg`}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        console.log('Edit item:', item.id);
                      }}
                    >
                      <Text style={tw`text-white text-xs font-medium`}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`bg-red-500 px-3 py-1 rounded-lg`}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        Alert.alert(
                          'Delete Item',
                          'Are you sure you want to delete this item?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete item:', item.id) }
                          ]
                        );
                      }}
                    >
                      <Text style={tw`text-white text-xs font-medium`}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
