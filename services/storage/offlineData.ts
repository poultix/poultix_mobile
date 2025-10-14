// Static offline data for demo purposes and fallbacks

export const offlineEmergencyData = {
    firstAidGuides: [
        {
            id: '1',
            title: 'Poultry Emergency Care',
            symptoms: ['Difficulty breathing', 'Loss of appetite', 'Lethargy'],
            treatment: ['Isolate affected birds', 'Provide clean water', 'Contact veterinarian immediately'],
            urgency: 'high'
        },
        {
            id: '2', 
            title: 'Common Poultry Diseases',
            symptoms: ['Coughing', 'Nasal discharge', 'Reduced egg production'],
            treatment: ['Improve ventilation', 'Administer prescribed medication', 'Monitor flock closely'],
            urgency: 'medium'
        }
    ],
    emergencyContacts: [
        { name: 'Emergency Vet Line', phone: '+250-123-456-789', available: '24/7' },
        { name: 'Poultry Disease Hotline', phone: '+250-987-654-321', available: 'Mon-Fri 8AM-6PM' }
    ]
};

export const offlineVeterinaryData = {
    nearbyVets: [
        {
            id: '1',
            name: 'Dr. John Uwimana',
            specialization: ['Poultry', 'Large Animals'],
            experience: 8,
            rating: 4.8,
            distance: '2.5 km',
            available: true,
            phone: '+250-111-222-333'
        },
        {
            id: '2',
            name: 'Dr. Sarah Mukamana',
            specialization: ['Poultry', 'Small Animals'],
            experience: 5,
            rating: 4.6,
            distance: '3.2 km',
            available: false,
            phone: '+250-444-555-666'
        }
    ]
};

export const offlinePharmacyData = {
    nearbyPharmacies: [
        {
            id: '1',
            name: 'VetCare Pharmacy',
            distance: '1.8 km',
            openHours: '8:00 AM - 8:00 PM',
            phone: '+250-777-888-999',
            available: true
        },
        {
            id: '2',
            name: 'Animal Health Center',
            distance: '4.1 km', 
            openHours: '7:00 AM - 6:00 PM',
            phone: '+250-222-333-444',
            available: true
        }
    ],
    commonMedicines: [
        {
            id: '1',
            name: 'Amoxicillin',
            type: 'Antibiotic',
            dosage: '20mg/kg',
            usage: 'Respiratory infections',
            price: 'RWF 2,500'
        },
        {
            id: '2',
            name: 'Oxytetracycline',
            type: 'Antibiotic',
            dosage: '15mg/kg',
            usage: 'General infections',
            price: 'RWF 3,200'
        }
    ]
};

export const offlineEnvironmentData = {
    optimalRanges: {
        temperature: { min: 18, max: 25, unit: '°C' },
        humidity: { min: 50, max: 70, unit: '%' },
        airQuality: { min: 80, max: 100, unit: 'AQI' }
    },
    tips: [
        'Maintain proper ventilation to prevent respiratory issues',
        'Monitor temperature regularly, especially during seasonal changes',
        'Ensure adequate humidity for bird comfort and health',
        'Clean coops regularly to maintain air quality'
    ]
};

export const offlineAIResponses = {
    commonQuestions: [
        {
            question: 'What should I feed my chickens?',
            answer: 'Provide a balanced diet with commercial feed (70%), grains (20%), and fresh vegetables (10%). Ensure constant access to clean water.'
        },
        {
            question: 'How often should I clean the coop?',
            answer: 'Clean the coop weekly, with daily removal of droppings. Deep clean monthly with disinfectant to prevent disease.'
        },
        {
            question: 'Signs of sick chickens?',
            answer: 'Watch for lethargy, loss of appetite, unusual discharge, difficulty breathing, or reduced egg production. Isolate and consult a vet immediately.'
        }
    ]
};

export const offlineSettingsData = {
    defaultSettings: {
        notifications: true,
        language: 'EN',
        temperatureUnit: 'celsius',
        theme: 'light',
        autoSync: true
    }
};
