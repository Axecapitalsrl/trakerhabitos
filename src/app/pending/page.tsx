import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export default async function PendingPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/sign-in");
  if (profile.status === "active") redirect("/dashboard");
  if (profile.status === "disabled") redirect("/disabled");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="card max-w-md space-y-3 p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-weak text-3xl">
          ⏳
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Tu cuenta está pendiente
        </h1>
        <p className="text-muted">
          Un administrador tiene que aprobar tu acceso. Cuando lo haga, vas a
          poder entrar al panel. Volvé a intentar más tarde.
        </p>
        <div className="pt-2">
          <LogoutButton variant="button" />
        </div>
      </div>
    </main>
  );
}
