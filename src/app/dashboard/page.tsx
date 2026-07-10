import { auth } from "@clerk/nextjs/server";
import { ensureDefaultHabits, getHabitViews } from "@/lib/habits";
import { getSessionProfile } from "@/lib/auth";
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

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Hola{firstName ? `, ${firstName}` : ""} 👋
        </h1>
        <p className="mt-1.5 text-muted">
          {habits.length === 0
            ? "Creá tu primer hábito para empezar a trackear."
            : "Marcá lo que cumpliste hoy. Tocá cualquier día para editarlo."}
        </p>
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
