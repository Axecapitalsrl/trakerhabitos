"use client";

import { useTransition } from "react";
import { toggleHabitDay } from "@/app/dashboard/actions";

interface TodayItem {
  id: string;
  name: string;
  doneToday: boolean;
  streak: number;
}

export function TodayHabits({
  habits,
  today,
}: {
  habits: TodayItem[];
  today: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      {habits.map((h) => (
        <button
          key={h.id}
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => toggleHabitDay(h.id, today))}
          className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:border-brand disabled:opacity-60"
        >
          <span
            className={[
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
              h.doneToday
                ? "bg-brand text-brand-fg"
                : "border-2 border-border-strong text-muted",
            ].join(" ")}
          >
            {h.doneToday ? "✓" : ""}
          </span>
          <span
            className={[
              "flex-1 truncate text-sm font-medium",
              h.doneToday ? "text-muted line-through" : "",
            ].join(" ")}
          >
            {h.name}
          </span>
          <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold tabular-nums">
            🔥 {h.streak}
          </span>
        </button>
      ))}
    </div>
  );
}
