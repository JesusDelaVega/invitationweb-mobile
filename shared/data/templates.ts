// Template System - Unified structure
import { PlanId } from '../types/plan';

export type TemplateCategory =
  | 'boda'
  | 'quinceañera'
  | 'cumpleaños'
  | 'graduacion'
  | 'corporativo'
  | 'bautizo'
  | 'babyshower';

export type TemplateStyle =
  | 'romantico'
  | 'elegante'
  | 'moderno'
  | 'clasico'
  | 'vintage'
  | 'minimalista'
  | 'colorido'
  | 'profesional';

export type SectionId =
  | 'hero'
  | 'story'
  | 'gallery'
  | 'details'
  | 'rsvp'
  | 'location'
  | 'music'
  | 'animations'
  | 'effects'
  | 'custom';

export interface Section {
  id: SectionId;
  name: string;
  description: string;
  icon: string;
  required: boolean;
  planRequired: string;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  style: TemplateStyle;
  color: string;
  gradient: string;
  planRequired: PlanId;
  price: number;
  description: string;
  features: string[];
  sections: SectionId[];
  premiumSections: SectionId[];
  cardSupported: boolean;
  websiteSupported: boolean;
  preview: string;
}

// Template Categories
export const TEMPLATE_CATEGORIES: Record<TemplateCategory, TemplateCategory> = {
  boda: 'boda',
  quinceañera: 'quinceañera',
  cumpleaños: 'cumpleaños',
  graduacion: 'graduacion',
  corporativo: 'corporativo',
  bautizo: 'bautizo',
  babyshower: 'babyshower'
};

// Template Styles
export const TEMPLATE_STYLES: Record<TemplateStyle, TemplateStyle> = {
  romantico: 'romantico',
  elegante: 'elegante',
  moderno: 'moderno',
  clasico: 'clasico',
  vintage: 'vintage',
  minimalista: 'minimalista',
  colorido: 'colorido',
  profesional: 'profesional'
};

// Base sections (available to all)
export const BASE_SECTIONS: Section[] = [
  {
    id: 'hero',
    name: 'Portada',
    description: 'Información principal del evento',
    icon: 'Heart',
    required: true,
    planRequired: 'free'
  },
  {
    id: 'story',
    name: 'Historia',
    description: 'Timeline y momentos especiales',
    icon: 'Clock',
    required: false,
    planRequired: 'free' // Changed from premium to free for mobile
  },
  {
    id: 'gallery',
    name: 'Galería',
    description: 'Fotos y recuerdos',
    icon: 'Camera',
    required: false,
    planRequired: 'free' // Changed from premium to free for mobile
  },
  {
    id: 'details',
    name: 'Detalles',
    description: 'Información del evento',
    icon: 'Calendar',
    required: true,
    planRequired: 'free'
  },
  {
    id: 'rsvp',
    name: 'Confirmación',
    description: 'Sistema de RSVP',
    icon: 'Users',
    required: true,
    planRequired: 'free'
  },
  {
    id: 'location',
    name: 'Ubicación',
    description: 'Lugar y dirección',
    icon: 'MapPin',
    required: true,
    planRequired: 'free'
  }
];

// Premium sections
export const PREMIUM_SECTIONS: Section[] = [
  {
    id: 'music',
    name: 'Música',
    description: 'Reproductor de música',
    icon: 'Music',
    required: false,
    planRequired: 'paid_single'
  },
  {
    id: 'animations',
    name: 'Animaciones',
    description: 'Efectos y transiciones',
    icon: 'Sparkles',
    required: false,
    planRequired: 'paid_double'
  },
  {
    id: 'effects',
    name: 'Efectos',
    description: 'Filtros visuales',
    icon: 'Palette',
    required: false,
    planRequired: 'creative_design'
  },
  {
    id: 'custom',
    name: 'Personalización',
    description: 'Branding personalizado',
    icon: 'Settings',
    required: false,
    planRequired: 'creative_design'
  }
];

// Template Database (simplified for initial MVP)
export const TEMPLATE_DATABASE: Template[] = [
  // BODAS
  {
    id: 'romantic_rose',
    name: 'Rosa Romántica',
    category: 'boda',
    style: 'romantico',
    color: '#e11d48',
    gradient: 'from-rose-900 via-pink-800 to-rose-900',
    planRequired: 'free',
    price: 0,
    description: 'Diseño romántico con tonos rosados suaves',
    features: ['Diseño clásico', 'Colores cálidos', 'Tipografía elegante'],
    sections: ['hero', 'details', 'rsvp', 'location'],
    premiumSections: [],
    cardSupported: true,
    websiteSupported: true,
    preview: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop&auto=format'
  },
  {
    id: 'elegant_gold',
    name: 'Oro Elegante',
    category: 'boda',
    style: 'elegante',
    color: '#d97706',
    gradient: 'from-amber-900 via-yellow-800 to-amber-900',
    planRequired: 'free',
    price: 0,
    description: 'Sofisticación con detalles dorados',
    features: ['Detalles premium', 'Animaciones suaves', 'Galería expandida'],
    sections: ['hero', 'story', 'gallery', 'details', 'rsvp', 'location'],
    premiumSections: [],
    cardSupported: true,
    websiteSupported: true,
    preview: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=1200&fit=crop&auto=format'
  },
  // QUINCEAÑERAS
  {
    id: 'princess_pink',
    name: 'Princesa Rosa',
    category: 'quinceañera',
    style: 'romantico',
    color: '#a855f7',
    gradient: 'from-purple-900 via-pink-800 to-purple-900',
    planRequired: 'free',
    price: 0,
    description: 'Sueños de princesa en rosa y morado',
    features: ['Colores vibrantes', 'Elementos decorativos', 'Estilo juvenil'],
    sections: ['hero', 'details', 'rsvp', 'location'],
    premiumSections: [],
    cardSupported: true,
    websiteSupported: true,
    preview: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop&auto=format'
  },
  // CUMPLEAÑOS
  {
    id: 'festive_colorful',
    name: 'Fiesta Colorida',
    category: 'cumpleaños',
    style: 'colorido',
    color: '#dc2626',
    gradient: 'from-red-900 via-pink-800 to-orange-900',
    planRequired: 'free',
    price: 0,
    description: 'Celebración llena de color y alegría',
    features: ['Colores vibrantes', 'Estilo festivo', 'Diseño alegre'],
    sections: ['hero', 'details', 'rsvp', 'location'],
    premiumSections: [],
    cardSupported: true,
    websiteSupported: true,
    preview: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=1200&fit=crop&auto=format'
  }
];

// Helper functions
export function getTemplateById(id: string): Template | undefined {
  return TEMPLATE_DATABASE.find(t => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return TEMPLATE_DATABASE.filter(t => t.category === category);
}

export function getTemplatesByPlan(planId: PlanId): Template[] {
  const planLevels: Record<PlanId, number> = {
    free: 0,
    paid_single: 1,
    paid_double: 2,
    creative_design: 3,
    basic: 2
  };

  const userLevel = planLevels[planId] || 0;

  return TEMPLATE_DATABASE.filter(t => {
    const templateLevel = planLevels[t.planRequired] || 0;
    return templateLevel <= userLevel;
  });
}

export function isTemplateAccessible(templateId: string, planId: PlanId): boolean {
  const template = getTemplateById(templateId);
  if (!template) return false;

  const planLevels: Record<PlanId, number> = {
    free: 0,
    paid_single: 1,
    paid_double: 2,
    creative_design: 3,
    basic: 2
  };

  const userLevel = planLevels[planId] || 0;
  const templateLevel = planLevels[template.planRequired] || 0;

  return templateLevel <= userLevel;
}

export function isSectionAccessible(sectionId: SectionId, planId: PlanId): boolean {
  const section = [...BASE_SECTIONS, ...PREMIUM_SECTIONS].find(s => s.id === sectionId);
  if (!section) return false;

  const planLevels: Record<string, number> = {
    free: 0,
    paid_single: 1,
    paid_double: 2,
    creative_design: 3
  };

  const userLevel = planLevels[planId] || 0;
  const sectionLevel = planLevels[section.planRequired] || 0;

  return sectionLevel <= userLevel;
}

export function getAvailableSections(templateId: string, planId: PlanId): SectionId[] {
  const template = getTemplateById(templateId);
  if (!template) return [];

  const allSections = [...template.sections, ...template.premiumSections];
  return allSections.filter(sectionId => isSectionAccessible(sectionId, planId));
}
