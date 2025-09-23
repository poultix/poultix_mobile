import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import tw from 'twrnc'
import { useNavigation } from "@react-navigation/native"
import { NavigationProps } from "@/interfaces/Navigation"
import TopNavigation from "../navigation/TopNavigation"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"
import { VeterinaryData } from "@/interfaces/Veterinary"
import { Schedule } from "@/interfaces/Schedule"
import { Ionicons } from '@expo/vector-icons'
import axios from "axios"
import hostConfig from "@/config/hostConfig"
import AsyncStorage from "@react-native-async-storage/async-storage"


export default function VeterinaryHome() {
    const router = useNavigation<NavigationProps>()
    const [schedules, setSchedules] = useState<Schedule[]>()
    const [veterinaryData, setVeterinaryData] = useState<VeterinaryData>({
        names: 'loading...',
        email: 'loading...',
        _id: 'loading...',
        farmManaged: 0
    })

    useEffect(() => {
        const fetchVeterinaryData = async () => {
            try {
                const token = await AsyncStorage.getItem('token')
                const response = await axios.get(hostConfig.host + '/userVeterinary', {
                    headers: { Authorization: 'Bearer ' + token }
                })
                console.log(response.data)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data)
                }
            }
        }
        fetchVeterinaryData()
    }, [])

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <TopNavigation />
            <ScrollView showsVerticalScrollIndicator={false}
                style={tw`mt-15 mb-20`}>
                <View style={[tw`flex-1 px-5 pt-12 pb-8`]}>
                    {/* Profile Section */}
                    <LinearGradient
                        colors={['#F95316', '#EB580C']}
                        style={tw`rounded-2xl p-6 mb-6 shadow-lg`}
                    >
                        <View style={tw`flex-row justify-between items-center`}>
                            <View>
                                <Text style={tw`text-2xl font-extrabold text-white tracking-tight`}>
                                    {veterinaryData.names}
                                </Text>
                                <Text style={tw`text-orange-100 text-sm mt-1 font-medium opacity-90`}>
                                    Farmer • Female, 25
                                </Text>
                            </View>
                            <View
                                onTouchStart={() => router.navigate('Farm')}
                                style={tw`relative`}>
                                <Image
                                    source={require('@/assets/logo.png')}
                                    style={tw`w-14 h-14 rounded-full border-3 border-white shadow-sm`}
                                />
                                <View style={tw`absolute bottom-0 right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white`} />
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Upcoming Schedule Section */}
                    <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md border border-orange-100`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={tw`text-xl font-bold text-gray-800`}>
                                Upcoming Visit
                            </Text>
                            <TouchableOpacity onPress={() => router.navigate('Schedule')}>
                                <Text style={tw`text-orange-600 text-sm font-semibold`}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        {schedules && schedules.length > 0 ? (
                            <View style={tw`flex-row items-center bg-orange-50 p-4 rounded-xl`}>
                                <Image
                                    source={require('@/assets/logo.png')}
                                    style={[tw`w-12 h-12 rounded-full mr-4 border border-orange-200`]}
                                />
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-800 text-base font-semibold`}>
                                        Dr. Patricia Uwimana
                                    </Text>
                                    <Text style={tw`text-gray-600 text-sm mt-1`}>
                                        Sunday, 27 June 2021
                                    </Text>
                                    <Text style={tw`text-gray-500 text-xs mt-0.5`}>08:00am - 10:00am</Text>
                                </View>
                                <TouchableOpacity style={tw`p-2 bg-orange-100 rounded-full`}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={22} color="#F97316" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={tw`flex-row items-center p-4 rounded-xl`}>
                                <Text style={tw`font-semibold`}>  There are no upcoming visits</Text>
                            </View>
                        )}
                    </View>

                    {/* Choose Your Location Section */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-xl font-bold text-center text-gray-800 my-4`}>
                            See Veterinaries around you
                        </Text>
                        <Text style={tw`text-lg font-semibold text-center text-gray-800 mb-4`}>
                            Choose Location
                        </Text>
                        <View style={tw`flex-row gap-3 mb-5`}>
                            {['Byose', 'Kibuye', 'Muhanga'].map((location) => (
                                <TouchableOpacity
                                    key={location}
                                    style={[tw`flex-1 bg-white p-4 rounded-xl shadow-sm border border-orange-100 active:bg-orange-50`]}
                                    onPress={() => router.navigate('Veterinary')}
                                >
                                    <Text style={tw`text-gray-800 text-sm font-semibold text-center`}>
                                        {location}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {[
                            { name: 'Dr. Mutesi Hadidja', location: 'Muhanga' },
                            { name: 'Dr. Teta Liana', location: 'Nyamirambo' },
                        ].map((doctor) => (
                            <View
                                key={doctor.name}
                                style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center border border-orange-100`}
                            >
                                <Image
                                    source={require('@/assets/logo.png')}
                                    style={[tw`w-12 h-12 rounded-full mr-3 border border-orange-200`]}
                                />
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-gray-800 text-base font-semibold`}>
                                        {doctor.name}
                                    </Text>
                                    <Text style={tw`text-gray-600 text-sm`}>{doctor.location}</Text>
                                </View>
                                <TouchableOpacity style={tw`p-2 bg-orange-50 rounded-full`}>
                                    <Ionicons name="ellipsis-horizontal" size={20} color="#EA580C" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    {/* Weekly Report Section */}
                    <View style={tw`bg-white rounded-2xl p-5 shadow-md border border-orange-100`}>
                        <Text style={tw`text-xl font-semibold text-gray-800 mb-5`}>
                            Weekly Report
                        </Text>
                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={tw`relative items-center justify-center`}>
                                <View
                                    style={tw`w-28 h-28 rounded-full border-8 border-orange-100`}
                                />
                                <View
                                    style={tw`absolute top-0 left-0 w-28 h-28 rounded-full border-8 border-orange-500`}
                                />
                                <Text style={tw`absolute text-orange-600 text-2xl font-bold`}>
                                    87%
                                </Text>
                            </View>
                            <View style={tw`space-y-3`}>
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`w-3 h-3 rounded-full bg-orange-300 mr-2`}></View>
                                    <Text style={tw`text-gray-700 text-sm font-medium`}>Healthy</Text>
                                </View>
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`w-3 h-3 rounded-full bg-orange-500 mr-2`}></View>
                                    <Text style={tw`text-gray-700 text-sm font-medium`}>At Risk</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}