// Project Store - Manage user projects with offline support
import { create } from 'zustand';
import { Project } from '@logowebmx/shared';
import { ApiService } from '../services/api';

interface ProjectState {
  // State
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Actions
  loadProjects: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  getProject: (id: string) => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  currentProject: null,
  isLoading: false,
  isRefreshing: false,
  error: null,

  // Load all user projects
  loadProjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await ApiService.projects.list();
      const projects = response.data.projects || [];

      set({
        projects,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al cargar proyectos';
      set({
        projects: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  // Refresh projects (for pull-to-refresh)
  refreshProjects: async () => {
    set({ isRefreshing: true, error: null });

    try {
      const response = await ApiService.projects.list();
      const projects = response.data.projects || [];

      set({
        projects,
        isRefreshing: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al refrescar proyectos';
      set({
        isRefreshing: false,
        error: errorMessage,
      });
    }
  },

  // Get single project
  getProject: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ApiService.projects.getById(id);
      const project = response.data;

      // Parse website_data if it's a string
      if (typeof project.website_data === 'string') {
        project.website_data = JSON.parse(project.website_data);
      }

      set({
        currentProject: project,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al cargar proyecto';
      set({
        currentProject: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  // Create new project
  createProject: async (data: Partial<Project>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ApiService.projects.create(data);
      const newProject = response.data;

      // Add to projects list
      set((state) => ({
        projects: [newProject, ...state.projects],
        currentProject: newProject,
        isLoading: false,
        error: null,
      }));

      return newProject;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al crear proyecto';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Update existing project
  updateProject: async (id: string, data: Partial<Project>) => {
    set({ isLoading: true, error: null });

    try {
      await ApiService.projects.update(id, data);

      // Update in local state
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p
        ),
        currentProject: state.currentProject?.id === id
          ? { ...state.currentProject, ...data }
          : state.currentProject,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar proyecto';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Delete project (soft delete)
  deleteProject: async (id: string) => {
    try {
      await ApiService.projects.delete(id);

      // Remove from local state
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar proyecto';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Set current project (for editing)
  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Helper hooks
export const useProjects = () => {
  const store = useProjectStore();
  return {
    projects: store.projects,
    currentProject: store.currentProject,
    isLoading: store.isLoading,
    isRefreshing: store.isRefreshing,
    error: store.error,
    loadProjects: store.loadProjects,
    refreshProjects: store.refreshProjects,
    getProject: store.getProject,
    createProject: store.createProject,
    updateProject: store.updateProject,
    deleteProject: store.deleteProject,
    setCurrentProject: store.setCurrentProject,
    clearError: store.clearError,
  };
};

// Selectors
export const useProjectsList = () => useProjectStore((state) => state.projects);
export const useCurrentProject = () => useProjectStore((state) => state.currentProject);
export const useProjectsLoading = () => useProjectStore((state) => state.isLoading);
export const useProjectsError = () => useProjectStore((state) => state.error);
