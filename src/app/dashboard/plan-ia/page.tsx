import Link from "next/link";
import { getSessionProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { currentPeriod, planConfig } from "@/lib/plans";
import { PlanIAForm } from "@/components/PlanIAForm";

export default async function PlanIAPage() {
  const profile = await getSessionProfile();
  const cfg = planConfig(profile?.plan ?? "free");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Plan personalizado con IA
      </h1>
      <p className="mt-1.5 text-muted">
        Respondé unas preguntas y una IA te arma una rutina de hábitos hecha
        para vos.
      </p>

      {cfg.aiPlansPerMonth === 0 ? (
        <div className="card mt-6 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-weak text-2xl">
            ✨
          </div>
          <h2 className="text-lg font-bold">Disponible en Pro y Premium</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Mejorá tu plan para que la IA arme tu rutina personalizada. Con Pro
            tenés 4 planes por mes; con Premium, ilimitados.
          </p>
          <Link href="/dashboard/planes" className="btn-brand mt-5 px-6 py-3">
            Ver planes
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          {cfg.aiPlansPerMonth !== null && (
            <RemainingBadge userId={profile!.id} limit={cfg.aiPlansPerMonth} />
          )}
          <PlanIAForm />
        </div>
      )}
    </main>
  );
}

async function RemainingBadge({
  userId,
  limit,
}: {
  userId: string;
  limit: number;
}) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("ai_plans_used, ai_plans_period")
    .eq("id", userId)
    .maybeSingle<{ ai_plans_used: number; ai_plans_period: string | null }>();
  const used =
    data?.ai_plans_period === currentPeriod() ? (data?.ai_plans_used ?? 0) : 0;
  const left = Math.max(0, limit - used);

  return (
    <p className="mb-4 inline-block rounded-full bg-surface-2 px-3 py-1 text-sm font-medium">
      Te quedan <span className="font-bold text-brand-strong">{left}</span> de{" "}
      {limit} planes este mes
    </p>
  );
}
