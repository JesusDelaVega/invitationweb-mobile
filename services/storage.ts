// Storage Service using MMKV (10x faster than AsyncStorage)
import { MMKV } from 'react-native-mmkv';

// Initialize MMKV instance
// @ts-ignore - MMKV class is correctly imported
const storage = new MMKV({
  id: 'invitationweb-storage',
  encryptionKey: 'invitationweb-secret-key-2026' // For sensitive data
});

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  USER_PLAN: 'user_plan',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

// Storage service
export const StorageService = {
  // String operations
  getString(key: string): string | undefined {
    return storage.getString(key);
  },

  setString(key: string, value: string): void {
    storage.set(key, value);
  },

  // JSON operations
  getJSON<T>(key: string): T | null {
    const value = storage.getString(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error parsing JSON for key ${key}:`, error);
      return null;
    }
  },

  setJSON(key: string, value: any): void {
    storage.set(key, JSON.stringify(value));
  },

  // Boolean operations
  getBoolean(key: string): boolean | undefined {
    return storage.getBoolean(key);
  },

  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  },

  // Number operations
  getNumber(key: string): number | undefined {
    return storage.getNumber(key);
  },

  setNumber(key: string, value: number): void {
    storage.set(key, value);
  },

  // Delete operations
  delete(key: string): void {
    storage.delete(key);
  },

  // Clear all
  clearAll(): void {
    storage.clearAll();
  },

  // Check if key exists
  contains(key: string): boolean {
    return storage.contains(key);
  },

  // Get all keys
  getAllKeys(): string[] {
    return storage.getAllKeys();
  }
};

// Convenience methods for auth
export const AuthStorage = {
  getToken(): string | undefined {
    return StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken(token: string): void {
    StorageService.setString(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getRefreshToken(): string | undefined {
    return StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(token: string): void {
    StorageService.setString(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  getUserData<T>(): T | null {
    return StorageService.getJSON<T>(STORAGE_KEYS.USER_DATA);
  },

  setUserData(user: any): void {
    StorageService.setJSON(STORAGE_KEYS.USER_DATA, user);
  },

  clearAuth(): void {
    StorageService.delete(STORAGE_KEYS.AUTH_TOKEN);
    StorageService.delete(STORAGE_KEYS.REFRESH_TOKEN);
    StorageService.delete(STORAGE_KEYS.USER_DATA);
  }
};

export default StorageService;
