import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile, UserStatus } from "@/lib/types";

/**
 * Verifica que el usuario autenticado sea admin. Devuelve su id.
 * Lanza si no hay sesión o no es admin. Usar en toda acción de /admin.
 */
export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle<{ role: string }>();

  if (data?.role !== "admin") throw new Error("No autorizado");
  return userId;
}

export async function listProfiles(): Promise<Profile[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();
  return data ?? [];
}

/**
 * Aprobación de usuario, DESACOPLADA del flujo de registro (spec §7).
 * Cuando en fase 2 haya aprobación automática post-pago, se llama a esta misma
 * función desde otro trigger sin tocar el resto.
 */
export async function approveUser(
  userId: string,
  approvedBy: string,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({
      status: "active",
      approved_at: new Date().toISOString(),
      approved_by: approvedBy,
    })
    .eq("id", userId);
}

export async function setUserStatus(
  userId: string,
  status: UserStatus,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ status }).eq("id", userId);
}
