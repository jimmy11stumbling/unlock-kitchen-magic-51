
interface Translation {
  [key: string]: string | Translation;
}

type LanguageCode = 'en' | 'es' | 'fr' | 'de';

class I18nService {
  private static instance: I18nService;
  private translations: Map<LanguageCode, Translation> = new Map();
  private currentLanguage: LanguageCode = 'en';

  private constructor() {
    this.loadTranslations();
  }

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  private loadTranslations() {
    // Example translations
    this.translations.set('en', {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        loading: 'Loading...',
        error: 'An error occurred'
      }
    });

    this.translations.set('es', {
      common: {
        save: 'Guardar',
        cancel: 'Cancelar',
        loading: 'Cargando...',
        error: 'Se produjo un error'
      }
    });
  }

  setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
    document.documentElement.lang = lang;
    // Store language preference
    localStorage.setItem('preferred-language', lang);
  }

  translate(key: string, params: Record<string, string> = {}): string {
    const keys = key.split('.');
    let value = this.translations.get(this.currentLanguage);

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k] as Translation;
      } else {
        return key; // Key not found
      }
    }

    if (typeof value === 'string') {
      return this.interpolateParams(value, params);
    }

    return key;
  }

  private interpolateParams(text: string, params: Record<string, string>): string {
    return text.replace(/{(\w+)}/g, (_, key) => params[key] || `{${key}}`);
  }

  getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  getSupportedLanguages(): LanguageCode[] {
    return Array.from(this.translations.keys());
  }
}

export const i18n = I18nService.getInstance();
