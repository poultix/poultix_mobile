import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    ImageBackground,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/interfaces/Navigation';
import TopNavigation from '../navigation/TopNavigation';
import { BleManager, State, Device as BleDevice, ScanMode } from 'react-native-ble-plx';
import DeviceInfo from 'react-native-device-info';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { Buffer } from 'buffer';
import * as Location from 'expo-location';

const bleManager = new BleManager();

interface Device {
    id: string;
    name: string;
}

export default function ConnectToDeviceScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [isBluetoothOn, setIsBluetoothOn] = useState(false);
    const [isLocationOn, setIsLocationOn] = useState(false);
    const [scannedDevices, setScannedDevices] = useState<Device[]>([]);
    const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const iconAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

    // Cache device names
    const cacheDeviceName = async (id: string, name: string) => {
        if (name !== 'Unnamed Device') {
            try {
                await AsyncStorage.setItem(`device:${id}`, name);
            } catch (error) {
                console.warn('Failed to cache device name:', error);
            }
        }
    };

    const getCachedDeviceName = async (id: string): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(`device:${id}`);
        } catch (error) {
            console.warn('Failed to retrieve cached device name:', error);
            return null;
        }
    };

    // Check location services
    const checkLocationServices = async (): Promise<boolean> => {
        try {
            const enabled = await Location.hasServicesEnabledAsync();
            setIsLocationOn(enabled);
            return enabled;
        } catch (error) {
            console.warn('Failed to check location services:', error);
            setIsLocationOn(false);
            return false;
        }
    };

    // Request permissions
    const requestPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                const apiLevel = await DeviceInfo.getApiLevel();
                const permissions = apiLevel < 31
                    ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
                    : [
                        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    ];
                const results = await requestMultiple(permissions);
                const allGranted = Object.values(results).every(
                    (status) => status === 'granted'
                );
                if (!allGranted) {
                    Alert.alert(
                        'Permission Denied',
                        'Please grant Bluetooth and location permissions in settings.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Open Settings', onPress: () => Linking.openSettings() },
                        ]
                    );
                }
                return allGranted;
            }
            return true;
        } catch (error) {
            console.warn('Permission request error:', error);
            return false;
        }
    };

    // Extract device name
    const getDeviceName = (device: BleDevice): string => {
        if (device.name && device.name.trim().length > 0) {
            return device.name.trim();
        }
        if (device.localName && device.localName.trim().length > 0) {
            return device.localName.trim();
        }
        if (device.manufacturerData) {
            try {
                const buffer = Buffer.from(device.manufacturerData, 'base64');
                let decoded = buffer.toString('utf8').trim();
                if (decoded.startsWith('!*') || decoded.startsWith('"')) {
                    decoded = decoded.slice(2);
                }
                if (decoded.length >= 3 && /^[a-zA-Z0-9\s_-]+$/.test(decoded)) {
                    console.log(`Decoded manufacturer data: ${decoded}`);
                    return decoded;
                }
            } catch (error) {
                console.warn(`Failed to decode manufacturer data for device ${device.id}:`, error);
            }
        }
        return 'Unnamed Device';
    };

    // Check connected devices
    const checkConnectedDevices = async () => {
        try {
            const devices = await bleManager.connectedDevices([]);
            const connected: Device[] = devices.map((device) => ({
                id: device.id,
                name: getDeviceName(device),
            }));
            setConnectedDevices(connected);
            connected.forEach((device) => cacheDeviceName(device.id, device.name));
        } catch (error) {
            console.warn('Failed to check connected devices:', error);
            setConnectedDevices([]);
        }
    };

    // Start scanning
    const startScan = async () => {
        try {
            setScanError(null);

            if (!isBluetoothOn) {
                Alert.alert(
                    'Bluetooth Disabled',
                    'Please enable Bluetooth in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
                return;
            }

            const locationEnabled = await checkLocationServices();
            if (!locationEnabled && Platform.OS === 'android') {
                Alert.alert(
                    'Location Services Disabled',
                    'Please enable location services in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
                return;
            }

            const permissionsGranted = await requestPermissions();
            if (!permissionsGranted) return;

            setScannedDevices([]);
            setScanning(true);

            bleManager.startDeviceScan(null, { scanMode: ScanMode.LowLatency }, (error, device) => {
                if (error) {
                    console.warn('Scan error:', error.message);
                    setScanning(false);
                    setScanError(error.message);
                    if (error.message.includes('Location services are disabled')) {
                        Alert.alert(
                            'Location Services Required',
                            'Please enable location services in settings.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Open Settings', onPress: () => Linking.openSettings() },
                            ]
                        );
                    } else if (error.message.includes('BluetoothLE is powered off')) {
                        Alert.alert(
                            'Bluetooth Disabled',
                            'Please enable Bluetooth in settings.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Open Settings', onPress: () => Linking.openSettings() },
                            ]
                        );
                    } else {
                        Alert.alert('Scan Error', 'Failed to scan for devices. Please try again.');
                    }
                    return;
                }

                if (device && device.rssi && device.rssi > -90) {
                    setScannedDevices((prev) => {
                        const existingDevice = prev.find((d) => d.id === device.id);
                        const name = getDeviceName(device);
                        if (!existingDevice) {
                            cacheDeviceName(device.id, name);
                            return [...prev, { id: device.id, name }];
                        } else if (existingDevice.name === 'Unnamed Device' && name !== 'Unnamed Device') {
                            cacheDeviceName(device.id, name);
                            return prev.map((d) =>
                                d.id === device.id ? { id: device.id, name } : d
                            );
                        }
                        return prev;
                    });
                }
            });

            setTimeout(() => {
                bleManager.stopDeviceScan();
                setScanning(false);
                checkConnectedDevices(); // Refresh connected devices after scan
            }, 8000);
        } catch (error) {
            console.error('Start scan error:', error);
            setScanning(false);
            setScanError('Failed to start scanning.');
            Alert.alert('Error', 'Unable to start scanning. Please check Bluetooth and location settings.');
        }
    };

    // Monitor Bluetooth and connection events
    useEffect(() => {
        // Animate UI
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(iconAnim, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }),
            Animated.timing(buttonAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]).start();

        // Load cached devices
        const loadCachedDevices = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const deviceKeys = keys.filter((key) => key.startsWith('device:'));
                const cachedDevices: Device[] = [];
                for (const key of deviceKeys) {
                    const name = await AsyncStorage.getItem(key);
                    if (name) {
                        const id = key.replace('device:', '');
                        cachedDevices.push({ id, name });
                    }
                }
                setScannedDevices(cachedDevices);
            } catch (error) {
                console.warn('Failed to load cached devices:', error);
            }
        };
        loadCachedDevices();

        // Check initial location status
        checkLocationServices();

        // Monitor Bluetooth state
        const stateSubscription = bleManager.onStateChange((state) => {
            if (state === State.PoweredOn) {
                setIsBluetoothOn(true);
                checkConnectedDevices();
                startScan();
            } else if (state === State.PoweredOff) {
                setIsBluetoothOn(false);
                setConnectedDevices([]);
                Alert.alert(
                    'Bluetooth Required',
                    'Please enable Bluetooth in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
            }
        }, true);

        // Monitor device disconnection
        const disconnectSubscription = bleManager.onDeviceDisconnected('',
            (error, device) => {
                if (error) {
                    console.warn('Disconnection error:', error);
                }
                setConnectedDevices((prev) => prev.filter((d) => d.id !== device?.id));
            }
        );

        return () => {
            stateSubscription.remove();
            disconnectSubscription.remove();
        };
    }, []);

    // Toggle Bluetooth prompt
    const handleToggleBluetooth = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
        if (!isBluetoothOn) {
            Alert.alert(
                'Enable Bluetooth',
                'Please enable Bluetooth in settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
        } else {
            Alert.alert(
                'Disable Bluetooth',
                'Please disable Bluetooth in settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
        }
    };

    // Connect to a device
    const connectToDevice = async (device: Device) => {
        try {
            setScanning(false);
            bleManager.stopDeviceScan();
            const connectedDevice = await bleManager.connectToDevice(device.id);
            await connectedDevice.discoverAllServicesAndCharacteristics();
            Alert.alert('Success', `Connected to ${device.name}`);
            // Update connected devices
            setConnectedDevices((prev) => {
                if (!prev.find((d) => d.id === device.id)) {
                    return [...prev, { id: device.id, name: device.name }];
                }
                return prev;
            });
        } catch (error) {
            console.error('Connection error:', error);
            Alert.alert('Connection Failed', `Unable to connect to ${device.name}.`);
        }
    };

    // Disconnect from a device
    const disconnectDevice = async (device: Device) => {
        try {
            await bleManager.cancelDeviceConnection(device.id);
            setConnectedDevices((prev) => prev.filter((d) => d.id !== device.id));
            Alert.alert('Success', `Disconnected from ${device.name}`);
        } catch (error) {
            console.error('Disconnection error:', error);
            Alert.alert('Disconnection Failed', `Unable to disconnect from ${device.name}.`);
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/chicken-farmer.webp')}
            style={tw`flex-1`}
            imageStyle={tw``}
        >
            <LinearGradient colors={['#FFFFFF', '#FFF7ED']} style={tw`flex-1`}>
                <SafeAreaView style={tw`flex-1`}>
                    <TopNavigation />
                    <View style={tw`flex-1 px-5 relative`}>
                        <Animated.View style={[tw`flex-1 items-center justify-center`, { opacity: fadeAnim }]}>
                            {/* Bluetooth Icon */}
                            <Animated.View
                                style={[
                                    tw`w-44 h-44 rounded-full relative mb-10`,
                                    { transform: [{ scale: iconAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] },
                                ]}
                            >
                                <View style={tw`absolute inset-0 bg-red-200 rounded-full opacity-30`} />
                                <LinearGradient
                                    colors={['#FEA3C7', '#FDA68A']}
                                    style={tw`absolute inset-2 rounded-full shadow-lg`}
                                >
                                    <BlurView intensity={20} tint="light" style={tw`flex-1 rounded-full`} />
                                </LinearGradient>
                                <View
                                    style={tw`w-32 h-32 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 shadow-lg overflow-hidden`}
                                >
                                    <LinearGradient colors={['#FFFFFF', '#FFF7ED']} style={tw`absolute inset-0 rounded-full`} />
                                    <Ionicons
                                        name="bluetooth"
                                        size={44}
                                        color={isBluetoothOn ? '#EF4444' : '#6B7280'}
                                        style={tw`${isBluetoothOn ? 'opacity-100' : 'opacity-70'}`}
                                    />
                                </View>
                                {isBluetoothOn && (
                                    <View style={tw`absolute inset-0 rounded-full border-2 border-red-400 opacity-20`} />
                                )}
                            </Animated.View>

                            <Text style={tw`text-gray-700 text-lg mb-8 text-center font-medium px-10 leading-relaxed`}>
                                {scanning
                                    ? 'Scanning for nearby devices...'
                                    : isBluetoothOn && isLocationOn
                                        ? scannedDevices.length > 0 || connectedDevices.length > 0
                                            ? 'Tap a device to connect or disconnect'
                                            : 'No devices found'
                                        : 'Enable Bluetooth and location services to find devices'}
                            </Text>

                            {/* Toggle Button */}
                            <Animated.View
                                style={[
                                    tw`flex-row items-center`,
                                    {
                                        opacity: buttonAnim,
                                        transform: [
                                            { translateY: buttonAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                                        ],
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={handleToggleBluetooth}
                                    style={tw`flex-row items-center rounded-full px-7 py-4 shadow-xl overflow-hidden relative`}
                                    activeOpacity={0.9}
                                >
                                    <LinearGradient
                                        colors={['#FF7111', '#FF9111']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={tw`absolute inset-0`}
                                    >
                                        <BlurView intensity={15} tint="light" style={tw`flex-1`} />
                                    </LinearGradient>
                                    <Text style={tw`text-white text-base font-semibold mr-4 z-10`}>Bluetooth</Text>
                                    <View style={tw`w-20 h-8 bg-white/90 rounded-full flex-row items-center px-1 z-10 shadow-inner`}>
                                        <Animated.View
                                            style={[
                                                tw`w-6 h-6 bg-orange-400 rounded-full shadow-md`,
                                                { transform: [{ translateX: isBluetoothOn ? 48 : 0 }] },
                                            ]}
                                        />
                                    </View>
                                    <Text style={tw`text-white text-base font-semibold ml-3 z-10`}>
                                        {isBluetoothOn ? 'ON' : 'OFF'}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>

                            {/* Device List */}
                            <ScrollView style={tw`mt-8 w-full`}>
                                {/* Connected Devices */}
                                {connectedDevices.length > 0 && (
                                    <View style={tw`mb-4`}>
                                        <Text style={tw`text-gray-700 text-base font-semibold mb-3`}>Connected Devices:</Text>
                                        {connectedDevices.map((device) => (
                                            <View key={device.id} style={tw`bg-green-100 p-3 mb-2 rounded-lg shadow-sm border border-green-200 flex-row justify-between items-center`}>
                                                <View>
                                                    <Text style={tw`text-gray-800 font-medium`}>{device.name}</Text>
                                                    <Text style={tw`text-gray-500 text-xs mt-1`}>ID: {device.id}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => disconnectDevice(device)}
                                                    style={tw`bg-red-500 px-3 py-1 rounded-lg`}
                                                >
                                                    <Text style={tw`text-white text-sm`}>Disconnect</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {/* Scanned Devices */}
                                {scannedDevices.length > 0 && (
                                    <View style={tw`mb-4`}>
                                        <Text style={tw`text-gray-700 text-base font-semibold mb-3`}>Available Devices:</Text>
                                        {scannedDevices.map((device) => (
                                            <TouchableOpacity
                                                key={device.id}
                                                style={tw`bg-white p-3 mb-2 rounded-lg shadow-sm border border-gray-200`}
                                                onPress={() => connectToDevice(device)}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={tw`text-gray-800 font-medium`}>{device.name}</Text>
                                                <Text style={tw`text-gray-500 text-xs mt-1`}>ID: {device.id}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                {scanning && (
                                    <ActivityIndicator size="large" color="#EF4444" style={tw`mt-4`} />
                                )}

                                {!scanning && (scannedDevices.length === 0 || scanError) && (
                                    <View style={tw`mt-4 items-center`}>
                                        <Text style={tw`text-gray-500 text-center mb-4`}>
                                            {scanError
                                                ? 'Scanning failed. Please check Bluetooth and location settings.'
                                                : 'No devices found. Try scanning again.'}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={startScan}
                                            style={tw`bg-blue-500 px-6 py-3 rounded-lg shadow-md`}
                                        >
                                            <Text style={tw`text-white text-base font-semibold`}>Retry Scan</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </ScrollView>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </ImageBackground>
    );
}