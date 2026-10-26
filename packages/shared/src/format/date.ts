/** Fecha corta según locale ("26/10/2026" en es-AR). */
export function formatDate(date: Date, locale = "es-AR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Suma días a una fecha sin mutarla. */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + (Number.isFinite(days) ? Math.trunc(days) : 0));
  return d;
}
