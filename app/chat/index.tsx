import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import CustomDrawer from '@/components/CustomDrawer';
import DrawerButton from '@/components/DrawerButton';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useDrawer } from '@/contexts/DrawerContext';
import { useUsers } from '@/contexts/UserContext';
import { User, UserRole } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import BottomTabs from '@/components/BottomTabs';

export default function ChatScreen() {
    const { currentUser } = useAuth();
    const { users, loading } = useUsers();
    const { messages, onlineUsers, setCurrentChat } = useChat();
    const { isDrawerVisible, setIsDrawerVisible } = useDrawer();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [filteredUsers, setFilteredUsers] = useState(users);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(-50)).current;

    const tabs = [
        { key: 'ALL', label: 'All Users', icon: 'people-outline', color: '#6B7280' },
        { key: 'FARMER', label: 'Farmers', icon: 'leaf-outline', color: '#F59E0B' },
        { key: 'VETERINARY', label: 'Veterinarians', icon: 'medical-outline', color: '#10B981' },
        { key: 'ADMIN', label: 'Admins', icon: 'shield-outline', color: '#7C3AED' },
    ];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(headerAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, headerAnim]);

    useEffect(() => {
        let filtered = users;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by role
        if (selectedTab !== 'ALL') {
            filtered = filtered.filter(user => user.role === selectedTab);
        }

        // Sort by role and name
        filtered.sort((a, b) => {
            if (a.role !== b.role) {
                const roleOrder = {
                    [UserRole.ADMIN]: 1,
                    [UserRole.VETERINARY]: 2,
                    [UserRole.FARMER]: 3,
                    [UserRole.PHARMACY]: 4,
                };
                return roleOrder[a.role] - roleOrder[b.role];
            }
            return a.name.localeCompare(b.name);
        });

        setFilteredUsers(filtered);
    }, [users, searchQuery, selectedTab]);

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN: return 'shield';
            case UserRole.VETERINARY: return 'medical';
            case UserRole.FARMER: return 'leaf';
            default: return 'person';
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN: return '#7C3AED';
            case UserRole.VETERINARY: return '#10B981';
            case UserRole.FARMER: return '#F59E0B';
            default: return '#6B7280';
        }
    };

    const handleUserPress = (user: User) => {
        setCurrentChat(user);
        router.push(`/chat/currentChat`);
    };

    const getLastMessage = (userId: string) => {
        // Filter messages between current user and this user
        const userMessages = messages.filter(msg =>
            (msg.sender.id === currentUser?.id && msg.receiver.id === userId) ||
            (msg.sender.id === userId && msg.receiver.id === currentUser?.id)
        );

        // Return the most recent message
        return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
    };

    const getOnlineStatus = (userId: string) => {
        return onlineUsers.has(userId);
    };

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'ALL') return users.length;
        return users.filter(user => user.role === tabKey).length;
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-gray-600 text-lg">Loading users...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />

            <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
                {/* Header */}
                <Animated.View style={{ transform: [{ translateY: headerAnim }] }} className="pb-4">
                    <LinearGradient
                        colors={['#F59E0B', '#D97706']}
                        className="px-6 py-8 shadow-lg"
                    >
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity
                                className="p-3 rounded-full"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back-outline" size={24} color="white" />
                            </TouchableOpacity>

                            <Text className="text-white text-xl font-bold">Contacts</Text>

                            <DrawerButton />
                        </View>
                    </LinearGradient>
                </Animated.View>

                <ScrollView 
                    className="flex-1 px-4" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
                >
                    {/* Search Bar */}
                    <View className="flex-row items-center bg-white rounded-3xl px-4 py-2 mb-6 shadow-sm border border-gray-200">
                        <Ionicons name="search-outline" size={20} color="#6B7280" style={{ marginRight: 12 }} />
                        <TextInput
                            className="flex-1 text-gray-800 text-base"
                            placeholder="Search contacts..."
                            placeholderTextColor="#6B7280"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Filter Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-6"
                        contentContainerStyle={{ paddingHorizontal: 4 }}
                    >
                        <View className="flex-row gap-3">
                            {tabs.map((tab) => (
                                <TouchableOpacity
                                    key={tab.key}
                                    className={`px-4 py-3 rounded-2xl flex-row items-center min-w-24 ${
                                        selectedTab === tab.key
                                            ? 'shadow-sm'
                                            : 'bg-white border border-gray-200'
                                    }`}
                                    style={{
                                        backgroundColor: selectedTab === tab.key ? '#F59E0B' : '#FFFFFF',
                                        shadowColor: selectedTab === tab.key ? '#F59E0B' : 'transparent',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 4
                                    }}
                                    onPress={() => setSelectedTab(tab.key)}
                                >
                                    <Ionicons
                                        name={tab.icon as any}
                                        size={18}
                                        color={selectedTab === tab.key ? 'white' : tab.color}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text className={`${selectedTab === tab.key
                                        ? 'text-white'
                                        : 'text-gray-600'
                                    } font-medium mr-2`}>
                                        {tab.label}
                                    </Text>
                                    <View 
                                        className="px-2 py-1 rounded-full"
                                        style={{
                                            backgroundColor: selectedTab === tab.key 
                                                ? 'rgba(255, 255, 255, 0.2)' 
                                                : '#F3F4F6'
                                        }}
                                    >
                                        <Text className={`${selectedTab === tab.key
                                            ? 'text-white'
                                            : 'text-gray-600'
                                        } text-xs font-bold`}>
                                            {getTabCount(tab.key)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Users List */}
                    {filteredUsers.length === 0 ? (
                        <View className="items-center py-16">
                            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                                <Ionicons name="people-outline" size={32} color="#9CA3AF" />
                            </View>
                            <Text className="text-gray-500 text-lg font-medium">No contacts found</Text>
                            <Text className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</Text>
                        </View>
                    ) : (
                        filteredUsers.map((user) => {
                            const lastMsg = getLastMessage(user.id);
                            const isOnline = getOnlineStatus(user.id);
                            
                            return (
                                <TouchableOpacity
                                    key={user.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4"
                                    onPress={() => handleUserPress(user)}
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center">
                                        {/* Avatar */}
                                        <View className="relative mr-4">
                                            <View 
                                                className="w-14 h-14 rounded-full items-center justify-center"
                                                style={{ backgroundColor: getRoleColor(user.role) + '20' }}
                                            >
                                                <Ionicons
                                                    name={getRoleIcon(user.role)}
                                                    size={22}
                                                    color={getRoleColor(user.role)}
                                                />
                                            </View>
                                            {isOnline && (
                                                <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                                            )}
                                        </View>

                                        {/* User Info */}
                                        <View className="flex-1">
                                            <View className="flex-row items-center mb-2">
                                                <Text className="font-bold text-gray-800 mr-2 flex-1" numberOfLines={1}>
                                                    {user.name}
                                                </Text>
                                                <View 
                                                    className="px-2 py-1 rounded-full"
                                                    style={{ backgroundColor: getRoleColor(user.role) + '20' }}
                                                >
                                                    <Text 
                                                        className="text-xs font-semibold capitalize"
                                                        style={{ color: getRoleColor(user.role) }}
                                                    >
                                                        {user.role.toLowerCase()}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Last Message Preview */}
                                            {lastMsg ? (
                                                <View className="flex-row items-center mb-1">
                                                    <Ionicons 
                                                        name={lastMsg.sender.id === currentUser?.id ? "arrow-up-outline" : "arrow-down-outline"} 
                                                        size={14} 
                                                        color={lastMsg.sender.id === currentUser?.id ? "#3B82F6" : "#10B981"} 
                                                    />
                                                    <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                                                        {lastMsg.content}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View className="flex-row items-center mb-1">
                                                    <Ionicons name="chatbubble-outline" size={14} color="#9CA3AF" />
                                                    <Text className="text-gray-400 text-sm ml-2 italic">
                                                        No messages yet
                                                    </Text>
                                                </View>
                                            )}

                                            {/* Status */}
                                            <View className="flex-row items-center">
                                                <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                                                <Text className="text-gray-400 text-xs ml-1">
                                                    {isOnline ? 'Online' : 'Offline'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            </Animated.View>
            <BottomTabs/>
        </View>
    );
}
