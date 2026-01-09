// Project Types
export interface MultiLanguageString {
  es?: string;
  en?: string;
  pt?: string;
  fr?: string;
  de?: string;
  it?: string;
}

export interface Location {
  formatted?: string;
  lat?: number;
  lng?: number;
  address?: string;
  googleMapsUrl?: string;
  venue?: string | MultiLanguageString;
  parking?: string | MultiLanguageString;
  transport?: string | MultiLanguageString;
  directions?: string | MultiLanguageString;
}

export interface GalleryImage {
  id?: number;
  url: string;
  alt?: string | MultiLanguageString;
  caption?: string | MultiLanguageString;
}

export interface TimelineItem {
  year: string;
  title: string | MultiLanguageString;
  description: string | MultiLanguageString;
  image?: string;
}

export interface HeroSection {
  title: string | MultiLanguageString;
  subtitle?: string | MultiLanguageString;
  description?: string | MultiLanguageString;
  date: string;
  time?: string;
  location?: Location;
  backgroundImage?: string;
}

export interface StorySection {
  title: string | MultiLanguageString;
  timeline: TimelineItem[];
}

export interface GallerySection {
  title: string | MultiLanguageString;
  images: GalleryImage[];
  maxImages: number;
}

export interface EventDetail {
  title: string | MultiLanguageString;
  time?: string;
  location?: string | MultiLanguageString;
  description?: string | MultiLanguageString;
}

export interface DetailsSection {
  title: string | MultiLanguageString;
  ceremony?: EventDetail;
  reception?: EventDetail;
  dressCode?: {
    title: string | MultiLanguageString;
    description: string | MultiLanguageString;
    suggestions?: string | MultiLanguageString;
  };
  gifts?: {
    title: string | MultiLanguageString;
    details: string | MultiLanguageString;
  };
}

export interface RSVPSection {
  title: string | MultiLanguageString;
  message: string | MultiLanguageString;
  enabled: boolean;
  deadline?: string;
  phone?: string;
  whatsappPhone?: string;
  whatsappEnabled?: boolean;
  formEnabled?: boolean;
}

export interface LocationSection {
  title: string | MultiLanguageString;
  venue: string | MultiLanguageString;
  address: string;
  lat: number;
  lng: number;
  mapUrl?: string;
  googleMapsUrl?: string;
  parking?: string | MultiLanguageString;
  transport?: string | MultiLanguageString;
  directions?: string | MultiLanguageString;
}

export interface SectionConfig {
  order: number;
  enabled: boolean;
  name: string;
}

export interface WebsiteData {
  hero?: HeroSection;
  story?: StorySection;
  gallery?: GallerySection;
  details?: DetailsSection;
  rsvp?: RSVPSection;
  location?: LocationSection;
  sections?: Record<string, SectionConfig>;
  settings?: {
    theme: string;
    language: string;
    published: boolean;
    category?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  website_data: string | WebsiteData; // JSON string in DB, object in client
  published_url?: string;
  is_published: boolean;
  is_demo?: boolean;
  demo_category?: string | null;
  publish_config?: {
    slug: string;
    customDomain?: string | null;
  };
  expires_at?: string | null;
  language?: string;
  trashed_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
}
