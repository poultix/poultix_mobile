import { User,  UserRole } from '@/types/user';
import { Farm,  FarmStatus } from '@/types/farm';
import { Schedule, ScheduleType, ScheduleStatus, SchedulePriority } from '@/types/schedule';
import { Pharmacy} from '@/types/pharmacy';
import { News, NewsPriority } from '@/types/news';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock user data
export const mockUsers: User[] = [
    {
        id: 'farmer_001',
        email: 'farmer@example.com',
        name: 'John Uwimana',
        role: UserRole.FARMER,
        phone: '+250 788 123 456',
        location: 'Byose, Muhanga District',
        createdAt: new Date('2023-01-10'),
        isActive: true
    },
    {
        id: 'vet_001',
        email: 'vet@example.com',
        name: 'Dr. Patricia Uwimana',
        role: UserRole.VETERINARY,
        phone: '+250 788 234 567',
        location: 'Muhanga District',
        createdAt: new Date('2023-01-15'),
        isActive: true
    },
    {
        id: 'admin_001',
        email: 'admin@poultix.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
        phone: '+250 788 345 678',
        location: 'Kigali',
        createdAt: new Date('2023-01-01'),
        isActive: true
    }
];




export const mockFarms: Farm[] = [
    {
        id: 'farm_001',
        name: 'Sunrise Poultry Farm',
        owner: mockUsers[0],
        location: {
            address: 'Byose, Muhanga District',
            coordinates: {
                latitude: -2.0853,
                longitude: 29.7564
            },
            district: 'Muhanga',
            sector: 'Byose'
        },
        size: 2.5,
        establishedDate: new Date('2020-03-15'),
        livestock: {
            total: 500,
            healthy: 450,
            sick: 12,
            atRisk: 38,
            breeds: ['Rhode Island Red', 'Leghorn']
        },
        facilities: {
            coops: 4,
            feedStorage: true,
            waterSystem: 'Automatic',
            electricityAccess: true
        },
        assignedVeterinary: mockUsers[1],
        healthStatus: FarmStatus.GOOD,
        lastInspection: new Date('2024-06-20'),
        certifications: ['Organic Certification', 'Animal Welfare Approved'],
        isActive: true,
        createdAt: new Date('2020-03-15'),
        updatedAt: new Date('2024-06-25')
    }
];

// Mock schedules
export const mockSchedules: Schedule[] = [
    {
        id: 'schedule_001',
        title: 'Routine Health Check',
        description: 'Regular health inspection and vaccination',
        type: ScheduleType.INSPECTION,
        farmer: mockUsers[0],
        veterinary: mockUsers[1],
        scheduledDate: new Date('2024-06-27'),
        startTime: '08:00',
        endTime: '10:00',
        status: ScheduleStatus.SCHEDULED,
        priority: SchedulePriority.MEDIUM,
        notes: 'Newcastle disease vaccination required',
        createdAt: new Date('2024-06-25'),
        updatedAt: new Date('2024-06-25'),
        createdBy: mockUsers[0]
    },
    {
        id: 'schedule_002',
        title: 'Emergency Treatment',
        description: 'Emergency visit for sick chickens',
        type: ScheduleType.EMERGENCY,
        farmer: mockUsers[0],
        veterinary: mockUsers[1],
        scheduledDate: new Date('2024-06-30'),
        startTime: '14:00',
        endTime: '16:00',
        status: ScheduleStatus.COMPLETED,
        priority: SchedulePriority.URGENT,
        notes: 'Respiratory symptoms in multiple birds',
        results: {
            findings: 'Mild respiratory infection detected',
            recommendations: ['Improve ventilation', 'Administer antibiotics', 'Monitor closely'],
            followUpRequired: true,
            followUpDate: new Date('2024-07-07'),
            medications: [{
                name: 'Enrofloxacin',
                dosage: '10mg/kg',
                duration: '5 days'
            }]
        },
        createdAt: new Date('2024-06-29'),
        updatedAt: new Date('2024-06-30'),
        createdBy: mockUsers[0]
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
    },
];



// Mock schedule requests
export const mockScheduleRequests = [
    {
        id: 'req_001',
        farmerId: 'farmer_001',
        veterinaryId: 'vet_001',
        farmerName: 'John Uwimana',
        veterinaryName: 'Dr. Patricia Uwimana',
        farmName: 'Sunrise Poultry Farm',
        requestedDate: new Date('2024-06-28'),
        preferredTime: '14:00',
        reason: 'Routine health check and vaccination',
        urgency: 'medium',
        status: 'pending',
        createdAt: new Date('2024-06-25T09:00:00'),
        notes: 'Some chickens showing mild respiratory symptoms'
    },
    {
        id: 'req_002',
        farmerId: 'farmer_002',
        veterinaryId: 'vet_001',
        farmerName: 'Jane Mukamana',
        veterinaryName: 'Dr. Patricia Uwimana',
        farmName: 'Green Valley Farm',
        requestedDate: new Date('2024-06-29'),
        preferredTime: '10:00',
        reason: 'Emergency - sick chickens',
        urgency: 'high',
        status: 'approved',
        createdAt: new Date('2024-06-24T16:30:00'),
        notes: 'Multiple chickens with severe symptoms, urgent attention needed'
    }
];

// Mock nearby farms for veterinaries
export const mockNearbyFarms = [
    {
        id: 'farm_001',
        farmName: 'Sunrise Poultry Farm',
        farmerName: 'John Uwimana',
        location: 'Byose, Muhanga District',
        distance: 2.5,
        totalChickens: 500,
        healthStatus: 'good',
        lastVisit: new Date('2024-06-20'),
        phone: '+250 788 123 456',
        coordinates: { latitude: -2.0853, longitude: 29.7564 }
    },
    {
        id: 'farm_002',
        farmName: 'Green Valley Farm',
        farmerName: 'Jane Mukamana',
        location: 'Muhanga Center',
        distance: 4.2,
        totalChickens: 350,
        healthStatus: 'attention_needed',
        lastVisit: new Date('2024-06-18'),
        phone: '+250 788 234 567',
        coordinates: { latitude: -2.0900, longitude: 29.7600 }
    },
    {
        id: 'farm_003',
        farmName: 'Happy Hens Farm',
        farmerName: 'Paul Nzeyimana',
        location: 'Kibuye Area',
        distance: 6.8,
        totalChickens: 280,
        healthStatus: 'excellent',
        lastVisit: new Date('2024-06-22'),
        phone: '+250 788 345 678',
        coordinates: { latitude: -2.0750, longitude: 29.7450 }
    }
];

// Mock news data
export const mockNews: News[] = [
    {
        title: 'New Vaccination Program Launched for Poultry Farmers',
        content: 'The Ministry of Agriculture has launched a comprehensive vaccination program targeting poultry farmers across all districts. This initiative aims to prevent the spread of Newcastle disease and improve overall poultry health.',
        category: 'Health',
        priority: NewsPriority.URGENT,
        tags: ['vaccination', 'newcastle', 'government'],
        author: mockUsers[2],
        createdAt: new Date('2024-06-23'),
        updatedAt: new Date('2024-06-23')
    },
    {
        title: 'Best Practices for Chicken Coop Hygiene',
        content: 'Proper hygiene in chicken coops is essential for preventing disease outbreaks. Regular cleaning, proper ventilation, and waste management are key factors in maintaining healthy chickens.',
        category: 'Health',
        priority: NewsPriority.HIGH,
        tags: ['hygiene', 'prevention', 'tips'],
        author: mockUsers[1],
        createdAt: new Date('2024-06-21'),
        updatedAt: new Date('2024-06-21')
    },
    {
        title: 'Market Prices for Poultry Products Rise',
        content: 'Local markets report a 15% increase in poultry product prices due to increased demand and reduced supply from recent disease outbreaks. Farmers are advised to maintain healthy flocks to capitalize on favorable market conditions.',
        category: 'Market',
        priority: NewsPriority.MEDIUM,
        tags: ['prices', 'market', 'demand'],
        author: mockUsers[2],
        createdAt: new Date('2024-06-18'),
        updatedAt: new Date('2024-06-18')
    },
    {
        title: 'Advanced Nutrition Guidelines for Layer Hens',
        content: 'Recent studies show that specific nutritional combinations can increase egg production by up to 20%. The guidelines include proper calcium ratios and protein timing.',
        category: 'Nutrition',
        priority: NewsPriority.HIGH,
        tags: ['nutrition', 'layers', 'production'],
        author: mockUsers[1],
        createdAt: new Date('2024-06-22'),
        updatedAt: new Date('2024-06-22')
    },
    {
        title: 'Smart Farming Technology for Poultry Management',
        content: 'New technology solutions help farmers monitor temperature, humidity, and bird behavior in real-time, leading to better health outcomes and increased productivity.',
        category: 'Technology',
        priority: NewsPriority.MEDIUM,
        tags: ['technology', 'iot', 'monitoring'],
        author: mockUsers[2],
        createdAt: new Date('2024-06-20'),
        updatedAt: new Date('2024-06-20')
    },
    {
        title: 'Breeding Program Success: New Disease-Resistant Chickens',
        content: 'After 5 years of selective breeding, researchers have developed chicken breeds with enhanced resistance to Newcastle disease and fowl pox, reducing medication needs.',
        category: 'Breeding',
        priority: NewsPriority.HIGH,
        tags: ['breeding', 'resistance', 'genetics'],
        author: mockUsers[1],
        createdAt: new Date('2024-06-19'),
        updatedAt: new Date('2024-06-19')
    }
];

// Mock authentication service
export class MockAuthService {
    private static users = [
        { email: 'farmer@example.com', password: 'password123', role: 'FARMER', token: 'mock_farmer_token' },
        { email: 'vet@example.com', password: 'password123', role: 'VETERINARY', token: 'mock_vet_token' },
        { email: 'admin@poultix.com', password: 'admin123', role: 'ADMIN', token: 'mock_admin_token' }
    ];

    // Auto-login feature - creates a persistent session for development
    static async createDevelopmentSession(): Promise<void> {

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
        const user = this.users[0]; // john.farmer@example.com
        await AsyncStorage.setItem('token', user.token);
        await AsyncStorage.setItem('role', user.role);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('🚜 Logged in as Farmer:', user.email);
    }

    static async loginAsVeterinary(): Promise<void> {
        const user = this.users[1]; // dr.patricia@example.com
        await AsyncStorage.setItem('token', user.token);
        await AsyncStorage.setItem('role', user.role);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('🩺 Logged in as Veterinary:', user.email);
    }

    static async loginAsAdmin(): Promise<void> {
        const user = this.users[2]; // admin@poultix.com
        await AsyncStorage.setItem('token', user.token);
        await AsyncStorage.setItem('role', user.role);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('👑 Logged in as Admin:', user.email);
    }

    static async logout(): Promise<void> {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.removeItem('userEmail');
        console.log('👋 Logged out successfully');
    }

    static async signIn(email: string, password: string): Promise<{ user: User; token: string }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const authUser = this.users.find(u => u.email === email && u.password === password);

        if (!authUser) {
            throw new Error('Invalid credentials');
        }

        // Find the corresponding User object from mockUsers
        const userObject = mockUsers.find(u => u.email === email);

        if (!userObject) {
            throw new Error('User data not found');
        }

        return { user: userObject, token: authUser.token };
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

    static async getCurrentUser(email: string): Promise<User | null> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return mockUsers.find(u => u.email === email) || null;
    }
}

// Mock data service
export class MockDataService {
    static async getUsers(): Promise<User[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockUsers;
    }

    static async getUserById(id: string): Promise<User | null> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockUsers.find(user => user.id === id) || null;
    }

    static async getFarms(): Promise<Farm[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockFarms;
    }

    static async getSchedules(): Promise<Schedule[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSchedules;
    }

    static async getVeterinaries(location?: string): Promise<typeof mockVeterinaries> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 700));

 

        return mockVeterinaries;
    }

    static async getPharmacies(): Promise<Pharmacy[]> {
        // Simulate network delay (reduced for better UX)
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockPharmacies;
    }

    static async getNews(): Promise<News[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockNews;
    }

    static async getNewsArticles(): Promise<News[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockNews;
    }


    static async getScheduleRequests(veterinaryId?: string): Promise<typeof mockScheduleRequests> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 400));

    
        return mockScheduleRequests;
    }

    static async createScheduleRequest(request: any): Promise<{ success: boolean; message: string }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newRequest = {
            id: `req_${Date.now()}`,
            ...request,
            status: 'pending',
            createdAt: new Date()
        };

        mockScheduleRequests.push(newRequest);
        return { success: true, message: 'Schedule request sent successfully' };
    }

    static async updateScheduleRequest(requestId: string, status: string): Promise<{ success: boolean }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const request = mockScheduleRequests.find(req => req.id === requestId);
        if (request) {
            request.status = status;
            return { success: true };
        }

        return { success: false };
    }

    static async getNearbyFarms(veterinaryLocation?: string): Promise<typeof mockNearbyFarms> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));

        if (veterinaryLocation) {
            return mockNearbyFarms.filter(farm =>
                farm.location.toLowerCase().includes(veterinaryLocation.toLowerCase())
            );
        }

        return mockNearbyFarms;
    }
}
