import type { CostSettings, PricingOptions } from "./types.js";

/** Tipos de filamento que ofrece la calculadora, con precio por kg de referencia (ARS, 2026). */
export const FILAMENT_TYPES = ["PLA", "PLA Silk", "PLA-CF", "PETG", "TPU", "ABS / ASA"] as const;

export type FilamentType = (typeof FILAMENT_TYPES)[number];

export const DEFAULT_FILAMENT_PRICES_ARS: Readonly<Record<FilamentType, number>> = {
  PLA: 22000,
  "PLA Silk": 26000,
  "PLA-CF": 35000,
  PETG: 24000,
  TPU: 30000,
  "ABS / ASA": 26000,
};

/** Valores iniciales en ARS: kWh marginal de Edemsa (Mendoza) y una Creality SparkX i7 con PLA. */
export const DEFAULT_COST_SETTINGS_ARS: Readonly<CostSettings> = {
  kwhPrice: 403.6,
  printerWatts: 130,
  printerPrice: 1_100_000,
  printerLifeHours: 5000,
  repairsPct: 20,
  failuresPct: 5,
};

export const DEFAULT_PRICING: Readonly<PricingOptions> = {
  multiplier: 3,
  multiplyExtras: true,
  roundingStep: 100,
};

export const MULTIPLIER_PRESETS = [1, 2, 3, 4] as const;
