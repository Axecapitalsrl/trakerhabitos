"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { todayStr } from "@/lib/dates";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  return userId;
}

/** Confirma que el hábito pertenece al usuario. Lanza si no. */
async function assertOwnership(
  supabase: ReturnType<typeof createAdminClient>,
  habitId: string,
  userId: string,
): Promise<void> {
  const { data } = await supabase
    .from("habits")
    .select("user_id")
    .eq("id", habitId)
    .maybeSingle<{ user_id: string }>();
  if (!data || data.user_id !== userId) {
    throw new Error("Hábito no encontrado");
  }
}

export async function createHabit(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return { error: "El nombre es obligatorio." };
  if (name.length > 80) return { error: "El nombre es demasiado largo." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("habits").insert({
    user_id: userId,
    name,
    description: description || null,
  });

  if (error) return { error: "No se pudo crear el hábito." };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateHabit(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return { error: "El nombre es obligatorio." };

  const supabase = createAdminClient();
  await assertOwnership(supabase, id, userId);

  const { error } = await supabase
    .from("habits")
    .update({ name, description: description || null })
    .eq("id", id);

  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function archiveHabit(habitId: string): Promise<void> {
  const userId = await requireUserId();
  const supabase = createAdminClient();
  await assertOwnership(supabase, habitId, userId);

  await supabase.from("habits").update({ archived: true }).eq("id", habitId);
  revalidatePath("/dashboard");
}

/**
 * Alterna el cumplimiento de un hábito para una fecha (por defecto hoy).
 * Si estaba marcado, lo desmarca (borra el log); si no, lo marca.
 */
export async function toggleHabitDay(
  habitId: string,
  date: string = todayStr(),
): Promise<void> {
  const userId = await requireUserId();
  const supabase = createAdminClient();
  await assertOwnership(supabase, habitId, userId);

  const { data: existing } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("date", date)
    .maybeSingle<{ id: string }>();

  if (existing) {
    await supabase.from("habit_logs").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("habit_logs")
      .insert({ habit_id: habitId, date, completed: true });
  }

  revalidatePath("/dashboard");
}
