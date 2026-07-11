"use client";

import { useState, useTransition } from "react";
import { addTemplateHabit } from "@/app/dashboard/rutas/actions";

export function TemplateHabitButton({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "added" | "error">("idle");
  const [msg, setMsg] = useState<string>();

  function add() {
    startTransition(async () => {
      const res = await addTemplateHabit(name, description);
      if (res.ok) {
        setState("added");
      } else {
        setState("error");
        setMsg(res.error);
      }
    });
  }

  if (state === "added") {
    return (
      <span className="shrink-0 rounded-full bg-brand-weak px-3 py-1.5 text-sm font-semibold text-brand-strong">
        ✓ Agregado
      </span>
    );
  }

  return (
    <div className="shrink-0 text-right">
      <button
        type="button"
        onClick={add}
        disabled={isPending}
        className="rounded-full border border-border-strong px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
      >
        {isPending ? "…" : "+ Agregar"}
      </button>
      {state === "error" && msg && (
        <p className="mt-1 max-w-[10rem] text-xs text-danger">{msg}</p>
      )}
    </div>
  );
}
