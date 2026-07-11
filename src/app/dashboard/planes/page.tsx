import { getSessionProfile } from "@/lib/auth";
import { planConfig, type Plan } from "@/lib/plans";
import { UpgradeButton } from "@/components/UpgradeButton";

const CARDS: {
  plan: Plan;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    plan: "starter",
    tagline: "Para empezar.",
    features: ["Hasta 5 hábitos", "Rachas y progreso semanal", "Hábitos sugeridos"],
  },
  {
    plan: "pro",
    tagline: "Para quien va en serio.",
    features: [
      "Hábitos ilimitados",
      "Plan personalizado con IA (4/mes)",
      "Estadísticas avanzadas",
    ],
  },
  {
    plan: "premium",
    tagline: "Todo, sin límites.",
    highlighted: true,
    features: [
      "Plan personalizado con IA ilimitado",
      "Asistente de hábitos con IA 24/7",
      "Soporte prioritario",
    ],
  },
];

export default async function PlanesPage() {
  const profile = await getSessionProfile();
  const current = profile?.plan ?? "free";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Mejorá tu plan</h1>
      <p className="mt-1.5 text-muted">
        Desbloqueá la IA y saltá los límites. Cancelás cuando quieras.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3 md:items-stretch">
        {CARDS.map((card) => {
          const cfg = planConfig(card.plan);
          const isCurrent = current === card.plan;
          return (
            <div
              key={card.plan}
              className={[
                "card flex flex-col p-6",
                card.highlighted ? "border-brand ring-2 ring-brand/30" : "",
              ].join(" ")}
            >
              <h3 className="text-lg font-bold">{cfg.name}</h3>
              <p className="mt-1 text-sm text-muted">{card.tagline}</p>
              <p className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight">
                  ${cfg.price}
                </span>
                <span className="text-muted"> /mes</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {card.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {isCurrent ? (
                  <span className="block rounded-full bg-surface-2 py-3 text-center text-sm font-semibold text-muted">
                    Tu plan actual
                  </span>
                ) : (
                  <UpgradeButton
                    plan={card.plan}
                    label={`Elegir ${cfg.name}`}
                    highlighted={card.highlighted}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Los pagos se procesan de forma segura con Stripe.
      </p>
    </main>
  );
}
