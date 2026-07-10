"use client";

import { useRef, useState } from "react";
import { createHabit } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/SubmitButton";

const inputClass =
  "w-full rounded-lg border border-border-strong bg-background px-3 py-2.5 outline-none focus:border-brand";

export function NewHabitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();

  async function handle(formData: FormData) {
    const res = await createHabit({}, formData);
    if (res.ok) {
      formRef.current?.reset();
      setOpen(false);
      setError(undefined);
    } else {
      setError(res.error);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-border px-4 py-3.5 text-sm font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
      >
        + Nuevo hábito
      </button>
    );
  }

  return (
    <form ref={formRef} action={handle} className="card flex flex-col gap-3 p-5">
      <input
        type="text"
        name="name"
        placeholder="Nombre del hábito (ej. Meditar)"
        autoFocus
        required
        maxLength={80}
        className={inputClass}
      />
      <input
        type="text"
        name="description"
        placeholder="Descripción (opcional)"
        className={inputClass}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <SubmitButton>Crear</SubmitButton>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(undefined);
          }}
          className="btn-ghost px-4 py-2.5 text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
