import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IOSDesign, getRoleColor } from '../../constants/iosDesign';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'farmer' | 'veterinary' | 'admin';
    location: string;
    joinDate: string;
    lastActive: string;
    status: 'active' | 'inactive' | 'suspended';
    farmsCount?: number;
    schedulesCount?: number;
    specialization?: string;
    licenseNumber?: string;
    experience?: string;
    profilePicture?: string;
}

export default function UserDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserDetails();
    }, [id]);

    const loadUserDetails = async () => {
        try {
            setLoading(true);
            // Mock user data based on ID
            const mockUsers: User[] = [
                {
                    id: '1',
                    name: 'John Kamau',
                    email: 'john.kamau@gmail.com',
                    phone: '+254 712 345 678',
                    role: 'farmer',
                    location: 'Nakuru County, Kenya',
                    joinDate: '2023-01-15',
                    lastActive: '2024-01-20',
                    status: 'active',
                    farmsCount: 3,
                    schedulesCount: 12,
                },
                {
                    id: '2',
                    name: 'Dr. Sarah Wanjiku',
                    email: 'dr.sarah@vetclinic.co.ke',
                    phone: '+254 722 456 789',
                    role: 'veterinary',
                    location: 'Nairobi, Kenya',
                    joinDate: '2022-08-10',
                    lastActive: '2024-01-21',
                    status: 'active',
                    specialization: 'Poultry Medicine',
                    licenseNumber: 'VET/2019/0234',
                    experience: '8 years',
                    schedulesCount: 45,
                },
                {
                    id: '3',
                    name: 'Admin User',
                    email: 'admin@poultix.com',
                    phone: '+254 700 123 456',
                    role: 'admin',
                    location: 'Nairobi, Kenya',
                    joinDate: '2022-01-01',
                    lastActive: '2024-01-21',
                    status: 'active',
                },
            ];
            
            const foundUser = mockUsers.find(u => u.id === id) || mockUsers[0];
            setUser(foundUser);
        } catch (error) {
            console.error('Error loading user details:', error);
            Alert.alert('Error', 'Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return IOSDesign.colors.systemGreen;
            case 'inactive': return IOSDesign.colors.systemOrange;
            case 'suspended': return IOSDesign.colors.systemRed;
            default: return IOSDesign.colors.gray[500];
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            case 'suspended': return 'Suspended';
            default: return 'Unknown';
        }
    };

    const handleSuspendUser = () => {
        Alert.alert(
            'Suspend User',
            `Are you sure you want to suspend ${user?.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Suspend', 
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Success', 'User has been suspended');
                    }
                }
            ]
        );
    };

    const handleActivateUser = () => {
        Alert.alert(
            'Activate User',
            `Are you sure you want to activate ${user?.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Activate',
                    onPress: () => {
                        Alert.alert('Success', 'User has been activated');
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: IOSDesign.colors.background.primary }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...IOSDesign.typography.body, color: IOSDesign.colors.text.secondary }}>
                        Loading user details...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: IOSDesign.colors.background.primary }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...IOSDesign.typography.body, color: IOSDesign.colors.text.secondary }}>
                        User not found
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
                    User Details
                </Text>
                <TouchableOpacity onPress={() => router.push('/communication/messages')}>
                    <Ionicons name="chatbubble-outline" size={24} color={IOSDesign.colors.systemBlue} />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ padding: IOSDesign.layout.screenPadding }}>
                    
                    {/* User Profile */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                        alignItems: 'center',
                    }}>
                        {/* Profile Picture Placeholder */}
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: IOSDesign.borderRadius.full,
                            backgroundColor: getRoleColor(user.role) + '20',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: IOSDesign.spacing.md,
                        }}>
                            <Ionicons 
                                name={user.role === 'farmer' ? 'leaf' : user.role === 'veterinary' ? 'medical' : 'shield'} 
                                size={32} 
                                color={getRoleColor(user.role)} 
                            />
                        </View>
                        
                        <Text style={{
                            ...IOSDesign.typography.title2,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.xs,
                        }}>
                            {user.name}
                        </Text>
                        
                        <View style={{
                            backgroundColor: getRoleColor(user.role) + '20',
                            paddingHorizontal: IOSDesign.spacing.md,
                            paddingVertical: IOSDesign.spacing.xs,
                            borderRadius: IOSDesign.borderRadius.lg,
                            marginBottom: IOSDesign.spacing.sm,
                        }}>
                            <Text style={{
                                ...IOSDesign.typography.calloutEmphasized,
                                color: getRoleColor(user.role),
                                textTransform: 'capitalize',
                            }}>
                                {user.role}
                            </Text>
                        </View>
                        
                        <View style={{
                            backgroundColor: getStatusColor(user.status) + '20',
                            paddingHorizontal: IOSDesign.spacing.sm,
                            paddingVertical: IOSDesign.spacing.xs,
                            borderRadius: IOSDesign.borderRadius.sm,
                        }}>
                            <Text style={{
                                ...IOSDesign.typography.footnoteEmphasized,
                                color: getStatusColor(user.status),
                            }}>
                                {getStatusText(user.status)}
                            </Text>
                        </View>
                    </View>

                    {/* Contact Information */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <Text style={{
                            ...IOSDesign.typography.headline,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.md,
                        }}>
                            Contact Information
                        </Text>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                ✉️ {user.email}
                            </Text>
                        </View>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                📞 {user.phone}
                            </Text>
                        </View>
                        
                        <View>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                📍 {user.location}
                            </Text>
                        </View>
                    </View>

                    {/* Professional Information (for veterinary) */}
                    {user.role === 'veterinary' && (
                        <View style={{
                            ...IOSDesign.components.card,
                            marginBottom: IOSDesign.spacing.lg,
                        }}>
                            <Text style={{
                                ...IOSDesign.typography.headline,
                                color: IOSDesign.colors.text.primary,
                                marginBottom: IOSDesign.spacing.md,
                            }}>
                                Professional Information
                            </Text>
                            
                            <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                                <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                    Specialization: {user.specialization}
                                </Text>
                            </View>
                            
                            <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                                <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                    License: {user.licenseNumber}
                                </Text>
                            </View>
                            
                            <View>
                                <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                    Experience: {user.experience}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Statistics */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <Text style={{
                            ...IOSDesign.typography.headline,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.md,
                        }}>
                            Statistics
                        </Text>
                        
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: IOSDesign.spacing.sm }}>
                            {user.farmsCount !== undefined && (
                                <View style={{
                                    flex: 1,
                                    backgroundColor: IOSDesign.colors.systemGreen + '10',
                                    padding: IOSDesign.spacing.md,
                                    borderRadius: IOSDesign.borderRadius.md,
                                    minWidth: '45%',
                                }}>
                                    <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemGreen }}>
                                        {user.farmsCount}
                                    </Text>
                                    <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                        Farms
                                    </Text>
                                </View>
                            )}
                            
                            {user.schedulesCount !== undefined && (
                                <View style={{
                                    flex: 1,
                                    backgroundColor: IOSDesign.colors.systemBlue + '10',
                                    padding: IOSDesign.spacing.md,
                                    borderRadius: IOSDesign.borderRadius.md,
                                    minWidth: '45%',
                                }}>
                                    <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemBlue }}>
                                        {user.schedulesCount}
                                    </Text>
                                    <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                        Schedules
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Account Information */}
                    <View style={{
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <Text style={{
                            ...IOSDesign.typography.headline,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.md,
                        }}>
                            Account Information
                        </Text>
                        
                        <View style={{ marginBottom: IOSDesign.spacing.sm }}>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                Joined: {new Date(user.joinDate).toLocaleDateString()}
                            </Text>
                        </View>
                        
                        <View>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                Last Active: {new Date(user.lastActive).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* Admin Actions */}
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
                            onPress={() => router.push('/communication/messages')}
                        >
                            <Text style={{
                                ...IOSDesign.typography.bodyEmphasized,
                                color: IOSDesign.colors.text.inverse,
                            }}>
                                Send Message
                            </Text>
                        </TouchableOpacity>
                        
                        {user.status === 'active' ? (
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: IOSDesign.colors.systemRed,
                                    paddingVertical: IOSDesign.spacing.md,
                                    borderRadius: IOSDesign.borderRadius.lg,
                                    alignItems: 'center',
                                    ...IOSDesign.shadows.small,
                                }}
                                onPress={handleSuspendUser}
                            >
                                <Text style={{
                                    ...IOSDesign.typography.bodyEmphasized,
                                    color: IOSDesign.colors.text.inverse,
                                }}>
                                    Suspend User
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: IOSDesign.colors.systemGreen,
                                    paddingVertical: IOSDesign.spacing.md,
                                    borderRadius: IOSDesign.borderRadius.lg,
                                    alignItems: 'center',
                                    ...IOSDesign.shadows.small,
                                }}
                                onPress={handleActivateUser}
                            >
                                <Text style={{
                                    ...IOSDesign.typography.bodyEmphasized,
                                    color: IOSDesign.colors.text.inverse,
                                }}>
                                    Activate User
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
