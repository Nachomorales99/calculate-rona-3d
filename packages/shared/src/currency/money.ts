import type { Currency } from "./currencies.js";
import { DEFAULT_CURRENCY } from "./currencies.js";

/** Redondea hacia arriba al múltiplo de `step` más cercano. `step <= 0` devuelve el valor sin tocar. */
export function roundUpTo(value: number, step: number): number {
  if (!Number.isFinite(value)) return 0;
  if (!Number.isFinite(step) || step <= 0) return value;
  // Evita que 300.0000001 suba a 400 por error de punto flotante.
  const ratio = value / step;
  const nearest = Math.round(ratio);
  const isAlmostExact = Math.abs(ratio - nearest) < 1e-9;
  return (isAlmostExact ? nearest : Math.ceil(ratio)) * step;
}

/** Redondea a los decimales de la moneda (al más cercano). */
export function roundToCurrency(value: number, currency: Currency = DEFAULT_CURRENCY): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** currency.decimals;
  return Math.round(value * factor) / factor;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function moneyFormatter(currency: Currency): Intl.NumberFormat {
  const key = `${currency.locale}:${currency.code}:${currency.decimals}`;
  let fmt = formatterCache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    });
    formatterCache.set(key, fmt);
  }
  return fmt;
}

/** Formatea un importe en la moneda dada ("$ 1.200" en ARS, "$12.50" en USD). */
export function formatMoney(value: number, currency: Currency = DEFAULT_CURRENCY): string {
  return moneyFormatter(currency).format(Number.isFinite(value) ? value : 0);
}

/** Formatea un número "común" con el locale de la moneda (para gramos, kWh, etc.). */
export function formatNumber(
  value: number,
  currency: Currency = DEFAULT_CURRENCY,
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat(currency.locale, { maximumFractionDigits }).format(
    Number.isFinite(value) ? value : 0,
  );
}
