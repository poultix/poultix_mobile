import { Language } from '../../types/user';
import { translations, Translations } from './translations';
import { cacheService } from '../storage/cacheService';

export class I18nService {
    private static instance: I18nService;
    private currentLanguage: Language = Language.EN;
    private translations: Translations;

    private constructor() {
        this.translations = translations[this.currentLanguage];
        this.loadLanguageFromStorage();
    }

    static getInstance(): I18nService {
        if (!I18nService.instance) {
            I18nService.instance = new I18nService();
        }
        return I18nService.instance;
    }

    private async loadLanguageFromStorage(): Promise<void> {
        try {
            const storedLanguage = await cacheService.get<Language>('user_language');
            if (storedLanguage) {
                this.setLanguage(storedLanguage);
            }
        } catch (error) {
            console.error('Error loading language from storage:', error);
        }
    }

    async setLanguage(language: Language): Promise<void> {
        this.currentLanguage = language;
        this.translations = translations[language];
        
        // Save to storage
        try {
            await cacheService.set('user_language', language, 365 * 24 * 60 * 60 * 1000); // 1 year
        } catch (error) {
            console.error('Error saving language to storage:', error);
        }
    }

    getCurrentLanguage(): Language {
        return this.currentLanguage;
    }

    getTranslations(): Translations {
        return this.translations;
    }

    t(section: keyof Translations, key: string): string {
        try {
            const sectionTranslations = this.translations[section];
            if (typeof sectionTranslations === 'object' && sectionTranslations !== null) {
                const translation = (sectionTranslations as any)[key];
                return translation || key;
            }
            return key;
        } catch (error) {
            console.error('Translation error:', error);
            return key;
        }
    }

    // Helper methods for common sections
    common(key: string): string {
        return this.t('common', key);
    }

    auth(key: string): string {
        return this.t('auth', key);
    }

    navigation(key: string): string {
        return this.t('navigation', key);
    }

    emergency(key: string): string {
        return this.t('emergency', key);
    }

    environment(key: string): string {
        return this.t('environment', key);
    }

    veterinary(key: string): string {
        return this.t('veterinary', key);
    }

    pharmacy(key: string): string {
        return this.t('pharmacy', key);
    }

    ai(key: string): string {
        return this.t('ai', key);
    }
}

export const i18n = I18nService.getInstance();
