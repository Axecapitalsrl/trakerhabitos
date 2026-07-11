// Rutas de hábitos — plantillas curadas a partir del ebook "Método Rachas".
// Cada hábito está redactado como acción concreta, mínima y registrable.

export interface TemplateHabit {
  name: string;
  description: string;
}

export interface Ruta {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  habits: TemplateHabit[];
}

export const RUTAS: Ruta[] = [
  {
    id: "salud",
    emoji: "🏃",
    title: "Salud y movimiento",
    subtitle: "Activá el cuerpo con acciones breves y repetibles.",
    habits: [
      { name: "🚶 Caminar 10 minutos después de comer", description: "Movimiento mínimo que se sostiene incluso en días ocupados." },
      { name: "🧎 Estiramiento de 8 minutos", description: "Una sesión corta para soltar el cuerpo." },
      { name: "🧍 Pausa postural cada hora", description: "Levantarte y moverte un minuto para cortar el sedentarismo." },
    ],
  },
  {
    id: "energia",
    emoji: "⚡",
    title: "Energía",
    subtitle: "Mañanas más ligeras y tardes con foco.",
    habits: [
      { name: "💧 Un vaso de agua al despertar", description: "Tu primera micro-victoria del día." },
      { name: "🤸 Moverme 2 minutos al levantarme", description: "Activación mínima para arrancar con inercia." },
      { name: "📝 Micro-planificar el día en 5 min", description: "Definir 1 prioridad para orientar tu energía." },
    ],
  },
  {
    id: "enfoque",
    emoji: "🎯",
    title: "Enfoque y estudio",
    subtitle: "Bloques cortos con inicio y cierre claros.",
    habits: [
      { name: "⏱️ Bloque de 25 minutos sin distracciones", description: "Una sola meta por bloque. Ancla: al sentarte a trabajar/estudiar." },
      { name: "🎯 Definir la prioridad del día en una frase", description: "Claridad antes que volumen." },
      { name: "✏️ Resolver 1 ejercicio y registrar la respuesta", description: "Avance concreto y medible." },
      { name: "📚 Leer 10 páginas", description: "Criterio de cierre tangible: 10 páginas y listo." },
    ],
  },
  {
    id: "descanso",
    emoji: "😴",
    title: "Descanso y sueño",
    subtitle: "Una ventana estable para que el cuerpo entienda el ritmo.",
    habits: [
      { name: "🌙 Acostarme cerca de mi hora objetivo (±45 min)", description: "Consistencia de horario, no perfección." },
      { name: "🔅 Bajar las luces 20 min antes de dormir", description: "Rutina de cierre que reduce la fricción para dormir." },
      { name: "📵 Sin pantallas la última media hora", description: "Menos estimulación antes de descansar." },
    ],
  },
  {
    id: "bienestar",
    emoji: "🧘",
    title: "Bienestar y mente",
    subtitle: "Pequeños gestos que bajan el ruido mental.",
    habits: [
      { name: "🫁 Respirar 5 minutos antes de dormir", description: "Cierre calmo del día." },
      { name: "🙏 Escribir 3 líneas de agradecimiento", description: "Enfoca la atención en lo que sí funcionó." },
      { name: "🧘 Meditar 10 minutos", description: "Un momento fijo de calma." },
      { name: "☕ Pausa consciente sin pantallas al mediodía", description: "Reset mental para la tarde." },
    ],
  },
  {
    id: "alimentacion",
    emoji: "🥗",
    title: "Alimentación",
    subtitle: "Reglas simples con foco en saciedad y calidad.",
    habits: [
      { name: "💧 Tomar 6 vasos de agua al día", description: "Versión inicial (~1.5 L). Después podés subir a 2L." },
      { name: "🥦 Media porción de verduras en una comida", description: "Un cambio chico que suma sin fricción." },
      { name: "🍽️ Comer sin pantallas una vez al día", description: "Comer con atención mejora la saciedad." },
    ],
  },
  {
    id: "orden",
    emoji: "🧹",
    title: "Orden y rutina",
    subtitle: "Un entorno ordenado reduce decisiones.",
    habits: [
      { name: "🧹 Ordenar mi espacio 10 minutos", description: "Menos fricción para arrancar mañana." },
      { name: "🗂️ Dejar listo el área de trabajo para mañana", description: "El día siguiente empieza con inercia." },
      { name: "📅 Planificar el día en 5 minutos", description: "Un mapa simple para orientar tu jornada." },
    ],
  },
];
