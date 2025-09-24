import { User, Farm, Schedule, Veterinary } from '@/types/entities';

// Realistic mock users
export const mockUsers: User[] = [
  // Admin
  {
    id: 'admin-001',
    email: 'admin@poultix.rw',
    name: 'Jean Baptiste Nzeyimana',
    role: 'admin',
    phone: '+250 788 000 001',
    location: 'Kigali, Rwanda',
    createdAt: new Date('2023-01-15'),
    isActive: true,
  },
  
  // Farmers
  {
    id: 'farmer-001',
    email: 'john@gmail.com',
    name: 'John Uwimana',
    role: 'farmer',
    phone: '+250 788 123 456',
    location: 'Muhanga District',
    createdAt: new Date('2023-03-20'),
    isActive: true,
    farmerData: {
      experience: 8,
      specialization: ['Layer Chickens', 'Broiler Production'],
      totalFarms: 2,
    },
  },
  {
    id: 'farmer-002',
    email: 'marie.mukamana@gmail.com',
    name: 'Marie Mukamana',
    role: 'farmer',
    phone: '+250 788 234 567',
    location: 'Nyanza District',
    createdAt: new Date('2023-02-10'),
    isActive: true,
    farmerData: {
      experience: 5,
      specialization: ['Free Range Chickens', 'Organic Farming'],
      totalFarms: 1,
    },
  },
  {
    id: 'farmer-003',
    email: 'paul.nzeyimana@gmail.com',
    name: 'Paul Nzeyimana',
    role: 'farmer',
    phone: '+250 788 345 678',
    location: 'Kamonyi District',
    createdAt: new Date('2023-04-05'),
    isActive: true,
    farmerData: {
      experience: 12,
      specialization: ['Commercial Poultry', 'Feed Production'],
      totalFarms: 3,
    },
  },
  {
    id: 'farmer-004',
    email: 'grace.uwimana@gmail.com',
    name: 'Grace Uwimana',
    role: 'farmer',
    phone: '+250 788 456 789',
    location: 'Ruhango District',
    createdAt: new Date('2023-05-12'),
    isActive: true,
    farmerData: {
      experience: 3,
      specialization: ['Small Scale Poultry'],
      totalFarms: 1,
    },
  },

  // Veterinaries
  {
    id: 'vet-001',
    email: 'dr.patricia@vetcare.rw',
    name: 'Dr. Patricia Uwimana',
    role: 'veterinary',
    phone: '+250 788 111 222',
    location: 'Muhanga District',
    createdAt: new Date('2023-01-30'),
    isActive: true,
    veterinaryData: {
      licenseNumber: 'VET-RW-2023-001',
      specialization: ['Poultry Health', 'Preventive Medicine', 'Vaccination'],
      yearsExperience: 10,
      serviceRadius: 25,
      assignedFarms: ['farm-001', 'farm-002', 'farm-005'],
    },
  },
  {
    id: 'vet-002',
    email: 'dr.mutesi@animalhealth.rw',
    name: 'Dr. Hadidja Mutesi',
    role: 'veterinary',
    phone: '+250 788 333 444',
    location: 'Nyanza District',
    createdAt: new Date('2023-02-15'),
    isActive: true,
    veterinaryData: {
      licenseNumber: 'VET-RW-2023-002',
      specialization: ['Livestock Medicine', 'Emergency Care', 'Surgery'],
      yearsExperience: 7,
      serviceRadius: 30,
      assignedFarms: ['farm-003', 'farm-004'],
    },
  },
  {
    id: 'vet-003',
    email: 'dr.teta@ruralvet.rw',
    name: 'Dr. Liana Teta',
    role: 'veterinary',
    phone: '+250 788 555 666',
    location: 'Kamonyi District',
    createdAt: new Date('2023-03-01'),
    isActive: true,
    veterinaryData: {
      licenseNumber: 'VET-RW-2023-003',
      specialization: ['Animal Nutrition', 'Breeding', 'Farm Management'],
      yearsExperience: 12,
      serviceRadius: 20,
      assignedFarms: ['farm-006', 'farm-007'],
    },
  },
];

// Realistic mock farms
export const mockFarms: Farm[] = [
  {
    id: 'farm-001',
    name: 'Sunrise Poultry Farm',
    ownerId: 'farmer-001',
    location: {
      address: 'Byose Sector, Muhanga District',
      coordinates: { latitude: -2.0853, longitude: 29.7564 },
      district: 'Muhanga',
      sector: 'Byose',
    },
    size: 2.5,
    establishedDate: new Date('2018-06-15'),
    livestock: {
      chickens: {
        total: 1200,
        healthy: 1150,
        sick: 25,
        atRisk: 25,
        breeds: ['Rhode Island Red', 'New Hampshire', 'Leghorn'],
      },
    },
    facilities: {
      coops: 4,
      feedStorage: true,
      waterSystem: 'Automated',
      electricityAccess: true,
    },
    assignedVeterinaryId: 'vet-001',
    healthStatus: 'good',
    lastInspection: new Date('2024-06-20'),
    certifications: ['Organic Certified', 'HACCP'],
    isActive: true,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: 'farm-002',
    name: 'Green Valley Poultry',
    ownerId: 'farmer-001',
    location: {
      address: 'Muhanga Center',
      coordinates: { latitude: -2.0900, longitude: 29.7600 },
      district: 'Muhanga',
      sector: 'Muhanga',
    },
    size: 1.8,
    establishedDate: new Date('2020-03-10'),
    livestock: {
      chickens: {
        total: 800,
        healthy: 750,
        sick: 30,
        atRisk: 20,
        breeds: ['Broiler', 'Kuroiler'],
      },
    },
    facilities: {
      coops: 3,
      feedStorage: true,
      waterSystem: 'Manual',
      electricityAccess: true,
    },
    assignedVeterinaryId: 'vet-001',
    healthStatus: 'fair',
    lastInspection: new Date('2024-06-18'),
    certifications: ['Bio-security Certified'],
    isActive: true,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-06-18'),
  },
  {
    id: 'farm-003',
    name: 'Mukamana Free Range Farm',
    ownerId: 'farmer-002',
    location: {
      address: 'Nyabisindu Sector, Nyanza District',
      coordinates: { latitude: -2.3500, longitude: 29.7500 },
      district: 'Nyanza',
      sector: 'Nyabisindu',
    },
    size: 3.2,
    establishedDate: new Date('2019-09-20'),
    livestock: {
      chickens: {
        total: 600,
        healthy: 580,
        sick: 10,
        atRisk: 10,
        breeds: ['Indigenous', 'Improved Indigenous'],
      },
    },
    facilities: {
      coops: 2,
      feedStorage: false,
      waterSystem: 'Natural',
      electricityAccess: false,
    },
    assignedVeterinaryId: 'vet-002',
    healthStatus: 'excellent',
    lastInspection: new Date('2024-06-22'),
    certifications: ['Organic Certified', 'Free Range Certified'],
    isActive: true,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2024-06-22'),
  },
  {
    id: 'farm-004',
    name: 'Happy Hens Farm',
    ownerId: 'farmer-004',
    location: {
      address: 'Ruhango Center',
      coordinates: { latitude: -2.2000, longitude: 29.7800 },
      district: 'Ruhango',
      sector: 'Ruhango',
    },
    size: 1.2,
    establishedDate: new Date('2021-01-15'),
    livestock: {
      chickens: {
        total: 400,
        healthy: 390,
        sick: 5,
        atRisk: 5,
        breeds: ['Leghorn', 'Rhode Island Red'],
      },
    },
    facilities: {
      coops: 2,
      feedStorage: true,
      waterSystem: 'Automated',
      electricityAccess: true,
    },
    assignedVeterinaryId: 'vet-002',
    healthStatus: 'good',
    lastInspection: new Date('2024-06-15'),
    certifications: ['Bio-security Certified'],
    isActive: true,
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: 'farm-005',
    name: 'Nzeyimana Commercial Poultry',
    ownerId: 'farmer-003',
    location: {
      address: 'Kamonyi Sector',
      coordinates: { latitude: -1.9500, longitude: 29.8000 },
      district: 'Kamonyi',
      sector: 'Kamonyi',
    },
    size: 5.0,
    establishedDate: new Date('2015-08-30'),
    livestock: {
      chickens: {
        total: 2500,
        healthy: 2400,
        sick: 50,
        atRisk: 50,
        breeds: ['Broiler', 'Layer Hybrid', 'Kuroiler'],
      },
    },
    facilities: {
      coops: 8,
      feedStorage: true,
      waterSystem: 'Automated',
      electricityAccess: true,
    },
    assignedVeterinaryId: 'vet-001',
    healthStatus: 'good',
    lastInspection: new Date('2024-06-25'),
    certifications: ['HACCP', 'ISO 22000', 'Bio-security Certified'],
    isActive: true,
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2024-06-25'),
  },
  {
    id: 'farm-006',
    name: 'Nzeyimana Layer Farm',
    ownerId: 'farmer-003',
    location: {
      address: 'Musambira Sector, Kamonyi District',
      coordinates: { latitude: -1.9800, longitude: 29.8200 },
      district: 'Kamonyi',
      sector: 'Musambira',
    },
    size: 3.5,
    establishedDate: new Date('2017-04-12'),
    livestock: {
      chickens: {
        total: 1800,
        healthy: 1750,
        sick: 25,
        atRisk: 25,
        breeds: ['Leghorn', 'Rhode Island Red', 'New Hampshire'],
      },
    },
    facilities: {
      coops: 6,
      feedStorage: true,
      waterSystem: 'Automated',
      electricityAccess: true,
    },
    assignedVeterinaryId: 'vet-003',
    healthStatus: 'excellent',
    lastInspection: new Date('2024-06-28'),
    certifications: ['Organic Certified', 'HACCP'],
    isActive: true,
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2024-06-28'),
  },
  {
    id: 'farm-007',
    name: 'Nzeyimana Breeding Farm',
    ownerId: 'farmer-003',
    location: {
      address: 'Gacurabwenge Sector, Kamonyi District',
      coordinates: { latitude: -1.9200, longitude: 29.7900 },
      district: 'Kamonyi',
      sector: 'Gacurabwenge',
    },
    size: 2.8,
    establishedDate: new Date('2019-11-08'),
    livestock: {
      chickens: {
        total: 1000,
        healthy: 980,
        sick: 10,
        atRisk: 10,
        breeds: ['Pure Breed Rhode Island Red', 'Pure Breed Leghorn'],
      },
    },
    facilities: {
      coops: 4,
      feedStorage: true,
      waterSystem: 'Semi-automated',
      electricityAccess: true,
    },
    assignedVeterinaryId: 'vet-003',
    healthStatus: 'excellent',
    lastInspection: new Date('2024-06-26'),
    certifications: ['Breeding License', 'Genetic Purity Certified'],
    isActive: true,
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2024-06-26'),
  },
];

// Realistic mock schedules
export const mockSchedules: Schedule[] = [
  {
    id: 'schedule-001',
    title: 'Routine Health Inspection',
    description: 'Monthly health check and vaccination status review',
    type: 'inspection',
    farmId: 'farm-001',
    farmerId: 'farmer-001',
    veterinaryId: 'vet-001',
    scheduledDate: new Date('2024-07-05'),
    startTime: '09:00',
    endTime: '11:00',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Focus on respiratory health due to recent weather changes',
    createdAt: new Date('2024-06-25'),
    updatedAt: new Date('2024-06-25'),
    createdBy: 'farmer-001',
  },
  {
    id: 'schedule-002',
    title: 'Newcastle Disease Vaccination',
    description: 'Annual Newcastle disease vaccination for all birds',
    type: 'vaccination',
    farmId: 'farm-002',
    farmerId: 'farmer-001',
    veterinaryId: 'vet-001',
    scheduledDate: new Date('2024-07-08'),
    startTime: '08:00',
    endTime: '12:00',
    status: 'scheduled',
    priority: 'high',
    notes: 'Bring extra vaccines - large flock size',
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20'),
    createdBy: 'vet-001',
  },
  {
    id: 'schedule-003',
    title: 'Emergency Treatment - Respiratory Issues',
    description: 'Urgent treatment for birds showing respiratory symptoms',
    type: 'emergency',
    farmId: 'farm-003',
    farmerId: 'farmer-002',
    veterinaryId: 'vet-002',
    scheduledDate: new Date('2024-06-30'),
    startTime: '14:00',
    endTime: '16:00',
    status: 'completed',
    priority: 'urgent',
    notes: 'Multiple birds affected, possible infectious bronchitis',
    results: {
      findings: 'Confirmed infectious bronchitis in 15 birds. Isolated affected birds.',
      recommendations: [
        'Administer antibiotics for 7 days',
        'Improve ventilation in coop 2',
        'Monitor remaining flock closely',
        'Quarantine new birds for 14 days'
      ],
      followUpRequired: true,
      followUpDate: new Date('2024-07-07'),
      medications: [
        {
          name: 'Tylosin',
          dosage: '10mg per bird',
          duration: '7 days'
        }
      ]
    },
    createdAt: new Date('2024-06-29'),
    updatedAt: new Date('2024-06-30'),
    createdBy: 'farmer-002',
  },
  {
    id: 'schedule-004',
    title: 'Nutrition Consultation',
    description: 'Feed optimization and nutrition planning session',
    type: 'consultation',
    farmId: 'farm-005',
    farmerId: 'farmer-003',
    veterinaryId: 'vet-001',
    scheduledDate: new Date('2024-07-10'),
    startTime: '10:00',
    endTime: '12:00',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Discuss feed conversion rates and cost optimization',
    createdAt: new Date('2024-06-28'),
    updatedAt: new Date('2024-06-28'),
    createdBy: 'farmer-003',
  },
  {
    id: 'schedule-005',
    title: 'Breeding Program Review',
    description: 'Quarterly review of breeding program and genetic selection',
    type: 'consultation',
    farmId: 'farm-007',
    farmerId: 'farmer-003',
    veterinaryId: 'vet-003',
    scheduledDate: new Date('2024-07-12'),
    startTime: '09:00',
    endTime: '11:30',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Review breeding records and plan next generation selection',
    createdAt: new Date('2024-06-26'),
    updatedAt: new Date('2024-06-26'),
    createdBy: 'vet-003',
  },
  {
    id: 'schedule-006',
    title: 'Routine Checkup',
    description: 'Weekly health monitoring and general assessment',
    type: 'routine_checkup',
    farmId: 'farm-004',
    farmerId: 'farmer-004',
    veterinaryId: 'vet-002',
    scheduledDate: new Date('2024-07-03'),
    startTime: '15:00',
    endTime: '16:30',
    status: 'completed',
    priority: 'low',
    results: {
      findings: 'All birds healthy, good egg production rates',
      recommendations: [
        'Continue current feeding schedule',
        'Clean water systems weekly',
        'Monitor for parasites during rainy season'
      ],
      followUpRequired: false,
    },
    createdAt: new Date('2024-06-28'),
    updatedAt: new Date('2024-07-03'),
    createdBy: 'vet-002',
  },
  {
    id: 'schedule-007',
    title: 'Vaccination Follow-up',
    description: 'Post-vaccination monitoring and assessment',
    type: 'inspection',
    farmId: 'farm-006',
    farmerId: 'farmer-003',
    veterinaryId: 'vet-003',
    scheduledDate: new Date('2024-07-15'),
    startTime: '08:30',
    endTime: '10:00',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Check vaccination effectiveness and any adverse reactions',
    createdAt: new Date('2024-06-30'),
    updatedAt: new Date('2024-06-30'),
    createdBy: 'vet-003',
  },
];

// Mock veterinary profiles
export const mockVeterinaries: Veterinary[] = [
  {
    id: 'veterinary-001',
    userId: 'vet-001',
    licenseNumber: 'VET-RW-2023-001',
    specializations: ['Poultry Health', 'Preventive Medicine', 'Vaccination', 'Disease Diagnosis'],
    serviceAreas: ['Muhanga', 'Kamonyi', 'Ruhango'],
    availability: {
      monday: { start: '08:00', end: '17:00', available: true },
      tuesday: { start: '08:00', end: '17:00', available: true },
      wednesday: { start: '08:00', end: '17:00', available: true },
      thursday: { start: '08:00', end: '17:00', available: true },
      friday: { start: '08:00', end: '17:00', available: true },
      saturday: { start: '08:00', end: '12:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false },
    },
    rates: {
      consultation: 15000,
      inspection: 25000,
      emergency: 50000,
      vaccination: 5000,
    },
    equipment: ['Digital Thermometer', 'Stethoscope', 'Vaccination Kit', 'Microscope', 'Portable Lab Kit'],
    certifications: ['DVM - University of Rwanda', 'Poultry Health Specialist', 'Emergency Care Certified'],
    rating: 4.8,
    totalVisits: 156,
    joinDate: new Date('2023-01-30'),
    isActive: true,
  },
  {
    id: 'veterinary-002',
    userId: 'vet-002',
    licenseNumber: 'VET-RW-2023-002',
    specializations: ['Livestock Medicine', 'Emergency Care', 'Surgery', 'Reproductive Health'],
    serviceAreas: ['Nyanza', 'Huye', 'Gisagara'],
    availability: {
      monday: { start: '07:00', end: '18:00', available: true },
      tuesday: { start: '07:00', end: '18:00', available: true },
      wednesday: { start: '07:00', end: '18:00', available: true },
      thursday: { start: '07:00', end: '18:00', available: true },
      friday: { start: '07:00', end: '18:00', available: true },
      saturday: { start: '09:00', end: '15:00', available: true },
      sunday: { start: '09:00', end: '12:00', available: true },
    },
    rates: {
      consultation: 18000,
      inspection: 30000,
      emergency: 60000,
      vaccination: 6000,
    },
    equipment: ['Surgical Kit', 'Ultrasound Machine', 'Blood Test Kit', 'X-ray Equipment', 'Emergency Kit'],
    certifications: ['DVM - University of Rwanda', 'Surgery Specialist', '24/7 Emergency Care'],
    rating: 4.6,
    totalVisits: 89,
    joinDate: new Date('2023-02-15'),
    isActive: true,
  },
  {
    id: 'veterinary-003',
    userId: 'vet-003',
    licenseNumber: 'VET-RW-2023-003',
    specializations: ['Animal Nutrition', 'Breeding', 'Farm Management', 'Genetics'],
    serviceAreas: ['Kamonyi', 'Muhanga', 'Nyamabuye'],
    availability: {
      monday: { start: '08:00', end: '16:00', available: true },
      tuesday: { start: '08:00', end: '16:00', available: true },
      wednesday: { start: '08:00', end: '16:00', available: true },
      thursday: { start: '08:00', end: '16:00', available: true },
      friday: { start: '08:00', end: '16:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false },
    },
    rates: {
      consultation: 20000,
      inspection: 35000,
      emergency: 70000,
      vaccination: 7000,
    },
    equipment: ['Nutrition Analysis Kit', 'Breeding Records System', 'Growth Monitoring Tools', 'Feed Testing Kit'],
    certifications: ['DVM - University of Rwanda', 'Animal Nutrition PhD', 'Breeding Specialist', 'Farm Management Certified'],
    rating: 4.9,
    totalVisits: 124,
    joinDate: new Date('2023-03-01'),
    isActive: true,
  },
];

// Helper functions for data relationships
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getFarmById = (id: string): Farm | undefined => {
  return mockFarms.find(farm => farm.id === id);
};

export const getScheduleById = (id: string): Schedule | undefined => {
  return mockSchedules.find(schedule => schedule.id === id);
};

export const getVeterinaryById = (id: string): Veterinary | undefined => {
  return mockVeterinaries.find(vet => vet.id === id);
};

// Get farms by owner
export const getFarmsByOwner = (ownerId: string): Farm[] => {
  return mockFarms.filter(farm => farm.ownerId === ownerId);
};

// Get schedules by farm
export const getSchedulesByFarm = (farmId: string): Schedule[] => {
  return mockSchedules.filter(schedule => schedule.farmId === farmId);
};

// Get schedules by veterinary
export const getSchedulesByVeterinary = (veterinaryId: string): Schedule[] => {
  return mockSchedules.filter(schedule => schedule.veterinaryId === veterinaryId);
};

// Get farms assigned to veterinary
export const getFarmsByVeterinary = (veterinaryId: string): Farm[] => {
  return mockFarms.filter(farm => farm.assignedVeterinaryId === veterinaryId);
};
