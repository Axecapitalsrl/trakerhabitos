import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getSessionProfile } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();

  if (!profile) redirect("/sign-in");
  if (profile.status === "disabled") redirect("/disabled");
  if (profile.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo href="/dashboard" />
            <span className="rounded-full bg-brand-weak px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-strong">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-surface-2 px-3.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-border"
            >
              ← Mi panel
            </Link>
            <UserButton />
          </nav>
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
