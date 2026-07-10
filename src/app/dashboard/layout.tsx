import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getSessionProfile } from "@/lib/auth";
import { Logo } from "@/components/Logo";

/**
 * Gate del dashboard. Corre en CADA request a /dashboard/*:
 *  - sin sesión           -> /sign-in
 *  - status 'pending'     -> /pending
 *  - status 'disabled'    -> /disabled
 *  - status 'active'      -> pasa
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();

  if (!profile) redirect("/sign-in");
  if (profile.status === "pending") redirect("/pending");
  if (profile.status === "disabled") redirect("/disabled");

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-4 sm:px-6">
          <Logo href="/dashboard" />
          <nav className="flex items-center gap-4">
            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="rounded-full bg-surface-2 px-3.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-border"
              >
                Admin
              </Link>
            )}
            <UserButton />
          </nav>
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
