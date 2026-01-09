// User Types
import { PlanId } from './plan';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  current_plan: PlanId;
  plan_expires_at?: string | null;
  trial_expires_at?: string | null;
  payment_status?: string;
  created_at: string;
  last_login?: string;
  phone?: string;
  bio?: string;
  website?: string;
  location?: string;
  language?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
