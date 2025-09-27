import Constants from 'expo-constants';

// Google OAuth Configuration
export const GoogleAuthConfig = {
    // Get client IDs from app.json extra config or environment variables
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID || 
                    process.env.GOOGLE_ANDROID_CLIENT_ID || 
                    'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID || 
                process.env.GOOGLE_IOS_CLIENT_ID || 
                'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || 
                process.env.GOOGLE_WEB_CLIENT_ID || 
                'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',

    // OAuth scopes
    scopes: ['profile', 'email', 'openid'],

    // Redirect URI scheme (should match app.json scheme)
    redirectScheme: 'myapp',
    redirectPath: 'auth/google',
};

// Helper function to validate configuration
export const validateGoogleAuthConfig = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (GoogleAuthConfig.androidClientId.includes('YOUR_ANDROID_CLIENT_ID')) {
        errors.push('Android Client ID not configured');
    }
    
    if (GoogleAuthConfig.iosClientId.includes('YOUR_IOS_CLIENT_ID')) {
        errors.push('iOS Client ID not configured');
    }
    
    if (GoogleAuthConfig.webClientId.includes('YOUR_WEB_CLIENT_ID')) {
        errors.push('Web Client ID not configured');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Development helper to show configuration status
export const getConfigurationStatus = () => {
    const validation = validateGoogleAuthConfig();
    
    return {
        ...validation,
        config: {
            androidClientId: GoogleAuthConfig.androidClientId.includes('YOUR_ANDROID_CLIENT_ID') 
                ? '❌ Not configured' 
                : '✅ Configured',
            iosClientId: GoogleAuthConfig.iosClientId.includes('YOUR_IOS_CLIENT_ID') 
                ? '❌ Not configured' 
                : '✅ Configured',
            webClientId: GoogleAuthConfig.webClientId.includes('YOUR_WEB_CLIENT_ID') 
                ? '❌ Not configured' 
                : '✅ Configured',
            redirectUri: `${GoogleAuthConfig.redirectScheme}://${GoogleAuthConfig.redirectPath}`,
        }
    };
};
