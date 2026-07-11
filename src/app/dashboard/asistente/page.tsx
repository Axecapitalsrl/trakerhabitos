import Link from "next/link";
import { getSessionProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { planConfig } from "@/lib/plans";
import { AssistantChat } from "@/components/AssistantChat";

export default async function AsistentePage() {
  const profile = await getSessionProfile();
  const cfg = planConfig(profile?.plan ?? "free");

  if (!cfg.assistant) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Asistente de hábitos
        </h1>
        <div className="card mt-6 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-weak text-2xl">
            🤖
          </div>
          <h2 className="text-lg font-bold">Exclusivo del plan Premium</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Tu asistente personal de hábitos, disponible 24/7 para motivarte,
            resolver dudas y ajustar tu rutina.
          </p>
          <Link href="/dashboard/planes" className="btn-brand mt-5 px-6 py-3">
            Pasar a Premium
          </Link>
        </div>
      </main>
    );
  }

  const supabase = createAdminClient();
  const { data: messages } = await supabase
    .from("assistant_messages")
    .select("role, content")
    .eq("user_id", profile!.id)
    .order("created_at", { ascending: true })
    .returns<{ role: "user" | "assistant"; content: string }[]>();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Asistente de hábitos
      </h1>
      <p className="mt-1.5 text-muted">
        Tu coach personal, disponible cuando lo necesites.
      </p>
      <div className="mt-6">
        <AssistantChat messages={messages ?? []} />
      </div>
    </main>
  );
}
