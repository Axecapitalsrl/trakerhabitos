import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Logo } from "@/components/Logo";

export default async function Home() {
  const { userId } = await auth();
  const primaryHref = userId ? "/dashboard" : "/sign-up";
  const primaryLabel = userId ? "Ir al panel" : "Empezar ahora";

  return (
    <div className="flex flex-1 flex-col">
      {/* ---------- Nav ---------- */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
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
          <div className="flex items-center gap-3">
            {!userId && (
              <Link
                href="/sign-in"
                className="hidden text-sm font-semibold text-foreground hover:text-brand sm:block"
              >
                Iniciar sesión
              </Link>
            )}
            <Link href={primaryHref} className="btn-ink text-sm">
              {primaryLabel}
            </Link>
          </div>
        </nav>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-20 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-weak px-3.5 py-1.5 text-sm font-semibold text-brand-strong">
          <span className="h-2 w-2 rounded-full bg-brand" />
          Registrate y empezá hoy
        </span>

        <h1 className="mt-7 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          Construí hábitos que
          <br />
          <span className="text-brand">realmente se mantienen</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">
          Una app simple y sin fricción para trackear tu día a día. Olvidate de
          las planillas complicadas y empezá a ver tu progreso real.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={primaryHref} className="btn-brand w-full px-8 py-4 text-lg sm:w-auto">
            {primaryLabel}
          </Link>
          <a href="#como-funciona" className="btn-ghost w-full px-8 py-4 text-lg sm:w-auto">
            Cómo funciona
          </a>
        </div>

        <p className="mt-4 text-sm text-muted">
          Gratis durante la beta · sin tarjeta de crédito
        </p>

        {/* Preview de hábitos */}
        <div className="mx-auto mt-16 max-w-md">
          <div className="card p-5 text-left shadow-[0_20px_60px_-24px_rgba(13,27,22,0.25)]">
            <HabitPreview name="💧 Beber 2L de agua" done={[1, 1, 0, 1, 1, 1, 0]} streak={5} />
            <div className="my-3 h-px bg-border" />
            <HabitPreview name="🏃 Hacer ejercicio" done={[1, 0, 1, 1, 0, 1, 1]} streak={2} />
            <div className="my-3 h-px bg-border" />
            <HabitPreview name="📚 Leer 20 minutos" done={[1, 1, 1, 1, 1, 1, 1]} streak={12} />
          </div>
        </div>
      </section>

      {/* ---------- Cómo funciona ---------- */}
      <section id="como-funciona" className="border-t border-border bg-surface py-20">
        <div className="mx-auto w-full max-w-5xl px-5">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cómo funciona
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted">
            Tres pasos y ya estás construyendo tu racha.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              n="1"
              title="Registrate"
              desc="Creá tu cuenta en segundos con tu email."
            />
            <Step
              n="2"
              title="Activá tu acceso"
              desc="Aprobamos tu cuenta y entrás a tu panel personal."
            />
            <Step
              n="3"
              title="Marcá cada día"
              desc="Completá tus hábitos y mirá crecer tu racha 🔥."
            />
          </div>
        </div>
      </section>

      {/* ---------- Precio ---------- */}
      <section id="precio" className="py-20">
        <div className="mx-auto w-full max-w-lg px-5 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Precio simple
          </h2>
          <div className="card mt-8 p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-strong">
              Beta
            </p>
            <p className="mt-3 text-5xl font-extrabold tracking-tight">
              Gratis
            </p>
            <p className="mt-2 text-muted">
              Acceso por aprovación mientras estamos en beta.
            </p>
            <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm">
              <Feature>Hábitos ilimitados</Feature>
              <Feature>Rachas y progreso semanal</Feature>
              <Feature>Hábitos sugeridos para arrancar</Feature>
            </ul>
            <Link href={primaryHref} className="btn-brand mt-8 w-full py-3.5">
              {primaryLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="border-t border-border bg-surface py-20">
        <div className="mx-auto w-full max-w-2xl px-5">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <div className="mt-10 space-y-4">
            <Faq q="¿Necesito tarjeta de crédito?">
              No. Durante la beta el acceso es gratuito.
            </Faq>
            <Faq q="¿Por qué mi cuenta queda pendiente?">
              Aprobamos las cuentas manualmente para cuidar la calidad del
              servicio. Es rápido.
            </Faq>
            <Faq q="¿Puedo crear mis propios hábitos?">
              Sí. Arrancás con hábitos sugeridos y podés agregar, editar o
              archivar los que quieras.
            </Faq>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Rachas. Hecho para construir mejores
            días.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

function HabitPreview({
  name,
  done,
  streak,
}: {
  name: string;
  done: number[];
  streak: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold tabular-nums">
          🔥 {streak}
        </span>
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {done.map((d, i) => (
          <span
            key={i}
            className={`h-6 flex-1 rounded-md ${d ? "bg-brand" : "bg-surface-2"}`}
          />
        ))}
      </div>
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

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 text-brand">✓</span>
      <span>{children}</span>
    </li>
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
