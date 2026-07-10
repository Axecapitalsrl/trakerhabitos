/**
 * Hábitos predeterminados con los que arranca cada usuario nuevo.
 * Se siembran una sola vez (ver ensureDefaultHabits en habits.ts).
 * Podés editar esta lista libremente; afecta solo a los usuarios que aún no
 * fueron sembrados.
 */
export interface DefaultHabit {
  name: string;
  description?: string;
}

export const DEFAULT_HABITS: DefaultHabit[] = [
  { name: "💧 Beber 2L de agua", description: "Mantenete hidratado" },
  { name: "🏃 Hacer ejercicio", description: "Al menos 30 minutos" },
  { name: "📚 Leer 20 minutos" },
  { name: "🧘 Meditar", description: "10 minutos de calma" },
  { name: "😴 Dormir 8 horas" },
  { name: "🥗 Comer saludable" },
];
