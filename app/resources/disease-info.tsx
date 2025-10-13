import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

// Mock disease information data
const diseases = [
    {
        id: '1',
        name: 'Foot and Mouth Disease (FMD)',
        category: 'Viral',
        severity: 'Critical',
        description: 'Highly contagious viral disease affecting cloven-hoofed animals with significant economic impact.',
        symptoms: [
            'Fever and depression',
            'Blisters on tongue, lips, and feet',
            'Excessive salivation',
            'Lameness and reluctance to move',
            'Reduced milk production',
            'Weight loss'
        ],
        transmission: 'Direct contact with infected animals, contaminated feed, vehicles, and people',
        prevention: [
            'Regular vaccination campaigns',
            'Quarantine infected animals',
            'Proper disposal of infected materials',
            'Movement control measures',
            'Biosecurity protocols'
        ],
        treatment: 'Supportive care, no specific antiviral treatment. Focus on prevention through vaccination.',
        affectedAnimals: ['Cattle', 'Sheep', 'Goats', 'Pigs'],
        economicImpact: 'High - major cause of livestock production losses',
        currentStatus: 'Endemic in some regions, vaccination campaigns ongoing'
    },
    {
        id: '2',
        name: 'Newcastle Disease',
        category: 'Viral',
        severity: 'Critical',
        description: 'Highly contagious viral disease affecting poultry with high mortality rates.',
        symptoms: [
            'Sudden death in flocks',
            'Respiratory distress',
            'Nervous signs (twisting of head/neck)',
            'Greenish diarrhea',
            'Swelling of tissues around eyes',
            'Drop in egg production'
        ],
        transmission: 'Direct contact, contaminated feed/water, wild birds, human movement',
        prevention: [
            'Regular vaccination programs',
            'Biosecurity measures',
            'All-in-all-out production systems',
            'Wild bird control',
            'Proper disinfection'
        ],
        treatment: 'Vaccination is primary prevention. No effective treatment for clinical cases.',
        affectedAnimals: ['Chickens', 'Turkeys', 'Ducks', 'Pigeons'],
        economicImpact: 'Very High - 100% mortality in unvaccinated flocks',
        currentStatus: 'Controlled through vaccination, occasional outbreaks'
    },
    {
        id: '3',
        name: 'Black Quarter (Blackleg)',
        category: 'Bacterial',
        severity: 'High',
        description: 'Acute bacterial disease caused by Clostridium chauvoei, affecting young cattle.',
        symptoms: [
            'Sudden onset of fever',
            'Lameness and swelling of muscles',
            'Crepitating swellings under skin',
            'Difficulty breathing',
            'Sudden death without prior symptoms',
            'Dark-colored blood from natural openings'
        ],
        transmission: 'Spores in soil persist for years, ingested during grazing',
        prevention: [
            'Annual vaccination program',
            'Avoid grazing on contaminated pastures',
            'Proper carcass disposal',
            'Mineral supplementation',
            'Stress reduction'
        ],
        treatment: 'Antibiotic therapy, surgical drainage of swellings, antitoxin administration',
        affectedAnimals: ['Cattle', 'Sheep', 'Goats'],
        economicImpact: 'High - sudden death losses, treatment costs',
        currentStatus: 'Well controlled through vaccination programs'
    },
    {
        id: '4',
        name: 'Peste des Petits Ruminants (PPR)',
        category: 'Viral',
        severity: 'Critical',
        description: 'Highly contagious viral disease affecting sheep and goats, similar to rinderpest.',
        symptoms: [
            'High fever',
            'Discharge from eyes and nose',
            'Erosions in mouth and gums',
            'Severe diarrhea',
            'Pneumonia',
            'High mortality rates'
        ],
        transmission: 'Direct contact, contaminated feed/water, aerosol spread',
        prevention: [
            'Mass vaccination campaigns',
            'Movement restrictions',
            'Quarantine measures',
            'Surveillance and early detection',
            'Safe carcass disposal'
        ],
        treatment: 'Supportive care, antibiotics for secondary infections. Vaccination is key.',
        affectedAnimals: ['Goats', 'Sheep'],
        economicImpact: 'Very High - Rwanda\'s PPR eradication program ongoing',
        currentStatus: 'Target for eradication by 2030'
    },
    {
        id: '5',
        name: 'Mastitis',
        category: 'Bacterial/Inflammatory',
        severity: 'Medium',
        description: 'Inflammation of the mammary gland, most common and costly disease in dairy cattle.',
        symptoms: [
            'Swollen, red, and painful udder',
            'Abnormal milk (flakes, clots, watery)',
            'Reduced milk production',
            'Fever and depression',
            'Hard udder quarters',
            'Pain when milking'
        ],
        transmission: 'Bacterial entry through teat canal, environmental contamination',
        prevention: [
            'Proper milking hygiene',
            'Post-milking teat disinfection',
            'Regular udder health checks',
            'Dry cow therapy',
            'Proper nutrition and housing'
        ],
        treatment: 'Antibiotic therapy based on culture results, anti-inflammatory drugs, frequent milking',
        affectedAnimals: ['Dairy cattle'],
        economicImpact: 'Very High - major cause of economic losses in dairy industry',
        currentStatus: 'Common but manageable with good management practices'
    }
];

const DiseaseInfoScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredDiseases, setFilteredDiseases] = useState(diseases);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const categories = [
        { name: 'All', count: diseases.length },
        { name: 'Viral', count: diseases.filter(d => d.category === 'Viral').length },
        { name: 'Bacterial', count: diseases.filter(d => d.category.includes('Bacterial')).length },
        { name: 'Critical', count: diseases.filter(d => d.severity === 'Critical').length },
        { name: 'High', count: diseases.filter(d => d.severity === 'High').length }
    ];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
        
        let filtered = diseases;
        if (selectedCategory !== 'All') {
            if (selectedCategory === 'Critical' || selectedCategory === 'High') {
                filtered = filtered.filter(disease => disease.severity === selectedCategory);
            } else {
                filtered = filtered.filter(disease => disease.category.includes(selectedCategory));
            }
        }
        setFilteredDiseases(filtered);
    }, [selectedCategory]);

    const [expandedDisease, setExpandedDisease] = useState<string | null>(null);

    const toggleDisease = (diseaseId: string) => {
        setExpandedDisease(expandedDisease === diseaseId ? null : diseaseId);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-600 bg-red-100';
            case 'High': return 'text-orange-600 bg-orange-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Header */}
            <LinearGradient
                colors={['#DC2626', '#B91C1C']}
                style={tw`pt-12 pb-6 px-6`}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`bg-white bg-opacity-20 p-2 rounded-xl mb-4 self-start`}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Animated.View style={[{ opacity: fadeAnim }]}>
                    <Text style={tw`text-white text-2xl font-bold mb-2`}>
                        Disease Information
                    </Text>
                    <Text style={tw`text-red-100 text-sm`}>
                        Comprehensive guides on livestock diseases
                    </Text>
                </Animated.View>
            </LinearGradient>

            {/* Category Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`bg-white border-b border-gray-200`}
                contentContainerStyle={tw`px-4 py-3`}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.name}
                        style={tw`mr-3 px-4 py-2 rounded-xl ${
                            selectedCategory === category.name
                                ? 'bg-red-500'
                                : 'bg-gray-100 border border-gray-200'
                        }`}
                        onPress={() => setSelectedCategory(category.name)}
                    >
                        <Text
                            style={tw`font-medium ${
                                selectedCategory === category.name ? 'text-white' : 'text-gray-700'
                            }`}
                        >
                            {category.name} ({category.count})
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-24`}>
                <Animated.View style={[{ opacity: fadeAnim }]}>
                    {/* Disease Report Button */}
                    <View style={tw`bg-red-50 border border-red-200 rounded-2xl p-6 mb-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="megaphone" size={24} color="#DC2626" style={tw`mr-3`} />
                            <Text style={tw`text-red-800 font-bold text-lg`}>Report a Disease</Text>
                        </View>
                        <Text style={tw`text-red-700 mb-4 leading-6`}>
                            Suspect an animal disease? Report it immediately to prevent spread and get expert help.
                        </Text>
                        <TouchableOpacity 
                            style={tw`bg-red-500 py-3 px-6 rounded-xl flex-row items-center justify-center`}
                            onPress={() => router.push('/emergency/contacts')}
                        >
                            <Ionicons name="call" size={18} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white font-bold`}>Report Now</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Diseases List */}
                    {filteredDiseases.map((disease, index) => (
                        <Animated.View
                            key={disease.id}
                            style={[
                                tw`mb-4`,
                                {
                                    opacity: fadeAnim,
                                    transform: [{
                                        translateY: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [10 * (index + 1), 0],
                                        }),
                                    }],
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 p-5`}
                                onPress={() => toggleDisease(disease.id)}
                                activeOpacity={0.7}
                            >
                                <View style={tw`flex-row items-start justify-between mb-3`}>
                                    <View style={tw`flex-1 mr-4`}>
                                        <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>
                                            {disease.name}
                                        </Text>
                                        <View style={tw`flex-row items-center mb-2`}>
                                            <View style={tw`bg-red-100 px-2 py-1 rounded-full mr-2`}>
                                                <Text style={tw`text-red-700 text-xs font-medium`}>
                                                    {disease.category}
                                                </Text>
                                            </View>
                                            <View style={tw`px-2 py-1 rounded-full ${getSeverityColor(disease.severity)}`}>
                                                <Text style={tw`text-xs font-bold`}>
                                                    {disease.severity}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={tw`text-gray-600 text-sm leading-5`}>
                                            {disease.description}
                                        </Text>
                                    </View>
                                    
                                    <TouchableOpacity
                                        style={tw`bg-red-100 p-2 rounded-xl`}
                                        onPress={() => toggleDisease(disease.id)}
                                    >
                                        <Ionicons 
                                            name={expandedDisease === disease.id ? "chevron-up" : "chevron-down"} 
                                            size={20} 
                                            color="#DC2626" 
                                        />
                                    </TouchableOpacity>
                                </View>

                                {expandedDisease === disease.id && (
                                    <Animated.View
                                        style={[
                                            tw`border-t border-gray-100 pt-4`,
                                            { opacity: fadeAnim }
                                        ]}
                                    >
                                        {/* Symptoms */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-3`}>Symptoms:</Text>
                                            {disease.symptoms.map((symptom, idx) => (
                                                <View key={idx} style={tw`flex-row items-start mb-2`}>
                                                    <Ionicons name="ellipse" size={6} color="#DC2626" style={tw`mr-3 mt-2`} />
                                                    <Text style={tw`text-gray-700 flex-1 leading-5`}>{symptom}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* Transmission */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-2`}>Transmission:</Text>
                                            <Text style={tw`text-gray-700 leading-5`}>{disease.transmission}</Text>
                                        </View>

                                        {/* Prevention */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-3`}>Prevention:</Text>
                                            {disease.prevention.map((prevent, idx) => (
                                                <View key={idx} style={tw`flex-row items-start mb-2`}>
                                                    <Ionicons name="shield-checkmark" size={16} color="#059669" style={tw`mr-3 mt-1`} />
                                                    <Text style={tw`text-gray-700 flex-1 leading-5`}>{prevent}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* Treatment */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-2`}>Treatment:</Text>
                                            <Text style={tw`text-gray-700 leading-5`}>{disease.treatment}</Text>
                                        </View>

                                        {/* Affected Animals */}
                                        <View style={tw`mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-3`}>Affected Animals:</Text>
                                            <View style={tw`flex-row flex-wrap`}>
                                                {disease.affectedAnimals.map((animal, idx) => (
                                                    <View key={idx} style={tw`bg-red-50 rounded-full px-3 py-1 mr-2 mb-1`}>
                                                        <Text style={tw`text-red-700 text-sm`}>{animal}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Status & Impact */}
                                        <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                                            <Text style={tw`text-gray-900 font-bold mb-2`}>Current Status:</Text>
                                            <Text style={tw`text-gray-700 mb-3`}>{disease.currentStatus}</Text>
                                            <Text style={tw`text-gray-900 font-bold mb-1`}>Economic Impact:</Text>
                                            <Text style={tw`text-gray-700`}>{disease.economicImpact}</Text>
                                        </View>

                                        {/* Action Buttons */}
                                        <View style={tw`flex-row space-x-3`}>
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => router.push('/vaccination')}
                                            >
                                                <Ionicons name="shield-checkmark" size={18} color="#6B7280" style={tw`mr-2`} />
                                                <Text style={tw`text-gray-700 font-bold`}>Vaccination</Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity
                                                style={tw`flex-1 bg-red-500 py-3 rounded-xl flex-row items-center justify-center`}
                                                onPress={() => router.push('/emergency/contacts')}
                                            >
                                                <Ionicons name="call" size={18} color="white" style={tw`mr-2`} />
                                                <Text style={tw`text-white font-bold`}>Report Case</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Animated.View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    ))}

                    {/* Disease Surveillance */}
                    <View style={tw`bg-blue-50 rounded-2xl p-6`}>
                        <View style={tw`flex-row items-center mb-3`}>
                            <Ionicons name="eye" size={20} color="#2563EB" />
                            <Text style={tw`text-blue-800 font-bold ml-2`}>Disease Surveillance</Text>
                        </View>
                        <Text style={tw`text-blue-700 mb-4`}>
                            Stay updated on disease outbreaks and prevention measures in Rwanda.
                        </Text>
                        <TouchableOpacity style={tw`bg-blue-500 py-3 px-6 rounded-xl`}>
                            <Text style={tw`text-white font-bold text-center`}>View Surveillance Reports</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default DiseaseInfoScreen;
