import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";

/**
 * Gate del dashboard + shell con sidebar. Corre en CADA request a /dashboard/*:
 *  - sin sesión       -> /sign-in
 *  - status 'pending'  -> /pending
 *  - status 'disabled' -> /disabled
 *  - status 'active'   -> pasa
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
    <AppShell
      name={profile.name}
      plan={profile.plan}
      isAdmin={profile.role === "admin"}
    >
      {children}
    </AppShell>
  );
}
