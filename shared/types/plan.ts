// Plan Types
export type PlanId = 'free' | 'paid_single' | 'paid_double' | 'creative_design' | 'basic';

export interface PlanLimits {
  max_drafts: number | null;
  max_published_projects: number;
  can_publish: boolean;
  can_edit: boolean;
  can_register: boolean;
  price: number;
  priceUSD: number;
  name: string;
  description: string;
}

export interface PlanLimitsMap {
  free: PlanLimits;
  paid_single: PlanLimits;
  paid_double: PlanLimits;
  creative_design: PlanLimits;
  basic: PlanLimits;
}

export interface PlanInfo {
  id: PlanId;
  max_drafts: number | null;
  max_published_projects: number;
  can_publish: boolean;
  can_edit: boolean;
  can_register: boolean;
  price: number;
  priceUSD: number;
  name: string;
  description: string;
}
