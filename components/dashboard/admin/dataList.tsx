import { View, TextInput, TouchableOpacity, ScrollView, Text } from "react-native";
import tw from 'twrnc';
import { useUsers } from '@/contexts/UserContext';
import { useFarms } from '@/contexts/FarmContext';
import { useSchedules } from '@/contexts/ScheduleContext';
import { useState } from 'react';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminDataList() {
    const { users } = useUsers();
    const { farms } = useFarms();
    const { schedules } = useSchedules();
    const [selectedTab, setSelectedTab] = useState<'users' | 'farms' | 'schedules'>('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string>('all');


    const getFilteredData = () => {
        let filteredData: any[] = [];

        switch (selectedTab) {
            case 'users':
                filteredData = users.filter(user => {
                    const matchesSearch = !searchQuery ||
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesFilter = selectedFilter === 'all' || user.role === selectedFilter;
                    return matchesSearch && matchesFilter;
                });
                break;

            case 'farms':
                filteredData = farms.filter(farm => {
                    const matchesSearch = !searchQuery ||
                        farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        `${farm.location.latitude}, ${farm.location.longitude}`.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesFilter = selectedFilter === 'all' || farm.healthStatus === selectedFilter;
                    return matchesSearch && matchesFilter;
                });
                break;

            case 'schedules':
                filteredData = schedules.filter(schedule => {
                    const matchesSearch = !searchQuery ||
                        schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        schedule.description.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesFilter = selectedFilter === 'all' || schedule.status === selectedFilter;
                    return matchesSearch && matchesFilter;
                });
                break;

            default:
                filteredData = [];
        }

        return filteredData;
    };


    const getFilterOptions = () => {
        switch (selectedTab) {
            case 'users':
                return [
                    { key: 'all', label: 'All Users' },
                    { key: 'farmer', label: 'Farmers' },
                    { key: 'veterinary', label: 'Veterinaries' },
                    { key: 'admin', label: 'Admins' },
                ];

            case 'farms':
                return [
                    { key: 'all', label: 'All Farms' },
                    { key: 'excellent', label: 'Excellent' },
                    { key: 'good', label: 'Good' },
                    { key: 'fair', label: 'Fair' },
                    { key: 'poor', label: 'Poor' },
                ];

            case 'schedules':
                return [
                    { key: 'all', label: 'All Schedules' },
                    { key: 'scheduled', label: 'Scheduled' },
                    { key: 'completed', label: 'Completed' },
                    { key: 'cancelled', label: 'Cancelled' },
                ];

            default:
                return [{ key: 'all', label: 'All' }];
        }
    };



    const data = getFilteredData();

    return (
        <View style={tw`px-4`}>
            {/* Tab Navigation */}
            <View style={tw`bg-white rounded-2xl p-2 mb-4 shadow-sm`}>
                <View style={tw`flex-row`}>
                    {(['users', 'farms', 'schedules'] as const).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                tw`flex-1 py-3 px-4 rounded-xl`,
                                selectedTab === tab ? tw`bg-amber-500` : tw`bg-transparent`
                            ]}
                            onPress={() => {
                                setSelectedTab(tab);
                                setSelectedFilter('all'); // Reset filter when changing tabs
                            }}
                        >
                            <Text style={[
                                tw`text-center font-semibold capitalize`,
                                selectedTab === tab ? tw`text-white` : tw`text-gray-600`
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Data Count Header */}
            <View style={tw`bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4`}>
                <View style={tw`flex-row items-center justify-between`}>
                    <View>
                        <Text style={tw`text-amber-800 font-bold text-lg capitalize`}>{selectedTab}</Text>
                        <Text style={tw`text-amber-600 text-sm`}>{data.length} items found</Text>
                    </View>
                    <View style={tw`bg-amber-500 p-3 rounded-full`}>
                        <Ionicons 
                            name={
                                selectedTab === 'users' ? 'people-outline' :
                                selectedTab === 'farms' ? 'leaf-outline' : 'calendar-outline'
                            } 
                            size={24} 
                            color="white" 
                        />
                    </View>
                </View>
            </View>

            {/* Search and Filter */}
            <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm`}>
                <View style={tw`flex-row items-center mb-3`}>
                    <View style={tw`flex-1 bg-gray-100 rounded-xl px-4 py-3 mr-3`}>
                        <TextInput
                            style={tw`text-gray-800`}
                            placeholder={`Search ${selectedTab}...`}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={tw`bg-amber-500 p-3 rounded-xl`}>
                        <Ionicons name="search-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={tw`flex-row gap-2`}>
                        {getFilterOptions().map((option) => (
                            <TouchableOpacity
                                key={option.key}
                                style={[
                                    tw`px-4 py-2 rounded-full border`,
                                    selectedFilter === option.key
                                        ? tw`bg-amber-500 border-amber-500`
                                        : tw`bg-white border-gray-200`
                                ]}
                                onPress={() => setSelectedFilter(option.key)}
                            >
                                <Text style={[
                                    tw`font-medium`,
                                    selectedFilter === option.key ? tw`text-white` : tw`text-gray-600`
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Data List */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {data.length === 0 ? (
                    <View style={tw`bg-white rounded-2xl p-8 items-center`}>
                        <View style={tw`bg-amber-100 p-6 rounded-full mb-4`}>
                            <Ionicons 
                                name={
                                    selectedTab === 'users' ? 'people-outline' :
                                    selectedTab === 'farms' ? 'leaf-outline' : 'calendar-outline'
                                } 
                                size={48} 
                                color="#D97706" 
                            />
                        </View>
                        <Text style={tw`text-gray-800 font-bold text-lg mb-2`}>No {selectedTab} found</Text>
                        <Text style={tw`text-gray-600 text-center`}>
                            {searchQuery ? 
                                `No ${selectedTab} match your search criteria` : 
                                `No ${selectedTab} available in the system`
                            }
                        </Text>
                    </View>
                ) : (
                    data.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}
                        onPress={() => {
                            // Navigate to detail screen based on type
                            if (selectedTab === 'users') {
                                router.push(`/user/user-detail`);
                            } else if (selectedTab === 'farms') {
                                router.push(`/farm/farm-detail`);
                            } else if (selectedTab === 'schedules') {
                                router.push(`/communication/schedule-detail`);
                            }
                        }}
                    >
                        {selectedTab === 'users' && (
                            <View style={tw`flex-row items-center justify-between`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`font-bold text-gray-800`}>{item.name}</Text>
                                    <Text style={tw`text-gray-600`}>{item.email}</Text>
                                    <Text style={tw`text-sm text-gray-500`}>{item.location}</Text>
                                </View>
                                <View style={[
                                    tw`px-3 py-1 rounded-full`,
                                    item.role === 'admin' ? tw`bg-purple-100` :
                                        item.role === 'farmer' ? tw`bg-green-100` : tw`bg-blue-100`
                                ]}>
                                    <Text style={[
                                        tw`text-xs font-bold capitalize`,
                                        item.role === 'admin' ? tw`text-purple-600` :
                                            item.role === 'farmer' ? tw`text-green-600` : tw`text-blue-600`
                                    ]}>
                                        {item.role}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {selectedTab === 'farms' && (
                            <View style={tw`flex-row items-center justify-between`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`font-bold text-gray-800`}>{item.name}</Text>
                                    <Text style={tw`text-gray-600`}>{item.location.latitude}, {item.location.longitude}</Text>
                                    <Text style={tw`text-sm text-gray-500`}>
                                        {item.livestock.total} chickens • {item.size} hectares
                                    </Text>
                                </View>
                                <View style={[
                                    tw`px-3 py-1 rounded-full`,
                                    item.healthStatus === 'excellent' ? tw`bg-green-100` :
                                        item.healthStatus === 'good' ? tw`bg-blue-100` :
                                            item.healthStatus === 'fair' ? tw`bg-yellow-100` : tw`bg-red-100`
                                ]}>
                                    <Text style={[
                                        tw`text-xs font-bold capitalize`,
                                        item.healthStatus === 'excellent' ? tw`text-green-600` :
                                            item.healthStatus === 'good' ? tw`text-blue-600` :
                                                item.healthStatus === 'fair' ? tw`text-yellow-600` : tw`text-red-600`
                                    ]}>
                                        {item.healthStatus}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {selectedTab === 'schedules' && (
                            <View style={tw`flex-row items-center justify-between`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`font-bold text-gray-800`}>{item.title}</Text>
                                    <Text style={tw`text-gray-600`}>{item.description}</Text>
                                    <Text style={tw`text-sm text-gray-500`}>
                                        {new Date(item.scheduledDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={[
                                    tw`px-3 py-1 rounded-full`,
                                    item.status === 'completed' ? tw`bg-green-100` :
                                        item.status === 'scheduled' ? tw`bg-blue-100` : tw`bg-gray-100`
                                ]}>
                                    <Text style={[
                                        tw`text-xs font-bold capitalize`,
                                        item.status === 'completed' ? tw`text-green-600` :
                                            item.status === 'scheduled' ? tw`text-blue-600` : tw`text-gray-600`
                                    ]}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}