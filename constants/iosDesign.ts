// iOS Design System for Poultix Mobile
export const IOSDesign = {
  // iOS-style Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // iOS-style Border Radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // iOS-style Colors
  colors: {
    // System Colors
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemOrange: '#FF9500',
    systemRed: '#FF3B30',
    systemPurple: '#AF52DE',
    systemYellow: '#FFCC00',
    systemPink: '#FF2D92',
    systemTeal: '#5AC8FA',

    // Gray Scale
    gray: {
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
      secondary: '#F8F9FA',
      tertiary: '#F3F4F6',
    },

    // Text Colors
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
    },

    // Role-based Colors
    roles: {
      admin: '#AF52DE',
      farmer: '#34C759',
      veterinary: '#FF3B30',
    },
  },

  // iOS-style Typography
  typography: {
    // Large Titles
    largeTitle: {
      fontSize: 34,
      fontWeight: '700' as const,
      lineHeight: 41,
    },
    
    // Titles
    title1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 34,
    },
    title2: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    title3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 25,
    },

    // Headlines
    headline: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
    },

    // Body Text
    body: {
      fontSize: 17,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    bodyEmphasized: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
    },

    // Callout
    callout: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 21,
    },
    calloutEmphasized: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 21,
    },

    // Subheadline
    subheadline: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    subheadlineEmphasized: {
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 20,
    },

    // Footnote
    footnote: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
    footnoteEmphasized: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 18,
    },

    // Caption
    caption1: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    caption1Emphasized: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
    },
    caption2: {
      fontSize: 11,
      fontWeight: '400' as const,
      lineHeight: 13,
    },
    caption2Emphasized: {
      fontSize: 11,
      fontWeight: '600' as const,
      lineHeight: 13,
    },
  },

  // iOS-style Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 16,
    },
  },

  // iOS-style Component Styles
  components: {
    // Card Style
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },

    // Button Styles
    button: {
      primary: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
      secondary: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
      destructive: {
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
    },

    // Input Style
    input: {
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 17,
      borderWidth: 0,
    },

    // List Item Style
    listItem: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: '#E5E7EB',
    },
  },

  // Screen Layout
  layout: {
    screenPadding: 16,
    sectionSpacing: 24,
    itemSpacing: 12,
  },
};

// Helper function to get role color
export const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return IOSDesign.colors.roles.admin;
    case 'farmer': return IOSDesign.colors.roles.farmer;
    case 'veterinary': return IOSDesign.colors.roles.veterinary;
    default: return IOSDesign.colors.gray[500];
  }
};

// Helper function to create consistent spacing
export const createSpacing = (size: keyof typeof IOSDesign.spacing) => {
  return IOSDesign.spacing[size];
};

// Helper function to create consistent shadows
export const createShadow = (size: keyof typeof IOSDesign.shadows) => {
  return IOSDesign.shadows[size];
};
