// Storage Service with automatic MMKV/AsyncStorage fallback
// Works in both Expo Go (AsyncStorage) and native builds (MMKV)
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Check if we're running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Storage instance - will be initialized lazily
let storage: any = null;
let storageInitialized = false;

// Initialize storage lazily
const initStorage = () => {
  if (storageInitialized) return;

  if (!isExpoGo) {
    try {
      // Dynamic import to avoid loading MMKV in Expo Go
      const MMKVModule = eval("require('react-native-mmkv')");
      const { MMKV } = MMKVModule;
      storage = new MMKV({
        id: 'invitationweb-storage',
        encryptionKey: 'invitationweb-secret-key-2026'
      });
      console.log('✅ Using MMKV for storage (native build)');
    } catch (error) {
      console.log('⚠️  MMKV not available, using AsyncStorage fallback');
      storage = null;
    }
  } else {
    console.log('⚠️  Expo Go detected, using AsyncStorage');
    storage = null;
  }

  storageInitialized = true;
};

// Initialize on module load
initStorage();

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  USER_PLAN: 'user_plan',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

// Storage service with automatic fallback
export const StorageService = {
  // String operations
  getString(key: string): string | undefined {
    if (storage) {
      // MMKV (native)
      return storage.getString(key);
    } else {
      // AsyncStorage (Expo Go) - sync version not available, return undefined
      // Use getStringAsync instead
      return undefined;
    }
  },

  async getStringAsync(key: string): Promise<string | null> {
    if (storage) {
      // MMKV
      return storage.getString(key) || null;
    } else {
      // AsyncStorage
      return await AsyncStorage.getItem(key);
    }
  },

  setString(key: string, value: string): void {
    if (storage) {
      // MMKV (sync)
      storage.set(key, value);
    } else {
      // AsyncStorage (async, but fire-and-forget)
      AsyncStorage.setItem(key, value).catch(err =>
        console.error('AsyncStorage setItem error:', err)
      );
    }
  },

  async setStringAsync(key: string, value: string): Promise<void> {
    if (storage) {
      storage.set(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  // JSON operations
  getJSON<T>(key: string): T | null {
    if (storage) {
      const value = storage.getString(key);
      if (!value) return null;

      try {
        return JSON.parse(value) as T;
      } catch (error) {
        console.error(`Error parsing JSON for key ${key}:`, error);
        return null;
      }
    }
    return null;
  },

  async getJSONAsync<T>(key: string): Promise<T | null> {
    const value = await this.getStringAsync(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error parsing JSON for key ${key}:`, error);
      return null;
    }
  },

  setJSON(key: string, value: any): void {
    this.setString(key, JSON.stringify(value));
  },

  async setJSONAsync(key: string, value: any): Promise<void> {
    await this.setStringAsync(key, JSON.stringify(value));
  },

  // Boolean operations
  getBoolean(key: string): boolean | undefined {
    if (storage) {
      return storage.getBoolean(key);
    }
    return undefined;
  },

  async getBooleanAsync(key: string): Promise<boolean | null> {
    if (storage) {
      return storage.getBoolean(key) ?? null;
    } else {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return value === 'true';
    }
  },

  setBoolean(key: string, value: boolean): void {
    if (storage) {
      storage.set(key, value);
    } else {
      AsyncStorage.setItem(key, value.toString()).catch(err =>
        console.error('AsyncStorage setItem error:', err)
      );
    }
  },

  // Number operations
  getNumber(key: string): number | undefined {
    if (storage) {
      return storage.getNumber(key);
    }
    return undefined;
  },

  async getNumberAsync(key: string): Promise<number | null> {
    if (storage) {
      return storage.getNumber(key) ?? null;
    } else {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return parseFloat(value);
    }
  },

  setNumber(key: string, value: number): void {
    if (storage) {
      storage.set(key, value);
    } else {
      AsyncStorage.setItem(key, value.toString()).catch(err =>
        console.error('AsyncStorage setItem error:', err)
      );
    }
  },

  // Delete operations
  delete(key: string): void {
    if (storage) {
      storage.delete(key);
    } else {
      AsyncStorage.removeItem(key).catch(err =>
        console.error('AsyncStorage removeItem error:', err)
      );
    }
  },

  async deleteAsync(key: string): Promise<void> {
    if (storage) {
      storage.delete(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },

  // Clear all
  clearAll(): void {
    if (storage) {
      storage.clearAll();
    } else {
      AsyncStorage.clear().catch(err =>
        console.error('AsyncStorage clear error:', err)
      );
    }
  },

  async clearAllAsync(): Promise<void> {
    if (storage) {
      storage.clearAll();
    } else {
      await AsyncStorage.clear();
    }
  },

  // Check if key exists
  contains(key: string): boolean {
    if (storage) {
      return storage.contains(key);
    }
    return false;
  },

  async containsAsync(key: string): Promise<boolean> {
    if (storage) {
      return storage.contains(key);
    } else {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    }
  },

  // Get all keys
  getAllKeys(): string[] {
    if (storage) {
      return storage.getAllKeys();
    }
    return [];
  },

  async getAllKeysAsync(): Promise<string[]> {
    if (storage) {
      return storage.getAllKeys();
    } else {
      return await AsyncStorage.getAllKeys();
    }
  }
};

// Convenience methods for auth (async versions for Expo Go compatibility)
export const AuthStorage = {
  async getToken(): Promise<string | null> {
    return await StorageService.getStringAsync(STORAGE_KEYS.AUTH_TOKEN);
  },

  async setToken(token: string): Promise<void> {
    await StorageService.setStringAsync(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await StorageService.getStringAsync(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await StorageService.setStringAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async getUserData<T>(): Promise<T | null> {
    return await StorageService.getJSONAsync<T>(STORAGE_KEYS.USER_DATA);
  },

  async setUserData(user: any): Promise<void> {
    await StorageService.setJSONAsync(STORAGE_KEYS.USER_DATA, user);
  },

  async clearAuth(): Promise<void> {
    await StorageService.deleteAsync(STORAGE_KEYS.AUTH_TOKEN);
    await StorageService.deleteAsync(STORAGE_KEYS.REFRESH_TOKEN);
    await StorageService.deleteAsync(STORAGE_KEYS.USER_DATA);
  }
};

export default StorageService;
