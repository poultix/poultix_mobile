// Expo Router Navigation Types
import { Device } from './Bluetooth';
import { Pharmacy } from './Pharmacy';

// Expo Router uses file-based routing, so we only need parameter types
export type RouteParams = {
    '/bluetooth-result': { devices: Device[] | null };
    '/pharmacies': { pharmacies: Pharmacy[] };
    '/(auth)/verify-code': { email: string };
};

// Screen names for reference (matches file structure)
export type ScreenNames = 
    | '/'
    | '/farmer'
    | '/farm' 
    | '/ai'
    | '/pharmacies'
    | '/news'
    | '/settings'
    | '/veterinary'
    | '/bluetooth-pairing'
    | '/bluetooth-settings'
    | '/bluetooth-result'
    | '/ph-reader'
    | '/network-error'
    | '/tester'
    | '/(auth)/sign-in'
    | '/(auth)/sign-up'
    | '/(auth)/forgot-password'
    | '/(auth)/verify-code'
    | '/(auth)/create-new-password'
    | '/(auth)/google-sign-in';

// Legacy type for backward compatibility (deprecated)
export type NavigationProps = any;
