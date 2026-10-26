import { roundUpTo } from "../currency/money.js";
import { nonNegative } from "./sanitize.js";
import type { CostBreakdown, PricingOptions, SalePrice } from "./types.js";

/**
 * Precio de venta por pieza.
 *
 * Con `multiplyExtras`: (total / piezas) × m
 * Sin él:               (base / piezas) × m + extras por pieza
 *
 * Un multiplicador inválido (0, negativo, NaN) se trata como ×1.
 */
export function calcSalePrice(cost: CostBreakdown, options: PricingOptions): SalePrice {
  const m = nonNegative(options.multiplier) || 1;
  const pieces = cost.pieces >= 1 ? cost.pieces : 1;
  const price = options.multiplyExtras
    ? cost.perUnit * m
    : (cost.base / pieces) * m + cost.extrasPerPiece;

  return {
    price,
    rounded: roundUpTo(price, options.roundingStep),
    gain: price - cost.perUnit,
  };
}
