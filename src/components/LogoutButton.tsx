"use client";

import { SignOutButton } from "@clerk/nextjs";

export function LogoutButton({
  variant = "text",
}: {
  variant?: "text" | "button";
}) {
  const className =
    variant === "button"
      ? "rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-2"
      : "text-sm font-semibold text-brand hover:underline";

  return (
    <SignOutButton>
      <button type="button" className={className}>
        Cerrar sesión
      </button>
    </SignOutButton>
  );
}
