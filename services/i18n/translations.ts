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
    };

    // Veterinary
    veterinary: {
        findVeterinarian: string;
        nearbyVets: string;
        specialization: string;
        experience: string;
        rating: string;
        bookAppointment: string;
    };

    // Pharmacy
    pharmacy: {
        findPharmacy: string;
        medicines: string;
        availability: string;
        price: string;
        prescription: string;
        nearbyPharmacies: string;
    };

    // AI
    ai: {
        assistant: string;
        askQuestion: string;
        chatWithAI: string;
        recommendations: string;
        diagnosis: string;
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
            search: 'Search',
            settings: 'Settings',
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
        },
        environment: {
            temperature: 'Temperature',
            humidity: 'Humidity',
            airQuality: 'Air Quality',
            monitoring: 'Monitoring',
            readings: 'Readings',
            deviceConnected: 'Device Connected',
            deviceDisconnected: 'Device Disconnected',
        },
        veterinary: {
            findVeterinarian: 'Find Veterinarian',
            nearbyVets: 'Nearby Vets',
            specialization: 'Specialization',
            experience: 'Experience',
            rating: 'Rating',
            bookAppointment: 'Book Appointment',
        },
        pharmacy: {
            findPharmacy: 'Find Pharmacy',
            medicines: 'Medicines',
            availability: 'Availability',
            price: 'Price',
            prescription: 'Prescription',
            nearbyPharmacies: 'Nearby Pharmacies',
        },
        ai: {
            assistant: 'AI Assistant',
            askQuestion: 'Ask a Question',
            chatWithAI: 'Chat with AI',
            recommendations: 'Recommendations',
            diagnosis: 'Diagnosis',
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
            findPharmacy: 'Shakisha farmasi',
            medicines: 'Imiti',
            availability: 'Kuboneka',
            price: 'Igiciro',
            prescription: 'Icyifuzo cy\'umuganga',
            nearbyPharmacies: 'Amafarimasi y\'ahafi',
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
            findPharmacy: 'Tafuta duka la dawa',
            medicines: 'Dawa',
            availability: 'Upatikanaji',
            price: 'Bei',
            prescription: 'Maagizo ya daktari',
            nearbyPharmacies: 'Maduka ya dawa yaliyo karibu',
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
