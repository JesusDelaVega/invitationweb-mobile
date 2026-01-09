// Utilidades para contenido multilenguaje en proyectos de usuario
import { MultiLanguageString } from '../types/project';

export type LanguageCode = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';

/**
 * Idiomas soportados en la aplicación
 */
export const SUPPORTED_LANGUAGES: LanguageCode[] = ['es', 'en', 'pt', 'fr', 'de', 'it'];

/**
 * Verifica si un valor es un objeto multilenguaje válido
 */
export const isMultiLanguageValue = (value: any): value is MultiLanguageString => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  // Debe tener al menos una clave y todas deben ser idiomas soportados
  return keys.length > 0 && keys.every(key => SUPPORTED_LANGUAGES.includes(key as LanguageCode));
};

/**
 * Convierte un valor simple a formato multilenguaje
 */
export const toMultiLanguageValue = (
  value: string | MultiLanguageString | any,
  defaultLanguage: LanguageCode = 'es'
): MultiLanguageString => {
  // Si ya es multilenguaje, devolverlo tal cual
  if (isMultiLanguageValue(value)) {
    return value;
  }

  // Si es string, crear objeto con idioma por defecto
  if (typeof value === 'string') {
    return { [defaultLanguage]: value };
  }

  // Si es otro tipo, convertir a string vacío en idioma por defecto
  return { [defaultLanguage]: '' };
};

/**
 * Obtiene el valor traducido de un campo multilenguaje
 */
export const getTranslatedValue = (
  value: string | MultiLanguageString | any,
  language: LanguageCode = 'es',
  fallbackLanguage: LanguageCode = 'es'
): string => {
  // Si es string (formato legacy), devolverlo directamente
  if (typeof value === 'string') {
    return value;
  }

  // Si es objeto multilenguaje, buscar en orden de prioridad
  if (isMultiLanguageValue(value)) {
    // 1. Idioma solicitado
    if (value[language]) return value[language];

    // 2. Idioma de respaldo
    if (value[fallbackLanguage]) return value[fallbackLanguage];

    // 3. Primer idioma disponible
    const firstAvailableKey = Object.keys(value).find(key => value[key as LanguageCode]);
    if (firstAvailableKey) return value[firstAvailableKey as LanguageCode] || '';
  }

  // Devolver string vacío si no hay valor
  return '';
};

/**
 * Migra los datos de un sitio web de formato legacy a multilenguaje
 */
export const migrateWebsiteDataToMultiLanguage = (
  websiteData: any,
  sourceLanguage: LanguageCode = 'es'
): any => {
  if (!websiteData) return websiteData;

  const migrated = { ...websiteData };

  // Migrar sección hero
  if (migrated.hero) {
    migrated.hero = {
      ...migrated.hero,
      title: toMultiLanguageValue(migrated.hero.title, sourceLanguage),
      subtitle: toMultiLanguageValue(migrated.hero.subtitle, sourceLanguage),
      description: toMultiLanguageValue(migrated.hero.description, sourceLanguage)
    };
  }

  // Migrar sección story
  if (migrated.story) {
    migrated.story = {
      ...migrated.story,
      title: toMultiLanguageValue(migrated.story.title, sourceLanguage),
      timeline: migrated.story.timeline?.map((item: any) => ({
        ...item,
        title: toMultiLanguageValue(item.title, sourceLanguage),
        description: toMultiLanguageValue(item.description, sourceLanguage)
      }))
    };
  }

  // Migrar sección gallery
  if (migrated.gallery) {
    migrated.gallery = {
      ...migrated.gallery,
      title: toMultiLanguageValue(migrated.gallery.title, sourceLanguage),
      images: migrated.gallery.images?.map((img: any) => ({
        ...img,
        alt: img.alt ? toMultiLanguageValue(img.alt, sourceLanguage) : { [sourceLanguage]: '' },
        caption: img.caption ? toMultiLanguageValue(img.caption, sourceLanguage) : undefined
      }))
    };
  }

  // Migrar sección details
  if (migrated.details) {
    migrated.details = {
      ...migrated.details,
      title: toMultiLanguageValue(migrated.details.title, sourceLanguage),
      ceremony: migrated.details.ceremony ? {
        ...migrated.details.ceremony,
        title: toMultiLanguageValue(migrated.details.ceremony.title, sourceLanguage),
        location: toMultiLanguageValue(migrated.details.ceremony.location, sourceLanguage),
        description: toMultiLanguageValue(migrated.details.ceremony.description, sourceLanguage)
      } : undefined,
      reception: migrated.details.reception ? {
        ...migrated.details.reception,
        title: toMultiLanguageValue(migrated.details.reception.title, sourceLanguage),
        location: toMultiLanguageValue(migrated.details.reception.location, sourceLanguage),
        description: toMultiLanguageValue(migrated.details.reception.description, sourceLanguage)
      } : undefined,
      dressCode: migrated.details.dressCode ? {
        ...migrated.details.dressCode,
        title: toMultiLanguageValue(migrated.details.dressCode.title, sourceLanguage),
        description: toMultiLanguageValue(migrated.details.dressCode.description, sourceLanguage),
        suggestions: toMultiLanguageValue(migrated.details.dressCode.suggestions, sourceLanguage)
      } : undefined,
      gifts: migrated.details.gifts ? {
        ...migrated.details.gifts,
        title: toMultiLanguageValue(migrated.details.gifts.title, sourceLanguage),
        details: toMultiLanguageValue(migrated.details.gifts.details, sourceLanguage)
      } : undefined
    };
  }

  // Migrar sección RSVP
  if (migrated.rsvp) {
    migrated.rsvp = {
      ...migrated.rsvp,
      title: toMultiLanguageValue(migrated.rsvp.title, sourceLanguage),
      message: toMultiLanguageValue(migrated.rsvp.message, sourceLanguage)
    };
  }

  // Migrar sección location
  if (migrated.location) {
    migrated.location = {
      ...migrated.location,
      title: toMultiLanguageValue(migrated.location.title, sourceLanguage),
      venue: toMultiLanguageValue(migrated.location.venue, sourceLanguage),
      parking: migrated.location.parking ? toMultiLanguageValue(migrated.location.parking, sourceLanguage) : undefined,
      transport: migrated.location.transport ? toMultiLanguageValue(migrated.location.transport, sourceLanguage) : undefined,
      directions: migrated.location.directions ? toMultiLanguageValue(migrated.location.directions, sourceLanguage) : undefined
    };
  }

  return migrated;
};

/**
 * Renderiza los datos de un sitio web en un idioma específico
 * NUEVA IMPLEMENTACIÓN: Conversión recursiva automática que maneja TODOS los campos
 */
export const renderWebsiteDataInLanguage = (
  data: any,
  language: LanguageCode = 'es',
  fallbackLanguage: LanguageCode = 'es'
): any => {
  // Caso 1: null o undefined - devolver tal cual
  if (data == null) {
    return data;
  }

  // Caso 2: Es un objeto multilanguage - convertir a string
  if (isMultiLanguageValue(data)) {
    return getTranslatedValue(data, language, fallbackLanguage);
  }

  // Caso 3: Es un array - convertir cada elemento recursivamente
  if (Array.isArray(data)) {
    return data.map(item => renderWebsiteDataInLanguage(item, language, fallbackLanguage));
  }

  // Caso 4: Es un objeto (pero no multilanguage) - convertir todas las propiedades recursivamente
  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        result[key] = renderWebsiteDataInLanguage(data[key], language, fallbackLanguage);
      }
    }
    return result;
  }

  // Caso 5: Es un primitivo (string, number, boolean) - devolver tal cual
  return data;
};

/**
 * Actualiza un campo específico en un idioma específico
 */
export const updateTranslation = (
  multiLanguageValue: MultiLanguageString | string | any,
  language: LanguageCode,
  newValue: string
): MultiLanguageString => {
  const current = isMultiLanguageValue(multiLanguageValue)
    ? multiLanguageValue
    : toMultiLanguageValue(multiLanguageValue);

  return {
    ...current,
    [language]: newValue
  };
};

/**
 * Obtiene todos los idiomas con contenido en un valor multilenguaje
 */
export const getAvailableLanguages = (multiLanguageValue: MultiLanguageString | any): LanguageCode[] => {
  if (!isMultiLanguageValue(multiLanguageValue)) {
    return [];
  }

  return Object.keys(multiLanguageValue).filter(lang => multiLanguageValue[lang as LanguageCode]) as LanguageCode[];
};

/**
 * Verifica si un objeto tiene contenido en un idioma específico
 */
export const hasContentInLanguage = (multiLanguageValue: MultiLanguageString | any, language: LanguageCode): boolean => {
  if (!isMultiLanguageValue(multiLanguageValue)) {
    return false;
  }

  return Boolean(multiLanguageValue[language]);
};
