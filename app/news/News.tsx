import React from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import tw from 'twrnc'
import NewsComponent from '@/components/news/BodyNews'
import StatusNews from '@/components/news/HeadNews'
import TopNavigation from '../navigation/TopNavigation'

export default function News() {
  const router = useRouter()

  return (
    <View style={tw`flex-1 bg-white px-4 `}>
      <TopNavigation />
      <View style={tw`flex flex-col gap-y-2 `} >
        {/* News head */}
        <View style={tw`flex-row justify-between items-center p-5`}>
          <View>
            <Text style={tw`font-semibold`}>Breaking new</Text>
          </View>
          <TouchableOpacity >
            <Text style={tw`text-orange-600`}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* News body */}
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`flex flex-col gap-y-4 pb-50`}  >

          {/* News status */}
          <ScrollView horizontal={true}
            contentContainerStyle={tw`flex flex-row gap-x-2`}
            showsHorizontalScrollIndicator={false} >
            <StatusNews />
            <StatusNews />
            <StatusNews />
            <StatusNews />
          </ScrollView>
          <NewsComponent />
          <NewsComponent />
          <NewsComponent />
          <NewsComponent />
          <NewsComponent />
        </ScrollView>
      </View>

    </View>
  )
}
