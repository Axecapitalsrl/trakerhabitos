import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ensureDefaultHabits, getHabitViews } from "@/lib/habits";
import { getSessionProfile } from "@/lib/auth";
import { planConfig } from "@/lib/plans";
import { NewHabitForm } from "@/components/NewHabitForm";
import { HabitCard } from "@/components/HabitCard";

export default async function DashboardPage() {
  const [{ userId }, profile] = await Promise.all([
    auth(),
    getSessionProfile(),
  ]);

  // Siembra los hábitos por defecto la primera vez (idempotente vía flag).
  if (userId) await ensureDefaultHabits(userId);

  const habits = userId ? await getHabitViews(userId) : [];

  const firstName = profile?.name?.split(" ")[0];
  const cfg = planConfig(profile?.plan ?? "free");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hola{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1.5 text-muted">
            {habits.length === 0
              ? "Creá tu primer hábito para empezar a trackear."
              : "Marcá lo que cumpliste hoy. Tocá cualquier día para editarlo."}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-xs font-bold">
          Plan {cfg.name}
        </span>
      </div>

      {/* Accesos rápidos */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          href="/dashboard/rutas"
          className="card flex flex-col gap-1 p-4 transition-colors hover:border-brand"
        >
          <span className="text-xl">📚</span>
          <span className="text-sm font-semibold">Rutas</span>
        </Link>
        <Link
          href="/dashboard/asistente"
          className="card flex flex-col gap-1 p-4 transition-colors hover:border-brand"
        >
          <span className="text-xl">🤖</span>
          <span className="text-sm font-semibold">Asistente</span>
        </Link>
        <Link
          href="/dashboard/plan-ia"
          className="card flex flex-col gap-1 p-4 transition-colors hover:border-brand"
        >
          <span className="text-xl">✨</span>
          <span className="text-sm font-semibold">Plan con IA</span>
        </Link>
        {cfg.id !== "premium" && (
          <Link
            href="/dashboard/planes"
            className="card flex flex-col gap-1 p-4 transition-colors hover:border-brand"
          >
            <span className="text-xl">⭐</span>
            <span className="text-sm font-semibold">Mejorar plan</span>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
        <NewHabitForm />
      </div>
    </main>
  );
}
