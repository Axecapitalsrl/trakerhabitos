"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { planConfig, type Plan } from "@/lib/plans";

export interface AddState {
  ok?: boolean;
  error?: string;
}

export async function addTemplateHabit(
  name: string,
  description: string,
): Promise<AddState> {
  const { userId } = await auth();
  if (!userId) return { error: "No autenticado." };
  if (!name) return { error: "Hábito inválido." };

  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle<{ plan: Plan }>();
  const limit = planConfig(profile?.plan ?? "free").habitLimit;

  if (limit !== null) {
    const { count } = await supabase
      .from("habits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("archived", false);
    if ((count ?? 0) >= limit) {
      return {
        error: `Tu plan permite hasta ${limit} hábitos. Mejorá tu plan para agregar más.`,
      };
    }
  }

  const { error } = await supabase.from("habits").insert({
    user_id: userId,
    name,
    description: description || null,
  });
  if (error) return { error: "No se pudo agregar el hábito." };

  revalidatePath("/dashboard");
  return { ok: true };
}
