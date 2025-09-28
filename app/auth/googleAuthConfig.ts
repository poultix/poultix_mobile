import Constants from 'expo-constants';

// Google OAuth Configuration
export const GoogleAuthConfig = {
    // Get client IDs from app.json extra config or environment variables
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID || 
                    process.env.GOOGLE_ANDROID_CLIENT_ID || 
                    '480918748504-vnpqk4m9p38ak0du8l4pc1np3soifqiv.apps.googleusercontent.com',
    
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID || 
                process.env.GOOGLE_IOS_CLIENT_ID || 
                '480918748504-96eo9ab0g4uac9p4r7kshh2fep039k9g.apps.googleusercontent.com',
    
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || 
                process.env.GOOGLE_WEB_CLIENT_ID || 
                '480918748504-lh71qqa9t1hnf1pkdcc5ps2mtsscmsnr.apps.googleusercontent.com',

    // OAuth scopes
    scopes: ['profile', 'email', 'openid'],

    // Redirect URI scheme (should match app.json scheme)
    redirectScheme: 'poultix',
    redirectPath: 'auth/google',
};

// Helper function to validate configuration
export const validateGoogleAuthConfig = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check if we're using the fallback values (which means not properly configured from app.json/env)
    const androidFromConfig = Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID || process.env.GOOGLE_ANDROID_CLIENT_ID;
    const iosFromConfig = Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID || process.env.GOOGLE_IOS_CLIENT_ID;
    const webFromConfig = Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || process.env.GOOGLE_WEB_CLIENT_ID;
    
    if (!androidFromConfig) {
        errors.push('Android Client ID not configured in app.json or environment');
    }
    
    if (!iosFromConfig) {
        errors.push('iOS Client ID not configured in app.json or environment');
    }
    
    if (!webFromConfig) {
        errors.push('Web Client ID not configured in app.json or environment');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Development helper to show configuration status
export const getConfigurationStatus = () => {
    const validation = validateGoogleAuthConfig();
    
    // Check if values are coming from config/env or using fallbacks
    const androidFromConfig = Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID || process.env.GOOGLE_ANDROID_CLIENT_ID;
    const iosFromConfig = Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID || process.env.GOOGLE_IOS_CLIENT_ID;
    const webFromConfig = Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || process.env.GOOGLE_WEB_CLIENT_ID;
    
    return {
        ...validation,
        config: {
            androidClientId: androidFromConfig ? '✅ Configured' : '⚠️ Using fallback',
            iosClientId: iosFromConfig ? '✅ Configured' : '⚠️ Using fallback',
            webClientId: webFromConfig ? '✅ Configured' : '⚠️ Using fallback',
            redirectUri: `${GoogleAuthConfig.redirectScheme}://${GoogleAuthConfig.redirectPath}`,
        },
        actualValues: {
            android: GoogleAuthConfig.androidClientId,
            ios: GoogleAuthConfig.iosClientId,
            web: GoogleAuthConfig.webClientId,
        }
    };
};

// Default export for Expo Router
export default GoogleAuthConfig;
