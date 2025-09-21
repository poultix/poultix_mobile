import React, { useEffect, useState, Suspense, lazy } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { ActivityIndicator, View } from 'react-native';

// Lazy-loaded components
const Home = lazy(() => import('./app/home/Home'));
const News = lazy(() => import('./app/news/News'));
const AiScreen = lazy(() => import('./app/ai/AiScreen'));
const SignIn = lazy(() => import('./app/auth/SignIn'));
const SignUp = lazy(() => import('./app/auth/SignUp'));
const ForgotPassword = lazy(() => import('./app/auth/ForgotPassword'));
const VerifyCode = lazy(() => import('./app/auth/VerifyCode'));
const GoogleSignIn = lazy(() => import('./app/auth/GoogleSignIn'));
const BtSettings = lazy(() => import('./app/bluetooth/BtSettings'));
const BtResult = lazy(() => import('./app/bluetooth/BtResult'));
const Pairing = lazy(() => import('./app/bluetooth/BtSearching'));
const FarmerHome = lazy(() => import('./app/farmer/FarmerHome'));
const FarmOverview = lazy(() => import('./app/farmer/FarmOverview'));
const ChickenPHReadingsScreen = lazy(() => import('./app/bluetooth/PhChecker'));
const SettingsScreen = lazy(() => import('./app/home/Settings'));
const CreateNewPasswordScreen = lazy(() => import('./app/auth/CreateNewPassword'));
const NetworkErrorScreen = lazy(() => import('./errors/NetworkError'));
const VeterinaryHome = lazy(() => import('./app/veterinary/VeterinaryHome'));
const PharmaciesScreen = lazy(() => import('./app/pharmacy/PharmacyHome'));
const Tester = lazy(() => import('./app/testing/Tester'));

// Custom Drawer (not lazy-loaded since it's lightweight)
import CustomDrawerContent from './app/navigation/Drawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Fallback Loading Component
const LoadingScreen = () => (
  <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
    <ActivityIndicator size="large" color="#EF4444" />
  </View>
);

// Drawer Navigator for authenticated users
const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Farmer"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: tw`w-72 bg-white`,
      drawerActiveTintColor: '#EF4444',
      drawerInactiveTintColor: '#6B7280',
      drawerLabelStyle: tw`text-base font-medium`,
      headerShown: false,
    }}
  >
    <Drawer.Screen
      name="Home"
      component={Home}
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="home-outline" size={24} color={color} />
        ),
        title: 'Home',
      }}
    />
    <Drawer.Screen
      name="Farmer"
      component={FarmerHome}
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="leaf-outline" size={24} color={color} />
        ),
        title: 'Farmer Dashboard',
      }}
    />
    <Drawer.Screen
      name="Farm"
      component={FarmOverview}
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="business-outline" size={24} color={color} />
        ),
        title: 'Farm Overview',
      }}
    />
    <Drawer.Screen
      name="Pharmacies"
      component={PharmaciesScreen}
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="medkit-outline" size={24} color={color} />
        ),
        title: 'Pharmacies',
      }}
    />
    <Drawer.Screen
      name="Bluetooth_Pairing"
      component={Pairing}
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="paw-outline" size={24} color={color} />
        ),
        title: 'Stool checker',
      }}
    />
    <Drawer.Screen
      name="AiScreen"
      component={AiScreen}
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="chatbox-ellipses-outline" size={24} color={color} />
        ),
        title: 'AI Assistant',
      }}
    />
    <Drawer.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="settings-outline" size={24} color={color} />
        ),
        title: 'Settings',
      }}
    />
    <Drawer.Screen
      name="News"
      component={News}
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="newspaper-outline" size={24} color={color} />
        ),
        title: 'News',
      }}
    />
  </Drawer.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Check authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userRole = await AsyncStorage.getItem('role');
        if (userRole) setRole(userRole);
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              {/* Authenticated Screens (Drawer) */}
              <Stack.Screen name="Drawer" component={DrawerNavigator} />
              {/* Modal/Utility Screens */}
              <Stack.Screen name="Bluetooth_Setting" component={BtSettings} />
              <Stack.Screen name="Bluetooth_Result" component={BtResult} />
              <Stack.Screen name="Bluetooth_Pairing" component={Pairing} />
              <Stack.Screen name="Ph_Reader" component={ChickenPHReadingsScreen} />
              <Stack.Screen name="NetworkError" component={NetworkErrorScreen} />
              <Stack.Screen name="Veterinary" component={VeterinaryHome} />
              <Stack.Screen name="Farmer" component={FarmerHome} />
              <Stack.Screen name="Pharmacy" component={PharmaciesScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="AiScreen" component={AiScreen} />
              <Stack.Screen name="News" component={News} />
              <Stack.Screen name="Farm" component={FarmOverview} />
              <Stack.Screen name="Tester" component={Tester} />
            </>
          ) : (
            <>
              {/* Authentication Screens */}
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="VerifyCode" component={VerifyCode} />
              <Stack.Screen name="GoogleSignIn" component={GoogleSignIn} />
              <Stack.Screen name="CreateNewPassword" component={CreateNewPasswordScreen} />
            </>
          )}
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </Suspense>
  );
};

export default App;