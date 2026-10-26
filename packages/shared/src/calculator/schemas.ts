import { z } from "zod";
import { CURRENCY_CODES } from "../currency/currencies.js";
import { FILAMENT_TYPES } from "./defaults.js";

/** Número ≥ 0 que acepta strings numéricos (vienen de inputs HTML). */
const money = z.coerce.number().min(0).finite();
const pct = z.coerce.number().min(0).max(1000).finite();

export const extraSchema = z.object({
  name: z.string().trim().max(60),
  unitPrice: money,
  qtyPerPiece: z.coerce.number().int().min(0).max(10_000),
});

export const printInputSchema = z.object({
  grams: money.max(100_000),
  hours: z.coerce.number().int().min(0).max(10_000),
  minutes: z.coerce.number().int().min(0).max(59),
  pieces: z.coerce.number().int().min(1).max(10_000),
  filamentPricePerKg: money,
  extras: z.array(extraSchema).max(50),
});

export const costSettingsSchema = z.object({
  kwhPrice: money,
  printerWatts: money.max(10_000),
  printerPrice: money,
  printerLifeHours: z.coerce.number().positive().max(1_000_000).finite(),
  repairsPct: pct,
  failuresPct: pct,
});

export const pricingOptionsSchema = z.object({
  multiplier: z.coerce.number().positive().max(1000).finite(),
  multiplyExtras: z.boolean(),
  roundingStep: z.coerce.number().positive().finite(),
});

export const filamentTypeSchema = z.enum(FILAMENT_TYPES);
export const currencyCodeSchema = z.enum(CURRENCY_CODES as [string, ...string[]]);

export const quoteOptionsSchema = z.object({
  counter: z.coerce.number().int().min(1),
  client: z.string().trim().max(120),
  description: z.string().trim().max(240),
  qty: z.coerce.number().int().min(1).max(100_000),
  validDays: z.coerce.number().int().min(1).max(365),
  notes: z.string().trim().max(1000),
  contact: z.string().trim().max(120),
  useRounded: z.boolean(),
  showIncludes: z.boolean(),
  extras: z.array(extraSchema).max(50),
});

export type ExtraInput = z.input<typeof extraSchema>;
export type PrintInputForm = z.input<typeof printInputSchema>;
export type CostSettingsForm = z.input<typeof costSettingsSchema>;
