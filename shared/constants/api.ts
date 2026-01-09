// API Constants
export const API_BASE_URL = process.env.API_BASE_URL || 'https://invitationweb.app';

export const API_ENDPOINTS = {
  // Auth
  AUTH_CALLBACK: '/api/auth/callback',
  AUTH_VERIFY: '/api/auth/verify',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',

  // Projects
  PROJECTS: '/api/projects',
  PROJECT_BY_ID: (id: string) => `/api/projects/${id}`,
  PROJECT_PUBLISH: (id: string) => `/api/projects/${id}/publish`,

  // Payments
  PAYMENT_CREATE_ORDER: '/api/payment/create-order',
  PAYMENT_COMPLETE_ORDER: '/api/payment/complete-order',
  PAYMENT_VERIFY_APPLE: '/api/payment/verify-apple',
  PAYMENT_VERIFY_GOOGLE: '/api/payment/verify-google',

  // Images
  IMAGES_UPLOAD: '/api/images/upload',
  IMAGES_LIST: '/api/images',

  // User
  USER_PROFILE: '/api/user/profile',
  USER_PREFERENCES: '/api/user/preferences',
  USER_PUSH_TOKEN: '/api/user/push-token',
} as const;

export const GOOGLE_CLIENT_ID = '429558656930-te4o1e3sn7tr15ap93c2a0lpocg2f7d6.apps.googleusercontent.com';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500,
} as const;
