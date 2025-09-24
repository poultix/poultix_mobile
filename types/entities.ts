// Core entity types for the farm management system

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'farmer' | 'veterinary';
  phone: string;
  avatar?: string;
  location: string;
  createdAt: Date;
  isActive: boolean;
  // Role-specific data
  farmerData?: {
    experience: number; // years
    specialization: string[];
    totalFarms: number;
  };
  veterinaryData?: {
    licenseNumber: string;
    specialization: string[];
    yearsExperience: number;
    serviceRadius: number; // km
    assignedFarms: string[]; // farm IDs
  };
}

export interface Farm {
  id: string;
  name: string;
  ownerId: string; // farmer user ID
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    district: string;
    sector: string;
  };
  size: number; // hectares
  establishedDate: Date;
  livestock: {
    chickens: {
      total: number;
      healthy: number;
      sick: number;
      atRisk: number;
      breeds: string[];
    };
    other?: {
      type: string;
      count: number;
    }[];
  };
  facilities: {
    coops: number;
    feedStorage: boolean;
    waterSystem: string;
    electricityAccess: boolean;
  };
  assignedVeterinaryId?: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastInspection?: Date;
  certifications: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  title: string;
  description: string;
  type: 'inspection' | 'vaccination' | 'treatment' | 'consultation' | 'emergency' | 'routine_checkup';
  farmId: string;
  farmerId: string;
  veterinaryId: string;
  scheduledDate: Date;
  startTime: string; // HH:MM format
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  results?: {
    findings: string;
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate?: Date;
    medications?: {
      name: string;
      dosage: string;
      duration: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // user ID
}

export interface Veterinary {
  id: string;
  userId: string; // reference to User
  licenseNumber: string;
  specializations: string[];
  serviceAreas: string[]; // districts/sectors
  availability: {
    [key: string]: { // day of week
      start: string;
      end: string;
      available: boolean;
    };
  };
  rates: {
    consultation: number;
    inspection: number;
    emergency: number;
    vaccination: number;
  };
  equipment: string[];
  certifications: string[];
  rating: number;
  totalVisits: number;
  joinDate: Date;
  isActive: boolean;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  farms: Farm[];
  schedules: Schedule[];
  veterinaries: Veterinary[];
  isLoading: boolean;
  error: string | null;
}

// Filter and search types
export interface FilterOptions {
  role?: User['role'];
  location?: string;
  healthStatus?: Farm['healthStatus'];
  scheduleStatus?: Schedule['status'];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchOptions {
  query: string;
  fields: string[];
}
