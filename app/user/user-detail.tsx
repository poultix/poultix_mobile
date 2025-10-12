import { IOSDesign, getRoleColor } from '@/constants/iosDesign';
import { User, UserRole } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/contexts/UserContext';

export default function UserDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { currentUser } = useAuth();
    const { users } = useUsers();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserDetails = useCallback(async () => {
        try {
            setLoading(true);
            
            // If no ID provided or ID matches current user, show current user
            if (!id || id === currentUser?.id) {
                setUser(currentUser);
            } else {
                // Look for user in users context (from UserContext)
                const foundUser = users.find(u => u.id === id);
                if (foundUser) {
                    setUser(foundUser);
                } else {
                    // Fallback to current user if not found
                    setUser(currentUser);
                }
            }
        } catch (error) {
            console.error('Error loading user details:', error);
            // Fallback to current user on error
            setUser(currentUser);
        } finally {
            setLoading(false);
        }
    }, [id, currentUser, users]);

    useEffect(() => {
        loadUserDetails();
    }, [loadUserDetails]);

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
            <View style={{ flex: 1, backgroundColor: IOSDesign.colors.background.primary }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...IOSDesign.typography.body, color: IOSDesign.colors.text.secondary }}>
                        Loading user details...
                    </Text>
                </View>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={{ flex: 1, backgroundColor: IOSDesign.colors.background.primary }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...IOSDesign.typography.body, color: IOSDesign.colors.text.secondary }}>
                        User not found
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: IOSDesign.colors.background.secondary }}>
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
                <TouchableOpacity onPress={() => router.push('/chat')}>
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
                                name={user.role === 'FARMER' ? 'leaf' : user.role === 'VETERINARY' ? 'medical' : 'shield'} 
                                size={32} 
                                color={getRoleColor(user.role)} 
                            />
                        </View>
                        
                        <Text style={{
                            ...IOSDesign.typography.title3,
                            color: user.role === 'FARMER' ? IOSDesign.colors.systemBlue : user.role === 'VETERINARY' ? IOSDesign.colors.systemGreen : IOSDesign.colors.systemPurple,
                            textAlign: 'center',
                        }}>
                            {user.role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
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
                            }}>
                                {user.role}
                            </Text>
                        </View>
                        
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: IOSDesign.spacing.sm,
                        }}>
                            <View style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: user.isActive ? IOSDesign.colors.systemGreen : IOSDesign.colors.systemRed,
                                marginRight: IOSDesign.spacing.xs,
                            }} />
                            <Text style={{
                                ...IOSDesign.typography.caption1,
                                color: user.isActive ? IOSDesign.colors.systemGreen : IOSDesign.colors.systemRed,
                            }}>
                                {user.isActive ? 'Active' : 'Inactive'}
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
                                📞 {user.phone || 'Not provided'}
                            </Text>
                        </View>
                        
                        <View>
                            <Text style={{ ...IOSDesign.typography.callout, color: IOSDesign.colors.text.secondary }}>
                                📍 {user.location.latitude}
                            </Text>
                        </View>
                    </View>

                    {/* Professional Information (for veterinary) */}
                    {user.role === 'VETERINARY' && (
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
                            onPress={() => router.push('/chat')}
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
                                    ...IOSDesign.typography.body,
                                    color: IOSDesign.colors.gray[600],
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
                                    ...IOSDesign.typography.body,
                                    color: IOSDesign.colors.gray[600],
                                }}>
                                    Activate User
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
