import React, { useState, useRef, useEffect } from 'react'
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
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import tw from 'twrnc'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface DataItem {
  id: string;
  type: 'news' | 'pharmacy' | 'veterinary' | 'farm';
  title: string;
  description: string;
  lastModified: string;
  status: 'active' | 'inactive' | 'pending';
}

interface EditModalProps {
  visible: boolean;
  item: DataItem | null;
  onClose: () => void;
  onSave: (item: DataItem) => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, item, onClose, onSave }) => {
  const [editedItem, setEditedItem] = useState<DataItem | null>(null)

  useEffect(() => {
    setEditedItem(item)
  }, [item])

  const handleSave = () => {
    if (editedItem) {
      onSave(editedItem)
      onClose()
    }
  }

  if (!editedItem) return null

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <View style={tw`px-4 py-4 border-b border-gray-200 bg-white`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>Edit {editedItem.type}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={tw`flex-1 px-4 py-4`}>
          <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
            <Text style={tw`text-gray-700 font-semibold mb-2`}>Title</Text>
            <TextInput
              style={tw`bg-gray-50 rounded-xl p-4 text-gray-800 mb-4`}
              value={editedItem.title}
              onChangeText={(text) => setEditedItem(prev => prev ? { ...prev, title: text } : null)}
              placeholder="Enter title..."
            />
            
            <Text style={tw`text-gray-700 font-semibold mb-2`}>Description</Text>
            <TextInput
              style={tw`bg-gray-50 rounded-xl p-4 text-gray-800 mb-4 min-h-24`}
              value={editedItem.description}
              onChangeText={(text) => setEditedItem(prev => prev ? { ...prev, description: text } : null)}
              placeholder="Enter description..."
              multiline
              textAlignVertical="top"
            />
            
            <Text style={tw`text-gray-700 font-semibold mb-2`}>Status</Text>
            <View style={tw`flex-row`}>
              {['active', 'inactive', 'pending'].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setEditedItem(prev => prev ? { ...prev, status: status as any } : null)}
                  style={[
                    tw`mr-3 px-4 py-2 rounded-full border`,
                    editedItem.status === status 
                      ? tw`bg-blue-500 border-blue-500`
                      : tw`border-gray-300`
                  ]}
                >
                  <Text style={[
                    tw`font-medium capitalize`,
                    editedItem.status === status ? tw`text-white` : tw`text-gray-600`
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        
        <View style={tw`px-4 py-4 bg-white border-t border-gray-200`}>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              onPress={onClose}
              style={tw`flex-1 bg-gray-200 rounded-2xl p-4 mr-2 items-center`}
            >
              <Text style={tw`text-gray-700 font-semibold`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={tw`flex-1 bg-blue-500 rounded-2xl p-4 ml-2 items-center`}
            >
              <Text style={tw`text-white font-semibold`}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default function DataManagementScreen() {
  const [dataItems, setDataItems] = useState<DataItem[]>([])
  const [filteredItems, setFilteredItems] = useState<DataItem[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const headerAnim = useRef(new Animated.Value(-50)).current
  const contentAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    checkAdminAccess()
    loadData()
    
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
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  useEffect(() => {
    filterData()
  }, [dataItems, selectedType, searchQuery])

  const checkAdminAccess = async () => {
    try {
      const role = await AsyncStorage.getItem('role')
      if (role !== 'admin') {
        Alert.alert('Access Denied', 'You need admin privileges to manage data.', [
          { text: 'OK', onPress: () => router.back() }
        ])
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
    }
  }

  const loadData = () => {
    // Mock data - in real app, this would come from your backend
    const mockData: DataItem[] = [
      {
        id: '1',
        type: 'news',
        title: 'New Vaccination Guidelines Released',
        description: 'Updated vaccination protocols for poultry health management.',
        lastModified: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        type: 'pharmacy',
        title: 'MediVet Pharmacy Kigali',
        description: 'Full-service veterinary pharmacy in downtown Kigali.',
        lastModified: '2024-01-14',
        status: 'active'
      },
      {
        id: '3',
        type: 'veterinary',
        title: 'Dr. Patricia Uwimana',
        description: 'Specialized poultry veterinarian with 10+ years experience.',
        lastModified: '2024-01-13',
        status: 'active'
      },
      {
        id: '4',
        type: 'farm',
        title: 'Green Valley Poultry Farm',
        description: 'Large-scale commercial poultry operation.',
        lastModified: '2024-01-12',
        status: 'pending'
      },
      {
        id: '5',
        type: 'news',
        title: 'Market Price Updates',
        description: 'Latest poultry market prices and trends.',
        lastModified: '2024-01-11',
        status: 'inactive'
      },
    ]
    setDataItems(mockData)
  }

  const filterData = () => {
    let filtered = dataItems

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }

  const handleEdit = (item: DataItem) => {
    setSelectedItem(item)
    setEditModalVisible(true)
  }

  const handleSave = (updatedItem: DataItem) => {
    setDataItems(prev => prev.map(item => 
      item.id === updatedItem.id ? { ...updatedItem, lastModified: new Date().toISOString().split('T')[0] } : item
    ))
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert('Success', 'Item updated successfully!')
  }

  const handleDelete = (item: DataItem) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDataItems(prev => prev.filter(i => i.id !== item.id))
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          }
        }
      ]
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return 'newspaper-outline'
      case 'pharmacy': return 'storefront-outline'
      case 'veterinary': return 'medical-outline'
      case 'farm': return 'leaf-outline'
      default: return 'document-outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'
      case 'inactive': return '#6B7280'
      case 'pending': return '#F59E0B'
      default: return '#6B7280'
    }
  }

  const dataTypes = [
    { value: 'all', label: 'All Types', count: dataItems.length },
    { value: 'news', label: 'News', count: dataItems.filter(i => i.type === 'news').length },
    { value: 'pharmacy', label: 'Pharmacies', count: dataItems.filter(i => i.type === 'pharmacy').length },
    { value: 'veterinary', label: 'Veterinaries', count: dataItems.filter(i => i.type === 'veterinary').length },
    { value: 'farm', label: 'Farms', count: dataItems.filter(i => i.type === 'farm').length },
  ]

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      
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
              tw`pb-4`,
              { transform: [{ translateY: headerAnim }] }
            ]}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={tw` p-8 shadow-xl`}
            >
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-sm opacity-90`}>
                    Admin Panel
                  </Text>
                  <Text style={tw`text-white text-2xl font-bold`}>
                    Data Management 📊
                  </Text>
                  <Text style={tw`text-green-100 text-sm mt-1`}>
                    Edit and manage all content
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/admin/add-news' as any)}
                  style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Filters */}
          <Animated.View 
            style={[
              tw`px-4 mb-4`,
              { opacity: contentAnim }
            ]}
          >
            <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-4`}>
              <Text style={tw`text-gray-800 font-bold text-lg mb-3`}>Filters</Text>
              
              {/* Search */}
              <View style={tw`flex-row items-center bg-gray-50 rounded-xl p-3 mb-4`}>
                <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-3`} />
                <TextInput
                  style={tw`flex-1 text-gray-800`}
                  placeholder="Search content..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Type Filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={tw`flex-row`}>
                  {dataTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setSelectedType(type.value)}
                      style={[
                        tw`mr-3 px-4 py-2 rounded-full border flex-row items-center`,
                        selectedType === type.value 
                          ? tw`bg-green-500 border-green-500`
                          : tw`border-gray-300`
                      ]}
                    >
                      <Text style={[
                        tw`font-medium mr-1`,
                        selectedType === type.value ? tw`text-white` : tw`text-gray-600`
                      ]}>
                        {type.label}
                      </Text>
                      <View style={[
                        tw`px-2 py-1 rounded-full`,
                        selectedType === type.value ? tw`bg-white bg-opacity-20` : tw`bg-gray-200`
                      ]}>
                        <Text style={[
                          tw`text-xs font-bold`,
                          selectedType === type.value ? tw`text-white` : tw`text-gray-600`
                        ]}>
                          {type.count}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Data Items */}
            <View style={tw`bg-white rounded-2xl shadow-sm overflow-hidden`}>
              <View style={tw`p-5 border-b border-gray-100`}>
                <Text style={tw`text-gray-800 font-bold text-lg`}>
                  Content Items ({filteredItems.length})
                </Text>
              </View>
              
              {filteredItems.length === 0 ? (
                <View style={tw`p-10 items-center`}>
                  <Ionicons name="document-outline" size={48} color="#6B7280" />
                  <Text style={tw`text-gray-500 text-lg mt-4`}>No items found</Text>
                  <Text style={tw`text-gray-400 text-sm mt-2`}>Try adjusting your filters</Text>
                </View>
              ) : (
                filteredItems.map((item, index) => (
                  <View key={item.id} style={tw`p-5 ${index !== filteredItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <View style={tw`flex-row items-start justify-between`}>
                      <View style={tw`flex-1 mr-4`}>
                        <View style={tw`flex-row items-center mb-2`}>
                          <View style={tw`bg-gray-100 p-2 rounded-full mr-3`}>
                            <Ionicons 
                              name={getTypeIcon(item.type) as keyof typeof Ionicons.glyphMap} 
                              size={16} 
                              color="#6B7280" 
                            />
                          </View>
                          <Text style={tw`text-gray-800 font-semibold text-base flex-1`}>
                            {item.title}
                          </Text>
                          <View style={[tw`px-2 py-1 rounded-full`, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                            <Text style={[tw`text-xs font-medium capitalize`, { color: getStatusColor(item.status) }]}>
                              {item.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={tw`text-gray-600 text-sm mb-2`} numberOfLines={2}>
                          {item.description}
                        </Text>
                        <Text style={tw`text-gray-400 text-xs`}>
                          Last modified: {item.lastModified}
                        </Text>
                      </View>
                      <View style={tw`flex-row`}>
                        <TouchableOpacity
                          onPress={() => handleEdit(item)}
                          style={tw`bg-blue-100 p-2 rounded-full mr-2`}
                        >
                          <Ionicons name="pencil-outline" size={16} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(item)}
                          style={tw`bg-red-100 p-2 rounded-full`}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <EditModal
        visible={editModalVisible}
        item={selectedItem}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  )
}
