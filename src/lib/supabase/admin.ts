import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la SERVICE ROLE key. Ignora RLS.
 *
 * SOLO se puede usar en el servidor (Server Components, Server Actions,
 * Route Handlers). El import "server-only" hace fallar el build si por error
 * se importa desde el cliente.
 *
 * Como bypassa RLS, TODA query debe filtrar explícitamente por el userId de
 * Clerk del usuario autenticado. Ver src/lib/auth.ts.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
