import { atLeastOne, nonNegative } from "./sanitize.js";
import type { CostBreakdown, CostSettings, Extra, PrintInput } from "./types.js";

/** Costo de los extras de UNA pieza. */
export function extrasPerPiece(extras: readonly Extra[]): number {
  return extras.reduce((sum, e) => sum + nonNegative(e.unitPrice) * nonNegative(e.qtyPerPiece), 0);
}

/** Horas totales de impresión a partir de horas + minutos. */
export function totalHours(hours: number, minutes: number): number {
  return nonNegative(hours) + nonNegative(minutes) / 60;
}

/** Desgaste de la impresora por hora: precio × (1 + reparaciones %) / vida útil. */
export function wearPerHour(settings: CostSettings): number {
  const life = nonNegative(settings.printerLifeHours);
  if (life === 0) return 0;
  return (nonNegative(settings.printerPrice) * (1 + nonNegative(settings.repairsPct) / 100)) / life;
}

/**
 * Costo completo de una impresión.
 *
 * filamento = g / 1000 × $/kg
 * luz       = W / 1000 × h × $/kWh
 * desgaste  = desgaste/h × h
 * fallas    = (filamento + luz) × fallas %
 * base      = filamento + luz + desgaste + fallas
 * extras    = extras por pieza × piezas
 * total     = base + extras
 */
export function calcPrintCost(input: PrintInput, settings: CostSettings): CostBreakdown {
  const grams = nonNegative(input.grams);
  const hours = totalHours(input.hours, input.minutes);
  const pieces = atLeastOne(input.pieces);

  const filament = (grams / 1000) * nonNegative(input.filamentPricePerKg);
  const kwhUsed = (nonNegative(settings.printerWatts) / 1000) * hours;
  const energy = kwhUsed * nonNegative(settings.kwhPrice);
  const wearRate = wearPerHour(settings);
  const wear = wearRate * hours;
  const failures = (filament + energy) * (nonNegative(settings.failuresPct) / 100);
  const base = filament + energy + wear + failures;
  const perPieceExtras = extrasPerPiece(input.extras);
  const extras = perPieceExtras * pieces;
  const total = base + extras;

  return {
    filament,
    energy,
    wear,
    failures,
    extras,
    extrasPerPiece: perPieceExtras,
    base,
    total,
    perUnit: total / pieces,
    pieces,
    totalHours: hours,
    kwhUsed,
    wearPerHour: wearRate,
  };
}
