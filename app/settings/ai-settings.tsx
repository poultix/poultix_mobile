import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
    Switch,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import { IOSDesign } from '@/constants/iosDesign';

// Import local AI services  
import { LocalAIService, PH_DISEASE_DATABASE } from '@/services/ai/localAIService';

export default function AISettingsScreen() {
  const [showStats, setShowStats] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDisease, setExpandedDisease] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getDiseaseCount = () => {
    let count = 0;
    Object.values(PH_DISEASE_DATABASE).forEach((category: any) => {
      count += Object.keys(category).length;
    });
    return count;
  };

  const getDiseasesForCategory = (category: string) => {
    if (category === 'all') {
      const allDiseases: any[] = [];
      Object.entries(PH_DISEASE_DATABASE).forEach(([catName, diseases]) => {
        Object.entries(diseases as any).forEach(([name, info]) => {
          allDiseases.push({ name, ...(info as any), category: catName });
        });
      });
      return allDiseases;
    }
    const categoryData = (PH_DISEASE_DATABASE as any)[category];
    if (!categoryData) return [];
    
    return Object.entries(categoryData).map(([name, info]) => ({
      name,
      ...(info as any),
      category
    }));
  };

  const testPHAnalysis = async (ph: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const response = await LocalAIService.generateResponse(`pH ${ph}`);
    Alert.alert(
      `pH ${ph} Analysis`,
      response.substring(0, 500) + '...',
      [{ text: 'OK' }]
    );
  };

  const categories = [
    { id: 'all', name: 'All Diseases', icon: 'list-outline', color: IOSDesign.colors.systemBlue },
    { id: 'acidosis', name: 'Acidosis', icon: 'trending-down-outline', color: IOSDesign.colors.systemRed },
    { id: 'alkalosis', name: 'Alkalosis', icon: 'trending-up-outline', color: IOSDesign.colors.systemOrange },
    { id: 'nutritional', name: 'Nutritional', icon: 'nutrition-outline', color: IOSDesign.colors.systemGreen },
    { id: 'infections', name: 'Infections', icon: 'bug-outline', color: IOSDesign.colors.systemPurple },
  ];

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: IOSDesign.colors.background.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          {/* Header */}
          <View style={tw`px-4 py-4`}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={tw`flex-row items-center mb-4`}
            >
              <Ionicons name="arrow-back" size={24} color={IOSDesign.colors.systemBlue} />
              <Text style={[tw`ml-2`, { 
                color: IOSDesign.colors.systemBlue,
                fontSize: IOSDesign.typography.body.fontSize,
              }]}>
                Back to AI
              </Text>
            </TouchableOpacity>

            <View style={[
              tw`rounded-3xl p-6 mb-6`,
              {
                backgroundColor: IOSDesign.colors.systemBlue,
                minHeight: 160,
              },
              IOSDesign.shadows.medium,
            ]}>
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={[
                    tw`mb-2`,
                    {
                      fontSize: IOSDesign.typography.title2.fontSize,
                      fontWeight: IOSDesign.typography.title2.fontWeight as any,
                      color: IOSDesign.colors.text.inverse,
                    }
                  ]}>
                    Local AI Settings 🤖
                  </Text>
                  <Text style={[
                    {
                      fontSize: IOSDesign.typography.subheadline.fontSize,
                      color: 'rgba(255,255,255,0.8)',
                    }
                  ]}>
                    pH Disease Knowledge Base
                  </Text>
                </View>
                <View style={tw`bg-white bg-opacity-20 p-3 rounded-2xl`}>
                  <Ionicons name="flask" size={32} color="white" />
                </View>
              </View>

              {/* Stats */}
              <View style={tw`flex-row justify-between mt-2`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text style={[tw`text-white text-2xl font-bold`]}>
                    {getDiseaseCount()}
                  </Text>
                  <Text style={[tw`text-white text-xs opacity-80`]}>
                    Total Diseases
                  </Text>
                </View>
                <View style={tw`flex-1 mx-2`}>
                  <Text style={[tw`text-white text-2xl font-bold`]}>
                    4
                  </Text>
                  <Text style={[tw`text-white text-xs opacity-80`]}>
                    Categories
                  </Text>
                </View>
                <View style={tw`flex-1 ml-2`}>
                  <Text style={[tw`text-white text-2xl font-bold`]}>
                    100%
                  </Text>
                  <Text style={[tw`text-white text-xs opacity-80`]}>
                    Local Processing
                  </Text>
                </View>
              </View>
            </View>

            {/* pH Test Buttons */}
            <View style={[
              tw`rounded-2xl p-4 mb-6`,
              {
                backgroundColor: IOSDesign.colors.background.primary,
              },
              IOSDesign.shadows.small,
            ]}>
              <Text style={[
                tw`mb-3`,
                {
                  fontSize: IOSDesign.typography.headline.fontSize,
                  fontWeight: IOSDesign.typography.headline.fontWeight as any,
                  color: IOSDesign.colors.text.primary,
                }
              ]}>
                Test pH Analysis
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={tw`flex-row gap-3`}>
                  {[4.5, 5.5, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(ph => (
                    <TouchableOpacity
                      key={ph}
                      onPress={() => testPHAnalysis(ph)}
                      style={[
                        tw`px-4 py-2 rounded-xl`,
                        {
                          backgroundColor: 
                            ph < 6.5 ? IOSDesign.colors.systemRed :
                            ph <= 7.5 ? IOSDesign.colors.systemGreen :
                            IOSDesign.colors.systemOrange
                        }
                      ]}
                    >
                      <Text style={tw`text-white font-semibold`}>pH {ph}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-6`}>
              <View style={tw`flex-row gap-3`}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedCategory(cat.id);
                    }}
                    style={[
                      tw`flex-row items-center px-4 py-2 rounded-xl`,
                      {
                        backgroundColor: selectedCategory === cat.id 
                          ? cat.color 
                          : IOSDesign.colors.background.secondary
                      }
                    ]}
                  >
                    <Ionicons 
                      name={cat.icon as any} 
                      size={16} 
                      color={selectedCategory === cat.id ? 'white' : cat.color} 
                    />
                    <Text style={[
                      tw`ml-2`,
                      {
                        color: selectedCategory === cat.id 
                          ? 'white' 
                          : IOSDesign.colors.text.primary,
                        fontWeight: selectedCategory === cat.id ? '600' : '400',
                      }
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Disease List */}
            <View>
              <Text style={[
                tw`mb-4`,
                {
                  fontSize: IOSDesign.typography.headline.fontSize,
                  fontWeight: IOSDesign.typography.headline.fontWeight as any,
                  color: IOSDesign.colors.text.primary,
                }
              ]}>
                Disease Database
              </Text>

              {getDiseasesForCategory(selectedCategory).map((disease, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setExpandedDisease(expandedDisease === disease.name ? null : disease.name);
                  }}
                  style={[
                    tw`mb-3 p-4 rounded-2xl`,
                    {
                      backgroundColor: IOSDesign.colors.background.primary,
                    },
                    IOSDesign.shadows.small,
                  ]}
                >
                  <View style={tw`flex-row items-center justify-between mb-2`}>
                    <Text style={[
                      tw`flex-1 mr-2`,
                      {
                        fontSize: IOSDesign.typography.bodyEmphasized.fontSize,
                        fontWeight: IOSDesign.typography.bodyEmphasized.fontWeight as any,
                        color: IOSDesign.colors.text.primary,
                      }
                    ]}>
                      {disease.name}
                    </Text>
                    <View style={[
                      tw`px-2 py-1 rounded-full`,
                      { 
                        backgroundColor: 
                          disease.severity === 'critical' ? IOSDesign.colors.systemRed :
                          disease.severity === 'high' ? IOSDesign.colors.systemOrange :
                          disease.severity === 'medium' ? IOSDesign.colors.systemYellow :
                          IOSDesign.colors.systemGreen
                      }
                    ]}>
                      <Text style={tw`text-white text-xs font-bold`}>
                        {disease.severity?.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-row items-center mb-2`}>
                    <Ionicons name="water-outline" size={14} color={IOSDesign.colors.systemBlue} />
                    <Text style={[
                      tw`ml-2 mr-4`,
                      { 
                        fontSize: IOSDesign.typography.caption1.fontSize,
                        color: IOSDesign.colors.text.secondary,
                      }
                    ]}>
                      pH {disease.phRange?.min}-{disease.phRange?.max}
                    </Text>
                    <Ionicons name="skull-outline" size={14} color={IOSDesign.colors.systemRed} />
                    <Text style={[
                      tw`ml-2`,
                      { 
                        fontSize: IOSDesign.typography.caption1.fontSize,
                        color: IOSDesign.colors.text.secondary,
                      }
                    ]}>
                      {disease.mortality}
                    </Text>
                  </View>

                  {expandedDisease === disease.name && (
                    <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
                      <Text style={[
                        tw`mb-2`,
                        {
                          fontSize: IOSDesign.typography.subheadlineEmphasized.fontSize,
                          fontWeight: IOSDesign.typography.subheadlineEmphasized.fontWeight as any,
                          color: IOSDesign.colors.text.primary,
                        }
                      ]}>
                        Symptoms:
                      </Text>
                      <Text style={[
                        tw`mb-3`,
                        { 
                          fontSize: IOSDesign.typography.footnote.fontSize,
                          color: IOSDesign.colors.text.secondary,
                        }
                      ]}>
                        {disease.symptoms?.join(', ')}
                      </Text>

                      <Text style={[
                        tw`mb-2`,
                        {
                          fontSize: IOSDesign.typography.subheadlineEmphasized.fontSize,
                          fontWeight: IOSDesign.typography.subheadlineEmphasized.fontWeight as any,
                          color: IOSDesign.colors.text.primary,
                        }
                      ]}>
                        Quick Measures:
                      </Text>
                      {disease.quickMeasures?.slice(0, 3).map((measure: string, i: number) => (
                        <Text key={i} style={[
                          tw`mb-1`,
                          { 
                            fontSize: IOSDesign.typography.footnote.fontSize,
                            color: IOSDesign.colors.text.secondary,
                          }
                        ]}>
                          {measure}
                        </Text>
                      ))}
                    </View>
                  )}

                  <View style={tw`flex-row items-center justify-end mt-2`}>
                    <Ionicons 
                      name={expandedDisease === disease.name ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={IOSDesign.colors.text.tertiary} 
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Info Card */}
            <View style={[
              tw`rounded-2xl p-4 mt-6`,
              {
                backgroundColor: IOSDesign.colors.systemBlue,
              }
            ]}>
              <View style={tw`flex-row items-center mb-2`}>
                <Ionicons name="information-circle" size={20} color="white" />
                <Text style={[
                  tw`ml-2`,
                  {
                    fontSize: IOSDesign.typography.headline.fontSize,
                    fontWeight: IOSDesign.typography.headline.fontWeight as any,
                    color: 'white',
                  }
                ]}>
                  About Local AI
                </Text>
              </View>
              <Text style={[
                tw`mb-2`,
                {
                  fontSize: IOSDesign.typography.footnote.fontSize,
                  color: 'rgba(255,255,255,0.9)',
                }
              ]}>
                This AI runs completely offline on your device. It includes a comprehensive database of pH-related poultry diseases with symptoms, treatments, and emergency quick measures.
              </Text>
              <Text style={[
                {
                  fontSize: IOSDesign.typography.footnote.fontSize,
                  color: 'rgba(255,255,255,0.9)',
                }
              ]}>
                No internet connection or API keys required. All data is processed locally for maximum privacy and instant response times.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
