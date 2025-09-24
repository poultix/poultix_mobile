// Expo Router Navigation Types
import { Device } from '@/interfaces/Bluetooth';
import { Pharmacy } from '@/interfaces/Pharmacy';

// Expo Router uses file-based routing, so we only need parameter types
export type RouteParams = {
    '/bluetooth/bluetooth-result': { devices: Device[] | null };
    '/pharmacy': { pharmacies: Pharmacy[] };
    '/(auth)/verify-code': { email: string };
};

// Screen names for reference (matches new folder structure)
export type ScreenNames = 
    | '/'
    | '/dashboard/admin-dashboard'
    | '/dashboard/farmer-dashboard'
    | '/dashboard/veterinary-dashboard'
    | '/farm'
    | '/farm/farmer'
    | '/farm/veterinary'
    | '/farm/create'
    | '/farm/nearby'
    | '/settings'
    | '/settings/settings-notifications'
    | '/settings/settings-privacy'
    | '/settings/settings-account'
    | '/settings/settings-appearance'
    | '/settings/settings-language'
    | '/settings/settings-storage'
    | '/settings/settings-help'
    | '/settings/settings-about'
    | '/communication/messages'
    | '/communication/schedule-request'
    | '/communication/schedule-management'
    | '/admin'
    | '/admin/add-news'
    | '/admin/data-management'
    | '/user/profile'
    | '/user/history'
    | '/pharmacy'
    | '/pharmacy/detail'
    | '/bluetooth/bluetooth-pairing'
    | '/bluetooth/bluetooth-settings'
    | '/bluetooth/bluetooth-result'
    | '/bluetooth/ph-reader'
    | '/general/ai'
    | '/general/news'
    | '/general/network-error'
    | '/general/tester'
    | '/(auth)/sign-in'
    | '/(auth)/sign-up'
    | '/(auth)/forgot-password'
    | '/(auth)/verify-code'
    | '/(auth)/create-new-password'
    | '/(auth)/google-sign-in';

// Legacy type for backward compatibility (deprecated)
export type NavigationProps = any;
