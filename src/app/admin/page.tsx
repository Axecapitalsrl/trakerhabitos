import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { listProfiles } from "@/lib/admin";
import { AdminUserActions } from "@/components/AdminUserActions";
import type { UserStatus } from "@/lib/types";

const STATUS_LABEL: Record<UserStatus, string> = {
  pending: "Pendiente",
  active: "Activo",
  disabled: "Desactivado",
};

const STATUS_BADGE: Record<UserStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-brand-weak text-brand-strong",
  disabled: "bg-surface-2 text-muted",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ userId: adminId }, { status }, profiles] = await Promise.all([
    auth(),
    searchParams,
    listProfiles(),
  ]);

  const validStatuses: UserStatus[] = ["pending", "active", "disabled"];
  const filter = validStatuses.includes(status as UserStatus)
    ? (status as UserStatus)
    : undefined;

  const counts = {
    all: profiles.length,
    pending: profiles.filter((p) => p.status === "pending").length,
    active: profiles.filter((p) => p.status === "active").length,
    disabled: profiles.filter((p) => p.status === "disabled").length,
  };

  const rows = filter
    ? profiles.filter((p) => p.status === filter)
    : profiles;

  const tabs: { label: string; href: string; active: boolean; n: number }[] = [
    { label: "Todos", href: "/admin", active: !filter, n: counts.all },
    {
      label: "Pendientes",
      href: "/admin?status=pending",
      active: filter === "pending",
      n: counts.pending,
    },
    {
      label: "Activos",
      href: "/admin?status=active",
      active: filter === "active",
      n: counts.active,
    },
    {
      label: "Desactivados",
      href: "/admin?status=disabled",
      active: filter === "disabled",
      n: counts.disabled,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Usuarios</h1>
      <p className="mt-1.5 text-muted">
        Aprobá o desactivá el acceso de cada usuario.
      </p>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={[
              "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
              t.active
                ? "bg-ink text-white"
                : "bg-surface-2 text-foreground hover:bg-border",
            ].join(" ")}
          >
            {t.label}
            <span className="ml-1.5 tabular-nums opacity-70">{t.n}</span>
          </Link>
        ))}
      </div>

      {/* Lista */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-border">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-muted">No hay usuarios acá.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">
                      {p.name || "—"}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[p.status]}`}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                    {p.role === "admin" && (
                      <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted">{p.email}</p>
                  <p className="text-xs text-muted">
                    Registrado {fmtDate(p.created_at)}
                  </p>
                </div>
                <div className="shrink-0">
                  <AdminUserActions
                    userId={p.id}
                    status={p.status}
                    isSelf={p.id === adminId}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
