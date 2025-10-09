import { Buffer } from "buffer";
import ExpoDevice from "expo-device";
import { useState } from "react";
import { Alert } from "react-native";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Characteristic, Device } from "react-native-ble-plx";

const DATA_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
const COLOR_CHARACTERISTIC_UUID = "19b10001-e8f2-537e-4f6c-d104768a1217";

// Mock device for testing when BLE is not available
const mockDevice: Device = {
    id: "mock-device-1",
    name: "Arduino Mock",
    localName: "Arduino",
    rssi: -50,
    mtu: 23,
    serviceData: null,
    serviceUUIDs: null,
    manufacturerData: null,
    txPowerLevel: null,
    solicitedServiceUUIDs: null,
    isConnectable: true,
    overflowServiceUUIDs: null,
} as Device;

export function useBLE() {
    const [bleManager, setBleManager] = useState<BleManager | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [color, setColor] = useState("white");
    const [bleSupported, setBleSupported] = useState(true);
    const [bluetoothState, setBluetoothState] = useState<string>('Unknown');

    // Initialize BleManager with error handling
    const initializeBleManager = () => {
        if (!bleManager) {
            try {
                const manager = new BleManager();
                setBleManager(manager);
                return manager;
            } catch (error) {
                console.warn("BLE not available, using mock data:", error);
                setBleSupported(false);
                return null;
            }
        }
        return bleManager;
    };

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermission === PermissionsAndroid.RESULTS.GRANTED &&
            bluetoothConnectPermission === PermissionsAndroid.RESULTS.GRANTED &&
            fineLocationPermission === PermissionsAndroid.RESULTS.GRANTED
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            try {
                // Safely get platform API level with fallback
                const apiLevel = ExpoDevice?.platformApiLevel || Platform.Version || 30;

                if (apiLevel < 31) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: "Location Permission",
                            message: "Bluetooth Low Energy requires Location",
                            buttonPositive: "OK",
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
                    return isAndroid31PermissionsGranted;
                }
            } catch (error) {
                console.warn('Error checking Android API level, using fallback permissions:', error);
                // Fallback: request all permissions for safety
                try {
                    const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
                    return isAndroid31PermissionsGranted;
                } catch (fallbackError) {
                    console.warn('Fallback permission request failed:', fallbackError);
                    return false;
                }
            }
        } else {
            return true;
        }
    };

 
    // Check Bluetooth state
    const checkBluetoothState = async () => {
        const manager = initializeBleManager();

        if (manager && bleSupported) {
            try {
                const state = await manager.state();
                setBluetoothState(state);
                return state;
            } catch (error) {
                console.warn('Failed to check Bluetooth state:', error);
                setBluetoothState('Unknown');
                return 'Unknown';
            }
        } else {
            setBluetoothState('MockMode');
            return 'MockMode';
        }
    };

    const scanForPeripherals = async () => {
        const manager = initializeBleManager();

        if (manager && bleSupported) {
            try {
                // Check Bluetooth state first
                const state = await checkBluetoothState();

                if (state !== 'PoweredOn') {
                    console.log(`Bluetooth is not powered on. Current state: ${state}`);
                    Alert.alert(
                        'Bluetooth Not Active',
                        'Please turn on Bluetooth to scan for devices.',
                        [{ text: 'OK' }]
                    );
                    return;
                }

                // Clear previous devices
                setDevices([]);
                setIsScanning(true);

                console.log('Starting BLE scan...');

                manager.startDeviceScan(null, null, (error: BleError | null, device: Device | null) => {
                    if (error) {
                        console.log('Scan error:', error);
                        setIsScanning(false);
                        Alert.alert(
                            'Scan Error',
                            'Failed to scan for devices. Please try again.',
                            [{ text: 'OK' }]
                        );
                        return;
                    }

                    if (device) {
                        if (!device.isConnectable) return
                        if (!device.name) {
                            fetchDeviceName(manager, device).then((updatedDevice) => {
                                setDevices((prevDevices) => {
                                    if (!prevDevices.find(d => d.id === device.id)) {
                                        return [...prevDevices, updatedDevice];
                                    }
                                    return prevDevices;
                                });

                            });
                        } else {
                            setDevices((prevDevices) => {
                                if (!prevDevices.find(d => d.id === device.id)) {
                                    return [...prevDevices, device];
                                }
                                return prevDevices;
                            });

                        }
                    }

                });

                // Stop scanning after 10 seconds
                setTimeout(() => {
                    manager.stopDeviceScan();
                    setIsScanning(false);
                    console.log('Scan completed');
                }, 10000);

            } catch (error) {
                console.error('Scan initialization error:', error);
                setIsScanning(false);
                Alert.alert(
                    'Scan Error',
                    'Failed to initialize scanning. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } else {
            // Mock scanning for testing
            console.log("Using mock BLE scanning");
            setDevices([]);
            setIsScanning(true);

            setTimeout(() => {
                setDevices([mockDevice]);
                setIsScanning(false);
                console.log('Mock scan completed');
            }, 2000);
        }
    };

    // Fetch device name if missing
    const fetchDeviceName = async (manager: BleManager, device: Device): Promise<Device> => {
        try {
            const connected = await manager.connectToDevice(device.id, { autoConnect: false });
            await connected.discoverAllServicesAndCharacteristics();

            const characteristic = await connected.readCharacteristicForService(
                "1800", // Generic Access
                "2A00"  // Device Name
            );

            if (characteristic?.value) {
                const name = Buffer.from(characteristic.value, "base64").toString("utf8");
                console.log(`Fetched name for ${device.id}:`, name);
                await manager.cancelDeviceConnection(device.id);
                device.name=name;
                return device
            }

            await manager.cancelDeviceConnection(device.id);
            return device;
        } catch (error) {
            console.log(`Failed to fetch name for ${device.id}:`, error);
            return device;
        }
    };


    const connectToDevice = async (device: Device) => {
        const manager = initializeBleManager();

        if (manager && bleSupported) {
            // Real BLE connection
            try {
                const deviceConnection = await manager.connectToDevice(device.id);
                setConnectedDevice(deviceConnection);
                await deviceConnection.discoverAllServicesAndCharacteristics();
                manager.stopDeviceScan();
                Alert.alert('Success', `Connected to ${device.name}`);
            } catch (e) {
                console.log("FAILED TO CONNECT", e);
                Alert.alert('Connection Failed', `Unable to connect to ${device.name}`);
            }
        } else {
            // Mock connection
            console.log("Mock connecting to device:", device.name);
            setConnectedDevice(device);
            Alert.alert('Success', `Connected to ${device.name} (Mock)`);
        }
    };

    const disconnectDevice = async (device: Device) => {
        const manager = initializeBleManager();

        if (manager && bleSupported) {
            try {
                await manager.cancelDeviceConnection(device.id);
                setConnectedDevice(null);
                Alert.alert('Success', `Disconnected from ${device.name}`);
            } catch (error) {
                console.error('Disconnection error:', error);
                Alert.alert('Disconnection Failed', `Unable to disconnect from ${device.name}`);
            }
        } else {
            // Mock disconnection
            setConnectedDevice(null);
            Alert.alert('Success', `Disconnected from ${device.name} (Mock)`);
        }
    };

    const startStreamingData = async (device: Device) => {
        const manager = initializeBleManager();

        if (manager && bleSupported && device) {
            // Real BLE data streaming
            device.monitorCharacteristicForService(
                DATA_SERVICE_UUID,
                COLOR_CHARACTERISTIC_UUID,
                (error: BleError | null, characteristic: Characteristic | null) => {
                    if (error) {
                        console.log(error);
                        return;
                    } else if (!characteristic?.value) {
                        console.log("No Data was received");
                        return;
                    }

                    const colorCode = Buffer.from(characteristic.value).toString();
                    let newColor = "white";
                    if (colorCode === "B") {
                        newColor = "blue";
                    } else if (colorCode === "R") {
                        newColor = "red";
                    } else if (colorCode === "G") {
                        newColor = "green";
                    }
                    setColor(newColor);
                }
            );
        } else {
            // Mock data streaming
            console.log("Mock streaming data from device");
            const colors = ["red", "green", "blue", "white"];
            let colorIndex = 0;

            const interval = setInterval(() => {
                setColor(colors[colorIndex]);
                colorIndex = (colorIndex + 1) % colors.length;
            }, 2000);

            // Clean up after 30 seconds
            setTimeout(() => clearInterval(interval), 30000);
        }
    };

    return {
        isScanning,
        devices,
        connectedDevice,
        color,
        bluetoothState,
        scanForPeripherals,
        connectToDevice,
        startStreamingData,
        disconnectDevice,
        bleSupported,
        requestPermissions,
        checkBluetoothState
    };
}