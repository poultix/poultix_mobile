import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IOSDesign } from '../../constants/iosDesign';


interface Farm {
    id: string;
    name: string;
    location: string;
    size: string;
    owner: string;
    contact: string;
    email: string;
    totalChickens: number;
    healthyChickens: number;
    sickChickens: number;
    atRiskChickens: number;
    lastVisit: string;
    nextVisit: string;
    healthStatus: 'excellent' | 'good' | 'warning' | 'critical';
    notes: string;
    established: string;
    farmType: string;
}

export default function FarmDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [farm, setFarm] = useState<Farm | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFarmDetails();
    }, [id]);

    const loadFarmDetails = async () => {
        try {
            setLoading(true);
            // Mock farm data
            const mockFarm: Farm = {
                id: id as string || '1',
                name: 'Green Valley Poultry Farm',
                location: 'Nakuru County, Kenya',
                size: '5.2 hectares',
                owner: 'John Kamau',
                contact: '+254 712 345 678',
                email: 'john.kamau@greenvalley.co.ke',
                totalChickens: 2500,
                healthyChickens: 2350,
                sickChickens: 50,
                atRiskChickens: 100,
                lastVisit: '2024-01-15',
                nextVisit: '2024-02-15',
                healthStatus: 'good',
                notes: 'Regular vaccination schedule maintained. Minor respiratory issues detected in Block C.',
                established: '2019-03-15',
                farmType: 'Commercial Layer Farm'
            };
            
            setFarm(mockFarm);
        } catch (error) {
            console.error('Error loading farm details:', error);
            Alert.alert('Error', 'Failed to load farm details');
        } finally {
            setLoading(false);
        }
    };

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return IOSDesign.colors.systemGreen;
            case 'good': return IOSDesign.colors.systemBlue;
            case 'warning': return IOSDesign.colors.systemOrange;
            case 'critical': return IOSDesign.colors.systemRed;
            default: return IOSDesign.colors.gray[500];
        }
    };

    const getHealthStatusText = (status: string) => {
        switch (status) {
            case 'excellent': return 'Excellent';
            case 'good': return 'Good';
            case 'warning': return 'Needs Attention';
            case 'critical': return 'Critical';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: IOSDesign.colors.background.primary }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...IOSDesign.typography.body, color: IOSDesign.colors.text.secondary }}>
                        Loading farm details...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!farm) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: IOSDesign.colors.background.primary }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...IOSDesign.typography.body, color: IOSDesign.colors.text.secondary }}>
                        Farm not found
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: IOSDesign.colors.background.secondary }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: IOSDesign.layout.screenPadding,
                paddingVertical: IOSDesign.spacing.md,
                backgroundColor: IOSDesign.colors.background.primary,
                ...IOSDesign.shadows.small,
            }}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ marginRight: IOSDesign.spacing.md }}
                >
                    <Ionicons name="chevron-back" size={24} color={IOSDesign.colors.text.primary} />
                </TouchableOpacity>
                <Text style={{
                    ...IOSDesign.typography.headline,
                    color: IOSDesign.colors.text.primary,
                    flex: 1,
                }}>
                    Farm Details
                </Text>
                <TouchableOpacity onPress={() => router.push('/communication/messages')}>
                    <Ionicons name="chatbubble-outline" size={24} color={IOSDesign.colors.systemBlue} />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ padding: IOSDesign.layout.screenPadding }}>
                    
                    {/* Farm Basic Info */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: IOSDesign.spacing.md }}>
                            <Ionicons name="leaf" size={24} color={IOSDesign.colors.systemGreen} />
                            <Text style={{
                                ...IOSDesign.typography.title3,
                                color: IOSDesign.colors.text.primary,
                                marginLeft: IOSDesign.spacing.sm,
                            }}>
                                {farm.name}
                            </Text>
                        </View>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                📍 {farm.location}
                            </Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                Status: 
                            </Text>
                            <View style={{
                                backgroundColor: getHealthStatusColor(farm.healthStatus) + '20',
                                paddingHorizontal: IOSDesign.spacing.sm,
                                paddingVertical: IOSDesign.spacing.xs,
                                borderRadius: IOSDesign.borderRadius.sm,
                                marginLeft: IOSDesign.spacing.sm,
                            }}>
                                <Text style={{
                                    ...IOSDesign.typography.footnoteEmphasized,
                                    color: getHealthStatusColor(farm.healthStatus),
                                }}>
                                    {getHealthStatusText(farm.healthStatus)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Owner Information */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <Text style={{
                            ...IOSDesign.typography.headline,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.md,
                        }}>
                            Owner Information
                        </Text>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.calloutEmphasized, color: IOSDesign.colors.text.primary }}>
                                {farm.owner}
                            </Text>
                        </View>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                📞 {farm.contact}
                            </Text>
                        </View>
                        
                        <View>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                ✉️ {farm.email}
                            </Text>
                        </View>
                    </View>

                    {/* Farm Statistics */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <Text style={{
                            ...IOSDesign.typography.headline,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.md,
                        }}>
                            Chicken Health Statistics
                        </Text>
                        
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: IOSDesign.spacing.sm }}>
                            <View style={{
                                flex: 1,
                                backgroundColor: IOSDesign.colors.systemBlue + '10',
                                padding: IOSDesign.spacing.md,
                                borderRadius: IOSDesign.borderRadius.md,
                                minWidth: '45%',
                            }}>
                                <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemBlue }}>
                                    {farm.totalChickens.toLocaleString()}
                                </Text>
                                <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                    Total Chickens
                                </Text>
                            </View>
                            
                            <View style={{
                                flex: 1,
                                backgroundColor: IOSDesign.colors.systemGreen + '10',
                                padding: IOSDesign.spacing.md,
                                borderRadius: IOSDesign.borderRadius.md,
                                minWidth: '45%',
                            }}>
                                <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemGreen }}>
                                    {farm.healthyChickens.toLocaleString()}
                                </Text>
                                <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                    Healthy
                                </Text>
                            </View>
                            
                            <View style={{
                                flex: 1,
                                backgroundColor: IOSDesign.colors.systemOrange + '10',
                                padding: IOSDesign.spacing.md,
                                borderRadius: IOSDesign.borderRadius.md,
                                minWidth: '45%',
                            }}>
                                <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemOrange }}>
                                    {farm.atRiskChickens.toLocaleString()}
                                </Text>
                                <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                    At Risk
                                </Text>
                            </View>
                            
                            <View style={{
                                flex: 1,
                                backgroundColor: IOSDesign.colors.systemRed + '10',
                                padding: IOSDesign.spacing.md,
                                borderRadius: IOSDesign.borderRadius.md,
                                minWidth: '45%',
                            }}>
                                <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemRed }}>
                                    {farm.sickChickens.toLocaleString()}
                                </Text>
                                <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                    Sick
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Farm Details */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <Text style={{
                            ...IOSDesign.typography.headline,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.md,
                        }}>
                            Farm Information
                        </Text>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                Size: {farm.size}
                            </Text>
                        </View>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                Type: {farm.farmType}
                            </Text>
                        </View>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                Established: {new Date(farm.established).toLocaleDateString()}
                            </Text>
                        </View>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                Last Visit: {new Date(farm.lastVisit).toLocaleDateString()}
                            </Text>
                        </View>
                        
                        <View>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                Next Visit: {new Date(farm.nextVisit).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* Notes */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <Text style={{
                            ...IOSDesign.typography.headline,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.md,
                        }}>
                            Veterinary Notes
                        </Text>
                        
                        <Text style={{
                            ...IOSDesign.typography.callout,
                            color: IOSDesign.colors.text.secondary,
                            lineHeight: 22,
                        }}>
                            {farm.notes}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: 'row', gap: IOSDesign.spacing.md, marginBottom: IOSDesign.spacing.xl }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: IOSDesign.colors.systemBlue,
                                paddingVertical: IOSDesign.spacing.md,
                                borderRadius: IOSDesign.borderRadius.lg,
                                alignItems: 'center',
                                ...IOSDesign.shadows.small,
                            }}
                            onPress={() => router.push('/communication/schedule-request')}
                        >
                            <Text style={{
                                ...IOSDesign.typography.bodyEmphasized,
                                color: IOSDesign.colors.text.inverse,
                            }}>
                                Schedule Visit
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: IOSDesign.colors.systemGreen,
                                paddingVertical: IOSDesign.spacing.md,
                                borderRadius: IOSDesign.borderRadius.lg,
                                alignItems: 'center',
                                ...IOSDesign.shadows.small,
                            }}
                            onPress={() => router.push('/communication/messages')}
                        >
                            <Text style={{
                                ...IOSDesign.typography.bodyEmphasized,
                                color: IOSDesign.colors.text.inverse,
                            }}>
                                Message Owner
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
