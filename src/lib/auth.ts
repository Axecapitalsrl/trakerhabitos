import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/types";

/**
 * Devuelve el profile del usuario de Clerk autenticado, creándolo la primera
 * vez (status = 'pending'). Devuelve null si no hay sesión de Clerk.
 *
 * Fuente de verdad de identidad: Clerk. `profiles.id` = Clerk user id.
 */
export async function getSessionProfile(): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>();

  if (existing) return existing;

  // Primera vez: creamos el profile como 'pending' con los datos de Clerk.
  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "";
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || null;

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({ id: userId, email, name })
    .select("*")
    .single<Profile>();

  if (error) {
    // Carrera: otra request lo creó primero -> lo leemos.
    const { data: retry } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single<Profile>();
    return retry ?? null;
  }

  return created;
}
