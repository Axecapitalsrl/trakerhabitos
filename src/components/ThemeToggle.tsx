"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: "light", icon: "☀️", label: "Claro" },
  { value: "dark", icon: "🌙", label: "Oscuro" },
  { value: "system", icon: "💻", label: "Sistema" },
];

function subscribe(cb: () => void) {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
}

function getSnapshot(): Theme {
  return (localStorage.getItem("theme") as Theme) || "system";
}

function setTheme(next: Theme) {
  localStorage.setItem("theme", next);
  document.documentElement.setAttribute("data-theme", next);
  window.dispatchEvent(new Event("themechange"));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    getSnapshot,
    () => "system",
  );

  return (
    <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setTheme(o.value)}
          title={o.label}
          aria-label={o.label}
          aria-pressed={theme === o.value}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors",
            theme === o.value
              ? "bg-surface shadow-sm"
              : "opacity-60 hover:opacity-100",
          ].join(" ")}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}
