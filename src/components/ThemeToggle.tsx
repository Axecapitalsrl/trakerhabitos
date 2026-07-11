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

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];

  function cycle() {
    const order = OPTIONS.map((o) => o.value);
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  }

  return (
    <>
      {/* Móvil: un solo botón que cicla los modos */}
      <button
        type="button"
        onClick={cycle}
        title={`Tema: ${current.label}`}
        aria-label={`Cambiar tema (actual: ${current.label})`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-base sm:hidden"
      >
        {current.icon}
      </button>

      {/* Desktop: control segmentado de 3 opciones */}
      <div className="hidden items-center gap-1 rounded-full bg-surface-2 p-1 sm:flex">
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
    </>
  );
}
