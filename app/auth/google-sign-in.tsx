import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { IOSDesign } from '../../constants/iosDesign';
import { GoogleAuthConfig, getConfigurationStatus } from './googleAuthConfig';


WebBrowser.maybeCompleteAuthSession();

interface GoogleUser {
    id: string;
    email: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
}

export default function SignInWithGoogleScreen() {
    const router = useRouter();
    const [user, setUser] = useState<GoogleUser | null>(null);
    const [loading, setLoading] = useState(false);

    // Create redirect URI for the current platform
    const redirectUri = AuthSession.makeRedirectUri({
        scheme: GoogleAuthConfig.redirectScheme, // This should match your app.json scheme
        path: GoogleAuthConfig.redirectPath,
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: GoogleAuthConfig.androidClientId,
        iosClientId: GoogleAuthConfig.iosClientId,
        webClientId: GoogleAuthConfig.webClientId,
        scopes: GoogleAuthConfig.scopes,
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
            // Add any extra parameters if needed
        },
    });

    useEffect(() => {
        // Load saved user data on component mount
        loadUserData();
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                getUserInfo(authentication.accessToken);
            } else {
                Alert.alert(
                    'Authentication Error',
                    'No access token received. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } else if (response?.type === 'error') {
            console.error('Auth error:', response.error);
            Alert.alert(
                'Authentication Failed',
                response.error?.message || 'Failed to sign in with Google. Please try again.',
                [{ text: 'OK' }]
            );
        } else if (response?.type === 'cancel') {
            console.log('User cancelled authentication');
        }
    }, [response]);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('googleUser');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const getUserInfo = async (accessToken: string) => {
        try {
            setLoading(true);
            
            // Use Google's userinfo endpoint
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (userInfoResponse.ok) {
                const userInfo: GoogleUser = await userInfoResponse.json();
                setUser(userInfo);
                
                // Save user data to AsyncStorage with expiration
                const userData = {
                    ...userInfo,
                    accessToken,
                    timestamp: Date.now(),
                };
                await AsyncStorage.setItem('googleUser', JSON.stringify(userData));
                
                Alert.alert(
                    'Welcome! 🎉', 
                    `Successfully signed in as ${userInfo.name}`,
                    [{ text: 'Continue', onPress: () => router.replace('/') }]
                );
            } else {
                const errorData = await userInfoResponse.json();
                throw new Error(errorData.error_description || 'Failed to fetch user info');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            Alert.alert(
                'Authentication Error',
                error instanceof Error ? error.message : 'Failed to get user information. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async () => {
        try {
            if (!request) {
                Alert.alert(
                    'Not Ready',
                    'Google Sign-In is still loading. Please wait a moment and try again.',
                    [{ text: 'OK' }]
                );
                return;
            }

            setLoading(true);
            const result = await promptAsync();
            
            // The result will be handled in the useEffect above
            console.log('Auth result:', result.type);
            
        } catch (error) {
            console.error('Sign in error:', error);
            Alert.alert(
                'Sign In Error',
                'Failed to initiate Google Sign-In. Please check your internet connection and try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            // Clear local storage
            await AsyncStorage.removeItem('googleUser');
            setUser(null);
            
            Alert.alert(
                'Signed Out',
                'You have been successfully signed out.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert(
                'Sign Out Error',
                'Failed to sign out completely. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: IOSDesign.colors.background.primary,
        }}>
            <View style={{
                flex: 1,
                paddingHorizontal: IOSDesign.layout.screenPadding,
                paddingTop: IOSDesign.spacing.xl,
            }}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={{
                        marginBottom: IOSDesign.spacing.lg,
                        padding: IOSDesign.spacing.sm,
                        marginLeft: -IOSDesign.spacing.sm,
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color={IOSDesign.colors.text.secondary} />
                </TouchableOpacity>

                <Text style={{
                    ...IOSDesign.typography.title1,
                    color: IOSDesign.colors.systemBlue,
                    marginBottom: IOSDesign.spacing.lg,
                    textAlign: 'center',
                }}>
                    Sign in with Google
                </Text>

                {!user ? (
                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={!request || loading}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 56,
                            backgroundColor: IOSDesign.colors.background.primary,
                            borderRadius: IOSDesign.borderRadius.lg,
                            borderWidth: 1,
                            borderColor: IOSDesign.colors.gray[300],
                            ...IOSDesign.shadows.medium,
                            opacity: (!request || loading) ? 0.6 : 1,
                            marginBottom: IOSDesign.spacing.lg,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator 
                                size="small" 
                                color={IOSDesign.colors.systemBlue} 
                                style={{ marginRight: IOSDesign.spacing.sm }}
                            />
                        ) : (
                            <Ionicons 
                                name="logo-google" 
                                size={24} 
                                color="#EA4335" 
                                style={{ marginRight: IOSDesign.spacing.sm }}
                            />
                        )}
                        <Text style={{
                            ...IOSDesign.typography.bodyEmphasized,
                            color: IOSDesign.colors.text.primary,
                        }}>
                            {loading ? 'Signing in...' : 'Sign in with Google'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{
                        marginTop: IOSDesign.spacing.lg,
                        alignItems: 'center',
                        ...IOSDesign.components.card,
                        marginBottom: IOSDesign.spacing.lg,
                    }}>
                        <Image 
                            source={{ uri: user.picture }} 
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: IOSDesign.borderRadius.full,
                                marginBottom: IOSDesign.spacing.md,
                            }}
                        />
                        <Text style={{
                            ...IOSDesign.typography.title3,
                            color: IOSDesign.colors.text.primary,
                            marginBottom: IOSDesign.spacing.xs,
                        }}>
                            {user.name}
                        </Text>
                        <Text style={{
                            ...IOSDesign.typography.callout,
                            color: IOSDesign.colors.text.secondary,
                            marginBottom: IOSDesign.spacing.lg,
                        }}>
                            {user.email}
                        </Text>
                        <TouchableOpacity
                            onPress={handleSignOut}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 48,
                                backgroundColor: IOSDesign.colors.systemRed,
                                borderRadius: IOSDesign.borderRadius.lg,
                                paddingHorizontal: IOSDesign.spacing.lg,
                                ...IOSDesign.shadows.small,
                            }}
                        >
                            <Ionicons 
                                name="exit-outline" 
                                size={20} 
                                color={IOSDesign.colors.text.inverse} 
                                style={{ marginRight: IOSDesign.spacing.sm }}
                            />
                            <Text style={{
                                ...IOSDesign.typography.bodyEmphasized,
                                color: IOSDesign.colors.text.inverse,
                            }}>
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Setup Instructions */}
                <View style={{
                    marginTop: IOSDesign.spacing.xl,
                    padding: IOSDesign.spacing.md,
                    backgroundColor: IOSDesign.colors.systemBlue + '10',
                    borderRadius: IOSDesign.borderRadius.lg,
                    borderLeftWidth: 4,
                    borderLeftColor: IOSDesign.colors.systemBlue,
                }}>
                    <Text style={{
                        ...IOSDesign.typography.calloutEmphasized,
                        color: IOSDesign.colors.systemBlue,
                        marginBottom: IOSDesign.spacing.sm,
                    }}>
                        🔧 Setup Instructions:
                    </Text>
                    <Text style={{
                        ...IOSDesign.typography.footnote,
                        color: IOSDesign.colors.text.secondary,
                        lineHeight: 18,
                    }}>
                        1. Get your Google OAuth client IDs from Google Cloud Console{'\n'}
                        2. Replace YOUR_*_CLIENT_ID with actual client IDs{'\n'}
                        3. Add bundle ID: com.wigothehacker.poultix{'\n'}
                        4. Add redirect URI: myapp://auth/google{'\n'}
                        5. Enable Google+ API in your project
                    </Text>
                </View>

                {/* Debug Info */}
                {__DEV__ && (
                    <View style={{
                        marginTop: IOSDesign.spacing.md,
                        padding: IOSDesign.spacing.sm,
                        backgroundColor: IOSDesign.colors.gray[100],
                        borderRadius: IOSDesign.borderRadius.sm,
                    }}>
                        <Text style={{
                            ...IOSDesign.typography.caption1Emphasized,
                            color: IOSDesign.colors.text.secondary,
                            marginBottom: IOSDesign.spacing.xs,
                        }}>
                            🔧 Development Info:
                        </Text>
                        <Text style={{
                            ...IOSDesign.typography.caption1,
                            color: IOSDesign.colors.text.tertiary,
                            lineHeight: 14,
                        }}>
                            Redirect URI: {redirectUri}{"\n"}
                            Android: {getConfigurationStatus().config.androidClientId}{"\n"}
                            iOS: {getConfigurationStatus().config.iosClientId}{"\n"}
                            Web: {getConfigurationStatus().config.webClientId}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
