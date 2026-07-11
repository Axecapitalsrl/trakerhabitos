export type Plan = "free" | "starter" | "pro" | "premium";

export interface PlanConfig {
  id: Plan;
  name: string;
  price: number; // USD/mes
  /** Máximo de hábitos activos. null = ilimitado. */
  habitLimit: number | null;
  /** Planes personalizados con IA por mes. 0 = sin acceso, null = ilimitado. */
  aiPlansPerMonth: number | null;
  /** Acceso al asistente de hábitos 24/7. */
  assistant: boolean;
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    habitLimit: 3,
    aiPlansPerMonth: 0,
    assistant: false,
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 7,
    habitLimit: 5,
    aiPlansPerMonth: 0,
    assistant: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 17,
    habitLimit: null,
    aiPlansPerMonth: 4,
    assistant: false,
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 27,
    habitLimit: null,
    aiPlansPerMonth: null,
    assistant: true,
  },
};

export function planConfig(plan: Plan): PlanConfig {
  return PLANS[plan] ?? PLANS.free;
}

/** Período mensual actual, formato 'YYYY-MM' (para resetear topes mensuales). */
export function currentPeriod(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
