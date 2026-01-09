// Sistema de planes - Modelo de 4 tiers
import { PlanId, PlanLimits, PlanLimitsMap, PlanInfo } from '../types/plan';

export const PLAN_LIMITS: PlanLimitsMap = {
  free: {
    max_drafts: 1, // 1 borrador permitido
    max_published_projects: 0, // No puede publicar
    can_publish: false, // Necesita upgrade para publicar
    can_edit: true, // Edición ilimitada
    can_register: true,
    price: 0,
    priceUSD: 0,
    name: "Gratuito",
    description: "1 borrador - Publicación requiere upgrade"
  },
  paid_single: {
    max_drafts: 1,
    max_published_projects: 1,
    can_publish: true,
    can_edit: true,
    can_register: true,
    price: 250,
    priceUSD: 15,
    name: "Básico",
    description: "Perfecto para publicar tu invitación"
  },
  paid_double: {
    max_drafts: 2,
    max_published_projects: 2,
    can_publish: true,
    can_edit: true,
    can_register: true,
    price: 400,
    priceUSD: 25,
    name: "Standard",
    description: "Para múltiples eventos - 2 proyectos publicados"
  },
  creative_design: {
    max_drafts: 5,
    max_published_projects: 5,
    can_publish: true,
    can_edit: true,
    can_register: true,
    price: 1200,
    priceUSD: 70,
    name: "Creative Design",
    description: "Para agencias y revendedores - Vende sitios con nuestra plataforma"
  },
  // Alias para compatibilidad hacia atrás
  basic: {
    max_drafts: 2,
    max_published_projects: 2,
    can_publish: true,
    can_edit: true,
    can_register: true,
    price: 400,
    priceUSD: 25,
    name: "Standard",
    description: "Para múltiples eventos - 2 proyectos publicados"
  }
};

// Obtener información de límites para un plan
export function getPlanLimits(userPlan: PlanId, hasExpansion: boolean = false): PlanLimits {
  const basePlan = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;

  // Si es Creative Design con expansión, incrementar límites
  if (userPlan === 'creative_design' && hasExpansion) {
    return {
      ...basePlan,
      max_drafts: 10,
      max_published_projects: 10,
      name: "Creative Design Max"
    };
  }

  return basePlan;
}

// Verificar si un usuario puede publicar
export function canUserPublish(userPlan: PlanId): boolean {
  const plan = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  return plan.can_publish;
}

// Verificar si un usuario puede editar
export function canUserEdit(userPlan: PlanId): boolean {
  const plan = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  return plan.can_edit;
}

// Obtener el número máximo de borradores para un plan
export function getMaxDrafts(userPlan: PlanId): number {
  const plan = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  // Si max_drafts es null, retornar Infinity para indicar sin límite
  return plan.max_drafts === null ? Infinity : plan.max_drafts;
}

// Obtener el número máximo de proyectos publicados para un plan
export function getMaxPublishedProjects(userPlan: PlanId): number {
  const plan = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  return plan.max_published_projects;
}

// Verificar si un usuario puede crear un nuevo borrador
export function canCreateDraft(userPlan: PlanId, currentDraftsCount: number): boolean {
  const plan = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  // Si max_drafts es null, no hay límite
  if (plan.max_drafts === null) return true;
  return currentDraftsCount < plan.max_drafts;
}

// Verificar si un usuario puede publicar un proyecto (revisar límite)
export function canPublishProject(userPlan: PlanId, currentPublishedCount: number): boolean {
  const plan = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  return plan.can_publish && currentPublishedCount < plan.max_published_projects;
}

// Obtener todos los planes disponibles (para UI)
export function getAvailablePlans(): PlanInfo[] {
  return Object.keys(PLAN_LIMITS).map(key => ({
    id: key as PlanId,
    ...PLAN_LIMITS[key as PlanId]
  }));
}

// Verificar si un plan puede publicar (formato con mensaje)
export function canPublish(planId: PlanId): { allowed: boolean; reason?: string } {
  const limits = getPlanLimits(planId);

  if (!limits.can_publish) {
    return {
      allowed: false,
      reason: `El plan ${limits.name} no permite publicar proyectos. Actualiza tu plan para publicar.`,
    };
  }

  return { allowed: true };
}
