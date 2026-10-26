/** Número finito y no negativo; cualquier otra cosa vale 0. */
export function nonNegative(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

/** Entero ≥ 1 (para cantidades de piezas). */
export function atLeastOne(value: unknown): number {
  const n = Math.round(nonNegative(value));
  return n >= 1 ? n : 1;
}
