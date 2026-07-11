"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateHabitPlan, type PlanAnswers } from "@/lib/ai";
import { currentPeriod, planConfig, type Plan } from "@/lib/plans";

export interface PlanState {
  error?: string;
  plan?: string;
}

export async function generatePlan(
  _prev: PlanState,
  formData: FormData,
): Promise<PlanState> {
  const { userId } = await auth();
  if (!userId) return { error: "No autenticado." };

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, ai_plans_used, ai_plans_period")
    .eq("id", userId)
    .maybeSingle<{
      plan: Plan;
      ai_plans_used: number;
      ai_plans_period: string | null;
    }>();

  const cfg = planConfig(profile?.plan ?? "free");
  if (cfg.aiPlansPerMonth === 0) {
    return {
      error: "El plan personalizado está disponible en Pro y Premium.",
    };
  }

  // Reseteo mensual del contador.
  const period = currentPeriod();
  const used =
    profile?.ai_plans_period === period ? (profile?.ai_plans_used ?? 0) : 0;

  if (cfg.aiPlansPerMonth !== null && used >= cfg.aiPlansPerMonth) {
    return {
      error: `Llegaste al tope de ${cfg.aiPlansPerMonth} planes este mes. Con Premium es ilimitado.`,
    };
  }

  const answers: PlanAnswers = {
    objetivo: String(formData.get("objetivo") ?? "").trim(),
    cantidad: String(formData.get("cantidad") ?? "").trim(),
    energia: String(formData.get("energia") ?? "").trim(),
    tiempo: String(formData.get("tiempo") ?? "").trim(),
    costaba: String(formData.get("costaba") ?? "").trim(),
    obstaculos: String(formData.get("obstaculos") ?? "").trim(),
    intensidad: String(formData.get("intensidad") ?? "").trim(),
  };

  if (!answers.objetivo) return { error: "Contanos tu objetivo principal." };

  let content: string;
  try {
    content = await generateHabitPlan(answers);
  } catch (e) {
    console.error("generateHabitPlan", e);
    return {
      error:
        "No se pudo generar el plan ahora. Verificá que la IA esté configurada e intentá de nuevo.",
    };
  }

  await supabase.from("habit_plans").insert({
    user_id: userId,
    content,
    answers,
  });

  await supabase
    .from("profiles")
    .update({ ai_plans_used: used + 1, ai_plans_period: period })
    .eq("id", userId);

  revalidatePath("/dashboard/plan-ia");
  return { plan: content };
}
