// Editor Store - Manage invitation editing state
import { create } from 'zustand';
import { WebsiteData } from '@/shared';

type EditorSection = 'hero' | 'story' | 'gallery' | 'details' | 'rsvp' | 'location';

interface EditorState {
  // State
  websiteData: WebsiteData;
  currentSection: EditorSection;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: number | null;
  projectId: string | null;

  // Actions
  setWebsiteData: (data: WebsiteData) => void;
  updateSection: <K extends keyof WebsiteData>(
    section: K,
    data: Partial<WebsiteData[K]>
  ) => void;
  setCurrentSection: (section: EditorSection) => void;
  markDirty: () => void;
  markClean: () => void;
  setSaving: (isSaving: boolean) => void;
  setLastSaved: (timestamp: number) => void;
  setProjectId: (id: string) => void;
  resetEditor: () => void;
}

// Default website data structure
const getDefaultWebsiteData = (): WebsiteData => ({
  hero: {
    title: { es: '' },
    subtitle: { es: '' },
    description: { es: '' },
    date: new Date().toISOString(),
    time: '18:00',
    backgroundImage: '',
  },
  story: {
    title: { es: 'Nuestra Historia' },
    timeline: [],
  },
  gallery: {
    title: { es: 'Galería' },
    images: [],
    maxImages: 30,
  },
  details: {
    title: { es: 'Detalles del Evento' },
  },
  rsvp: {
    title: { es: 'Confirma tu Asistencia' },
    message: { es: 'Esperamos contar con tu presencia' },
    enabled: true,
    whatsappEnabled: true,
    formEnabled: true,
  },
  location: {
    title: { es: 'Ubicación' },
    venue: { es: '' },
    address: '',
    lat: 0,
    lng: 0,
  },
  sections: {
    hero: { order: 0, enabled: true, name: 'Hero' },
    story: { order: 1, enabled: false, name: 'Historia' },
    gallery: { order: 2, enabled: true, name: 'Galería' },
    details: { order: 3, enabled: true, name: 'Detalles' },
    rsvp: { order: 4, enabled: true, name: 'RSVP' },
    location: { order: 5, enabled: true, name: 'Ubicación' },
  },
  settings: {
    theme: 'romantic_rose',
    language: 'es',
    published: false,
  },
});

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  websiteData: getDefaultWebsiteData(),
  currentSection: 'hero',
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  projectId: null,

  // Set entire website data (when loading project)
  setWebsiteData: (data: WebsiteData) => {
    set({
      websiteData: data,
      isDirty: false,
    });
  },

  // Update a specific section
  updateSection: (section, data) => {
    set((state) => ({
      websiteData: {
        ...state.websiteData,
        [section]: {
          ...state.websiteData[section],
          ...data,
        },
      },
      isDirty: true,
    }));
  },

  // Set current editing section
  setCurrentSection: (section: EditorSection) => {
    set({ currentSection: section });
  },

  // Mark as dirty (has unsaved changes)
  markDirty: () => {
    set({ isDirty: true });
  },

  // Mark as clean (saved)
  markClean: () => {
    set({ isDirty: false });
  },

  // Set saving state
  setSaving: (isSaving: boolean) => {
    set({ isSaving });
  },

  // Set last saved timestamp
  setLastSaved: (timestamp: number) => {
    set({ lastSaved: timestamp });
  },

  // Set project ID
  setProjectId: (id: string) => {
    set({ projectId: id });
  },

  // Reset editor to default state
  resetEditor: () => {
    set({
      websiteData: getDefaultWebsiteData(),
      currentSection: 'hero',
      isDirty: false,
      isSaving: false,
      lastSaved: null,
      projectId: null,
    });
  },
}));

// Helper hooks
export const useEditor = () => {
  const store = useEditorStore();
  return {
    websiteData: store.websiteData,
    currentSection: store.currentSection,
    isDirty: store.isDirty,
    isSaving: store.isSaving,
    lastSaved: store.lastSaved,
    projectId: store.projectId,
    setWebsiteData: store.setWebsiteData,
    updateSection: store.updateSection,
    setCurrentSection: store.setCurrentSection,
    markDirty: store.markDirty,
    markClean: store.markClean,
    setSaving: store.setSaving,
    setLastSaved: store.setLastSaved,
    setProjectId: store.setProjectId,
    resetEditor: store.resetEditor,
  };
};

// Selectors
export const useWebsiteData = () => useEditorStore((state) => state.websiteData);
export const useCurrentSection = () => useEditorStore((state) => state.currentSection);
export const useIsDirty = () => useEditorStore((state) => state.isDirty);
export const useIsSaving = () => useEditorStore((state) => state.isSaving);
