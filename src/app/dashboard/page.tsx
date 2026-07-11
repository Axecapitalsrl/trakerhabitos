import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ensureDefaultHabits, getHabitViews } from "@/lib/habits";
import { getSessionProfile } from "@/lib/auth";
import { planConfig } from "@/lib/plans";
import { todayStr } from "@/lib/dates";
import { TodayHabits } from "@/components/TodayHabits";

export default async function DashboardPage() {
  const [{ userId }, profile] = await Promise.all([auth(), getSessionProfile()]);
  if (userId) await ensureDefaultHabits(userId);
  const habits = userId ? await getHabitViews(userId) : [];

  const firstName = profile?.name?.split(" ")[0];
  const cfg = planConfig(profile?.plan ?? "free");

  // ---- Métricas ----
  const active = habits.length;
  const doneToday = habits.filter((h) => h.doneToday).length;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.streak), 0);
  const weekSum = habits.reduce((s, h) => s + h.weekCount, 0);
  const weeklyPct = active ? Math.round((weekSum / (active * 7)) * 100) : 0;
  const todayPct = active ? Math.round((doneToday / active) * 100) : 0;

  // Cumplidos por día de la semana (para las barras y días perfectos).
  const perDay = [0, 0, 0, 0, 0, 0, 0];
  for (const h of habits) {
    h.week.forEach((d, i) => {
      if (d.done) perDay[i]++;
    });
  }
  const perfectDays = active
    ? perDay.filter((c) => c === active).length
    : 0;
  const weekMeta = habits[0]?.week ?? [];
  const pending = habits.filter((h) => !h.doneToday);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Hola{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-muted">
            Tu progreso de un vistazo.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-xs font-bold">
          Plan {cfg.name}
        </span>
      </div>

      {active === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-weak text-2xl">
            🚀
          </div>
          <p className="font-semibold">Empezá tu primer hábito</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Cuando tengas hábitos vas a ver acá tus métricas: rachas, % de
            cumplimiento y tu semana.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/dashboard/habitos" className="btn-brand px-5 py-2.5">
              Crear hábito
            </Link>
            <Link href="/dashboard/rutas" className="btn-ghost px-5 py-2.5">
              Ver rutas
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat
              label="Hoy"
              value={`${doneToday}/${active}`}
              sub={`${todayPct}% completado`}
            />
            <Stat label="Racha más larga" value={`🔥 ${bestStreak}`} sub="días seguidos" />
            <Stat label="Cumplimiento" value={`${weeklyPct}%`} sub="esta semana" />
            <Stat
              label="Días perfectos"
              value={`${perfectDays}/7`}
              sub="semana"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Barras de la semana */}
            <div className="card p-5">
              <h2 className="text-sm font-bold">Tu semana</h2>
              <p className="text-xs text-muted">
                Hábitos completados por día
              </p>
              <div className="mt-5 flex items-end justify-between gap-2">
                {weekMeta.map((d, i) => {
                  const frac = active ? perDay[i] / active : 0;
                  return (
                    <div
                      key={d.date}
                      className="flex flex-1 flex-col items-center gap-1.5"
                    >
                      <div className="flex h-24 w-full items-end">
                        <div
                          className={[
                            "w-full rounded-md transition-all",
                            d.isToday ? "bg-brand" : "bg-brand/50",
                          ].join(" ")}
                          style={{ height: `${Math.max(6, frac * 100)}%` }}
                          title={`${perDay[i]}/${active}`}
                        />
                      </div>
                      <span
                        className={[
                          "text-[11px] font-medium",
                          d.isToday ? "text-brand-strong" : "text-muted",
                        ].join(" ")}
                      >
                        {d.weekday}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Para hoy */}
            <div className="card flex flex-col p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">Para hoy</h2>
                  <p className="text-xs text-muted">
                    {doneToday}/{active} hechos
                  </p>
                </div>
                <Link
                  href="/dashboard/habitos"
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Ver todos
                </Link>
              </div>
              {pending.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                  <div className="text-3xl">🎉</div>
                  <p className="mt-2 font-semibold">¡Todo listo por hoy!</p>
                  <p className="text-sm text-muted">
                    Completaste tus {active} hábitos.
                  </p>
                </div>
              ) : (
                <div className="max-h-[380px] overflow-y-auto pr-1">
                  <TodayHabits
                    today={todayStr()}
                    habits={pending.map((h) => ({
                      id: h.id,
                      name: h.name,
                      doneToday: h.doneToday,
                      streak: h.streak,
                    }))}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}
