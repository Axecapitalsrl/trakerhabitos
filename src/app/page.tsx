import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  const { userId } = await auth();
  const primaryHref = userId ? "/dashboard" : "/sign-up";
  const primaryLabel = userId ? "Ir al panel" : "Empezar ahora";

  return (
    <div className="flex flex-1 flex-col">
      {/* ---------- Nav ---------- */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-5">
          <Logo />
          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            <a href="#como-funciona" className="hover:text-foreground">
              Cómo funciona
            </a>
            <a href="#precio" className="hover:text-foreground">
              Precio
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {!userId && (
              <Link
                href="/sign-in"
                className="hidden text-sm font-semibold text-foreground hover:text-brand sm:block"
              >
                Iniciar sesión
              </Link>
            )}
            <Link
              href={primaryHref}
              className="btn-ink whitespace-nowrap px-4 text-sm sm:px-5"
            >
              {primaryLabel}
            </Link>
          </div>
        </nav>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-2 md:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-weak px-3.5 py-1.5 text-sm font-semibold text-brand-strong">
            <span className="h-2 w-2 rounded-full bg-brand" />
            Lanzamiento oficial: 70% OFF
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Construí hábitos que{" "}
            <span className="text-brand">realmente se mantienen</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Una app simple y sin fricción para trackear tu día a día. Olvidate
            de las planillas complicadas y empezá a ver tu progreso real.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={primaryHref} className="btn-brand px-7 py-4 text-lg">
              {userId ? "Ir al panel" : "Empezar ahora"}
            </Link>
            <a href="#como-funciona" className="btn-ghost px-7 py-4 text-lg">
              Cómo funciona
            </a>
          </div>
        </div>

        {/* Mockup del producto */}
        <HeroMockup />
      </section>

      {/* ---------- Por qué es difícil ---------- */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto w-full max-w-5xl px-5">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            ¿Por qué es tan difícil mantener un hábito?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">
            Seguro ya intentaste armar una rutina antes, pero siempre pasa lo
            mismo:
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Pain
              icon="🤯"
              title="Apps sobrecargadas"
              desc="Tienen tantas funciones, gráficos y configuraciones que te da paja abrirlas."
            />
            <Pain
              icon="📄"
              title="Planillas que se abandonan"
              desc="Ese Notion o Excel súper complejo que armaste con emoción y dejaste de usar al tercer día."
            />
            <Pain
              icon="😶‍🌫️"
              title="Falta de motivación visual"
              desc="Si no ves tu progreso y tus rachas claramente, es fácil decir 'por un día que no lo haga no pasa nada'."
            />
          </div>
        </div>
      </section>

      {/* ---------- Cómo funciona ---------- */}
      <section id="como-funciona" className="py-20">
        <div className="mx-auto w-full max-w-5xl px-5">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Un sistema tan simple que no vas a poder fallar
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted">
            Diseñamos Rachas para que hacer el seguimiento te tome menos de 10
            segundos al día.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              n="1"
              title="Creá tus hábitos"
              desc="Definí qué querés lograr. Sin configuraciones raras, solo el nombre y listo."
            />
            <Step
              n="2"
              title="Marcalos cada día"
              desc="Entrá, hacé un clic y seguí con tu vida. Cero fricción."
            />
            <Step
              n="3"
              title="Mirá tus rachas"
              desc="El cerebro ama las rachas. Ver ese número crecer te va a obligar a no romper la cadena."
            />
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto w-full max-w-5xl px-5">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Todo lo que necesitás, nada de lo que sobra
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <FeatureCard
              icon="✅"
              title="Tracking diario simple"
              desc="Un clic para marcar como completado. Sin notas, sin tiempos, sin complicaciones innecesarias."
            />
            <FeatureCard
              icon="🔥"
              title="Vista de rachas"
              desc="Visualizá tus días seguidos. La gamificación perfecta para mantenerte motivado a largo plazo."
            />
            <FeatureCard
              icon="🧘"
              title="Panel limpio y sin fricción"
              desc="Una interfaz minimalista que te muestra exactamente lo que necesitás ver hoy y nada más."
            />
            <FeatureCard
              icon="📱"
              title="Desde cualquier dispositivo"
              desc="Usalo en tu celu, tablet o compu. Tus hábitos sincronizados en tiempo real en todos lados."
            />
            <FeatureCard
              icon="✨"
              title="Plan personalizado con IA"
              desc="Respondé unas preguntas y una IA te arma una rutina de hábitos hecha para vos (planes Pro y Premium)."
            />
            <FeatureCard
              icon="🤖"
              title="Asistente de hábitos 24/7"
              desc="Tu coach personal con IA que te motiva, resuelve dudas y ajusta tu rutina cuando lo necesitás (Premium)."
            />
          </div>
        </div>
      </section>

      {/* ---------- Precio (3 planes) ---------- */}
      <section id="precio" className="py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-weak px-3.5 py-1.5 text-sm font-semibold text-brand-strong">
              🔥 Oferta de lanzamiento
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Invertí en tu mejor versión
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Elegí el plan que va con vos. Empezás gratis y mejorás cuando
              quieras. Cancelás con un clic.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-stretch">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} href={primaryHref} />
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            El plan personalizado con IA usa Claude Sonnet 5 · el asistente 24/7,
            Claude Haiku 4.5.
          </p>
        </div>
      </section>

      {/* ---------- Testimonios ---------- */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto w-full max-w-5xl px-5">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted">
            Placeholder · reemplazar con testimonios reales
          </p>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Gente que ya está construyendo su mejor versión
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Testimonial
              quote="Probé Notion, Excel, apps súper complejas... Al final siempre dejaba de anotar. Con Rachas es tan rápido que ya llevo 45 días seguidos leyendo y entrenando."
              name="Martín S."
              role="Emprendedor"
            />
            <Testimonial
              quote="El diseño es hermoso. Entro, marco mis hábitos y sigo. Ver el fueguito de la racha crecer me da una satisfacción tremenda. Vale cada centavo."
              name="Lucía G."
              role="Diseñadora"
            />
            <Testimonial
              quote="Por fin una app que hace una sola cosa y la hace bien. No tiene mil configuraciones que te marean. Es exactamente lo que necesitaba para organizarme."
              name="Tomás F."
              role="Desarrollador"
            />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="py-20">
        <div className="mx-auto w-full max-w-2xl px-5">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <div className="mt-10 space-y-4">
            <Faq q="¿Tienen período de prueba gratuito?">
              Sí. Al registrarte tenés acceso al plan Free para probar el
              sistema con hasta 3 hábitos. Cuando quieras, pasás a un plan pago.
            </Faq>
            <Faq q="¿Puedo cancelar cuando quiera?">
              Cuando quieras, con un clic desde tu cuenta. Sin ataduras ni letra
              chica.
            </Faq>
            <Faq q="¿Necesito tarjeta de crédito para empezar?">
              No. Te registrás gratis y probás. Solo cargás una tarjeta si
              decidís pasar a un plan pago.
            </Faq>
            <Faq q="¿Por qué mi cuenta queda pendiente al registrarme?">
              Aprobamos las cuentas para cuidar la calidad del servicio. Es
              rápido y, una vez aprobado, entrás directo a tu panel.
            </Faq>
          </div>
        </div>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto w-full max-w-2xl px-5 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Dejá de planear. Empezá a hacer.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Sumate hoy y construí los hábitos que van a cambiar tu año. Un clic
            al día, sin fricción.
          </p>
          <Link
            href={primaryHref}
            className="btn-brand mt-8 px-8 py-4 text-lg"
          >
            {primaryLabel}
          </Link>
          <p className="mt-3 text-sm text-muted">
            Empezás gratis • Cancelás cuando quieras
          </p>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Rachas. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ================= Subcomponentes ================= */

function HeroMockup() {
  const habits = [
    { name: "Leer 10 páginas", streak: 12, done: true },
    { name: "Entrenar (Fuerza)", streak: 3, done: true },
    { name: "Meditar 10 min", streak: 45, done: true },
    { name: "Tomar 2L de agua", streak: 5, done: true },
    { name: "Estudiar programación", streak: 8, done: false },
  ];
  const week = [true, true, false, true, true, true, false];
  return (
    <div className="card p-6 shadow-[0_24px_70px_-28px_rgba(13,27,22,0.35)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Hoy, 24 de octubre</p>
          <p className="text-lg font-bold">4/5 completados</p>
        </div>
        <span className="rounded-full bg-brand-weak px-3 py-1 text-sm font-bold text-brand-strong">
          🔥 En racha
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        {habits.map((h) => (
          <div
            key={h.name}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
          >
            <span
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                h.done
                  ? "bg-brand text-brand-fg"
                  : "border-2 border-border-strong text-muted",
              ].join(" ")}
            >
              {h.done ? "✓" : ""}
            </span>
            <span className="flex-1 text-sm font-medium">{h.name}</span>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold tabular-nums">
              🔥 {h.streak}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold text-muted">Resumen semanal</p>
        <div className="flex justify-between gap-1">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[11px] text-muted">{d}</span>
              <span
                className={[
                  "h-7 w-full rounded-md",
                  week[i] ? "bg-brand" : "bg-surface-2",
                ].join(" ")}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pain({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="card p-6">
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="card p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-weak font-extrabold text-brand-strong">
        {n}
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{desc}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="card flex gap-4 p-6">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm text-muted">{desc}</p>
      </div>
    </div>
  );
}

function Testimonial({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="card flex flex-col p-6">
      <p className="flex-1 text-sm leading-relaxed">“{quote}”</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-weak font-bold text-brand-strong">
          {name[0]}
        </span>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted">{role}</p>
        </div>
      </div>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 text-brand">✓</span>
      <span>{children}</span>
    </li>
  );
}

type Plan = {
  name: string;
  price: string;
  tagline: string;
  badge?: string;
  highlighted?: boolean;
  cta: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "7",
    tagline: "Para empezar a construir tus hábitos.",
    cta: "Empezar",
    features: [
      "Hasta 5 hábitos",
      "Marcado diario y rachas",
      "Progreso semanal",
      "Hábitos sugeridos para arrancar",
    ],
  },
  {
    name: "Pro",
    price: "17",
    tagline: "Para quien va en serio.",
    badge: "Más popular",
    cta: "Elegir Pro",
    features: [
      "Todo lo de Starter",
      "Hábitos ilimitados",
      "Plan personalizado con IA (hasta 4 por mes)",
      "Estadísticas avanzadas",
      "Recordatorios",
    ],
  },
  {
    name: "Premium",
    price: "27",
    tagline: "Todo, sin límites.",
    badge: "Completo",
    highlighted: true,
    cta: "Elegir Premium",
    features: [
      "Todo lo de Pro",
      "Plan personalizado con IA ilimitado",
      "Asistente personal de hábitos con IA 24/7",
      "Exportá tus datos",
      "Soporte prioritario",
    ],
  },
];

function PlanCard({ plan, href }: { plan: Plan; href: string }) {
  return (
    <div
      className={[
        "card flex flex-col p-6",
        plan.highlighted ? "border-brand ring-2 ring-brand/30" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold">{plan.name}</h3>
        {plan.badge && (
          <span
            className={[
              "rounded-full px-2.5 py-0.5 text-xs font-bold",
              plan.highlighted
                ? "bg-brand text-brand-fg"
                : "bg-brand-weak text-brand-strong",
            ].join(" ")}
          >
            {plan.badge}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
      <p className="mt-5">
        <span className="text-4xl font-extrabold tracking-tight">
          ${plan.price}
        </span>
        <span className="text-muted"> /mes</span>
      </p>
      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {plan.features.map((f) => (
          <Feature key={f}>{f}</Feature>
        ))}
      </ul>
      <Link
        href={href}
        className={[
          plan.highlighted ? "btn-brand" : "btn-ink",
          "mt-8 w-full py-3",
        ].join(" ")}
      >
        {plan.cta}
      </Link>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold">{q}</h3>
      <p className="mt-1.5 text-sm text-muted">{children}</p>
    </div>
  );
}
