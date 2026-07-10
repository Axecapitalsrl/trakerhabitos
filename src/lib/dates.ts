/**
 * Helpers de fecha. Se trabaja con strings "YYYY-MM-DD" en hora LOCAL del
 * servidor. En dev local eso coincide con la zona del usuario. Al deployar,
 * setear la env var TZ a la zona del usuario para que el "día" no se corte a
 * medianoche UTC. (Fase 2: multi-usuario -> guardar tz por usuario.)
 */

export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayStr(): string {
  return toDateStr(new Date());
}

/** Devuelve las últimas `n` fechas (YYYY-MM-DD), de más vieja a hoy. */
export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const base = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    out.push(toDateStr(d));
  }
  return out;
}

/**
 * Racha actual: días consecutivos completados terminando hoy.
 * Si hoy todavía no se marcó, arranca desde ayer para no "romper" la racha
 * a mitad del día.
 */
export function computeStreak(doneSet: Set<string>): number {
  const cursor = new Date();
  if (!doneSet.has(toDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (doneSet.has(toDateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
