"use client";

import { useState, useTransition } from "react";
import {
  archiveHabit,
  toggleHabitDay,
  updateHabit,
} from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/SubmitButton";
import type { HabitView } from "@/lib/habits";

const inputClass =
  "w-full rounded-lg border border-border-strong bg-background px-3 py-2 outline-none focus:border-brand";

export function HabitCard({ habit }: { habit: HabitView }) {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggle(date: string) {
    startTransition(() => toggleHabitDay(habit.id, date));
  }

  if (editing) {
    return <EditHabitForm habit={habit} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{habit.name}</h3>
          {habit.description && (
            <p className="mt-0.5 truncate text-sm text-muted">
              {habit.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            title="Racha actual"
            className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold tabular-nums"
          >
            🔥 {habit.streak}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 120)}
              aria-label="Acciones"
              className="rounded-lg px-2 py-1 text-muted hover:bg-surface-2"
            >
              ⋯
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditing(true);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-2"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (confirm(`¿Archivar "${habit.name}"?`)) {
                      startTransition(() => archiveHabit(habit.id));
                    }
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-surface-2"
                >
                  Archivar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Semana: 7 días clickeables (hoy resaltado). */}
      <div className="mt-4 flex items-center justify-between gap-1">
        {habit.week.map((day) => (
          <button
            key={day.date}
            type="button"
            disabled={isPending}
            onClick={() => toggle(day.date)}
            title={day.date}
            className="flex flex-1 flex-col items-center gap-1.5 disabled:opacity-60"
          >
            <span className="text-[11px] font-medium text-muted">
              {day.weekday}
            </span>
            <span
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                day.done
                  ? "bg-brand text-brand-fg"
                  : "border-2 border-border-strong bg-surface-2 text-muted hover:border-brand hover:text-brand",
                day.isToday && !day.done ? "border-brand text-brand" : "",
                day.isToday ? "ring-2 ring-brand/30 ring-offset-1" : "",
              ].join(" ")}
            >
              {day.done ? "✓" : ""}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs font-medium text-muted">
        {habit.weekCount}/7 esta semana
      </p>
    </div>
  );
}

function EditHabitForm({
  habit,
  onDone,
}: {
  habit: HabitView;
  onDone: () => void;
}) {
  const [error, setError] = useState<string>();

  async function handle(formData: FormData) {
    const res = await updateHabit({}, formData);
    if (res.ok) onDone();
    else setError(res.error);
  }

  return (
    <form action={handle} className="card flex flex-col gap-3 p-5">
      <input type="hidden" name="id" value={habit.id} />
      <input
        type="text"
        name="name"
        defaultValue={habit.name}
        required
        maxLength={80}
        className={inputClass}
      />
      <input
        type="text"
        name="description"
        defaultValue={habit.description ?? ""}
        placeholder="Descripción (opcional)"
        className={inputClass}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <SubmitButton>Guardar</SubmitButton>
        <button
          type="button"
          onClick={onDone}
          className="btn-ghost px-4 py-2 text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
