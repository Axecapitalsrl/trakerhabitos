/**
 * Promueve a admin al usuario cuyo email es SEED_ADMIN_EMAIL.
 *
 * Flujo:
 *   1. El futuro admin se registra en la app vía Clerk (queda status='pending').
 *   2. Corré: npm run seed
 *   3. Su profile pasa a role='admin', status='active'.
 *
 * Es idempotente. Requiere que el profile ya exista (es decir, que el usuario
 * haya entrado al menos una vez a la app después de registrarse en Clerk).
 */
import { createClient } from "@supabase/supabase-js";

// Node 20.12+ / 24: carga .env.local sin dependencias externas.
process.loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_ADMIN_EMAIL;

if (!url || !serviceKey || !email) {
  console.error(
    "Faltan variables de entorno. Requeridas: NEXT_PUBLIC_SUPABASE_URL, " +
      "SUPABASE_SERVICE_ROLE_KEY, SEED_ADMIN_EMAIL.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: profile, error: findError } = await admin
    .from("profiles")
    .select("id, email, role, status")
    .eq("email", email)
    .maybeSingle();

  if (findError) throw findError;

  if (!profile) {
    console.error(
      `No existe un profile con email "${email}".\n` +
        "Primero registrate en la app con ese email (Clerk) y entrá una vez,\n" +
        "así se crea el profile. Después volvé a correr: npm run seed",
    );
    process.exit(1);
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update({
      role: "admin",
      status: "active",
      approved_at: new Date().toISOString(),
      approved_by: profile.id,
    })
    .eq("id", profile.id);

  if (updateError) throw updateError;

  console.log(`✔ Admin listo: ${email} (role=admin, status=active)`);
}

main().catch((err) => {
  console.error("Error en el seed:", err);
  process.exit(1);
});
