/** Une clases ignorando falsy. Suficiente para este proyecto; no hace merge de utilidades Tailwind. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
