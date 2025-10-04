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
import tw from 'twrnc';

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
        { key: 'FARMER', label: 'Farmers', icon: 'leaf-outline', color: '#10B981' },
        { key: 'VETERINARY', label: 'Veterinarians', icon: 'medical-outline', color: '#EF4444' },
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
    }, []);

    useEffect(() => {
        let filtered = users;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user.location ? `${user.location.latitude}, ${user.location.longitude}` : '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by role
        if (selectedTab !== 'ALL') {
            filtered = filtered.filter(user => user.role === selectedTab);
        }

        // Sort by role and name
        filtered.sort((a, b) => {
            if (a.role !== b.role) {
                const roleOrder = { 'ADMIN': 0, 'VETERINARY': 1, 'FARMER': 2 };
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
            case UserRole.VETERINARY: return '#EF4444';
            case UserRole.FARMER: return '#10B981';
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

    const getLastSeen = (userId: string) => {
        // Simulate last seen - in real app this would come from server
        const lastSeenTimes: { [key: string]: string } = {
            'farmer_001': 'Online',
            'vet_001': 'Online',
            'admin_001': 'Last seen 2 hours ago'
        };
        return lastSeenTimes[userId] || 'Last seen recently';
    };

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'ALL') return users.length;
        return users.filter(user => user.role === tabKey).length;
    };

    if (loading) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text style={tw`text-gray-600 text-lg`}>Loading users...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />

            <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
                {/* Header */}
                <Animated.View style={[tw`pb-4`, { transform: [{ translateY: headerAnim }] }]}>
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        style={tw`p-8 shadow-xl`}
                    >
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <TouchableOpacity
                                style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back-outline" size={24} color="white" />
                            </TouchableOpacity>

                            <Text style={tw`text-white text-xl font-bold`}>Contacts</Text>

                            <DrawerButton />
                        </View>

                        {/* Stats */}
                        <View style={tw`bg-white bg-opacity-15 rounded-2xl p-6`}>
                            <Text style={tw`text-white font-bold text-lg mb-4`}>Community Chat</Text>
                            <View style={tw`flex-row justify-between`}>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-3xl font-bold`}>
                                        {users.filter(u => getOnlineStatus(u.id)).length}
                                    </Text>
                                    <Text style={tw`text-blue-100 text-xs font-medium`}>Online</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-3xl font-bold`}>
                                        {messages.length}
                                    </Text>
                                    <Text style={tw`text-blue-100 text-xs font-medium`}>Messages</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-3xl font-bold`}>
                                        {users.filter(u => u.role === UserRole.VETERINARY).length}
                                    </Text>
                                    <Text style={tw`text-blue-100 text-xs font-medium`}>Vets</Text>
                                </View>
                                <View style={tw`items-center flex-1`}>
                                    <Text style={tw`text-white text-3xl font-bold`}>{users.length}</Text>
                                    <Text style={tw`text-blue-100 text-xs font-medium`}>Total</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                    {/* Search Bar */}
                    <View style={tw`flex-row items-center bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-200`}>
                        <Ionicons name="search-outline" size={20} color="#6B7280" style={tw`mr-2`} />
                        <TextInput
                            style={tw`flex-1 text-gray-800 text-base`}
                            placeholder="Search users..."
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
                        style={tw`mb-6`}
                    >
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={tw`mr-3 px-4 py-3 rounded-2xl flex-row items-center ${selectedTab === tab.key
                                    ? 'bg-blue-500'
                                    : 'bg-white border border-gray-200'
                                    }`}
                                onPress={() => setSelectedTab(tab.key)}
                            >
                                <Ionicons
                                    name={tab.icon as any}
                                    size={18}
                                    color={selectedTab === tab.key ? 'white' : tab.color}
                                    style={tw`mr-2`}
                                />
                                <Text style={tw`${selectedTab === tab.key
                                    ? 'text-white'
                                    : 'text-gray-600'
                                    } font-medium mr-1`}>
                                    {tab.label}
                                </Text>
                                <View style={tw`${selectedTab === tab.key
                                    ? 'bg-white bg-opacity-20'
                                    : 'bg-gray-100'
                                    } px-2 py-1 rounded-full`}>
                                    <Text style={tw`${selectedTab === tab.key
                                        ? 'text-white'
                                        : 'text-gray-600'
                                        } text-xs font-bold`}>
                                        {getTabCount(tab.key)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Users List */}
                    {filteredUsers.length === 0 ? (
                        <View style={tw`items-center py-10`}>
                            <Ionicons name="people-outline" size={48} color="#6B7280" />
                            <Text style={tw`text-gray-500 text-lg mt-4`}>No users found</Text>
                        </View>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <TouchableOpacity
                                key={user.id}
                                style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4`}
                                onPress={() => handleUserPress(user)}
                                activeOpacity={0.7}
                            >
                                <View style={tw`flex-row items-center overflow-hidden relative`}>
                                    {/* Avatar */}
                                    <View style={[tw`w-16 h-16 rounded-full items-center justify-center mr-4`,
                                    { backgroundColor: getRoleColor(user.role) + '20' }]}>
                                        <Ionicons
                                            name={getRoleIcon(user.role)}
                                            size={24}
                                            color={getRoleColor(user.role)}
                                        />
                                        {getOnlineStatus(user.id) && <View className='absolute bottom-4 -right-0 w-3 h-3 rounded-full bg-green-400' />}
                                    </View>

                                    {/* User Info */}
                                    <View style={tw`flex-1 `}>
                                        <View style={tw`flex-row items-center justify-between mb-1`}>
                                            <View style={tw`flex-row items-center `}>
                                                <Text style={tw` font-bold text-gray-800 m-2`}>
                                                    {user.name}
                                                </Text>
                                                <View style={[tw`px-2 py-1 rounded-full`,
                                                { backgroundColor: getRoleColor(user.role) + '20' }]}>
                                                    <Text style={[tw`text-xs font-semibold capitalize`,
                                                    { color: getRoleColor(user.role) }]}>
                                                        {user.role.toLowerCase()}
                                                    </Text>
                                                </View>
                                            </View>

                                        </View>

                                        {/* Last Message Preview */}
                                        {(() => {
                                            const lastMsg = getLastMessage(user.id);
                                            return lastMsg ? (
                                                <Text style={tw`text-gray-600 text-sm mb-1`} numberOfLines={1}>
                                                    {lastMsg.sender.id === currentUser?.id ? '📤 ' : '📥 '}{lastMsg.content}
                                                </Text>
                                            ) : (
                                                <Text style={tw`text-gray-500 text-sm mb-1 italic`}>
                                                    Tap to start chatting
                                                </Text>
                                            );
                                        })()}

                                        <View style={tw`flex-row items-center`}>
                                            <Ionicons name="location-outline" size={14} color="#6B7280" style={tw`mr-1`} />
                                            <Text style={tw`text-gray-500 text-sm`}>
                                                {user.location ? `${user.location.latitude}, ${user.location.longitude}` : 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
}
