import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ensureDefaultHabits, getHabitViews } from "@/lib/habits";
import { NewHabitForm } from "@/components/NewHabitForm";
import { HabitCard } from "@/components/HabitCard";

export default async function HabitosPage() {
  const { userId } = await auth();
  if (userId) await ensureDefaultHabits(userId);
  const habits = userId ? await getHabitViews(userId) : [];

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mis hábitos</h1>
          <p className="mt-1 text-sm text-muted">
            Marcá lo que cumpliste. Tocá cualquier día para editarlo.
          </p>
        </div>
        <Link
          href="/dashboard/rutas"
          className="hidden shrink-0 rounded-full bg-surface-2 px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-border sm:block"
        >
          📚 Explorar rutas
        </Link>
      </div>

      {habits.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-weak text-2xl">
            🔥
          </div>
          <p className="font-semibold">Todavía no tenés hábitos</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Creá tu primero o explorá las Rutas para arrancar con hábitos ya
            armados.
          </p>
          <div className="mx-auto mt-5 max-w-xs">
            <NewHabitForm />
          </div>
        </div>
      ) : (
        <div className="grid items-start gap-4 sm:grid-cols-2">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
          <NewHabitForm />
        </div>
      )}
    </div>
  );
}
