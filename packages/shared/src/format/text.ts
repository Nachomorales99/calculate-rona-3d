/** "a, b y c" en castellano. */
export function joinList(items: readonly string[], conjunction = "y"): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1] ?? ""}`;
}

/** "9 h 30 min" o "9 h" a partir de horas decimales. */
export function formatHours(hours: number): string {
  const safe = Number.isFinite(hours) && hours > 0 ? hours : 0;
  const hh = Math.floor(safe);
  const mm = Math.round((safe - hh) * 60);
  if (mm === 60) return `${hh + 1} h`;
  return mm ? `${hh} h ${mm} min` : `${hh} h`;
}

/** "N.º 0007": número de presupuesto con relleno. */
export function formatQuoteNumber(counter: number, width = 4): string {
  const n = Number.isFinite(counter) && counter > 0 ? Math.floor(counter) : 1;
  return `N.º ${String(n).padStart(width, "0")}`;
}

/** Nombre de archivo seguro a partir de texto libre (sin acentos raros ni símbolos). */
export function toSafeFilename(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
