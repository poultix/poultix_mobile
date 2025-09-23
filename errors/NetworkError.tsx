// screens/NetworkErrorScreen.tsx
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import hostConfig from '@/config/hostConfig';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/interfaces/Navigation';

export default function NetworkErrorScreen() {
    const router = useNavigation<NavigationProps>()
    const onRetry = async () => {
        try {
            const response = await axios.get(hostConfig.host + '/ping')
            if (response.status == 200) router.navigate('Farmer')
        } catch (error) {
            if (axios.isAxiosError(error)) if (!error.response) Alert.alert('Network Error!', 'Make sure you are connected to internet and try agan.')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <MaterialIcons name="wifi-off" size={80} color="#d9534f" />
            <Text style={styles.title}>Network Error</Text>
            <Text style={styles.subtitle}>Please check your internet connection and try again.</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => { onRetry() }}>
                <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginTop: 20,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#d9534f',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
