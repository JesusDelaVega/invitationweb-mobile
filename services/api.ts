// API Service with retry logic
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { API_BASE_URL, API_ENDPOINTS, HTTP_STATUS } from '@/shared';
import { AuthStorage } from './storage';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry logic (same as web)
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    // Exponential backoff with jitter
    const baseDelay = 1000;
    const maxDelay = 10000;
    const backoffFactor = 2;

    const delay = Math.min(
      baseDelay * Math.pow(backoffFactor, retryCount - 1),
      maxDelay
    );
    const jitter = Math.random() * 0.1 * delay;

    return delay + jitter;
  },
  retryCondition: (error: AxiosError) => {
    // Retry on network errors and specific status codes
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === HTTP_STATUS.RATE_LIMITED ||
      error.response?.status === HTTP_STATUS.SERVER_ERROR
    );
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = AuthStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = AuthStorage.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`, {
            refresh_token: refreshToken
          });

          const { token } = response.data;
          AuthStorage.setToken(token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        AuthStorage.clearAuth();
        // Note: Redirect to login will be handled by authStore listener
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API service
export const ApiService = {
  // Auth endpoints
  auth: {
    callback: (code: string) =>
      api.post(API_ENDPOINTS.AUTH_CALLBACK, { code }),

    verify: () =>
      api.get(API_ENDPOINTS.AUTH_VERIFY),

    logout: () =>
      api.post(API_ENDPOINTS.AUTH_LOGOUT),

    refresh: (refreshToken: string) =>
      api.post(API_ENDPOINTS.AUTH_REFRESH, { refresh_token: refreshToken }),
  },

  // Projects endpoints
  projects: {
    list: () =>
      api.get(API_ENDPOINTS.PROJECTS),

    getById: (id: string) =>
      api.get(API_ENDPOINTS.PROJECT_BY_ID(id)),

    create: (data: any) =>
      api.post(API_ENDPOINTS.PROJECTS, data),

    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.PROJECTS, { id, ...data }),

    delete: (id: string) =>
      api.delete(API_ENDPOINTS.PROJECT_BY_ID(id)),

    publish: (id: string, publishData: any) =>
      api.post(API_ENDPOINTS.PROJECT_PUBLISH(id), publishData),
  },

  // Payment endpoints
  payments: {
    createOrder: (planType: string) =>
      api.post(API_ENDPOINTS.PAYMENT_CREATE_ORDER, { plan_type: planType }),

    completeOrder: (orderId: string, paymentData: any) =>
      api.post(API_ENDPOINTS.PAYMENT_COMPLETE_ORDER, { order_id: orderId, ...paymentData }),

    verifyApple: (receipt: string, productId: string, transactionId: string) =>
      api.post(API_ENDPOINTS.PAYMENT_VERIFY_APPLE, { receipt, productId, transactionId }),

    verifyGoogle: (purchaseToken: string, productId: string) =>
      api.post(API_ENDPOINTS.PAYMENT_VERIFY_GOOGLE, { purchaseToken, productId }),
  },

  // Images endpoints
  images: {
    upload: (file: FormData, onProgress?: (progress: number) => void) =>
      api.post(API_ENDPOINTS.IMAGES_UPLOAD, file, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }),

    list: (folder?: string) =>
      api.get(API_ENDPOINTS.IMAGES_LIST, { params: { folder } }),
  },

  // User endpoints
  user: {
    getProfile: () =>
      api.get(API_ENDPOINTS.USER_PROFILE),

    updateProfile: (data: any) =>
      api.post(API_ENDPOINTS.USER_PROFILE, data),

    getPreferences: () =>
      api.get(API_ENDPOINTS.USER_PREFERENCES),

    updatePreferences: (data: any) =>
      api.post(API_ENDPOINTS.USER_PREFERENCES, data),

    registerPushToken: (token: string) =>
      api.post(API_ENDPOINTS.USER_PUSH_TOKEN, { push_token: token }),
  },

  // Generic HTTP methods
  get: (url: string, config?: any) => api.get(url, config),
  post: (url: string, data?: any, config?: any) => api.post(url, data, config),
  put: (url: string, data?: any, config?: any) => api.put(url, data, config),
  delete: (url: string, config?: any) => api.delete(url, config),
};

export default api;
