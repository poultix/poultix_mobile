import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

interface NewsArticle {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    publishedDate: string;
    category: string;
    readTime: number;
    image?: string;
    tags: string[];
}

const NewsDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Mock article data - in real app, fetch from API
    const mockArticle: NewsArticle = {
        id: id as string,
        title: 'New Vaccination Protocols for Poultry Farmers in Rwanda',
        content: `
Rwanda's veterinary authorities have announced updated vaccination protocols for poultry farmers across the country. The new guidelines, effective immediately, aim to strengthen disease prevention measures and improve biosecurity standards.

Key Updates:
• Mandatory vaccination schedules for Newcastle disease and Gumboro disease
• Enhanced record-keeping requirements for all poultry farms
• New reporting protocols for suspected disease outbreaks
• Increased focus on biosecurity measures and farm hygiene

The Rwanda Agriculture and Animal Resources Development Board (RAB) emphasizes that these protocols are designed to protect both local poultry production and export markets. Farmers are encouraged to work closely with certified veterinarians to implement these measures.

"This is a crucial step in safeguarding our poultry industry," said Dr. Marie Claire Uwimana, Director of Animal Health at RAB. "By following these protocols, farmers can significantly reduce the risk of disease outbreaks and ensure the health of their flocks."

Farmers are advised to:
1. Maintain up-to-date vaccination records
2. Practice strict biosecurity measures
3. Report any unusual symptoms immediately
4. Work with licensed veterinarians for vaccination services

The new protocols also include training programs for farmers and veterinary professionals to ensure proper implementation. Free training sessions will be organized in all districts starting next month.

For more information, contact your local veterinary officer or visit the RAB website.
        `,
        excerpt: 'Rwanda introduces comprehensive vaccination protocols to strengthen poultry health and biosecurity measures.',
        author: 'Dr. Jean Baptiste Nkurunziza',
        publishedDate: '2024-10-15',
        category: 'Vaccination',
        readTime: 3,
        tags: ['vaccination', 'poultry', 'biosecurity', 'rwanda', 'rab'],
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setArticle(mockArticle);
            setLoading(false);
        }, 1000);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // In real app, save to bookmarks
    };

    const shareArticle = () => {
        // In real app, implement share functionality
        alert('Share functionality would be implemented here');
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Vaccination': 'bg-blue-100 text-blue-800',
            'Disease': 'bg-red-100 text-red-800',
            'News': 'bg-green-100 text-green-800',
            'Research': 'bg-purple-100 text-purple-800',
            'Policy': 'bg-orange-100 text-orange-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={tw`text-gray-600 mt-4`}>Loading article...</Text>
            </View>
        );
    }

    if (!article) {
        return (
            <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Ionicons name="newspaper-outline" size={64} color="#D1D5DB" />
                <Text style={tw`text-gray-500 text-lg mt-4`}>Article not found</Text>
                <TouchableOpacity
                    style={tw`mt-4 bg-blue-500 px-6 py-3 rounded-xl`}
                    onPress={() => router.back()}
                >
                    <Text style={tw`text-white font-medium`}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            {/* Header */}
            <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <View style={tw`flex-row items-center justify-between mb-4`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={tw`flex-row space-x-2`}>
                        <TouchableOpacity
                            onPress={shareArticle}
                            style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                        >
                            <Ionicons name="share-outline" size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={toggleBookmark}
                            style={tw`bg-white bg-opacity-20 p-2 rounded-xl`}
                        >
                            <Ionicons
                                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                size={20}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <View style={tw`px-2 py-1 rounded-full self-start mb-3 ${getCategoryColor(article.category)}`}>
                        <Text style={tw`text-xs font-bold`}>
                            {article.category}
                        </Text>
                    </View>

                    <Text style={tw`text-white text-2xl font-bold mb-3 leading-8`}>
                        {article.title}
                    </Text>

                    <View style={tw`flex-row items-center justify-between`}>
                        <View style={tw`flex-row items-center`}>
                            <Ionicons name="person-circle-outline" size={16} color="#E0E7FF" style={tw`mr-2`} />
                            <Text style={tw`text-blue-100 text-sm`}>
                                {article.author}
                            </Text>
                        </View>

                        <View style={tw`flex-row items-center`}>
                            <Ionicons name="time-outline" size={14} color="#E0E7FF" style={tw`mr-1`} />
                            <Text style={tw`text-blue-100 text-sm`}>
                                {article.readTime} min read
                            </Text>
                        </View>
                    </View>

                    <Text style={tw`text-blue-200 text-sm mt-2`}>
                        {article.publishedDate}
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Article Content */}
                    <Text style={tw`text-gray-700 text-base leading-7 mb-6`}>
                        {article.content.trim().split('\n').map((paragraph, index) => {
                            if (paragraph.trim() === '') return null;

                            // Check if it's a bullet point (starts with •)
                            if (paragraph.trim().startsWith('•')) {
                                return (
                                    <View key={index} style={tw`flex-row items-start mb-2`}>
                                        <Text style={tw`text-blue-500 mr-2 mt-1`}>•</Text>
                                        <Text style={tw`text-gray-700 text-base leading-7 flex-1`}>
                                            {paragraph.trim().substring(1).trim()}
                                        </Text>
                                    </View>
                                );
                            }

                            // Check if it's a numbered list
                            if (/^\d+\./.test(paragraph.trim())) {
                                return (
                                    <View key={index} style={tw`flex-row items-start mb-2`}>
                                        <Text style={tw`text-blue-500 mr-2 font-medium min-w-[20px]`}>
                                            {paragraph.trim().match(/^\d+\./)?.[0]}
                                        </Text>
                                        <Text style={tw`text-gray-700 text-base leading-7 flex-1`}>
                                            {paragraph.trim().substring(paragraph.trim().indexOf('.') + 1).trim()}
                                        </Text>
                                    </View>
                                );
                            }

                            return (
                                <Text key={index} style={tw`text-gray-700 text-base leading-7 mb-4`}>
                                    {paragraph.trim()}
                                </Text>
                            );
                        })}
                    </Text>

                    {/* Tags */}
                    <View style={tw`flex-row flex-wrap mb-6`}>
                        {article.tags.map((tag, index) => (
                            <View key={index} style={tw`bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2`}>
                                <Text style={tw`text-gray-600 text-sm font-medium`}>
                                    #{tag}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Author Bio */}
                    <View style={tw`bg-gray-50 rounded-2xl p-5 mb-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <View style={tw`w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3`}>
                                <Ionicons name="person" size={20} color="white" />
                            </View>
                            <View>
                                <Text style={tw`text-gray-900 font-semibold`}>{article.author}</Text>
                                <Text style={tw`text-gray-600 text-sm`}>Veterinary Specialist</Text>
                            </View>
                        </View>
                        <Text style={tw`text-gray-700 text-sm leading-5`}>
                            Expert in animal health and disease prevention with over 15 years of experience
                            in veterinary medicine across East Africa.
                        </Text>
                    </View>

                    {/* Related Articles */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-900 font-bold text-lg mb-4`}>Related Articles</Text>

                        <TouchableOpacity style={tw`bg-white border border-gray-200 rounded-2xl p-4 mb-3`}>
                            <Text style={tw`text-gray-900 font-medium mb-2`}>
                                Biosecurity Measures for Poultry Farms
                            </Text>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>
                                Essential practices to prevent disease outbreaks in poultry operations.
                            </Text>
                            <Text style={tw`text-blue-600 text-sm font-medium`}>Read More →</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={tw`bg-white border border-gray-200 rounded-2xl p-4`}>
                            <Text style={tw`text-gray-900 font-medium mb-2`}>
                                Newcastle Disease: Latest Research
                            </Text>
                            <Text style={tw`text-gray-600 text-sm mb-2`}>
                                New findings on Newcastle disease prevention and treatment.
                            </Text>
                            <Text style={tw`text-blue-600 text-sm font-medium`}>Read More →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={tw`flex-row space-x-3`}>
                        <TouchableOpacity
                            style={tw`flex-1 bg-blue-500 py-4 rounded-2xl flex-row items-center justify-center`}
                            onPress={shareArticle}
                        >
                            <Ionicons name="share-outline" size={18} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white font-bold`}>Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`flex-1 bg-gray-100 py-4 rounded-2xl flex-row items-center justify-center`}
                            onPress={() => router.push('/news')}
                        >
                            <Ionicons name="newspaper-outline" size={18} color="#6B7280" style={tw`mr-2`} />
                            <Text style={tw`text-gray-700 font-bold`}>More News</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default NewsDetailScreen;
