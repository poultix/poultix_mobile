import { Language } from '../../types/user';

export interface Translations {
    // Common
    common: {
        back: string;
        next: string;
        save: string;
        cancel: string;
        loading: string;
        error: string;
        success: string;
        search: string;
        settings: string;
        logout: string;
        language: string;
        selectLanguage: string;
        done: string;
        notifications: string;
        offline: string;
        farmer: string;
        farms: string;
        accountVerificationPending: string;
        verify: string;
        welcome: string;
        overview: string;
        myFarms: string;
        schedules: string;
        totalChickens: string;
        upcomingVisits: string;
        healthy: string;
        none: string;
        addFarm: string;
        requestVisit: string;
        hectares: string;
        total: string;
        needAttention: string;
        sick: string;
        atRisk: string;
        noFarmsYet: string;
        getStartedAddFarm: string;
        addYourFirstFarm: string;
        all: string;
        confirm: string;
        delete: string;
        edit: string;
        add: string;
        filter: string;
        sort: string;
        refresh: string;
        retry: string;
        close: string;
        open: string;
        yes: string;
        no: string;
        ok: string;
        continue: string;
        skip: string;
        previous: string;
        finish: string;
        start: string;
        stop: string;
        pause: string;
        play: string;
        profile: string;
        account: string;
        login: string;
        register: string;
        forgotPassword: string;
        resetPassword: string;
        changePassword: string;
        updateProfile: string;
        help: string;
        about: string;
        contact: string;
        privacy: string;
        terms: string;
    };
    
    // Auth
    auth: {
        login: string;
        signup: string;
        email: string;
        password: string;
        forgotPassword: string;
        createAccount: string;
        welcomeBack: string;
        signUpTitle: string;
        enterEmail: string;
        enterPassword: string;
        signingIn: string;
        signIn: string;
        orContinueWith: string;
    };

    // Navigation/Search Hub
    navigation: {
        findMedicines: string;
        findVets: string;
        vaccines: string;
        pharmacies: string;
        emergency: string;
        resources: string;
        environmentMonitoring: string;
        aiAssistant: string;
        dashboard: string;
        exploreApp: string;
    };

    // Emergency
    emergency: {
        firstAid: string;
        emergencyContacts: string;
        symptoms: string;
        treatment: string;
        urgentCare: string;
        guides: string;
        steps: string;
        materials: string;
        quickReference: string;
    };

    // Environment
    environment: {
        temperature: string;
        humidity: string;
        airQuality: string;
        monitoring: string;
        readings: string;
        deviceConnected: string;
        deviceDisconnected: string;
        realTime: string;
        scanner: string;
        connectDevice: string;
        optimalRange: string;
        alerts: string;
    };

    // Veterinary
    veterinary: {
        findVeterinarian: string;
        nearbyVets: string;
        specialization: string;
        experience: string;
        rating: string;
        bookAppointment: string;
        verified: string;
        available: string;
        networkStats: string;
        searchVets: string;
        noVetsFound: string;
        aiScore: string;
        consultationFee: string;
        loading: string;
    };

    // Pharmacy
    pharmacy: {
        findPharmacy: string;
        medicines: string;
        availability: string;
        price: string;
        prescription: string;
        nearbyPharmacies: string;
        searchMedicines: string;
        loading: string;
        noMedicinesFound: string;
        categories: string;
        checkout: string;
    };

    // AI
    ai: {
        assistant: string;
        askQuestion: string;
        chatWithAI: string;
        recommendations: string;
        diagnosis: string;
        typeMessage: string;
        send: string;
        thinking: string;
        powered: string;
        smartAssistant: string;
        error: string;
        quickQuestions: string;
        askAboutPoultry: string;
        quickAction1: string;
        quickAction2: string;
        quickAction3: string;
        quickAction4: string;
        quickAction5: string;
        quickAction6: string;
    };

    // Map
    map: {
        pharmacies: string;
        veterinarians: string;
        farms: string;
        interactiveMap: string;
        exploreServices: string;
    };

    // Custom Drawer
    drawer: {
        adminPanel: string;
        systemAdministration: string;
        dataManagement: string;
        editContent: string;
        veterinaryCare: string;
        findExpertHelp: string;
        medicine: string;
        medicineDirectory: string;
        pharmacies: string;
        locatePharmacies: string;
        aiAssistant: string;
        getAiAdvice: string;
        bluetoothDevices: string;
        connectDevices: string;
        phAnalyzer: string;
        analyzeStoolSamples: string;
        climateScanner: string;
        environmentalMonitoring: string;
        settings: string;
        appPreferences: string;
    };

    // Recent Activities & Visits
    activities: {
        recentActivities: string;
        viewRecentActivities: string;
        activityHistory: string;
        noSchedulesYet: string;
        scheduleVisitsText: string;
        requestFirstVisit: string;
        visitStatus: string;
        priority: string;
        urgentPriority: string;
        highPriority: string;
        mediumPriority: string;
        lowPriority: string;
    };

    // PH Reader - Comprehensive translations
    phReader: {
        // Header & Navigation
        smartAnalysisTool: string;
        phAnalyzer: string;
        advancedPoultryMonitoring: string;
        
        // Quick Stats
        totalScans: string;
        lastReading: string;
        
        // Action Buttons
        smartScan: string;
        scanning: string;
        history: string;
        newReading: string;
        viewHistory: string;
        
        // Input Section
        manualPhEntry: string;
        phReading: string;
        enterPhReading: string;
        analyzePhReading: string;
        
        // History
        readingHistory: string;
        noReadingsYet: string;
        
        // Health Status Messages
        severeAcidosis: string;
        acidosisWarning: string;
        healthyRange: string;
        alkalosisWarning: string;
        severeAlkalosis: string;
        
        // Status Descriptions
        severeAcidosisDesc: string;
        acidosisWarningDesc: string;
        healthyRangeDesc: string;
        alkalosisWarningDesc: string;
        severeAlkalosisDesc: string;
        
        // Recommendations - Severe Acidosis
        severeAcidosisRec1: string;
        severeAcidosisRec2: string;
        severeAcidosisRec3: string;
        severeAcidosisRec4: string;
        
        // Recommendations - Acidosis Warning
        acidosisRec1: string;
        acidosisRec2: string;
        acidosisRec3: string;
        acidosisRec4: string;
        
        // Recommendations - Healthy Range
        healthyRec1: string;
        healthyRec2: string;
        healthyRec3: string;
        healthyRec4: string;
        
        // Recommendations - Alkalosis Warning
        alkalosisRec1: string;
        alkalosisRec2: string;
        alkalosisRec3: string;
        alkalosisRec4: string;
        
        // Recommendations - Severe Alkalosis
        severeAlkalosisRec1: string;
        severeAlkalosisRec2: string;
        severeAlkalosisRec3: string;
        severeAlkalosisRec4: string;
        
        // Section Titles
        healthAnalysis: string;
        recommendations: string;
        phRelatedDiseaseRisks: string;
        quickEmergencyMeasures: string;
        nextSteps: string;
        
        // Disease Info
        symptoms: string;
        mortalityRisk: string;
        
        // Next Steps Actions
        findVeterinarian: string;
        locateVetServices: string;
        findPharmacy: string;
        getMedications: string;
        
        // Alerts & Errors
        scanComplete: string;
        phReadingDetected: string;
        analyze: string;
        invalidPhValue: string;
        severity: string;
        
        // Severity Levels
        low: string;
        medium: string;
        high: string;
        critical: string;
    };
}

export const translations: Record<Language, Translations> = {
    [Language.EN]: {
        common: {
            back: 'Back',
            next: 'Next',
            save: 'Save',
            cancel: 'Cancel',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            confirm: 'Confirm',
            delete: 'Delete',
            edit: 'Edit',
            add: 'Add',
            search: 'Search',
            filter: 'Filter',
            sort: 'Sort',
            refresh: 'Refresh',
            retry: 'Retry',
            close: 'Close',
            open: 'Open',
            yes: 'Yes',
            no: 'No',
            ok: 'OK',
            done: 'Done',
            continue: 'Continue',
            skip: 'Skip',
            previous: 'Previous',
            finish: 'Finish',
            start: 'Start',
            stop: 'Stop',
            pause: 'Pause',
            play: 'Play',
            settings: 'Settings',
            profile: 'Profile',
            account: 'Account',
            logout: 'Logout',
            login: 'Login',
            register: 'Register',
            forgotPassword: 'Forgot Password',
            resetPassword: 'Reset Password',
            changePassword: 'Change Password',
            updateProfile: 'Update Profile',
            notifications: 'Notifications',
            help: 'Help',
            about: 'About',
            contact: 'Contact',
            privacy: 'Privacy',
            terms: 'Terms',
            language: 'Language',
            selectLanguage: 'Select Language',
            all: 'All',
            farmer: 'Farmer',
            farms: 'farms',
            accountVerificationPending: 'Account verification pending',
            verify: 'Verify',
            welcome: 'Welcome',
            overview: 'Overview',
            myFarms: 'My Farms',
            schedules: 'Schedules',
            totalChickens: 'Total Chickens',
            upcomingVisits: 'Upcoming Visits',
            healthy: 'healthy',
            none: 'None',
            addFarm: 'Add Farm',
            requestVisit: 'Request Visit',
            hectares: 'hectares',
            total: 'total',
            needAttention: 'Need Attention',
            sick: 'sick',
            atRisk: 'at risk',
            noFarmsYet: 'No Farms Yet',
            getStartedAddFarm: 'Get started by adding your first farm to track your poultry operations',
            addYourFirstFarm: 'Add Your First Farm',
            offline: 'Offline',
        },
        auth: {
            login: 'Login',
            signup: 'Sign Up',
            email: 'Email',
            password: 'Password',
            forgotPassword: 'Forgot Password?',
            createAccount: 'Create Account',
            welcomeBack: 'Welcome Back',
            signUpTitle: 'Create Your Account',
            enterEmail: 'Enter your email address',
            enterPassword: 'Enter your password',
            signingIn: 'Signing In...',
            signIn: 'Sign In',
            orContinueWith: 'OR CONTINUE WITH',
        },
        navigation: {
            findMedicines: 'Find Medicines',
            findVets: 'Find Vets',
            vaccines: 'Vaccines',
            pharmacies: 'Pharmacies',
            emergency: 'Emergency',
            resources: 'Resources',
            environmentMonitoring: 'Environment Monitoring',
            aiAssistant: 'AI Assistant',
            dashboard: 'Dashboard',
            exploreApp: 'Explore App',
        },
        emergency: {
            firstAid: 'First Aid',
            emergencyContacts: 'Emergency Contacts',
            symptoms: 'Symptoms',
            treatment: 'Treatment',
            urgentCare: 'Urgent Care',
            guides: 'Guides',
            steps: 'Steps',
            materials: 'Materials',
            quickReference: 'Quick Reference',
        },
        environment: {
            temperature: 'Temperature',
            humidity: 'Humidity',
            airQuality: 'Air Quality',
            monitoring: 'Monitoring',
            readings: 'Readings',
            deviceConnected: 'Device Connected',
            deviceDisconnected: 'Device Disconnected',
            realTime: 'Real Time',
            scanner: 'Scanner',
            connectDevice: 'Connect Device',
            optimalRange: 'Optimal Range',
            alerts: 'Alerts',
        },
        veterinary: {
            findVeterinarian: 'Find Veterinarian',
            nearbyVets: 'Nearby Vets',
            specialization: 'Specialization',
            experience: 'Experience',
            rating: 'Rating',
            bookAppointment: 'Book Appointment',
            verified: 'Verified',
            available: 'Available',
            networkStats: 'Network Stats',
            searchVets: 'Search veterinarians...',
            noVetsFound: 'No veterinarians found',
            aiScore: 'AI Score',
            consultationFee: 'Consultation Fee',
            loading: 'Loading veterinarians...',
        },
        pharmacy: {
            findPharmacy: 'Find Pharmacy',
            medicines: 'Medicines',
            availability: 'Availability',
            price: 'Price',
            prescription: 'Prescription',
            nearbyPharmacies: 'Nearby Pharmacies',
            searchMedicines: 'Search medicines...',
            loading: 'Loading medicines...',
            noMedicinesFound: 'No medicines found',
            categories: 'Categories',
            checkout: 'Checkout',
        },
        ai: {
            assistant: 'AI Assistant',
            askQuestion: 'Ask a Question',
            chatWithAI: 'Chat with AI',
            recommendations: 'Recommendations',
            diagnosis: 'Diagnosis',
            typeMessage: 'Type a message...',
            send: 'Send',
            thinking: 'Thinking...',
            powered: 'Powered by',
            smartAssistant: 'Smart Assistant',
            error: 'Sorry, I encountered an error. Please try again.',
            quickQuestions: 'Quick Questions',
            askAboutPoultry: 'Ask about poultry farming...',
            quickAction1: 'My chickens are coughing and sneezing',
            quickAction2: 'Birds have bloody diarrhea',
            quickAction3: 'Sudden death in my flock',
            quickAction4: 'Egg production has dropped',
            quickAction5: 'Best vaccination schedule?',
            quickAction6: 'How to prevent diseases?',
        },
        map: {
            pharmacies: 'Pharmacies',
            veterinarians: 'Veterinarians',
            farms: 'Farms',
            interactiveMap: 'Interactive Map',
            exploreServices: 'Explore veterinary services near you',
        },
        drawer: {
            adminPanel: 'Admin Panel',
            systemAdministration: 'System administration',
            dataManagement: 'Data Management',
            editContent: 'Edit content',
            veterinaryCare: 'Veterinary Care',
            findExpertHelp: 'Find expert help',
            medicine: 'Medicine',
            medicineDirectory: 'Medicine directory',
            pharmacies: 'Pharmacies',
            locatePharmacies: 'Locate nearby pharmacies',
            aiAssistant: 'AI Assistant',
            getAiAdvice: 'Get AI-powered advice',
            bluetoothDevices: 'Bluetooth Devices',
            connectDevices: 'Connect to devices',
            phAnalyzer: 'PH Analyzer',
            analyzeStoolSamples: 'Analyze stool samples',
            climateScanner: 'Climate Scanner',
            environmentalMonitoring: 'Environmental health monitoring',
            settings: 'Settings',
            appPreferences: 'App preferences',
        },
        activities: {
            recentActivities: 'Recent Activities',
            viewRecentActivities: 'View your recent activities',
            activityHistory: 'Activity History',
            noSchedulesYet: 'No Schedules Yet',
            scheduleVisitsText: 'Schedule veterinary visits for your farms to maintain poultry health and prevent diseases. Regular check-ups keep your flock healthy and productive.',
            requestFirstVisit: 'Request Your First Visit',
            visitStatus: 'Visit Status',
            priority: 'priority',
            urgentPriority: 'urgent priority',
            highPriority: 'high priority',
            mediumPriority: 'medium priority',
            lowPriority: 'low priority',
        },
        phReader: {
            // Header & Navigation
            smartAnalysisTool: 'Smart Analysis Tool',
            phAnalyzer: 'PH Analyzer',
            advancedPoultryMonitoring: 'Advanced poultry health monitoring',
            
            // Quick Stats
            totalScans: 'TOTAL SCANS',
            lastReading: 'LAST READING',
            
            // Action Buttons
            smartScan: 'Smart Scan',
            scanning: 'Scanning...',
            history: 'History',
            newReading: 'New Reading',
            viewHistory: 'View History',
            
            // Input Section
            manualPhEntry: 'Manual pH Entry',
            phReading: 'pH Reading',
            enterPhReading: 'Enter pH reading (0.0 - 14.0)',
            analyzePhReading: 'Analyze pH Reading',
            
            // History
            readingHistory: 'Reading History',
            noReadingsYet: 'No readings yet',
            
            // Health Status Messages
            severeAcidosis: 'Severe Acidosis',
            acidosisWarning: 'Acidosis Warning',
            healthyRange: 'Healthy Range',
            alkalosisWarning: 'Alkalosis Warning',
            severeAlkalosis: 'Severe Alkalosis',
            
            // Status Descriptions
            severeAcidosisDesc: 'pH is critically low. Immediate veterinary attention is needed.',
            acidosisWarningDesc: 'pH is below the normal range, indicating potential acidity issues.',
            healthyRangeDesc: 'pH is within the optimal range. Your poultry is in excellent condition.',
            alkalosisWarningDesc: 'pH is above the normal range, indicating alkalinity issues.',
            severeAlkalosisDesc: 'pH is critically high. This may indicate kidney issues or dietary imbalance.',
            
            // Recommendations - Severe Acidosis
            severeAcidosisRec1: 'Provide immediate access to clean, alkaline water.',
            severeAcidosisRec2: 'Consult a vet for electrolyte therapy.',
            severeAcidosisRec3: 'Avoid acidic feed.',
            severeAcidosisRec4: 'Monitor chicken closely for signs of distress.',
            
            // Recommendations - Acidosis Warning
            acidosisRec1: 'Adjust the diet with alkaline-rich feed.',
            acidosisRec2: 'Add calcium supplements to water.',
            acidosisRec3: 'Monitor for symptoms of diarrhea or stress.',
            acidosisRec4: 'Increase fresh vegetable intake.',
            
            // Recommendations - Healthy Range
            healthyRec1: 'Maintain current diet and hydration.',
            healthyRec2: 'Ensure a clean environment.',
            healthyRec3: 'Continue routine health checks.',
            healthyRec4: 'Keep up the excellent care!',
            
            // Recommendations - Alkalosis Warning
            alkalosisRec1: 'Avoid overuse of alkaline feed or medications.',
            alkalosisRec2: 'Ensure proper hydration with clean water.',
            alkalosisRec3: 'Consult a vet if symptoms persist.',
            alkalosisRec4: 'Review recent dietary changes.',
            
            // Recommendations - Severe Alkalosis
            severeAlkalosisRec1: 'Seek veterinary assistance immediately.',
            severeAlkalosisRec2: 'Provide balanced feed and avoid over-supplementing.',
            severeAlkalosisRec3: 'Check water quality for high pH levels.',
            severeAlkalosisRec4: 'Emergency vet consultation recommended.',
            
            // Section Titles
            healthAnalysis: 'Health Analysis',
            recommendations: 'Recommendations',
            phRelatedDiseaseRisks: 'PH-Related Disease Risks',
            quickEmergencyMeasures: 'Quick Emergency Measures',
            nextSteps: 'Next Steps',
            
            // Disease Info
            symptoms: 'Symptoms',
            mortalityRisk: 'Mortality Risk',
            
            // Next Steps Actions
            findVeterinarian: 'Find Veterinarian',
            locateVetServices: 'Locate nearby veterinary services',
            findPharmacy: 'Find Pharmacy',
            getMedications: 'Get medications and supplements',
            
            // Alerts & Errors
            scanComplete: 'Scan Complete!',
            phReadingDetected: 'pH reading detected',
            analyze: 'Analyze',
            invalidPhValue: 'Please enter a valid pH value between 0 and 14.',
            severity: 'Severity',
            
            // Severity Levels
            low: 'low',
            medium: 'medium',
            high: 'high',
            critical: 'critical',
        },
    },
    [Language.FR]: {
        common: {
            back: 'Retour',
            next: 'Suivant',
            save: 'Enregistrer',
            cancel: 'Annuler',
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès',
            search: 'Rechercher',
            settings: 'Paramètres',
            logout: 'Déconnexion',
            language: 'Langue',
            selectLanguage: 'Sélectionner la langue',
            done: 'Terminé',
            notifications: 'Notifications',
            offline: 'Hors ligne',
            farmer: 'Fermier',
            farms: 'fermes',
            accountVerificationPending: 'Vérification du compte en attente',
            verify: 'Vérifier',
            welcome: 'Bienvenue',
            overview: 'Aperçu',
            myFarms: 'Mes Fermes',
            schedules: 'Horaires',
            totalChickens: 'Total Poulets',
            upcomingVisits: 'Visites à Venir',
            healthy: 'sain',
            none: 'Aucun',
            addFarm: 'Ajouter Ferme',
            requestVisit: 'Demander Visite',
            hectares: 'hectares',
            total: 'total',
            needAttention: 'Nécessite Attention',
            sick: 'malade',
            atRisk: 'à risque',
            noFarmsYet: 'Aucune Ferme Encore',
            getStartedAddFarm: 'Commencez par ajouter votre première ferme pour suivre vos opérations avicoles',
            addYourFirstFarm: 'Ajoutez Votre Première Ferme',
        },
        auth: {
            login: 'Connexion',
            signup: 'S\'inscrire',
            email: 'Email',
            password: 'Mot de passe',
            forgotPassword: 'Mot de passe oublié?',
            createAccount: 'Créer un compte',
            welcomeBack: 'Bon retour',
            signUpTitle: 'Créez votre compte',
        },
        navigation: {
            findMedicines: 'Trouver des médicaments',
            findVets: 'Trouver des vétérinaires',
            vaccines: 'Vaccins',
            pharmacies: 'Pharmacies',
            emergency: 'Urgence',
            resources: 'Ressources',
            environmentMonitoring: 'Surveillance environnementale',
            aiAssistant: 'Assistant IA',
            dashboard: 'Tableau de bord',
            exploreApp: 'Explorez l\'app',
        },
        emergency: {
            firstAid: 'Premiers secours',
            emergencyContacts: 'Contacts d\'urgence',
            symptoms: 'Symptômes',
            treatment: 'Traitement',
            urgentCare: 'Soins urgents',
        },
        environment: {
            temperature: 'Température',
            humidity: 'Humidité',
            airQuality: 'Qualité de l\'air',
            monitoring: 'Surveillance',
            readings: 'Lectures',
            deviceConnected: 'Appareil connecté',
            deviceDisconnected: 'Appareil déconnecté',
        },
        veterinary: {
            findVeterinarian: 'Trouver un vétérinaire',
            nearbyVets: 'Vétérinaires à proximité',
            specialization: 'Spécialisation',
            experience: 'Expérience',
            rating: 'Évaluation',
            bookAppointment: 'Prendre rendez-vous',
        },
        pharmacy: {
            findPharmacy: 'Trouver une pharmacie',
            medicines: 'Médicaments',
            availability: 'Disponibilité',
            price: 'Prix',
            prescription: 'Ordonnance',
            nearbyPharmacies: 'Pharmacies à proximité',
            searchMedicines: 'Rechercher des médicaments...',
            loading: 'Chargement des médicaments...',
            noMedicinesFound: 'Aucun médicament trouvé',
            categories: 'Catégories',
            checkout: 'Commander',
        },
        ai: {
            assistant: 'Assistant IA',
            askQuestion: 'Poser une question',
            chatWithAI: 'Discuter avec l\'IA',
            recommendations: 'Recommandations',
            diagnosis: 'Diagnostic',
        },
    },
    [Language.KN]: {
        common: {
            back: 'Gusubira',
            next: 'Ibikurikira',
            save: 'Bika',
            cancel: 'Hagarika',
            loading: 'Biracyegurira...',
            error: 'Ikosa',
            success: 'Byakunze',
            search: 'Shakisha',
            settings: 'Amagenamiterere',
            logout: 'Gusohoka',
            language: 'Ururimi',
            selectLanguage: 'Hitamo ururimi',
            done: 'Byarangiye',
            notifications: 'Amakuru',
            offline: 'Ntari kumurongo',
            farmer: 'Umuhinzi',
            farms: 'inganda',
            accountVerificationPending: 'Kwemeza konti bitegereje',
            verify: 'Emeza',
            welcome: 'Murakaza neza',
            overview: 'Incamake',
            myFarms: 'Inganda zanjye',
            schedules: 'Amahoro',
            totalChickens: 'Inkoko zose',
            upcomingVisits: 'Ibishya bizaza',
            healthy: 'mubuzima',
            none: 'Nta kimwe',
            addFarm: 'Ongeramo ifamu',
            requestVisit: 'Saba isubiramo',
            hectares: 'hekitari',
            total: 'byose',
            needAttention: 'Bikeneye kwitabwaho',
            sick: 'wurwaye',
            atRisk: 'mububabare',
            noFarmsYet: 'Nta nkanda zigaragara',
            getStartedAddFarm: 'Tangira wongeramo ifamu yawe ya mbere kugirango ukurikirane inganda zawe z\'inyoni',
            addYourFirstFarm: 'Ongeramo Ifamu Yawe Ya Mbere',
        },
        auth: {
            login: 'Injira',
            signup: 'Iyandikishe',
            email: 'Imeyili',
            password: 'Ijambobanga',
            forgotPassword: 'Wibagiwe ijambobanga?',
            createAccount: 'Kora konti',
            welcomeBack: 'Murakaza neza',
            signUpTitle: 'Kora konti yawe',
        },
        navigation: {
            findMedicines: 'Shakisha imiti',
            findVets: 'Shakisha veterinaire',
            vaccines: 'Urukingo',
            pharmacies: 'Amafarimasi',
            emergency: 'Ubwiherero',
            resources: 'Ibikoresho',
            environmentMonitoring: 'Gukurikirana ibidukikije',
            aiAssistant: 'Umufasha wa AI',
            dashboard: 'Imbonerahamwe',
            exploreApp: 'Shakisha ubunyangamugayo',
        },
        emergency: {
            firstAid: 'Ubufasha bw\'ubwambere',
            emergencyContacts: 'Nimero z\'ubwiherero',
            symptoms: 'Ibimenyetso',
            treatment: 'Ubuvuzi',
            urgentCare: 'Ubuvuzi bw\'ubwiherero',
        },
        environment: {
            temperature: 'Ubushyuhe',
            humidity: 'Ubushuhe',
            airQuality: 'Ubwiza bw\'umwuka',
            monitoring: 'Gukurikirana',
            readings: 'Ibipimo',
            deviceConnected: 'Igikoresho cyemewe',
            deviceDisconnected: 'Igikoresho kidahuye',
        },
        veterinary: {
            findVeterinarian: 'Shakisha veterinaire',
            nearbyVets: 'Veterinaire b\'ahafi',
            specialization: 'Ubuhanga',
            experience: 'Uburambe',
            rating: 'Amanota',
            bookAppointment: 'Gena ubusabane',
        },
        pharmacy: {
            findPharmacy: 'Shakisha Ubuvuzi',
            medicines: 'Imiti',
            availability: 'Kuboneka',
            price: 'Igiciro',
            prescription: 'Icyitonderwa',
            nearbyPharmacies: 'Amaduka y\'imiti hafi',
            searchMedicines: 'Shakisha imiti...',
            loading: 'Bipakira imiti...',
            noMedicinesFound: 'Nta miti yabonetse',
            categories: 'Amatsinda',
            checkout: 'Gura',
        },
        ai: {
            assistant: 'Umufasha wa AI',
            askQuestion: 'Baza ikibazo',
            chatWithAI: 'Ganira na AI',
            recommendations: 'Ibyifuzo',
            diagnosis: 'Gusuzuma',
        },
    },
    [Language.SW]: {
        common: {
            back: 'Nyuma',
            next: 'Ijayo',
            save: 'Hifadhi',
            cancel: 'Ghairi',
            loading: 'Inapakia...',
            error: 'Hitilafu',
            success: 'Mafanikio',
            search: 'Tafuta',
            settings: 'Mipangilio',
            logout: 'Ondoka',
            language: 'Lugha',
            selectLanguage: 'Chagua lugha',
            done: 'Imemaliza',
            notifications: 'Arifa',
            offline: 'Nje ya mtandao',
            farmer: 'Mkulima',
            farms: 'mashamba',
            accountVerificationPending: 'Uthibitisho wa akaunti unasubiri',
            verify: 'Thibitisha',
            welcome: 'Karibu',
            overview: 'Muhtasari',
            myFarms: 'Mashamba Yangu',
            schedules: 'Ratiba',
            totalChickens: 'Kuku Jumla',
            upcomingVisits: 'Ziara Zinazokuja',
            healthy: 'wenye afya',
            none: 'Hakuna',
            addFarm: 'Ongeza Shamba',
            requestVisit: 'Omba Ziara',
            hectares: 'hektari',
            total: 'jumla',
            needAttention: 'Inahitaji Umakini',
            sick: 'mgonjwa',
            atRisk: 'hatarini',
            noFarmsYet: 'Hakuna Mashamba Bado',
            getStartedAddFarm: 'Anza kwa kuongeza shamba lako la kwanza ili kufuatilia shughuli zako za kuku',
            addYourFirstFarm: 'Ongeza Shamba Lako la Kwanza',
        },
        auth: {
            login: 'Ingia',
            signup: 'Jisajili',
            email: 'Barua pepe',
            password: 'Nenosiri',
            forgotPassword: 'Umesahau nenosiri?',
            createAccount: 'Unda akaunti',
            welcomeBack: 'Karibu tena',
            signUpTitle: 'Unda akaunti yako',
        },
        navigation: {
            findMedicines: 'Tafuta dawa',
            findVets: 'Tafuta daktari wa mifugo',
            vaccines: 'Chanjo',
            pharmacies: 'Maduka ya dawa',
            emergency: 'Dharura',
            resources: 'Rasilimali',
            environmentMonitoring: 'Ufuatiliaji wa mazingira',
            aiAssistant: 'Msaidizi wa AI',
            dashboard: 'Dashibodi',
            exploreApp: 'Chunguza programu',
        },
        emergency: {
            firstAid: 'Huduma ya kwanza',
            emergencyContacts: 'Mawasiliano ya dharura',
            symptoms: 'Dalili',
            treatment: 'Matibabu',
            urgentCare: 'Huduma ya haraka',
        },
        environment: {
            temperature: 'Joto',
            humidity: 'Unyevu',
            airQuality: 'Ubora wa hewa',
            monitoring: 'Ufuatiliaji',
            readings: 'Vipimo',
            deviceConnected: 'Kifaa kimeunganishwa',
            deviceDisconnected: 'Kifaa hakijaunganishwa',
        },
        veterinary: {
            findVeterinarian: 'Tafuta daktari wa mifugo',
            nearbyVets: 'Madaktari wa mifugo walioko karibu',
            specialization: 'Utaalamu',
            experience: 'Uzoefu',
            rating: 'Ukadiriaji',
            bookAppointment: 'Panga miadi',
        },
        pharmacy: {
            findPharmacy: 'Tafuta Duka la Dawa',
            medicines: 'Madawa',
            availability: 'Upatikanaji',
            price: 'Bei',
            prescription: 'Muhtasari',
            nearbyPharmacies: 'Maduka ya Dawa Karibu',
            searchMedicines: 'Tafuta madawa...',
            loading: 'Inapakia madawa...',
            noMedicinesFound: 'Hakuna madawa yaliyopatikana',
            categories: 'Makategoria',
            checkout: 'Maliza ununuzi',
        },
        ai: {
            assistant: 'Msaidizi wa AI',
            askQuestion: 'Uliza swali',
            chatWithAI: 'Ongea na AI',
            recommendations: 'Mapendekezo',
            diagnosis: 'Uchunguzi',
        },
    },
    [Language.KR]: {
        common: {
            back: '뒤로',
            next: '다음',
            save: '저장',
            cancel: '취소',
            loading: '로딩 중...',
            error: '오류',
            success: '성공',
            search: '검색',
            settings: '설정',
            logout: '로그아웃',
            language: '언어',
            selectLanguage: '언어 선택',
            done: '완료',
            notifications: '알림',
            offline: '오프라인',
            farmer: '농부',
            farms: '농장',
            accountVerificationPending: '계정 인증 대기 중',
            verify: '확인',
            welcome: '환영합니다',
            overview: '개요',
            myFarms: '내 농장',
            schedules: '일정',
            totalChickens: '총 닭',
            upcomingVisits: '예정된 방문',
            healthy: '건강한',
            none: '없음',
            addFarm: '농장 추가',
            requestVisit: '방문 요청',
            hectares: '헥타르',
            total: '총',
            needAttention: '주의 필요',
            sick: '아픈',
            atRisk: '위험한',
            noFarmsYet: '아직 농장이 없습니다',
            getStartedAddFarm: '첫 번째 농장을 추가하여 가금류 운영을 추적하세요',
            addYourFirstFarm: '첫 번째 농장 추가',
        },
        auth: {
            login: '로그인',
            signup: '회원가입',
            email: '이메일',
            password: '비밀번호',
            forgotPassword: '비밀번호를 잊으셨나요?',
            createAccount: '계정 만들기',
            welcomeBack: '다시 오신 것을 환영합니다',
            signUpTitle: '계정을 만드세요',
        },
        navigation: {
            findMedicines: '의약품 찾기',
            findVets: '수의사 찾기',
            vaccines: '백신',
            pharmacies: '약국',
            emergency: '응급상황',
            resources: '자료',
            environmentMonitoring: '환경 모니터링',
            aiAssistant: 'AI 어시스턴트',
            dashboard: '대시보드',
            exploreApp: '앱 탐색',
        },
        emergency: {
            firstAid: '응급처치',
            emergencyContacts: '응급 연락처',
            symptoms: '증상',
            treatment: '치료',
            urgentCare: '응급 치료',
        },
        environment: {
            temperature: '온도',
            humidity: '습도',
            airQuality: '공기질',
            monitoring: '모니터링',
            readings: '측정값',
            deviceConnected: '기기 연결됨',
            deviceDisconnected: '기기 연결 해제됨',
        },
        veterinary: {
            findVeterinarian: '수의사 찾기',
            nearbyVets: '근처 수의사',
            specialization: '전문 분야',
            experience: '경험',
            rating: '평점',
            bookAppointment: '예약하기',
        },
        pharmacy: {
            findPharmacy: '약국 찾기',
            medicines: '의약품',
            availability: '재고',
            price: '가격',
            prescription: '처방전',
            nearbyPharmacies: '근처 약국',
            searchMedicines: '의약품 검색...',
            loading: '의약품 로딩 중...',
            noMedicinesFound: '의약품을 찾을 수 없습니다',
            categories: '카테고리',
            checkout: '결제',
        },
        ai: {
            assistant: 'AI 어시스턴트',
            askQuestion: '질문하기',
            chatWithAI: 'AI와 채팅',
            recommendations: '추천',
            diagnosis: '진단',
        },
    },
};
