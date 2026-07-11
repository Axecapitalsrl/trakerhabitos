"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { assistantReply, type AssistantTurn } from "@/lib/ai";
import { getHabitViews } from "@/lib/habits";
import { planConfig, type Plan } from "@/lib/plans";

export interface ChatState {
  error?: string;
}

export async function sendMessage(
  _prev: ChatState,
  formData: FormData,
): Promise<ChatState> {
  const { userId } = await auth();
  if (!userId) return { error: "No autenticado." };

  const text = String(formData.get("message") ?? "").trim();
  if (!text) return {};
  if (text.length > 2000) return { error: "Mensaje demasiado largo." };

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, name")
    .eq("id", userId)
    .maybeSingle<{ plan: Plan; name: string | null }>();

  if (!planConfig(profile?.plan ?? "free").assistant) {
    return { error: "El asistente está disponible solo en Premium." };
  }

  // Guardar el mensaje del usuario.
  await supabase
    .from("assistant_messages")
    .insert({ user_id: userId, role: "user", content: text });

  // Historial (últimos 20).
  const { data: rows } = await supabase
    .from("assistant_messages")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .returns<AssistantTurn[]>();
  const history = (rows ?? []).slice(-20);

  // Resumen de hábitos para dar contexto.
  const views = await getHabitViews(userId);
  const summary =
    views.length === 0
      ? "Todavía no tiene hábitos creados."
      : views
          .map(
            (h) =>
              `- ${h.name}: racha ${h.streak}, ${h.doneToday ? "hecho hoy" : "pendiente hoy"}`,
          )
          .join("\n");

  let reply: string;
  try {
    reply = await assistantReply(history, profile?.name ?? null, summary);
  } catch (e) {
    console.error("assistantReply", e);
    return {
      error: "El asistente no está disponible ahora. Intentá de nuevo.",
    };
  }

  await supabase
    .from("assistant_messages")
    .insert({ user_id: userId, role: "assistant", content: reply });

  revalidatePath("/dashboard/asistente");
  return {};
}
