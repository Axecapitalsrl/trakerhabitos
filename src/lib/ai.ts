import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Modelos elegidos: Sonnet 5 para el plan personalizado (calidad),
// Haiku 4.5 para el asistente 24/7 (económico y rápido).
const MODEL_PLAN = "claude-sonnet-5";
const MODEL_ASSISTANT = "claude-haiku-4-5";

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Falta ANTHROPIC_API_KEY en el entorno.");
  }
  return new Anthropic({ apiKey });
}

// Principios del "Método Rachas" (extraídos del ebook de la marca). Se
// inyectan en los prompts para que la IA sea fiel a la metodología.
const METODO_RACHAS = `Seguí el "Método Rachas":
- Progreso, no perfección. Una racha mide la acción, no el carácter. Romperla no borra el avance.
- Regla de oro: si no se puede completar, no es un hábito. Cada hábito debe ser una acción concreta, medible y binaria (lo hice / no lo hice).
- Tamaño mínimo: definí la versión más chica que igual cuenta, que se pueda completar hasta en un día de poca energía ("test del día promedio").
- Anclá el hábito a un momento o rutina existente (después de X), no a una hora rígida.
- Reducí la fricción de inicio. Ante un día difícil, bajá al mínimo por 48h en vez de abandonar.
- Retorno rápido sin culpa: si se cae, se retoma al día siguiente disponible, sin "compensar".`;

function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export interface PlanAnswers {
  objetivo: string;
  cantidad: string;
  energia: string;
  tiempo: string;
  costaba: string;
  obstaculos: string;
  intensidad: string;
}

/**
 * Genera un plan de hábitos personalizado con Claude Sonnet 5 a partir de las
 * respuestas del cuestionario. Devuelve markdown.
 */
export async function generateHabitPlan(answers: PlanAnswers): Promise<string> {
  const system = `Sos un coach de hábitos experto de la app "Rachas". Armás planes de hábitos personalizados, realistas y sostenibles, en español rioplatense (usá "vos").

${METODO_RACHAS}

Reglas de formato:
- Devolvé SOLO markdown, sin preámbulo ni despedida larga.
- Estructura: un párrafo breve de intro (2-3 líneas), luego una lista de 4 a 7 hábitos concretos.
- Cada hábito: nombre corto con un emoji al inicio, la cadencia sugerida (ej. diario/mañana), y en una línea el porqué.
- Adaptá la dificultad a lo que pidió la persona. No inventes datos personales.
- Terminá con una frase de aliento corta.`;

  const prompt = `Armá mi plan de hábitos personalizado con esta info:
- Objetivo principal: ${answers.objetivo}
- Hábitos que quiero sostener por día: ${answers.cantidad}
- Momento del día con más energía: ${answers.energia}
- Tiempo diario disponible: ${answers.tiempo}
- Hábitos que ya me costó sostener: ${answers.costaba || "—"}
- Mis principales obstáculos: ${answers.obstaculos || "—"}
- Prefiero empezar: ${answers.intensidad}`;

  const message = await client().messages.create({
    model: MODEL_PLAN,
    max_tokens: 2500,
    thinking: { type: "disabled" },
    system,
    messages: [{ role: "user", content: prompt }],
  });

  return textOf(message);
}

export interface AssistantTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Respuesta del asistente de hábitos 24/7 con Claude Haiku 4.5.
 * `history` es el historial previo; `userName` y `habitSummary` dan contexto.
 */
export async function assistantReply(
  history: AssistantTurn[],
  userName: string | null,
  habitSummary: string,
): Promise<string> {
  const system = `Sos el asistente personal de hábitos de la app "Rachas". Hablás en español rioplatense (usá "vos"), sos cálido, motivador y concreto.
Ayudás a la persona a sostener sus hábitos: das ideas, resolvés dudas, motivás y sugerís ajustes. Respuestas breves (2-5 oraciones), accionables. No inventes datos que no tengas.

${METODO_RACHAS}
${userName ? `La persona se llama ${userName}.` : ""}
Contexto de sus hábitos hoy:
${habitSummary}`;

  const message = await client().messages.create({
    model: MODEL_ASSISTANT,
    max_tokens: 700,
    system,
    messages: history.map((t) => ({ role: t.role, content: t.content })),
  });

  return textOf(message);
}
