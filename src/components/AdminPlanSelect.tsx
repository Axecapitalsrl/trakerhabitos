"use client";

import { useTransition } from "react";
import { setUserPlanAction } from "@/app/admin/actions";
import type { Plan } from "@/lib/plans";

const OPTIONS: Plan[] = ["free", "starter", "pro", "premium"];

export function AdminPlanSelect({
  userId,
  plan,
}: {
  userId: string;
  plan: Plan;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={plan}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() =>
          setUserPlanAction(userId, e.target.value as Plan),
        )
      }
      className="rounded-lg border border-border-strong bg-background px-2.5 py-1.5 text-sm font-medium capitalize outline-none focus:border-brand disabled:opacity-50"
      aria-label="Plan del usuario"
    >
      {OPTIONS.map((p) => (
        <option key={p} value={p} className="capitalize">
          {p}
        </option>
      ))}
    </select>
  );
}
