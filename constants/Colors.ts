// Poultix Mobile - Unified Color System
// Based on your existing iOS Design System with Poultry/Agriculture theme

export const PoultixColors = {
  // Primary Brand Colors (Poultry/Agriculture Theme)
  primary: {
    // Main brand color - Professional Blue
    50: '#EFF6FF',
    100: '#DBEAFE', 
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Secondary Colors
  secondary: {
    // Agriculture Green
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0', 
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main secondary
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Role-Based Colors (Consistent with your current usage)
  roles: {
    farmer: {
      primary: '#10B981', // Emerald - Agriculture/Growth
      secondary: '#059669',
      light: '#D1FAE5',
      dark: '#047857',
    },
    veterinary: {
      primary: '#EF4444', // Red - Medical/Emergency
      secondary: '#DC2626', 
      light: '#FEE2E2',
      dark: '#B91C1C',
    },
    admin: {
      primary: '#7C3AED', // Purple - Authority/Management
      secondary: '#6D28D9',
      light: '#EDE9FE', 
      dark: '#5B21B6',
    },
  },

  // Feature-Based Colors
  features: {
    // Farm Management
    farm: {
      primary: '#F59E0B', // Amber - Harvest/Productivity
      secondary: '#D97706',
      light: '#FEF3C7',
      dark: '#92400E',
    },
    
    // Communication/Chat
    chat: {
      primary: '#10B981', // Emerald - Communication/Connection
      secondary: '#059669',
      light: '#D1FAE5',
      dark: '#047857',
    },
    
    // Health/Medical
    health: {
      primary: '#EF4444', // Red - Health/Medical
      secondary: '#DC2626',
      light: '#FEE2E2', 
      dark: '#B91C1C',
    },
    
    // Pharmacy
    pharmacy: {
      primary: '#EF4444', // Red - Medical/Pharmacy
      secondary: '#DC2626',
      light: '#FEE2E2',
      dark: '#B91C1C',
    },
    
    // News/Information
    news: {
      primary: '#8B5CF6', // Violet - Information/News
      secondary: '#7C3AED',
      light: '#EDE9FE',
      dark: '#6D28D9',
    },
    
    // AI/Technology
    ai: {
      primary: '#06B6D4', // Cyan - Technology/AI
      secondary: '#0891B2',
      light: '#CFFAFE',
      dark: '#0E7490',
    },
  },

  // Status Colors
  status: {
    success: {
      primary: '#10B981',
      secondary: '#059669',
      light: '#D1FAE5',
      dark: '#047857',
    },
    warning: {
      primary: '#F59E0B',
      secondary: '#D97706', 
      light: '#FEF3C7',
      dark: '#92400E',
    },
    error: {
      primary: '#EF4444',
      secondary: '#DC2626',
      light: '#FEE2E2',
      dark: '#B91C1C',
    },
    info: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      light: '#DBEAFE',
      dark: '#1D4ED8',
    },
  },

  // Neutral Colors (Gray Scale)
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB', 
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    dark: '#1F2937',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#374151', 
    tertiary: '#6B7280',
    quaternary: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#3B82F6',
  },

  // Border Colors
  border: {
    light: '#F3F4F6',
    default: '#E5E7EB',
    dark: '#D1D5DB',
  },
};

// Gradient Combinations (Based on your current usage)
export const PoultixGradients = {
  // Role-based gradients
  farmer: ['#10B981', '#059669'],
  veterinary: ['#EF4444', '#DC2626'], 
  admin: ['#7C3AED', '#6D28D9'],
  
  // Feature-based gradients
  primary: ['#3B82F6', '#2563EB'],
  secondary: ['#10B981', '#059669'],
  farm: ['#F59E0B', '#D97706'],
  health: ['#EF4444', '#DC2626'],
  chat: ['#10B981', '#059669'],
  news: ['#8B5CF6', '#7C3AED'],
  ai: ['#06B6D4', '#0891B2'],
  
  // Status gradients
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706'],
  error: ['#EF4444', '#DC2626'],
  info: ['#3B82F6', '#2563EB'],
};

// Helper Functions
export const getFeatureColor = (feature: keyof typeof PoultixColors.features) => {
  return PoultixColors.features[feature];
};

export const getRoleColor = (role: 'farmer' | 'veterinary' | 'admin') => {
  return PoultixColors.roles[role];
};

export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info') => {
  return PoultixColors.status[status];
};

export const getGradient = (type: keyof typeof PoultixGradients) => {
  return PoultixGradients[type];
};

// Screen-specific color mappings (to maintain consistency)
export const ScreenColors = {
  // Dashboard screens
  farmerDashboard: PoultixGradients.farmer,
  veterinaryDashboard: PoultixGradients.veterinary, 
  adminDashboard: PoultixGradients.admin,
  
  // Feature screens
  farmManagement: PoultixGradients.farm,
  communication: PoultixGradients.chat,
  messages: PoultixGradients.chat,
  userDirectory: PoultixGradients.primary,
  pharmacy: PoultixGradients.health,
  veterinaryCare: PoultixGradients.health,
  news: PoultixGradients.news,
  ai: PoultixGradients.ai,
  
  // Auth screens
  auth: PoultixGradients.primary,
};

export default PoultixColors;
