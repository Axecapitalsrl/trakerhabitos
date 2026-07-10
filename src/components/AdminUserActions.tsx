"use client";

import { useTransition } from "react";
import {
  approveUserAction,
  disableUserAction,
  reactivateUserAction,
} from "@/app/admin/actions";
import type { UserStatus } from "@/lib/types";

export function AdminUserActions({
  userId,
  status,
  isSelf,
}: {
  userId: string;
  status: UserStatus;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      {status === "pending" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => approveUserAction(userId))}
          className="btn-brand px-3.5 py-1.5 text-sm disabled:opacity-50"
        >
          Aprobar
        </button>
      )}

      {status === "active" && !isSelf && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm("¿Desactivar el acceso de este usuario?")) {
              startTransition(() => disableUserAction(userId));
            }
          }}
          className="rounded-full border border-border-strong px-3.5 py-1.5 text-sm font-semibold text-danger transition-colors hover:bg-surface-2 disabled:opacity-50"
        >
          Desactivar
        </button>
      )}

      {status === "disabled" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => reactivateUserAction(userId))}
          className="rounded-full border border-border-strong px-3.5 py-1.5 text-sm font-semibold transition-colors hover:bg-surface-2 disabled:opacity-50"
        >
          Reactivar
        </button>
      )}

      {status === "active" && isSelf && (
        <span className="text-xs font-medium text-muted">Vos</span>
      )}
    </div>
  );
}
