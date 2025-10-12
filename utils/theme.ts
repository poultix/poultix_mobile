import { UserRole } from '@/types/user';

export const getRoleTheme = (role?: UserRole) => {
    switch (role) {
        case 'FARMER': 
            return {
                primary: '#FF8C00',
                primaryRgb: '255, 140, 0',
                bg: 'bg-orange-500',
                bgLight: 'bg-orange-50',
                text: 'text-orange-500',
                border: 'border-orange-500',
            };
        case 'VETERINARY': 
            return {
                primary: '#DC2626',
                primaryRgb: '220, 38, 38',
                bg: 'bg-red-600',
                bgLight: 'bg-red-50',
                text: 'text-red-600',
                border: 'border-red-600',
            };
        case 'ADMIN': 
            return {
                primary: '#7C3AED',
                primaryRgb: '124, 58, 237',
                bg: 'bg-purple-600',
                bgLight: 'bg-purple-50',
                text: 'text-purple-600',
                border: 'border-purple-600',
            };
        case 'PHARMACY': 
            return {
                primary: '#2563EB',
                primaryRgb: '37, 99, 235',
                bg: 'bg-blue-600',
                bgLight: 'bg-blue-50',
                text: 'text-blue-600',
                border: 'border-blue-600',
            };
        default: 
            return {
                primary: '#6B7280',
                primaryRgb: '107, 114, 128',
                bg: 'bg-gray-500',
                bgLight: 'bg-gray-50',
                text: 'text-gray-500',
                border: 'border-gray-500',
            };
    }
};
