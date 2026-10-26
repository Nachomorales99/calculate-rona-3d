import type { Currency } from "../currency/currencies.js";
import { DEFAULT_CURRENCY } from "../currency/currencies.js";
import { roundToCurrency } from "../currency/money.js";
import { addDays } from "../format/date.js";
import { formatQuoteNumber, joinList } from "../format/text.js";
import { atLeastOne, nonNegative } from "./sanitize.js";
import type { Extra, SalePrice } from "./types.js";

export interface QuoteOptions {
  /** Número correlativo del presupuesto. */
  counter: number;
  client: string;
  description: string;
  /** Cantidad de piezas que se cotizan (independiente de las piezas por impresión). */
  qty: number;
  /** Días de validez. */
  validDays: number;
  notes: string;
  /** Contacto del emisor (WhatsApp, Instagram, email). */
  contact: string;
  /** Usar el precio redondeado en vez del exacto. */
  useRounded: boolean;
  /** Listar los extras incluidos ("Incluye argolla y cadena."). */
  showIncludes: boolean;
  extras: readonly Extra[];
  currency?: Currency;
  /** Fecha de emisión (hoy por defecto). */
  issuedAt?: Date;
}

/** Lo que ve el cliente: nunca incluye costos, multiplicador ni ganancia. */
export interface QuoteData {
  number: string;
  client: string;
  description: string;
  includes: string;
  qty: number;
  unitPrice: number;
  total: number;
  issuedAt: Date;
  validUntil: Date;
  notes: string;
  contact: string;
  currency: Currency;
}

export const QUOTE_FALLBACKS = {
  client: "Nombre del cliente",
  description: "Pieza impresa en 3D",
  validDays: 7,
} as const;

/** Texto "Incluye 2 argollas, cadena e imán." a partir de los extras con cantidad. */
export function describeIncludes(
  extras: readonly Extra[],
  formatQty: (n: number) => string,
): string {
  const names = extras
    .filter((e) => e.name.trim() !== "" && nonNegative(e.qtyPerPiece) > 0)
    .map((e) => {
      const qty = nonNegative(e.qtyPerPiece);
      const name = e.name.trim().toLowerCase();
      return qty > 1 ? `${formatQty(qty)} ${name}` : name;
    });
  return names.length ? `Incluye ${joinList(names)}.` : "";
}

export function buildQuote(sale: SalePrice, options: QuoteOptions): QuoteData {
  const currency = options.currency ?? DEFAULT_CURRENCY;
  const issuedAt = options.issuedAt ?? new Date();
  const qty = atLeastOne(options.qty);
  const validDays = nonNegative(options.validDays) || QUOTE_FALLBACKS.validDays;
  const unitPrice = roundToCurrency(options.useRounded ? sale.rounded : sale.price, currency);
  const formatQty = (n: number) => new Intl.NumberFormat(currency.locale).format(n);

  return {
    number: formatQuoteNumber(options.counter),
    client: options.client.trim() || QUOTE_FALLBACKS.client,
    description: options.description.trim() || QUOTE_FALLBACKS.description,
    includes: options.showIncludes ? describeIncludes(options.extras, formatQty) : "",
    qty,
    unitPrice,
    total: roundToCurrency(unitPrice * qty, currency),
    issuedAt,
    validUntil: addDays(issuedAt, validDays),
    notes: options.notes.trim(),
    contact: options.contact.trim(),
    currency,
  };
}
