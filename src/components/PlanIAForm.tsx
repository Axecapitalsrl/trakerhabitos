"use client";

import { useActionState } from "react";
import { generatePlan, type PlanState } from "@/app/dashboard/plan-ia/actions";
import { SubmitButton } from "@/components/SubmitButton";

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-background px-3 py-2.5 outline-none focus:border-brand";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

export function PlanIAForm() {
  const [state, formAction] = useActionState<PlanState, FormData>(
    generatePlan,
    {},
  );

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="card flex flex-col gap-4 p-5">
        <Field label="¿Cuál es tu objetivo principal?">
          <select name="objetivo" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Elegí una opción
            </option>
            <option>Mejorar mi salud física</option>
            <option>Ser más productivo</option>
            <option>Bienestar mental / reducir estrés</option>
            <option>Rendir mejor en el deporte</option>
            <option>Estudiar / aprender algo nuevo</option>
            <option>Mejorar mi descanso y energía</option>
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="¿Cuántos hábitos por día?">
            <select name="cantidad" defaultValue="2 a 3" className={fieldClass}>
              <option>1 o 2</option>
              <option>2 a 3</option>
              <option>4 a 6</option>
              <option>7 o más</option>
            </select>
          </Field>
          <Field label="¿Cuándo tenés más energía?">
            <select name="energia" defaultValue="Mañana" className={fieldClass}>
              <option>Mañana</option>
              <option>Mediodía</option>
              <option>Tarde</option>
              <option>Noche</option>
            </select>
          </Field>
          <Field label="Tiempo diario disponible">
            <select
              name="tiempo"
              defaultValue="15 a 30 min"
              className={fieldClass}
            >
              <option>Menos de 15 min</option>
              <option>15 a 30 min</option>
              <option>30 a 60 min</option>
              <option>Más de 60 min</option>
            </select>
          </Field>
          <Field label="Prefiero empezar">
            <select
              name="intensidad"
              defaultValue="Suave y sostenible"
              className={fieldClass}
            >
              <option>Suave y sostenible</option>
              <option>Con un desafío exigente</option>
            </select>
          </Field>
        </div>

        <Field label="¿Qué hábitos ya intentaste y te costó sostener? (opcional)">
          <input name="costaba" className={fieldClass} placeholder="Ej. correr, meditar…" />
        </Field>
        <Field label="¿Qué suele frenarte? (opcional)">
          <input
            name="obstaculos"
            className={fieldClass}
            placeholder="Ej. falta de tiempo, me olvido, poca motivación…"
          />
        </Field>

        {state.error && <p className="text-sm text-danger">{state.error}</p>}

        <div>
          <SubmitButton>Generar mi plan ✨</SubmitButton>
        </div>
      </form>

      {state.plan && (
        <div className="card p-6">
          <h3 className="mb-3 text-lg font-bold">Tu plan personalizado</h3>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {state.plan}
          </div>
        </div>
      )}
    </div>
  );
}
