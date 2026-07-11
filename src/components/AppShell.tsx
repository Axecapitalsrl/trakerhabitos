"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { planConfig, type Plan } from "@/lib/plans";

function subscribeSidebar(cb: () => void) {
  window.addEventListener("sidebarchange", cb);
  return () => window.removeEventListener("sidebarchange", cb);
}
function getCollapsed() {
  return localStorage.getItem("sidebar-collapsed") === "1";
}
function setCollapsedStore(v: boolean) {
  localStorage.setItem("sidebar-collapsed", v ? "1" : "0");
  window.dispatchEvent(new Event("sidebarchange"));
}

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊", exact: true },
  { href: "/dashboard/habitos", label: "Mis hábitos", icon: "🔥" },
  { href: "/dashboard/rutas", label: "Rutas", icon: "📚" },
  { href: "/dashboard/asistente", label: "Asistente", icon: "🤖" },
  { href: "/dashboard/plan-ia", label: "Plan con IA", icon: "✨" },
];

export function AppShell({
  name,
  plan,
  isAdmin,
  children,
}: {
  name: string | null;
  plan: Plan;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // drawer móvil
  const collapsed = useSyncExternalStore(
    subscribeSidebar,
    getCollapsed,
    () => false,
  );
  const cfg = planConfig(plan);

  function toggleCollapsed() {
    setCollapsedStore(!collapsed);
  }

  function active(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const navLinks = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={[
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active(item.href, item.exact)
              ? "bg-brand-weak text-brand-strong"
              : "text-muted hover:bg-surface-2 hover:text-foreground",
          ].join(" ")}
        >
          <span className="text-base">{item.icon}</span>
          {item.label}
        </Link>
      ))}
      {isAdmin && (
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className={[
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active("/admin")
              ? "bg-brand-weak text-brand-strong"
              : "text-muted hover:bg-surface-2 hover:text-foreground",
          ].join(" ")}
        >
          <span className="text-base">🛠️</span>
          Admin
        </Link>
      )}
    </nav>
  );

  const footer = (
    <div className="flex flex-col gap-3">
      <ThemeToggle />
      {cfg.id !== "premium" && (
        <Link
          href="/dashboard/planes"
          onClick={() => setOpen(false)}
          className="btn-brand w-full py-2 text-sm"
        >
          ⭐ Mejorar plan
        </Link>
      )}
      <div className="flex items-center gap-2.5">
        <UserButton />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">{name || "Mi cuenta"}</p>
          <p className="text-xs text-muted">Plan {cfg.name}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-1">
      {/* Sidebar desktop */}
      <aside
        className={[
          "fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-surface",
          collapsed ? "hidden" : "hidden md:flex",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-4">
          <Logo href="/dashboard" />
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Ocultar menú"
            title="Ocultar menú"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground"
          >
            «
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pt-3">{navLinks}</div>
        <div className="border-t border-border p-3">{footer}</div>
      </aside>

      {/* Botón para mostrar el sidebar cuando está oculto (desktop) */}
      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label="Mostrar menú"
          title="Mostrar menú"
          className="fixed left-3 top-3 z-30 hidden h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-lg shadow-sm hover:bg-surface-2 md:flex"
        >
          ☰
        </button>
      )}

      {/* Top bar móvil */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-surface-2"
        >
          ☰
        </button>
        <Logo href="/dashboard" />
        <UserButton />
      </div>

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <Logo href="/dashboard" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-2"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pt-3">{navLinks}</div>
            <div className="border-t border-border p-3">{footer}</div>
          </aside>
        </div>
      )}

      {/* Contenido */}
      <div
        className={[
          "flex min-w-0 flex-1 flex-col",
          collapsed ? "" : "md:pl-64",
        ].join(" ")}
      >
        <div className="h-14 md:hidden" />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
