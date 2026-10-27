const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

/** "27 oct 2026" a partir de un ISO (YYYY-MM-DD). Devuelve el texto original si no parsea. */
export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = m ? MONTHS[m - 1] : undefined;
  if (!y || !month || !d) return iso;
  return `${String(d).padStart(2, "0")} ${month} ${y}`;
}
