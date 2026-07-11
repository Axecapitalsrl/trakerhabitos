"use client";

import { useState, useTransition } from "react";
import { startCheckout } from "@/app/dashboard/planes/actions";
import type { Plan } from "@/lib/plans";

export function UpgradeButton({
  plan,
  label,
  highlighted,
}: {
  plan: Plan;
  label: string;
  highlighted?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  function go() {
    startTransition(async () => {
      const res = await startCheckout(plan);
      if (res.url) {
        window.location.href = res.url;
      } else {
        setError(res.error ?? "No se pudo iniciar el pago.");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={go}
        disabled={isPending}
        className={[
          highlighted ? "btn-brand" : "btn-ink",
          "w-full py-3 disabled:opacity-50",
        ].join(" ")}
      >
        {isPending ? "Redirigiendo…" : label}
      </button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
