// Auth Store using Zustand + MMKV persistence
import { create } from 'zustand';
import { User } from '@/shared';
import { ApiService } from '../services/api';
import { AuthStorage } from '../services/storage';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login with Google OAuth code
  login: async (code: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ApiService.auth.callback(code);
      const { token, refresh_token, user } = response.data;

      // Save to storage
      AuthStorage.setToken(token);
      AuthStorage.setRefreshToken(refresh_token);
      AuthStorage.setUserData(user);

      // Update state
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });

    try {
      // Call logout endpoint
      await ApiService.auth.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear storage and state regardless of API result
      AuthStorage.clearAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Verify authentication (check if token is valid)
  verifyAuth: async () => {
    const token = AuthStorage.getToken();

    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return;
    }

    set({ isLoading: true });

    try {
      const response = await ApiService.auth.verify();
      const user = response.data.user;

      // Update storage
      AuthStorage.setUserData(user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Token is invalid - clear auth
      AuthStorage.clearAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Refresh authentication (re-fetch user data)
  refreshAuth: async () => {
    const token = AuthStorage.getToken();

    if (!token) {
      return;
    }

    try {
      const response = await ApiService.auth.verify();
      const user = response.data.user;

      AuthStorage.setUserData(user);
      set({ user });
    } catch (error) {
      console.error('Error refreshing auth:', error);
    }
  },

  // Set user (for manual updates)
  setUser: (user: User) => {
    AuthStorage.setUserData(user);
    set({ user });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Initialize auth state from storage on app start
export const initializeAuth = async () => {
  const token = AuthStorage.getToken();
  const user = AuthStorage.getUserData<User>();

  if (token && user) {
    useAuthStore.setState({
      token,
      user,
      isAuthenticated: true,
    });

    // Verify token is still valid
    await useAuthStore.getState().verifyAuth();
  }
};

// Helper hooks
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    verifyAuth: store.verifyAuth,
    refreshAuth: store.refreshAuth,
    setUser: store.setUser,
    clearError: store.clearError,
  };
};

// Selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
