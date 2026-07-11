export type UserRole = "user" | "admin";
export type UserStatus = "pending" | "active" | "disabled";
export type HabitFrequency = "daily" | "weekly";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  organization_id: string | null;
  defaults_seeded: boolean;
  plan: import("@/lib/plans").Plan;
  stripe_customer_id: string | null;
  ai_plans_used: number;
  ai_plans_period: string | null;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  archived: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  created_at: string;
}
