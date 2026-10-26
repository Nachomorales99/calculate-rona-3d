import { nonNegative } from "../calculator/sanitize.js";

/** Un impuesto o tasa que se aplica sobre el cargo variable, en porcentaje (21 = 21 %). */
export interface EnergyTax {
  key: string;
  label: string;
  pct: number;
}

/** Parámetros de la fórmula del kWh marginal. Todos editables por el usuario. */
export interface MarginalKwhParams {
  /**
   * Factor que la distribuidora aplica al precio unitario antes de impuestos
   * (en Edemsa, 1,0309). Si no hay, usar 1.
   */
  adjustmentFactor: number;
  /** Impuestos y tasas porcentuales que se aplican sobre P × factor. */
  taxes: EnergyTax[];
  /** Cargo porcentual que se aplica sobre P sin factor (en Edemsa, 1 %). */
  flatPct: number;
}

/** Valores de la factura de Edemsa (Mendoza) tal como los leyó Nacho en 2026. */
export const EDEMSA_PARAMS: Readonly<MarginalKwhParams> = {
  adjustmentFactor: 1.0309,
  taxes: [
    { key: "iva", label: "IVA", pct: 21 },
    { key: "provincial", label: "Impuesto provincial", pct: 1.5 },
    { key: "municipal", label: "Tasa municipal", pct: 9 },
  ],
  flatPct: 1,
};

export interface MarginalKwhResult {
  /** Precio unitario cargado. */
  unitPrice: number;
  /** P × factor. */
  adjusted: number;
  /** Suma de impuestos en porcentaje. */
  taxesPct: number;
  /** Lo que suman los impuestos en dinero. */
  taxesAmount: number;
  /** P × flatPct. */
  flatAmount: number;
  /** El costo marginal con impuestos: lo que se carga en la calculadora. */
  kwhPrice: number;
}

/**
 * kWh marginal = P × factor × (1 + Σ impuestos) + P × flatPct
 *
 * Ejemplo Edemsa: P × 1,0309 × (1 + 0,21 + 0,015 + 0,09) + P × 0,01
 */
export function calcMarginalKwh(
  unitPrice: number,
  params: MarginalKwhParams = EDEMSA_PARAMS,
): MarginalKwhResult {
  const p = nonNegative(unitPrice);
  const factor = nonNegative(params.adjustmentFactor) || 1;
  const taxesPct = params.taxes.reduce((sum, t) => sum + nonNegative(t.pct), 0);
  const adjusted = p * factor;
  const taxesAmount = adjusted * (taxesPct / 100);
  const flatAmount = p * (nonNegative(params.flatPct) / 100);
  return {
    unitPrice: p,
    adjusted,
    taxesPct,
    taxesAmount,
    flatAmount,
    kwhPrice: adjusted + taxesAmount + flatAmount,
  };
}

/** Período bimestral tal como lo imprime la distribuidora: "2026-09/10". */
export function bimonthlyPeriod(date: Date): string {
  const month = date.getMonth(); // 0–11
  const start = month - (month % 2) + 1; // 1, 3, 5, 7, 9, 11
  const end = start + 1;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(start)}/${pad(end)}`;
}
