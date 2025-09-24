import { FarmerData } from '@/interfaces/Farmer';
import { FarmData } from '@/interfaces/Farm';
import { VeterinaryData } from '@/interfaces/Veterinary';
import { Schedule } from '@/interfaces/Schedule';
import { Pharmacy } from '@/interfaces/Pharmacy';

// Mock user data
export const mockFarmerData: FarmerData = {
    _id: 'farmer_001',
    email: 'john.farmer@example.com',
    names: 'John Uwimana'
};

export const mockVeterinaryData: VeterinaryData = {
    _id: 'vet_001',
    email: 'dr.patricia@example.com',
    names: 'Dr. Patricia Uwimana',
    farmManaged: 5
};

export const mockFarmData: FarmData = {
    _id: 'farm_001',
    farmName: 'Sunrise Poultry Farm',
    chickens: {
        healthyChickens: 450,
        sickChickens: 12,
        riskChickens: 38
    },
    locations: 'Byose, Muhanga District'
};

// Mock schedules
export const mockSchedules: Schedule[] = [
    {
        veterinary: {
            details: {
                names: 'Dr. Patricia Uwimana',
                email: 'dr.patricia@example.com',
                picture: 'https://via.placeholder.com/150',
                createdAt: new Date('2023-01-15')
            },
            farmManaged: {
                farmer: {
                    names: 'John Uwimana',
                    email: 'john.farmer@example.com',
                    picture: 'https://via.placeholder.com/150',
                    createdAt: new Date('2023-01-10')
                },
                farmName: 'Sunrise Poultry Farm',
                location: 'Byose, Muhanga District',
                chickens: {
                    healthyChickens: 450,
                    sickChickens: 12,
                    riskChickens: 38
                }
            },
            vaccinesAvailable: {
                name: 'Newcastle Disease Vaccine',
                description: 'Live attenuated vaccine for Newcastle disease prevention',
                price: 2500,
                createdAt: new Date('2024-01-15')
            }
        },
        farmer: {
            names: 'John Uwimana',
            email: 'john.farmer@example.com',
            picture: 'https://via.placeholder.com/150',
            createdAt: new Date('2023-01-10')
        },
        time: {
            startDate: new Date('2024-06-27'),
            startHour: new Date('2024-06-27T08:00:00'),
            endDate: new Date('2024-06-27'),
            endHour: new Date('2024-06-27T10:00:00')
        }
    },
    {
        veterinary: {
            details: {
                names: 'Dr. Mutesi Hadidja',
                email: 'dr.mutesi@example.com',
                picture: 'https://via.placeholder.com/150',
                createdAt: new Date('2023-02-20')
            },
            farmManaged: {
                farmer: {
                    names: 'John Uwimana',
                    email: 'john.farmer@example.com',
                    picture: 'https://via.placeholder.com/150',
                    createdAt: new Date('2023-01-10')
                },
                farmName: 'Green Valley Farm',
                location: 'Muhanga District',
                chickens: {
                    healthyChickens: 320,
                    sickChickens: 8,
                    riskChickens: 22
                }
            },
            vaccinesAvailable: {
                name: 'Infectious Bronchitis Vaccine',
                description: 'Inactivated vaccine for infectious bronchitis prevention',
                price: 3000,
                createdAt: new Date('2024-02-20')
            }
        },
        farmer: {
            names: 'John Uwimana',
            email: 'john.farmer@example.com',
            picture: 'https://via.placeholder.com/150',
            createdAt: new Date('2023-01-10')
        },
        time: {
            startDate: new Date('2024-06-30'),
            startHour: new Date('2024-06-30T14:00:00'),
            endDate: new Date('2024-06-30'),
            endHour: new Date('2024-06-30T16:00:00')
        }
    }
];

// Mock veterinaries list
export const mockVeterinaries = [
    {
        name: 'Dr. Patricia Uwimana',
        location: 'Byose',
        specialization: 'Poultry Health',
        experience: '8 years',
        rating: 4.8,
        phone: '+250 788 123 456',
        email: 'dr.patricia@example.com'
    },
    {
        name: 'Dr. Mutesi Hadidja',
        location: 'Muhanga',
        specialization: 'Livestock Vaccination',
        experience: '6 years',
        rating: 4.6,
        phone: '+250 788 234 567',
        email: 'dr.mutesi@example.com'
    },
    {
        name: 'Dr. Teta Liana',
        location: 'Nyamirambo',
        specialization: 'Animal Nutrition',
        experience: '10 years',
        rating: 4.9,
        phone: '+250 788 345 678',
        email: 'dr.teta@example.com'
    }
];

// Mock pharmacies
export const mockPharmacies: Pharmacy[] = [
    {
        id: 'pharmacy_001',
        name: 'VetCare Pharmacy',
        address: 'KG 15 Ave, Kigali',
        distance: 2.5,
        phone: '+250 788 111 222',
        isOpen: true,
        location: {
            latitude: -1.9441,
            longitude: 30.0619
        }
    },
    {
        id: 'pharmacy_002',
        name: 'Animal Health Center',
        address: 'Muhanga District Center',
        distance: 5.2,
        phone: '+250 788 333 444',
        isOpen: true,
        location: {
            latitude: -2.0853,
            longitude: 29.7564
        }
    },
    {
        id: 'pharmacy_003',
        name: 'Livestock Pharmacy Plus',
        address: 'Byose Market Area',
        distance: 1.8,
        phone: '+250 788 555 666',
        isOpen: false,
        location: {
            latitude: -2.0500,
            longitude: 29.7800
        }
    }
];

// Mock news data
export const mockNews = [
    {
        id: 'news_001',
        title: 'New Vaccination Program Launched for Poultry Farmers',
        summary: 'Government announces free vaccination program to combat Newcastle disease outbreak.',
        content: 'The Ministry of Agriculture has launched a comprehensive vaccination program targeting poultry farmers across all districts. This initiative aims to prevent the spread of Newcastle disease and improve overall poultry health.',
        imageUrl: 'https://via.placeholder.com/300x200',
        publishedAt: new Date('2024-06-20'),
        category: 'Health',
        author: 'Ministry of Agriculture'
    },
    {
        id: 'news_002',
        title: 'Best Practices for Chicken Coop Hygiene',
        summary: 'Expert tips on maintaining clean and healthy environments for your poultry.',
        content: 'Proper hygiene in chicken coops is essential for preventing disease outbreaks. Regular cleaning, proper ventilation, and waste management are key factors in maintaining healthy chickens.',
        imageUrl: 'https://via.placeholder.com/300x200',
        publishedAt: new Date('2024-06-18'),
        category: 'Tips',
        author: 'Dr. Jean Baptiste'
    },
    {
        id: 'news_003',
        title: 'Market Prices for Poultry Products Rise',
        summary: 'Increased demand leads to higher prices for eggs and chicken meat.',
        content: 'Local markets report a 15% increase in poultry product prices due to increased demand and reduced supply from recent disease outbreaks. Farmers are advised to maintain healthy flocks to capitalize on favorable market conditions.',
        imageUrl: 'https://via.placeholder.com/300x200',
        publishedAt: new Date('2024-06-15'),
        category: 'Market',
        author: 'Rwanda Agriculture Board'
    }
];

// Mock authentication service
export class MockAuthService {
    private static users = [
        { email: 'john.farmer@example.com', password: 'password123', role: 'farmer', token: 'mock_farmer_token' },
        { email: 'dr.patricia@example.com', password: 'password123', role: 'veterinary', token: 'mock_vet_token' },
        { email: 'admin@poultix.com', password: 'admin123', role: 'admin', token: 'mock_admin_token' }
    ];

    // Auto-login feature - creates a persistent session for development
    static async createDevelopmentSession(): Promise<void> {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        
        // Check if we already have a session
        const existingToken = await AsyncStorage.getItem('token');
        if (existingToken) {
            return; // Already logged in
        }

        // Auto-login as farmer for development convenience
        const defaultUser = this.users[0]; // john.farmer@example.com
        await AsyncStorage.setItem('token', defaultUser.token);
        await AsyncStorage.setItem('role', defaultUser.role);
        await AsyncStorage.setItem('userEmail', defaultUser.email);
        
        console.log('🚀 Development session created - Auto-logged in as:', defaultUser.email);
    }

    // Quick login methods for development - switch between users easily
    static async loginAsFarmer(): Promise<void> {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const user = this.users[0]; // john.farmer@example.com
        await AsyncStorage.setItem('token', user.token);
        await AsyncStorage.setItem('role', user.role);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('🚜 Logged in as Farmer:', user.email);
    }

    static async loginAsVeterinary(): Promise<void> {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const user = this.users[1]; // dr.patricia@example.com
        await AsyncStorage.setItem('token', user.token);
        await AsyncStorage.setItem('role', user.role);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('🩺 Logged in as Veterinary:', user.email);
    }

    static async loginAsAdmin(): Promise<void> {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const user = this.users[2]; // admin@poultix.com
        await AsyncStorage.setItem('token', user.token);
        await AsyncStorage.setItem('role', user.role);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('👑 Logged in as Admin:', user.email);
    }

    static async logout(): Promise<void> {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.removeItem('userEmail');
        console.log('👋 Logged out successfully');
    }

    static async signIn(email: string, password: string): Promise<{ role: string; token: string }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }
        
        return { role: user.role, token: user.token };
    }

    static async signUp(email: string, password: string, names: string, role: string): Promise<{ success: boolean; message: string }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const existingUser = this.users.find(u => u.email === email);
        
        if (existingUser) {
            throw new Error('User already exists');
        }
        
        // Add new user to mock database
        this.users.push({
            email,
            password,
            role,
            token: `mock_${role}_${Date.now()}`
        });
        
        return { success: true, message: 'Account created successfully' };
    }

    static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('Email not found');
        }
        
        return { success: true, message: 'Password reset code sent to your email' };
    }

    static async verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock verification - accept any 6-digit code
        if (code.length === 6 && /^\d+$/.test(code)) {
            return { success: true, message: 'Code verified successfully' };
        }
        
        throw new Error('Invalid verification code');
    }
}

// Mock data service
export class MockDataService {
    static async getFarmerData(token: string): Promise<FarmerData> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockFarmerData;
    }

    static async getVeterinaryData(token: string): Promise<VeterinaryData> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockVeterinaryData;
    }

    static async getFarmData(token: string): Promise<FarmData> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockFarmData;
    }

    static async getSchedules(token: string): Promise<Schedule[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSchedules;
    }

    static async getVeterinaries(location?: string): Promise<typeof mockVeterinaries> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        if (location) {
            return mockVeterinaries.filter(vet => 
                vet.location.toLowerCase().includes(location.toLowerCase())
            );
        }
        
        return mockVeterinaries;
    }

    static async getPharmacies(): Promise<Pharmacy[]> {
        // Simulate network delay (reduced for better UX)
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockPharmacies;
    }

    static async getNews(): Promise<typeof mockNews> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockNews;
    }
}
