import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    ScrollView,
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';
import { router } from 'expo-router';
import { Device } from 'react-native-ble-plx';
import * as Location from 'expo-location';
import { useBLE } from '@/hooks/useBLE';

export default function ConnectToDeviceScreen() {
    const {
        isScanning,
        devices,
        connectedDevice,
        bluetoothState,
        scanForPeripherals,
        connectToDevice,
        disconnectDevice,
        bleSupported,
        requestPermissions,
        checkBluetoothState
    } = useBLE();

    const [isLocationOn, setIsLocationOn] = useState(false);
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        // Initialize animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Check location services and permissions
        initializePermissions();
    }, []);

    const initializePermissions = async () => {
        await checkLocationServices();
        await checkBluetoothPermissions();
        await checkBluetoothState();
    };

    const checkLocationServices = async () => {
        try {
            const enabled = await Location.hasServicesEnabledAsync();
            setIsLocationOn(enabled);
        } catch (error) {
            console.warn('Failed to check location services:', error);
            setIsLocationOn(false);
        }
    };

    const checkBluetoothPermissions = async () => {
        try {
            const granted = await requestPermissions();
            setPermissionsGranted(granted);
            return granted;
        } catch (error) {
            console.warn('Failed to check Bluetooth permissions:', error);
            setPermissionsGranted(false);
            // In case of permission check failure, assume we're in mock mode
            if (!bleSupported) {
                console.log('BLE not supported, permissions not required for mock mode');
                setPermissionsGranted(true);
                return true;
            }
            return false;
        }
    };

    const handleRequestPermissions = async () => {
        setIsRequestingPermissions(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            // If BLE is not supported, skip permission request
            if (!bleSupported) {
                setPermissionsGranted(true);
                Alert.alert(
                    'Mock Mode Active',
                    'BLE is not available on this device. Using mock mode for testing.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const granted = await requestPermissions();
            setPermissionsGranted(granted);

            if (granted) {
                Alert.alert(
                    'Permissions Granted',
                    'Bluetooth and location permissions have been granted. You can now scan for devices.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'Permissions Required',
                    'Bluetooth and location permissions are required to scan for devices. Please grant them in Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
            }
        } catch (error) {
            console.error('Permission request error:', error);

            // If there's an error but BLE is not supported, enable mock mode
            if (!bleSupported) {
                setPermissionsGranted(true);
                Alert.alert(
                    'Mock Mode Enabled',
                    'Permission check failed, but mock mode is available for testing.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'Permission Error',
                    'Failed to request permissions. This might be due to device compatibility issues. Please try again or check Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
            }
        } finally {
            setIsRequestingPermissions(false);
        }
    };

    const handleStartScan = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // If BLE is not supported, allow scanning in mock mode
        if (!bleSupported) {
            scanForPeripherals();
            return;
        }

        // Check permissions before scanning (only for real BLE)
        if (!permissionsGranted) {
            Alert.alert(
                'Permissions Required',
                'Bluetooth and location permissions are required to scan for devices.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Grant Permissions', onPress: handleRequestPermissions },
                ]
            );
            return;
        }

        // Check location services (only for real BLE)
        if (!isLocationOn) {
            Alert.alert(
                'Location Services Required',
                'Please enable location services to scan for Bluetooth devices.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
            return;
        }

        scanForPeripherals();
    };

    const handleDeviceConnect = (device: Device) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        connectToDevice(device);
    };

    const handleDeviceDisconnect = (device: Device) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        disconnectDevice(device);
    };

    const openSettings = () => {
        Alert.alert(
            'Enable Services',
            'Please enable Bluetooth and Location services in Settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
        );
    };

    const getDeviceIcon = (device: Device) => {
        const name = device.name?.toLowerCase() || device.localName?.toLowerCase() || '';
        if (name.includes('arduino') || name.includes('esp')) return 'hardware-chip-outline';
        if (name.includes('phone') || name.includes('mobile')) return 'phone-portrait-outline';
        if (name.includes('watch')) return 'watch-outline';
        if (name.includes('headphone') || name.includes('audio')) return 'headset-outline';
        return 'bluetooth-outline';
    };

    const getStatusColor = (device: Device) => {
        return connectedDevice?.id === device.id ? '#10B981' : '#6B7280';
    };

    const isDeviceConnected = (device: Device) => {
        return connectedDevice?.id === device.id;
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            {/* Header */}
            <View style={tw`px-6 py-10 border-b border-gray-100 bg-blue-600 relative -top-6`}>
                <View style={tw`flex-row items-center justify-between`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`w-10 h-10 rounded-full bg-blue-600 items-center justify-center`}
                    >
                        <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={tw`text-xl font-bold text-gray-900`}>Bluetooth Devices</Text>
                    <TouchableOpacity
                        onPress={openSettings}
                        style={tw`w-10 h-10 rounded-full bg-blue-600 items-center justify-center`}
                    >
                        <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <Animated.View
                style={[
                    tw`flex-1`,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* Status Card */}
                <View style={tw`mx-6 mt-6 p-6 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100`}>
                    <View style={tw`flex-row items-center justify-between mb-4`}>
                        <View style={tw`flex-row items-center`}>
                            <View style={tw`w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4`}>
                                <Ionicons
                                    name="bluetooth"
                                    size={24}
                                    color={bleSupported ? "#0EA5E9" : "#6B7280"}
                                />
                            </View>
                            <View>
                                <Text style={tw`text-lg font-semibold text-gray-900`}>
                                    {bleSupported ? 'Bluetooth Ready' : 'Bluetooth Unavailable'}
                                </Text>
                                <Text style={tw`text-sm text-gray-600`}>
                                    {bleSupported
                                        ? isScanning
                                            ? 'Scanning for devices...'
                                            : `${devices.length} device${devices.length !== 1 ? 's' : ''} found`
                                        : 'Using mock mode for testing'
                                    }
                                </Text>
                            </View>
                        </View>
                        {(isScanning || isRequestingPermissions) && (
                            <ActivityIndicator size="small" color="#0EA5E9" />
                        )}
                    </View>

                    {/* Status Indicators */}
                    <View style={tw`mb-4 p-3 bg-white/50 rounded-xl`}>
                        {/* Bluetooth State */}
                        <View style={tw`flex-row items-center mb-2`}>
                            <Ionicons
                                name={bluetoothState === 'PoweredOn' || bluetoothState === 'MockMode' ? "checkmark-circle" : "alert-circle"}
                                size={20}
                                color={bluetoothState === 'PoweredOn' || bluetoothState === 'MockMode' ? "#10B981" : "#EF4444"}
                                style={tw`mr-2`}
                            />
                            <Text style={tw`text-sm font-medium text-gray-700 flex-1`}>
                                Bluetooth: {bluetoothState === 'PoweredOn' ? 'Active' :
                                    bluetoothState === 'MockMode' ? 'Mock Mode' :
                                        bluetoothState === 'PoweredOff' ? 'Off' :
                                            bluetoothState}
                            </Text>
                        </View>

                        {/* Permissions and Location */}
                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={tw`flex-row items-center flex-1`}>
                                <Ionicons
                                    name={permissionsGranted ? "checkmark-circle" : "alert-circle"}
                                    size={20}
                                    color={permissionsGranted ? "#10B981" : "#F59E0B"}
                                    style={tw`mr-2`}
                                />
                                <Text style={tw`text-sm font-medium text-gray-700`}>
                                    Permissions: {permissionsGranted ? 'OK' : 'Required'}
                                </Text>
                            </View>
                            <View style={tw`flex-row items-center`}>
                                <Ionicons
                                    name={isLocationOn ? "checkmark-circle" : "alert-circle"}
                                    size={20}
                                    color={isLocationOn ? "#10B981" : "#F59E0B"}
                                    style={tw`mr-2`}
                                />
                                <Text style={tw`text-sm font-medium text-gray-700`}>
                                    Location: {isLocationOn ? 'On' : 'Off'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={tw`flex-row gap-3`}>
                        {!permissionsGranted && (
                            <TouchableOpacity
                                onPress={handleRequestPermissions}
                                disabled={isRequestingPermissions}
                                style={tw`flex-1 flex-row items-center justify-center py-3 px-4 bg-orange-500 rounded-xl ${isRequestingPermissions ? 'opacity-50' : ''}`}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="shield-checkmark"
                                    size={18}
                                    color="white"
                                    style={tw`mr-2`}
                                />
                                <Text style={tw`text-white font-semibold text-sm`}>
                                    {isRequestingPermissions ? 'Requesting...' : 'Grant Permissions'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={handleStartScan}
                            disabled={isScanning}
                            style={tw`flex-1 flex-row items-center justify-center py-3 px-4 bg-blue-500 rounded-xl ${isScanning ? 'opacity-50' : ''}`}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={isScanning ? "refresh" : "search"}
                                size={18}
                                color="white"
                                style={tw`mr-2`}
                            />
                            <Text style={tw`text-white font-semibold text-sm`}>
                                {isScanning ? 'Scanning...' : 'Start Scan'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Connected Device */}
                {connectedDevice && (
                    <View style={tw`mx-6 mt-6`}>
                        <Text style={tw`text-lg font-semibold text-gray-900 mb-3`}>Connected Device</Text>
                        <View style={tw`p-4 bg-green-50 rounded-xl border border-green-200`}>
                            <View style={tw`flex-row items-center justify-between`}>
                                <View style={tw`flex-row items-center flex-1`}>
                                    <View style={tw`w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3`}>
                                        <Ionicons
                                            name={getDeviceIcon(connectedDevice)}
                                            size={20}
                                            color="#10B981"
                                        />
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`font-semibold text-gray-900`}>
                                            {connectedDevice.name || connectedDevice.localName || 'Unknown Device'}
                                        </Text>
                                        <Text style={tw`text-sm text-gray-600`}>
                                            {connectedDevice.id}
                                        </Text>
                                        <View style={tw`flex-row items-center mt-1`}>
                                            <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-2`} />
                                            <Text style={tw`text-xs text-green-600 font-medium`}>Connected</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeviceDisconnect(connectedDevice)}
                                    style={tw`px-4 py-2 bg-red-500 rounded-lg`}
                                >
                                    <Text style={tw`text-white font-medium text-sm`}>Disconnect</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Available Devices */}
                <View style={tw`flex-1 mx-6 mt-6`}>
                    <Text style={tw`text-lg font-semibold text-gray-900 mb-3`}>
                        Available Devices ({devices.length})
                    </Text>

                    <ScrollView
                        style={tw`flex-1`}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={tw`pb-6`}
                    >
                        {devices.length > 0 ? (
                            devices.map((device) => (
                                <TouchableOpacity
                                    key={device.id}
                                    onPress={() => handleDeviceConnect(device)}
                                    disabled={isDeviceConnected(device)}
                                    style={tw`p-4 mb-3 bg-white rounded-xl border border-gray-200 shadow-sm ${isDeviceConnected(device) ? 'opacity-50' : ''
                                        }`}
                                    activeOpacity={0.7}
                                >
                                    <View style={tw`flex-row items-center justify-between`}>
                                        <View style={tw`flex-row items-center flex-1`}>
                                            <View style={[
                                                tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
                                                { backgroundColor: getStatusColor(device) + '20' }
                                            ]}>
                                                <Ionicons
                                                    name={getDeviceIcon(device)}
                                                    size={20}
                                                    color={getStatusColor(device)}
                                                />
                                            </View>
                                            <View style={tw`flex-1`}>
                                                <Text style={tw`font-semibold text-gray-900`}>
                                                    {device.name || device.localName || 'Unknown Device'}
                                                </Text>
                                                <Text style={tw`text-sm text-gray-600 mt-1`}>
                                                    {device.id}
                                                </Text>
                                                {device.rssi && (
                                                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                                                        Signal: {device.rssi} dBm
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View style={tw`items-end`}>
                                            {isDeviceConnected(device) ? (
                                                <View style={tw`px-3 py-1 bg-green-100 rounded-full`}>
                                                    <Text style={tw`text-green-600 font-medium text-xs`}>Connected</Text>
                                                </View>
                                            ) : (
                                                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={tw`flex-1 items-center justify-center py-12`}>
                                <View style={tw`w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4`}>
                                    <Ionicons name="bluetooth-outline" size={32} color="#9CA3AF" />
                                </View>
                                <Text style={tw`text-gray-500 text-center text-base mb-2`}>
                                    No devices found
                                </Text>
                                <Text style={tw`text-gray-400 text-center text-sm px-8`}>
                                    Make sure your device is discoverable and try scanning again
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}