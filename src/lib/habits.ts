import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeStreak, lastNDays, todayStr } from "@/lib/dates";
import { DEFAULT_HABITS } from "@/lib/default-habits";
import type { Habit } from "@/lib/types";

/**
 * Siembra los hábitos predeterminados la primera vez que el usuario entra.
 * Idempotente vía el flag profiles.defaults_seeded, y además deduplica por
 * nombre para no pisar hábitos que el usuario ya tenga.
 */
export async function ensureDefaultHabits(userId: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("defaults_seeded")
    .eq("id", userId)
    .maybeSingle<{ defaults_seeded: boolean }>();

  if (!profile || profile.defaults_seeded) return;

  const { data: existing } = await supabase
    .from("habits")
    .select("name")
    .eq("user_id", userId)
    .returns<{ name: string }[]>();

  const taken = new Set((existing ?? []).map((h) => h.name.toLowerCase()));
  const toInsert = DEFAULT_HABITS.filter(
    (h) => !taken.has(h.name.toLowerCase()),
  ).map((h) => ({
    user_id: userId,
    name: h.name,
    description: h.description ?? null,
  }));

  if (toInsert.length > 0) {
    await supabase.from("habits").insert(toInsert);
  }
  await supabase
    .from("profiles")
    .update({ defaults_seeded: true })
    .eq("id", userId);
}

export interface HabitView {
  id: string;
  name: string;
  description: string | null;
  doneToday: boolean;
  streak: number;
  /** Últimos 7 días, de más viejo a hoy. */
  week: { date: string; weekday: string; done: boolean; isToday: boolean }[];
  weekCount: number;
}

const WEEKDAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

/**
 * Trae los hábitos activos del usuario con su estado de hoy, racha y la
 * semana. `userId` = Clerk user id. Acceso server-side con service role,
 * filtrando SIEMPRE por user_id.
 */
export async function getHabitViews(userId: string): Promise<HabitView[]> {
  const supabase = createAdminClient();

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("archived", false)
    .order("created_at", { ascending: true })
    .returns<Habit[]>();

  if (!habits || habits.length === 0) return [];

  const habitIds = habits.map((h) => h.id);

  // Logs de los últimos 90 días (suficiente para racha + semana).
  const cutoff = lastNDays(90)[0];
  const { data: logs } = await supabase
    .from("habit_logs")
    .select("habit_id, date, completed")
    .in("habit_id", habitIds)
    .gte("date", cutoff)
    .eq("completed", true)
    .returns<{ habit_id: string; date: string; completed: boolean }[]>();

  // Set de fechas completadas por hábito.
  const doneByHabit = new Map<string, Set<string>>();
  for (const id of habitIds) doneByHabit.set(id, new Set());
  for (const log of logs ?? []) {
    doneByHabit.get(log.habit_id)?.add(log.date);
  }

  const today = todayStr();
  const week7 = lastNDays(7);

  return habits.map((habit) => {
    const done = doneByHabit.get(habit.id) ?? new Set<string>();
    const week = week7.map((date) => {
      const d = new Date(`${date}T00:00:00`);
      return {
        date,
        weekday: WEEKDAY_LETTERS[d.getDay()],
        done: done.has(date),
        isToday: date === today,
      };
    });

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      doneToday: done.has(today),
      streak: computeStreak(done),
      week,
      weekCount: week.filter((d) => d.done).length,
    };
  });
}
