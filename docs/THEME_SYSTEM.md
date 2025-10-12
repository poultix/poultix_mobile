# 🎨 Poultix Theme System Documentation

## Overview

The Poultix app now features a comprehensive theme system that provides:

- **Role-based theming** (Farmer, Veterinary, Admin, Pharmacy)
- **Dark/Light mode support**
- **Consistent design tokens** (colors, spacing, typography)
- **Themed UI components** for rapid development
- **Type-safe theme access** throughout the app

## 🎯 Role-Based Colors

### Color Palette

| Role | Primary Color | Usage |
|------|---------------|-------|
| 🟠 **Farmer** | `#FF8C00` | Agriculture, Growth, Farming |
| 🔴 **Veterinary** | `#DC2626` | Medical, Emergency, Healthcare |
| 🟣 **Admin** | `#7C3AED` | Authority, Management, Control |
| 🔵 **Pharmacy** | `#2563EB` | Trust, Healthcare, Reliability |

### Status Colors (Universal)

- ✅ **Success**: `#10B981`
- ⚠️ **Warning**: `#F59E0B`
- ❌ **Error**: `#EF4444`
- ℹ️ **Info**: `#3B82F6`

## 🏗️ Architecture

### Theme Context Provider

```tsx
// Wrap your app with ThemeProvider
<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

### Using Themes in Components

```tsx
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.primary }}>
      <Text style={{ color: theme.text.primary }}>
        Hello World
      </Text>
    </View>
  );
};
```

## 🧩 Themed Components

### Available Components

#### 1. ThemedContainer
```tsx
<ThemedContainer variant="card" padding="lg">
  <Text>Content goes here</Text>
</ThemedContainer>
```

**Props:**
- `variant`: `'background' | 'surface' | 'card'`
- `padding`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'`

#### 2. ThemedText
```tsx
<ThemedText variant="primary" size="lg" weight="bold">
  Themed Text
</ThemedText>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'disabled' | 'inverse'`
- `size`: `'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'`
- `weight`: `'normal' | 'medium' | 'semibold' | 'bold'`

#### 3. ThemedButton
```tsx
<ThemedButton 
  variant="primary" 
  size="lg" 
  icon="checkmark-circle"
  onPress={handlePress}
>
  Submit
</ThemedButton>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `icon`: Ionicons name
- `iconPosition`: `'left' | 'right'`
- `loading`: boolean
- `fullWidth`: boolean

#### 4. ThemedInput
```tsx
<ThemedInput
  label="Email"
  placeholder="Enter your email"
  icon="mail-outline"
  error={emailError}
/>
```

**Props:**
- `label`: string
- `error`: string
- `icon`: Ionicons name
- `iconPosition`: `'left' | 'right'`

#### 5. ThemedCard
```tsx
<ThemedCard padding="lg" shadow>
  <Text>Card content</Text>
</ThemedCard>
```

#### 6. ThemedStatusBadge
```tsx
<ThemedStatusBadge 
  status="success" 
  text="Verified" 
  size="md" 
/>
```

### Header Components

#### 1. ThemedHeader
```tsx
<ThemedHeader
  title="Page Title"
  subtitle="Page subtitle"
  showBack
  showDrawer
/>
```

#### 2. DashboardHeader
```tsx
<DashboardHeader
  userName="John Doe"
  userRole="Farmer"
  subtitle="Welcome back!"
/>
```

#### 3. PageHeader
```tsx
<PageHeader
  title="Settings"
  subtitle="Manage your preferences"
  showBack
/>
```

## 🎨 Design Tokens

### Spacing Scale
```tsx
const spacing = {
  xs: 4,   // 4px
  sm: 8,   // 8px
  md: 16,  // 16px
  lg: 24,  // 24px
  xl: 32,  // 32px
  xxl: 48, // 48px
};
```

### Border Radius
```tsx
const borderRadius = {
  sm: 4,     // 4px
  md: 8,     // 8px
  lg: 12,    // 12px
  xl: 16,    // 16px
  full: 9999, // Fully rounded
};
```

### Shadows
```tsx
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};
```

## 🌙 Dark Mode Support

### Toggle Dark Mode
```tsx
const { isDark, toggleTheme, setThemeMode } = useTheme();

// Toggle between light and dark
toggleTheme();

// Set specific mode
setThemeMode(true); // Dark mode
setThemeMode(false); // Light mode
```

### Dark Theme Colors
- Background: `#111827`
- Surface: `#1F2937`
- Card: `#374151`
- Text Primary: `#F9FAFB`
- Text Secondary: `#D1D5DB`

## 🚀 Migration Guide

### From Old System to New Theme System

#### Before (Old Way)
```tsx
// Hard-coded colors
<View style={{ backgroundColor: '#FF8C00' }}>
  <Text style={{ color: '#FFFFFF' }}>
    Farmer Dashboard
  </Text>
</View>
```

#### After (New Theme System)
```tsx
// Theme-aware
<ThemedContainer variant="card">
  <ThemedText variant="inverse" size="lg" weight="bold">
    Farmer Dashboard
  </ThemedText>
</ThemedContainer>
```

### Converting Existing Components

1. **Replace hard-coded colors** with theme values
2. **Use themed components** instead of basic RN components
3. **Add dark mode support** automatically
4. **Ensure role-based theming** works correctly

## 📱 Usage Examples

### Dashboard Screen
```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ThemedContainer, 
  ThemedText, 
  ThemedButton,
  ThemedCard 
} from '@/components/ui/ThemedComponents';
import { DashboardHeader } from '@/components/ui/ThemedHeader';

const DashboardScreen = () => {
  const { theme } = useTheme();
  
  return (
    <ThemedContainer variant="background">
      <DashboardHeader
        userName="John Doe"
        userRole="Farmer"
        subtitle="Welcome back!"
      />
      
      <ThemedCard padding="lg">
        <ThemedText size="xl" weight="bold">
          Quick Stats
        </ThemedText>
        
        <ThemedButton 
          variant="primary" 
          icon="analytics-outline"
          fullWidth
        >
          View Analytics
        </ThemedButton>
      </ThemedCard>
    </ThemedContainer>
  );
};
```

### Form Screen
```tsx
import { ThemedInput, ThemedButton } from '@/components/ui/ThemedComponents';

const FormScreen = () => {
  return (
    <ThemedContainer variant="surface" padding="lg">
      <ThemedInput
        label="Farm Name"
        placeholder="Enter farm name"
        icon="leaf-outline"
      />
      
      <ThemedInput
        label="Location"
        placeholder="Enter location"
        icon="location-outline"
      />
      
      <ThemedButton variant="primary" fullWidth>
        Save Farm
      </ThemedButton>
    </ThemedContainer>
  );
};
```

## 🎯 Best Practices

### 1. Always Use Theme Values
```tsx
// ✅ Good
const { theme } = useTheme();
<View style={{ backgroundColor: theme.primary }} />

// ❌ Bad
<View style={{ backgroundColor: '#FF8C00' }} />
```

### 2. Use Themed Components
```tsx
// ✅ Good
<ThemedText variant="primary" size="lg">Hello</ThemedText>

// ❌ Bad
<Text style={{ color: '#111827', fontSize: 18 }}>Hello</Text>
```

### 3. Respect Role-Based Colors
```tsx
// ✅ Good - Automatically adapts to user role
const { theme } = useTheme();
<View style={{ backgroundColor: theme.primary }} />

// ❌ Bad - Hard-coded to one role
<View style={{ backgroundColor: '#FF8C00' }} />
```

### 4. Support Dark Mode
```tsx
// ✅ Good - Works in both light and dark
<ThemedContainer variant="card">
  <ThemedText variant="primary">Content</ThemedText>
</ThemedContainer>

// ❌ Bad - Only works in light mode
<View style={{ backgroundColor: 'white' }}>
  <Text style={{ color: 'black' }}>Content</Text>
</View>
```

## 🔧 Customization

### Adding New Theme Values
```tsx
// In utils/theme.ts
const baseTheme = {
  // Add new values here
  customColor: '#123456',
  customSpacing: 20,
};
```

### Creating Custom Themed Components
```tsx
import { useTheme } from '@/contexts/ThemeContext';

const CustomThemedComponent = ({ children, ...props }) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
      }}
      {...props}
    >
      {children}
    </View>
  );
};
```

## 🎉 Benefits

### For Developers
- **Consistent design** across the app
- **Type-safe** theme access
- **Rapid development** with pre-built components
- **Easy maintenance** with centralized theming

### For Users
- **Role-specific** visual identity
- **Dark mode** support for better UX
- **Consistent** user experience
- **Accessible** color contrasts

### For Business
- **Brand consistency** across user roles
- **Professional appearance**
- **Scalable design system**
- **Future-proof** theming architecture

---

## 🚀 Ready to Use!

Your Poultix app now has a complete, production-ready theme system that automatically adapts to user roles and supports both light and dark modes. Start using the themed components today for a consistent, professional user experience! 🎨✨
