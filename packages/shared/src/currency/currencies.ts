/**
 * Catálogo de monedas de trabajo. La calculadora nunca asume una moneda:
 * recibe un `Currency` y con él formatea y redondea.
 *
 * `roundingStep` es el paso de redondeo "comercial" del precio final
 * (en Argentina se redondea a $100; en USD, al dólar).
 */
export interface Currency {
  /** Código ISO 4217. */
  readonly code: string;
  /** Nombre para mostrar. */
  readonly name: string;
  /** Locale de Intl para el formato. */
  readonly locale: string;
  /** Decimales que se muestran y a los que se redondea el precio unitario. */
  readonly decimals: 0 | 2;
  /** Paso de redondeo del precio de venta (hacia arriba). */
  readonly roundingStep: number;
}

export const CURRENCIES = {
  ARS: { code: "ARS", name: "Peso argentino", locale: "es-AR", decimals: 0, roundingStep: 100 },
  USD: { code: "USD", name: "Dólar estadounidense", locale: "en-US", decimals: 2, roundingStep: 1 },
  EUR: { code: "EUR", name: "Euro", locale: "es-ES", decimals: 2, roundingStep: 1 },
  BRL: { code: "BRL", name: "Real brasileño", locale: "pt-BR", decimals: 2, roundingStep: 1 },
  CLP: { code: "CLP", name: "Peso chileno", locale: "es-CL", decimals: 0, roundingStep: 100 },
  UYU: { code: "UYU", name: "Peso uruguayo", locale: "es-UY", decimals: 0, roundingStep: 10 },
  PYG: { code: "PYG", name: "Guaraní", locale: "es-PY", decimals: 0, roundingStep: 1000 },
  COP: { code: "COP", name: "Peso colombiano", locale: "es-CO", decimals: 0, roundingStep: 100 },
  PEN: { code: "PEN", name: "Sol peruano", locale: "es-PE", decimals: 2, roundingStep: 1 },
  MXN: { code: "MXN", name: "Peso mexicano", locale: "es-MX", decimals: 2, roundingStep: 1 },
} as const satisfies Record<string, Currency>;

export type CurrencyCode = keyof typeof CURRENCIES;

export const DEFAULT_CURRENCY: Currency = CURRENCIES.ARS;

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES;
}

/** Devuelve la moneda del catálogo o la default si el código no existe. */
export function getCurrency(code: string | null | undefined): Currency {
  return isCurrencyCode(code) ? CURRENCIES[code] : DEFAULT_CURRENCY;
}
