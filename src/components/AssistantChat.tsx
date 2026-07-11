"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage } from "@/app/dashboard/asistente/actions";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-brand shrink-0 px-4 py-2.5 disabled:opacity-50"
    >
      {pending ? "…" : "Enviar"}
    </button>
  );
}

export function AssistantChat({ messages }: { messages: Msg[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string>();

  async function handle(formData: FormData) {
    const res = await sendMessage({}, formData);
    formRef.current?.reset();
    setError(res.error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="card p-5 text-sm text-muted">
            👋 Hola, soy tu asistente de hábitos. Preguntame lo que quieras:
            ideas para sostener una rutina, cómo recuperar una racha, o pedime
            que te motive. ¿En qué te ayudo?
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={[
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-brand text-brand-fg"
                  : "border border-border bg-surface",
              ].join(" ")}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <form ref={formRef} action={handle} className="flex items-end gap-2">
        <input
          name="message"
          required
          maxLength={2000}
          autoComplete="off"
          placeholder="Escribí tu mensaje…"
          className="flex-1 rounded-full border border-border-strong bg-background px-4 py-2.5 outline-none focus:border-brand"
        />
        <SendButton />
      </form>
    </div>
  );
}
