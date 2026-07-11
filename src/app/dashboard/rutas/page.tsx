import { RUTAS } from "@/lib/templates";
import { TemplateHabitButton } from "@/components/TemplateHabitButton";

export default function RutasPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Rutas de hábitos
      </h1>
      <p className="mt-1.5 text-muted">
        Hábitos listos, diseñados con el Método Rachas: concretos, mínimos y
        fáciles de sostener. Agregá los que quieras con un clic.
      </p>

      <div className="mt-8 space-y-8">
        {RUTAS.map((ruta) => (
          <section key={ruta.id}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">{ruta.emoji}</span>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  {ruta.title}
                </h2>
                <p className="text-sm text-muted">{ruta.subtitle}</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {ruta.habits.map((h) => (
                <div
                  key={h.name}
                  className="card flex items-center gap-3 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{h.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{h.description}</p>
                  </div>
                  <TemplateHabitButton
                    name={h.name}
                    description={h.description}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
